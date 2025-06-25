const express = require('express');
const router = express.Router();
const User = require('../models/User');
const passport = require('passport');

// Login page
router.get('/login', (req, res) => {
    res.render('login', {
        title: 'Login',
        messages: req.flash()
    });
});

// Register page
router.get('/register', (req, res) => {
    res.render('register', {
        title: 'Register',
        messages: req.flash()
    });
});

// Register handle
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, confirmPassword } = req.body;

        // Validation
        if (!name || !email || !password || !confirmPassword) {
            req.flash('error', 'Please fill in all fields');
            return res.redirect('/auth/register');
        }

        if (password !== confirmPassword) {
            req.flash('error', 'Passwords do not match');
            return res.redirect('/auth/register');
        }

        // Check if user exists
        const userExists = await User.findOne({ email: email.toLowerCase() });
        if (userExists) {
            req.flash('error', 'Email is already registered');
            return res.redirect('/auth/register');
        }

        // Create new user
        const user = new User({
            name,
            email,
            password
        });

        await user.save();
        req.flash('success', 'You are now registered and can log in');
        res.redirect('/auth/login');
    } catch (error) {
        console.error(error);
        req.flash('error', 'An error occurred during registration');
        res.redirect('/auth/register');
    }
});

// Login handle
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/auth/login',
        failureFlash: true
    })(req, res, next);
});

// Logout handle
router.get('/logout', (req, res) => {
    req.logout(function(err) {
        if (err) {
            console.error(err);
            return next(err);
        }
        req.flash('success', 'You are logged out');
        res.redirect('/auth/login');
    });
});

module.exports = router; 