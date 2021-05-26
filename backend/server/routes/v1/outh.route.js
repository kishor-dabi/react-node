var router = require("express").Router();
const authController = require('../../controller/auth.controller.js');

router.post('/login', authController.login);
router.post('/signup', authController.signup);
// router.post('/forgot-password', authController.forgotPassword);
// router.post('/resend-otp', authController.resendOtp);
// router.post('/verify-signup-otp', authController.verifySignupOtp);
// router.post('/verify-otp', authController.verifySignupOtp);
// router.post('/reset-password', authController.resetPassword);
// router.post('/admin/create', authController.createAdmin);
// router.post('/admin/login', authController.Adminlogin);
// router.post('/check-version', authController.checkAppVersion);


module.exports = router;