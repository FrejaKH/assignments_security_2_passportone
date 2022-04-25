const express = require('express');
const router = express.Router();
const auth = require("../controllers/authController.js");
const { forwardAuthenticated, ensureAuthenticated } = require('../config/auth');


/* registration form  */
router.get('/register', forwardAuthenticated, auth.register);
/* receive registration data  */
router.post('/register', auth.postRegister);

/* login form  */
router.get('/login', forwardAuthenticated, auth.login);
/* handle login */
router.post('/login', auth.postLogin)

router.get('/dashboard', ensureAuthenticated, async function(req, res, next) {
    let user = req.user ? req.user.uid : null;
    let allUsers = await auth.allUsers({});
    res.render('dashboard', {
        title: 'Registered Users',
        user: user,
        allUsers,
    });
});



/* logout, kills session and redirects to frontpage  */
router.get('/logout', auth.logout);

module.exports = router;