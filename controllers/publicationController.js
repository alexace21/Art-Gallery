const router = require('express').Router();

const { isAuth } = require('../middlewares/authMiddleware');
const publicationService = require('../services/publicationService');

router.get('/', async (req, res) => {
    const publications = await publicationService.getAll().lean();

    res.render('publication', { publications });
});

router.get('/:publicationId/details', async (req, res) => {
    const publication = await publicationService.getOne(req.params.publicationId);

    res.render('publication/details', { publication });
});

router.get('/create', isAuth, (req, res) => {
    res.render('publication/create');
});

router.post('/create', isAuth, async (req, res) => {
    const publicationData = { ...req.body, author: req.user._id };

    const createdPublication = await publicationService.create(publicationData);

    res.redirect('/publications');
});

module.exports = router;
