const router = require('express').Router();
const userService = require('../services/authService');

router.get('/login', (req, res) => {
    res.render('auth/login');
});

router.get('/register', (req, res) => {
    res.render('auth/register');
});

router.post('/register', async (req, res) => {
    const { username, password, repeatPassword } = req.body;

    if (password !== repeatPassword) {
        return res.render('auth/register', { error: 'Password mismatch!' });
    }
    try {
        // Create user
        const newUser = await userService.create({ username, password });
        res.redirect('auth/login');
    } catch (error) {
        // Add mongoose error mapper/handler
        return res.render('auth/register', { error: 'db error' });
    }
});

module.exports = router;