// const userController = require('../controller/user.js');
// const otpVarification = require('../controller/otp_varification.js');

const { route } = require("./outh.route");

// const { route } = require('./outh.route');
module.exports = (app) => {

    var router = require("express").Router();
    var authRoute = require('./outh.route')
    // var policyRoute = require('./master_policies.route')
    // var masterDataRoute = require('./master_data.route')
    var userRoute = require('./user.route')
    // var recipeRoute = require('./recipe.route')
    // var userMealRoute = require('./user-meal.route')
    // var paymentRoute = require('./payment.route')
    // var goalRoute = require('./goal.route')
    //     // var paymentRoute = require('./payment.route')

    // var adminHelpRoute = require('./admin-help.route')
    // var dashboardRoute = require('./admin.route')
    // var userList = require('./admin-user.route')
        // var userDetails = require('./admin-user.route')
        // var activateDeactivate = require('./admin-user.route')

    // var mealsReciepe = require('./admin.route')
    // var question = require('./admin.route')
    // var adminMealRoute = require('./admin-meal.route')
    // var adminProteinRoute = require('./admin-protein.route')
    // var adminGoalRoute = require('./admin-goal.route')
    // var adminAllergiesRoute = require('./admin-allergies.route')
    // var adminLeveofExcerciseRoute = require('./admin-level-of-excercise.route')
    // var adminMasterContentRoute = require('./admin-master-content.route')

    app.get('/test-api', (req, res) => {
        res.status(200).send({
            data: "Welcome Node Sequlize API v1"
        })
    })

    // router.get('/users',userController.getAllUsers);


    // router.put('/user/:userId',userController.update);
    // router.get('/user/:id',userController.getUserById);


    router.use('', authRoute);
    // router.use('/policy', policyRoute);
    // router.use('/master-data', masterDataRoute);
    router.use('/user', userRoute);
    // router.use('/recipe', recipeRoute);
    // router.use('/user-meal', userMealRoute);
    // router.use('/payments', paymentRoute);
    // router.use('/goal', goalRoute);
    // router.use('/admin/dashboard', dashboardRoute);
    // router.use('/admin', userList)
    //     // router.use('/admin/userdetails', userDetails)
    //     // router.use('/admin/user/activated/deactivated', activateDeactivate)
    // router.use('/admin-reciepe', mealsReciepe)
    // router.use('/question', question)
    // router.use('/admin', adminHelpRoute)
    // router.use('/admin', adminMealRoute)
    // router.use('/admin', adminProteinRoute)
    // router.use('/admin', adminGoalRoute)
    // router.use('/admin', adminAllergiesRoute)
    // router.use('/admin', adminLeveofExcerciseRoute)
    // router.use('/admin', adminMasterContentRoute)





    // router.use('/payments', paymentRoute);




    // router.post('/api/signup', )

    app.use("/api", router);

}