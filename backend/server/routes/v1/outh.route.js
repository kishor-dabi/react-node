var router = require("express").Router();
const authController = require('../../controller/auth.controller.js');

router.post('/login', authController.login);
router.post('/signup', authController.signup);
router.post('/verify-signup-otp', authController.verifySignupOtp);



module.exports = router;