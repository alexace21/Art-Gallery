const router = require('express').Router();
const userService = require('../services/authService');
const { COOKIE_SESSION_NAME } = require('../constants');
const { isAuth, isGuest } = require('../middlewares/authMiddleware');
const { getErrorMessage } = require('../utils/errorMapper');

router.get('/login', isGuest, (req, res) => {
    res.render('auth/login');
});

router.get('/register', isGuest, (req, res) => {
    res.render('auth/register');
});

router.post('/register', isGuest, async (req, res) => {
    const { password, repeatPassword, ...userData } = req.body;

    if (password !== repeatPassword) {
        return res.render('auth/register', { error: 'Password mismatch!' });
    }
    try {
        const newUser = await userService.create({ password, ...userData });
        const token = await userService.generateToken(newUser);

        res.cookie(COOKIE_SESSION_NAME, token, { httpOnly: true });
        res.redirect('/auth/login');
    } catch (error) {
        // Add mongoose error mapper/handler
        return res.render('auth/register', { error: getErrorMessage(error) });
    }
});

router.post('/login', isGuest, async (req, res) => {
    const { username, password } = req.body;

    const user = await userService.login(username, password);
    const token = await userService.generateToken(user);

    res.cookie(COOKIE_SESSION_NAME, token, { httpOnly: true });
    res.redirect('/');
});

router.get('/logout', isAuth, (req, res) => {
    res.clearCookie(COOKIE_SESSION_NAME);
    res.redirect('/');
});

module.exports = router;