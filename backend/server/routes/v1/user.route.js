var router = require("express").Router();
const userController = require('../../controller/user.controller');

// router.post('/user-details', userController.userPersonalDetailSave);
router.get('/user-profile', userController.getLoginUserDetails);
router.get('/users', userController.userList);



module.exports = router;