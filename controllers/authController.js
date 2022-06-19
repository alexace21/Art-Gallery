const router = require('express').Router();
const userService = require('../services/authService');
const { COOKIE_SESSION_NAME } = require('../constants');

router.get('/login', (req, res) => {
    res.render('auth/login');
});

router.get('/register', (req, res) => {
    res.render('auth/register');
});

router.post('/register', async (req, res) => {
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
        return res.render('auth/register', { error: 'db error' });
    }
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    const user = await userService.login(username, password);
    const token = await userService.generateToken(user);

    res.cookie(COOKIE_SESSION_NAME, token, { httpOnly: true });
    res.redirect('/');
});

router.get('/logout', (req, res) => {
    res.clearCookie(COOKIE_SESSION_NAME);
    res.redirect('/');
});

module.exports = router;