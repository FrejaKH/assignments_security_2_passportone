const express = require('express');
const router = express.Router();
const auth = require("../controllers/authController.js");

/* registration form  */
router.get('/register', auth.register);
/* receive registration data  */
router.post('/register', auth.postRegister);

/* login form  */
router.get('/login', auth.login);

/* logout, kills session and redirects to frontpage  */
router.get('/logout', auth.logout);

module.exports = router;