const bcrypt = require('bcryptjs');
const passport = require('passport');
const mongoose = require('mongoose');

const User = require('../models/User');
const saltRounds = 10;

exports.register = function (req, res) {
    res.render('register', {
            title: 'registered'
    });
};

exports.postRegister = async function (req, res) {
    let { name, uid, email, password, passwordr } = req.body;
    let errors = [];

    if (!name || !uid || !email || !password || !passwordr) {
        errors.push({ msg: 'Please enter all fields' });
    }
    if (password != passwordr) {
        errors.push({ msg: 'Passwords do not match' });
    }
    if (password.length < 32) {
        errors.push({ msg: 'Password must be at least 32 characters' });
    }
    if (errors.length > 0) {            // respond if errors
        res.render('register', {
            errors,
            name,
            uid,
            email,
            password,
            passwordr
        });
    }

    let user = await User.findOne({ email: email });
    if (user) {
        errors.push({ msg: 'Email already exists' });
        res.render('register', {        // respond if already exists
            errors,
            name,
            uid,
            email,
            password,
            passwordr
        });
    }

    let hash = await bcrypt.hash(password, saltRounds);
    let newUser = new User({name: name, uid: uid, email: email, password: hash});
    await newUser.save();
    req.flash('success_msg', 'You are now registered and can log in');
    res.redirect('/users/login');       // respond if aok
};


exports.login = function (req, res) {
    res.render('login', {
        title: 'Login'
    });
};

exports.postLogin = function (req, res, next) {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
};

exports.logout = function (req, res) {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/');
};

exports.allUsers = async function (que, sort) {
    const users = await User.find(que, null, sort);
    return users;
}