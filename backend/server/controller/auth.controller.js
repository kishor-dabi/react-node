const User = require('../models').User;
const OTP = require('../models').OTP;
const models = require('../models');
const to = require('await-to-js').default;
const emailService = require('../services/email.service').emailService;
const sendResponse = require('../services/response.service').response;

const create_jwt = require('../services/jwt_token.service').create_jwt;
const semver = require('semver')



const bcrypt = require('bcrypt');
const saltRounds = 10;
var jwt = require('jsonwebtoken');

const env = process.env.NODE_ENV || 'development';

const config = require(__dirname + '/../config/config.json')[env];
const db = require("../models");




// Retrieve all user from the database.
const login = async(req, res) => {
    let userData, userDevice, otpUpdate, otpCreate, error, reqBody = req.body
    const t = await db.sequelize.transaction();
    try {


        [error, userData] = await to(User.find({
            where: { email: reqBody.email, password: reqBody.password },
            // include: "accounts"
        }))

        if (error) {
            await t.rollback();
            return sendResponse(res, 400, false, error)
        }
        // .then(data=>{
        // bcrypt.compare(reqBody.password, data.password).then(function(result) {
        // result == true
        if (userData) {
            // let user_data = JSON.parse(JSON.stringify(data))
            let user_data = JSON.parse(JSON.stringify(userData));
            delete user_data.password;
            // console.log("-- user data",user_data);
            if (!user_data.is_verified) {

                let allOtp = await OTP.findAll({
                    where: {
                        user_id: userData.user_id,
                        otp_for: 1,
                        status: 1
                    }
                }, { transaction: t })
                if (allOtp.length) {
                    [error, otpUpdate] = await to(OTP.update({ status: 2 }, {
                        where: {
                            user_id: userData.user_id,
                            otp_for: 1,
                            status: 1
                        }
                    }));
                    if (error) {
                        await t.rollback();
                        return sendResponse(res, 400, false, error)
                    }
                    [error, otpCreate] = await to(OTP.create({
                        user_id: userData.user_id,
                        otp_for: 1,
                        status: 1,
                        otp: Math.floor(100000 + Math.random() * 900000)
                    }, { transaction: t }));
                    if (error) {
                        await t.rollback();
                        return sendResponse(res, 400, false, error)
                    }

                    if (otpCreate) {
                        let message = await emailService(`hi, use ${otpCreate.otp} for sign up varification`, userData.email, "Sign Up OTP")
                            // let email_body =  `hi, use ${otpdata.otp} for sign up varification`
                            // sendResponse(res, 201, true, "Otp send to email", userData)

                        if (message) {
                            // t.commit()
                            await t.commit();
                            return sendResponse(res, 201, true, "Otp send to email", { user_data: userData, token: "" })
                        } else {
                            await t.rollback();
                            return sendResponse(res, 400, false, "Error")
                        }
                    }

                    // }).catch((otpcreateerr)=>{
                    //     res.status(400).send({message:otpcreateerr, success:false});
                    // })
                } else {
                    [error, otpCreate] = await to(OTP.create({
                        user_id: userData.user_id,
                        otp_for: 1,
                        status: 1,
                        otp: Math.floor(100000 + Math.random() * 900000)
                    }, { transaction: t }));
                    if (error) {
                        await t.rollback();
                        return sendResponse(res, 400, false, error)
                    }

                    if (otpCreate) {
                        let message = await emailService(`hi, use ${otpCreate.otp} for sign up varification`, userData.email, "Sign Up OTP")
                            // let email_body =  `hi, use ${otpdata.otp} for sign up varification`
                        if (message) {
                            await t.commit();
                            return sendResponse(res, 201, true, "Otp send to email", { user_data: userData, token: "" })
                        } else {
                            await t.rollback();
                            return sendResponse(res, 400, false, "error")
                        }
                        // res.status(201).send({user:userData, otp_data_message:mailRes, success:true});
                    }
                }

            }
            let token = jwt.sign({
                exp: Math.floor(Date.now() / 1000) + ((config.jwt_expiry_days || 1) * 24 * 60 * 60),
                data: user_data
            }, config.jwt);
            [error, userDevice] = await to(models.Token.create({
                user_id: user_data.user_id,
                token_id: reqBody.token_id,
                token: token,
                device_name: reqBody.device_name,
                os_version: reqBody.os_version,
                app_version: reqBody.app_version,
                model_name: reqBody.model_name,
                status: 1
            }));
            if (error) {
                await t.rollback();
                return sendResponse(res, 400, false, error)
            }
            // .then((userDeviceRes)=>{
            // console.log(JSON.stringify(userDeviceRes));
            if (userDevice) {
                await t.commit();
                // res.status(200).send({token:token, user_data:user_data,success:true});
                return sendResponse(res, 200, true, "login success.", { token: token, user_data: user_data })
            } else {
                await t.rollback();
                return sendResponse(res, 400, false, "login fail.")
            }
            // res.status(200).send({token:token, user_data:user_data,success:true});
            // })

        } else {
            await t.rollback();
            return sendResponse(res, 400, false, "Invalid email or password.")
        }
    } catch (e) {
        console.log(e);
        await t.rollback();
        return sendResponse(res, 400, false, e)
            // res.status(500).send({message:e, success:false});
    }
};

module.exports.login = login;


const signup = async(req, res) => {

    const t = await db.sequelize.transaction();
    try {

        let userCreate, userRes, otpUpdate, otpCreate, error, userData, body = req.body;

console.log(body);
        if (!body.password) {
            await t.rollback();
            return sendResponse(res, 400, false, "password is required.");
        }
        if (!body.full_name) {
            await t.rollback();
            return sendResponse(res, 400, false, "Name is required.");
        }
        
        body.status = body.status ? body.status : 1;
        body.user_type = body.user_type ? body.user_type : 3;

        if (!body.email) {
            await t.rollback();
            return sendResponse(res, 400, false, "Email is required.");
        }

        [error, userRes] = await to(User.find({
            where: {
                email: req.body.email
            }
        }));
        if (error) {
            await t.rollback();
            return sendResponse(res, 400, false, error)
        }
        // console.log(" -- userRes", userRes);
        if (userRes) {
            await t.rollback();
            return sendResponse(res, 500, false, 'User already exist with this email')
                // res.status(500).send({message:, success:false});
        } else {

            [error, userCreate] = await to(User
                .create(
                    body, { transaction: t }
                ));
            if (error) {
                await t.rollback();
                return sendResponse(res, 400, false, error)
            }
            // console.log(" -- userCreate", userCreate);

            if (userCreate) {
                let allOtp = await OTP.findAll({
                    where: {
                        user_id: userCreate.user_id,
                        otp_for: 1,
                        status: 1
                    }
                }, { transaction: t })
                if (allOtp.length) {
                    [error, otpUpdate] = await to(OTP.update({ status: 2 }, {
                        where: {
                            user_id: userCreate.user_id,
                            otp_for: 1,
                            status: 1
                        }
                    }));
                    if (error) {
                        await t.rollback();
                        return sendResponse(res, 400, false, error)
                    }
                    [error, otpCreate] = await to(OTP.create({
                        user_id: userCreate.user_id,
                        otp_for: 1,
                        status: 1,
                        otp: Math.floor(100000 + Math.random() * 900000)
                    }, { transaction: t }));
                    if (error) {
                        await t.rollback();
                        return sendResponse(res, 400, false, error)
                    }

                    if (otpCreate) {
                        let message = await emailService(`hi, use ${otpCreate.otp} for sign up varification`, userCreate.email, "Sign Up OTP")
                            // let email_body =  `hi, use ${otpdata.otp} for sign up varification`
                            // sendResponse(res, 201, true, "Otp send to email", userCreate)

                        if (message) {
                            // t.commit()
                            await t.commit();
                            return sendResponse(res, 201, true, "Otp send to email", { user_data: userCreate, token: null })
                        } else {
                            await t.rollback();
                            return sendResponse(res, 400, false, "Error")
                        }
                    }

                    // }).catch((otpcreateerr)=>{
                    //     res.status(400).send({message:otpcreateerr, success:false});
                    // })
                } else {
                    [error, otpCreate] = await to(OTP.create({
                        user_id: userCreate.user_id,
                        otp_for: 1,
                        status: 1,
                        otp: Math.floor(100000 + Math.random() * 900000)
                    }, { transaction: t }));
                    if (error) {
                        await t.rollback();
                        return sendResponse(res, 400, false, error)
                    }

                    if (otpCreate) {
                        let message = await emailService(`hi, use ${otpCreate.otp} for sign up varification`, userCreate.email, "Sign Up OTP")
                            // let email_body =  `hi, use ${otpdata.otp} for sign up varification`
                        if (message) {
                            await t.commit();
                            return sendResponse(res, 201, true, "Otp send to email", { user_data: userCreate, token: null })

                        } else {
                            await t.rollback();
                            return sendResponse(res, 400, false, "error")
                        }
                        // res.status(201).send({user:userCreate, otp_data_message:mailRes, success:true});
                    }
                }
            }
        }

    } catch (e) {
        console.log(e);
        // await t.commit();
        await t.rollback();
        sendResponse(res, 201, false, "Account not created.")
            // res.status(400).send("e");
    }
}

module.exports.signup = signup;

const verifySignupOtp = async(req, res) => { // email, varification_for 1/2
    let userData, userUpdateDataRes, otpUpdate, otpdestroy, error, reqBody = req.body;
    try {
        if (!reqBody.email) {
            return sendResponse(res, 400, false, "Email is required.");
            // return sendResponse(res, 400, false, "Email is required.");
        }
        [error, userData] = await to(User.find({
            where: { email: req.body.email },
        }))
        if (error) {
            return sendResponse(res, 400, false, error)
        }

        // console.log(JSON.stringify(userData), "-----");
        userData = JSON.parse(JSON.stringify(userData));
        if (userData) {
            let otpFindRes = await OTP.find({
                where: { user_id: userData.user_id, status: 1, otp_for: reqBody.varification_for },
            })

            if (otpFindRes) {

                if (otpFindRes.otp == reqBody.otp) {
                    [error, otpUpdate] = await to(OTP.update({
                        status: 2
                    }, {
                        where: {
                            otp_id: otpFindRes.otp_id
                        }
                    }));
                    if (error) {
                        return sendResponse(res, 400, false, error)
                    }

                    [error, otpdestroy] = await to(OTP.destroy({
                        where: {
                            otp_id: otpFindRes.otp_id
                        }
                    }));
                    if (!error && otpdestroy) {

                        if (reqBody.varification_for == 1) {


                            [error, userUpdateDataRes] = await to(User.update({ is_verified: true }, {
                                where: { user_id: userData.user_id },
                            }))

                            let userFindData = await User.findOne({
                                where: { user_id: userData.user_id },
                            })

                            // console.log(userFindData , "user find data");

                            let token = await create_jwt(userFindData);

                            /* jwt.sign({
                                exp: Math.floor(Date.now() / 1000) + ((config.jwt_expiry_days || 1) * 24 * 60 * 60),
                                data: user_data
                            }, config.jwt); */
                            [error, userDevice] = await to(models.Token.create({
                                user_id: userFindData.user_id,
                                token_id: reqBody.token_id,
                                token: token,
                                device_name: reqBody.device_name,
                                os_version: reqBody.os_version,
                                app_version: reqBody.app_version,
                                model_name: reqBody.model_name,
                                status: 1
                            }));
                            if (error) {
                                return sendResponse(res, 400, false, error)
                            }
                            // .then((userDeviceRes)=>{
                            // console.log(JSON.stringify(userDeviceRes));
                            if (userDevice) {
                                // res.status(200).send({token:token, user_data:user_data,success:true});
                                return sendResponse(res, 200, true, "login success.", { token: token, user_data: userFindData })
                            } else {
                                return sendResponse(res, 400, false, "login fail.")
                            }

                            // return sendResponse(res, 200, true, "otp match")
                        } else {
                            return sendResponse(res, 200, true, "otp match")
                        }

                    } else {
                        return sendResponse(res, 400, false, "otp not match")
                    }
                    // res.status(200).send({message:"otp match", success:true});

                } else {
                    return sendResponse(res, 400, false, "otp not match")
                }
            } else {
                return sendResponse(res, 400, false, "otp not match")

            }

        } else {
            return sendResponse(res, 400, false, "Invalid email")
        }

        // res.status(400).send({message:err, success:false}) 
        // });
    } catch (e) {
        console.log(e);
        return sendResponse(res, 400, false, e)

        // res.status(400).send({message:e, success:false});
    }
}
module.exports.verifySignupOtp = verifySignupOtp;




const forgotPassword = async(req, res) => {
    let userData, otpUpdate, allOtps, otpcreate, error, emailSend, reqBody = req.body;
    try {
        if (!reqBody.email) {
            return sendResponse(res, 400, false, "Email is required.");
            // return sendResponse(res, 400, false, "Email is required.");
        }

        [error, userData] = await to(User.find({
            where: {
                email: reqBody.email
            }
        }));
        if (error) {
            return sendResponse(res, 400, false, error)
        }

        //   .then(data=>{
        // console.log(JSON.stringify(data))
        if (!userData) {
            return sendResponse(res, 400, false, 'User not exist with this email')
                // res.status(500).send({message:'User not exist with this email', success:false});
        } else {

            [error, allOtps] = await to(OTP.findAll({
                where: {
                    user_id: userData.user_id,
                    otp_for: 2,
                    status: 1
                }
            }));
            if (error) {
                return sendResponse(res, 400, false, error)
            }
            // .then((alldata)=>{
            if (allOtps.length) {
                [error, otpUpdate] = await to(OTP.update({ status: 2 }, {
                    where: {
                        user_id: userData.user_id,
                        otp_for: 2,
                        status: 1
                    }
                }));
                if (error) {
                    return sendResponse(res, 400, false, error)
                }
                // .then((updateResult)=>{
                [error, otpcreate] = await to(OTP.create({
                    user_id: userData.user_id,
                    otp_for: 2,
                    status: 1,
                    otp: Math.floor(100000 + Math.random() * 900000)
                }));
                if (error) {
                    return sendResponse(res, 400, false, error)
                }
                // .then((otpdata)=>{
                [error, emailSend] = await to(emailService(`hi, use ${otpcreate.otp} for reset password`, userData.email, "reset password OTP"))
                if (emailSend) {
                    return sendResponse(res, 201, true, "Otp send to email")
                } else {
                    return sendResponse(res, 400, false, "Error")
                }
                // return message;
                // }).then((mailRes)=>{
                //     res.status(200).send({ success:true});
                // }).catch((otpcreateerr)=>{
                //     res.status(400).send({message:otpcreateerr, success:false});
                // })
                // }).catch((otpErr)=>{
                //     res.status(400).send({message:otpErr, success:false});
                // })
            } else {
                [error, otpcreate] = await to(OTP.create({
                    user_id: userData.user_id,
                    otp_for: 2,
                    status: 1,
                    otp: Math.floor(100000 + Math.random() * 900000)
                }));
                if (error) {
                    return sendResponse(res, 400, false, error)
                }

                [error, emailSend] = await to(emailService(`hi, use ${otpcreate.otp} for reset password`, userData.email, "reset password OTP"))
                if (emailSend) {
                    return sendResponse(res, 201, true, "Otp send to email")
                } else {
                    return sendResponse(res, 400, false, "Error")
                }
                // .then((otpdata)=>{
                // let email_body =  `hi, use ${otpdata.otp} for sign up varification`
                //     return message;
                //     // res.status(201).send({user:data, otp_data_message:"email send"});
                // }).then((mailRes)=>{
                //     res.status(200).send({ success:true});
                // }).catch((otpErr)=>{
                //     res.status(400).send({message:otpErr, success:false});
                // })
            }
            // })

        }
        //   });
    } catch (e) {
        console.log(e);
        res.status(400).send({ message: e, success: false });
    }
}

module.exports.forgotPassword = forgotPassword;


const createAdmin = async(req, res) => {

    const t = await db.sequelize.transaction();
    try {

        let userCreate, userRes, otpUpdate, otpCreate, error, body = req.body;

        console.log(body);
        if (!body.email) {
            await t.rollback();
            return sendResponse(res, 400, false, "Email is required.");
        }
        if (!body.password) {
            await t.rollback();
            return sendResponse(res, 400, false, "password is required.");
        }
        if (!body.full_name) {
            await t.rollback();
            return sendResponse(res, 400, false, "Name is required.");
        }
        // if (!body.full_name) {
        //     return sendResponse(res, 400, false, "Name is required.");
        // }
        body.status = body.status ? body.status : 1;
        body.user_type = body.user_type ? body.user_type : 1;

        [error, userRes] = await to(User.find({
            where: {
                email: req.body.email
            }
        }));
        if (error) {
            await t.rollback();
            return sendResponse(res, 400, false, error)
        }
        // console.log(" -- userRes", userRes);
        if (userRes) {
            await t.rollback();
            return sendResponse(res, 500, false, 'User already exist with this email')
                // res.status(500).send({message:, success:false});
        } else {
            bcrypt.hash(req.body.password, saltRounds, async function(err, hash) {
                // Store hash in your password DB.
                if (!err) {
                    console.log(hash)
                    body.password = hash;

                    [error, userCreate] = await to(User.create(
                        body, { transaction: t }
                    ));
                    if (error) {
                        await t.rollback();
                        return sendResponse(res, 400, false, error)
                    }
                    await t.commit();
                    return sendResponse(res, 201, true, "Admin created", userCreate)
                } else {
                    await t.rollback();
                    return sendResponse(res, 201, false, "Admin not  created")
                }
            })
        }


    } catch (e) {
        console.log(e);
        // await t.commit();
        await t.rollback();
        sendResponse(res, 201, false, "Account not created.")
            // res.status(400).send("e");
    }
}

module.exports.createAdmin = createAdmin;

const Adminlogin = async(req, res) => {
    let userData, error, userDevice, reqBody = req.body
    try {
        [error, userData] = await to(User.findOne({
            where: { email: reqBody.email, user_type: 1 },
            // include: "accounts"
        }))
        if (error) {
            return sendResponse(res, 400, false, error)
        }
        // .then(data=>{
        bcrypt.compare(reqBody.password, userData.password).then(async function(result) {
            // result == true
            if (result) {
                // let user_data = JSON.parse(JSON.stringify(data))
                let user_data = JSON.parse(JSON.stringify(userData));
                delete user_data.password;

                let token = jwt.sign({
                    exp: Math.floor(Date.now() / 1000) + ((config.jwt_expiry_days || 1) * 24 * 60 * 60),
                    data: user_data
                }, config.jwt);

                [error, userDevice] = await to(models.Token.create({
                    user_id: user_data.user_id,
                    // token_id: reqBody.token_id,
                    token: token,
                    device_name: "web",
                    os_version: 0,
                    app_version: 0,
                    model_name: 0,
                    status: 1
                }));

                if (error) {
                    console.log(error);
                    return sendResponse(res, 400, false, error)
                }
                // res.status(200).send({token:token, user_data:user_data,success:true});
                return sendResponse(res, 200, true, "login success.", { token: token, user_data: user_data })

            } else {
                return sendResponse(res, 400, false, "Invalid email or password.")
            }

        })
    } catch (e) {
        console.log(e);
        return sendResponse(res, 400, false, e)
            // res.status(500).send({message:e, success:false});
    }
};

module.exports.Adminlogin = Adminlogin;



const checkAppVersion = async(req, res) => {
    try {
        console.log(req.body);
        let reqBody = req.body;
        let [error, version] = await to(models.AppVersion.findOne({
            where: {
                os_type: reqBody.os_type,
                is_current_version: 1
            },
            order: [
                ['createdAt', 'DESC']
            ]
        }));
        version = JSON.parse(JSON.stringify(version))
        console.log(version);


        if (!version) {
            return sendResponse(res, 400, false, "no version found")
        }
        console.log(reqBody.app_version, version.version_number);
        if (semver.lt(reqBody.app_version, version.version_number)) {
            version.update_available = true;
        } else {
            version.update_available = false;
        }

        return sendResponse(res, 200, true, "version", version)
    } catch (e) {
        console.log(e);
        return sendResponse(res, 400, false, "error", e)

    }
}
module.exports.checkAppVersion = checkAppVersion;