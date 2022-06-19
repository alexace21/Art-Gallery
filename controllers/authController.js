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
        // Create user
        const newUser = await userService.create({ password, ...userData });
        res.redirect('/login');
    } catch (error) {
        // Add mongoose error mapper/handler
        return res.render('auth/register', { error: 'db error' });
    }
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    const user = await userService.login(username, password);
    const token = await userService.generateToken(user);

    res.cookie(COOKIE_SESSION_NAME, token);
    res.redirect('/');
});

module.exports = router;