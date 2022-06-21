const router = require('express').Router();

const { isAuth } = require('../middlewares/authMiddleware');
const { isPublicationAuthor, preloadPublication } = require('../middlewares/publicationMiddleware');
const publicationService = require('../services/publicationService');
const { getErrorMessage } = require('../utils/errorMapper');
const userService = require('../services/userService');


router.get('/', async (req, res) => {
    const publications = await publicationService.getAll().lean();

    res.render('publication', { publications });
});

router.get('/:publicationId/details', async (req, res) => {
    const publication = await publicationService.getOneDetailed(req.params.publicationId).lean();
    const isAuthor = publication.author._id == req.user?._id;
    const isShared = publication.usersShared.some(x => x._id == req.user._id);

    res.render('publication/details', { ...publication, isAuthor, isShared });
});

router.get('/:publicationId/edit',
    isAuth,
    preloadPublication,
    isPublicationAuthor,
    (req, res) => {
        res.render('publication/edit', { ...req.publication });
    });

router.post('/:publicationId/edit',
    isAuth,
    preloadPublication,
    isPublicationAuthor,
    async (req, res) => {
        try {
            await publicationService.update(req.params.publicationId, req.body);

            res.redirect(`/publications/${req.params.publicationId}/details`);
        } catch (error) {
            res.render('publication/edit', { ...req.body, error: getErrorMessage(error) });
        }
    });

router.get('/:publicationId/delete',
    isAuth,
    preloadPublication,
    isPublicationAuthor,
    async(req, res) => {
        await publicationService.delete(req.params.publicationId);
        res.redirect('/publications');
    });

router.get('/create', isAuth, (req, res) => {
    res.render('publication/create');
});

router.post('/create', isAuth, async (req, res) => {
    const publicationData = { ...req.body, author: req.user._id };
    try {
        const createdPublication = await publicationService.create(publicationData);
        await userService.addPublication(req.user._id, createdPublication._id);
        res.redirect('/publications');
    } catch (error) {
        return res.render('publication/create', { ...req.body, error: getErrorMessage(error) });
    }

});

router.get('/:publicationId/share', isAuth, async(req, res) => {
    const publication = await publicationService.getOne(req.params.publicationId);
    const user =await userService.getOne(req.user._id);

    publication.usersShared.push(req.user._id);
    user.shares.push(publication)

    await publication.save();
    await user.save();
    
    res.redirect('/');
});

module.exports = router;
