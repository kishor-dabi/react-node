const sendResponse = require('../services/response.service').response;
const User = require('../models').User;
const OTP = require('../models').OTP;
const models = require('../models');
const to = require('await-to-js').default;
const decoded_jwt = require('../services/jwt_token.service').decoded_jwt;
const db = require("../models");
const moment = require('moment');
const HelpCategory = require('../models').HelpCategory;
const { Op, where } = require("sequelize");



const getLoginUserDetails = async(req, res) => {
    let userProfileData, tokenData, error, reqBody = req.body;
    
    try {
        [error, tokenData] = await to(decoded_jwt(req))

        if (error) {
            console.log(error);
            return sendResponse(res, 400, false, "token decode error", error);
        }

        let tokenUserData = tokenData.decoded ? tokenData.decoded.data : null;

        // console.log();
        [error, userProfileData] = await to(models.User.findOne({

            where: {
                user_id: tokenUserData.user_id
            },
            attributes: {
                exclude: ["createdAt", "updatedAt", "deletedAt"]
            }
        }));
       
        if (error) {
            console.log(error);
            return sendResponse(res, 400, false, "Error", error)
        }

        // console.log(error, JSON.stringify(tokenData));
        return sendResponse(res, 200, true, "success", userProfileData)
    } catch (e) {
        console.log(e);
        return sendResponse(res, 400, false, "Error", e)
    }
}

module.exports.getLoginUserDetails = getLoginUserDetails;


const logout = async(req, res) => {
    let userdata, tokenData, error, reqBody = req.body;
    [error, tokenData] = await to(decoded_jwt(req))

    let token = req.headers.authorization;
    token = token ? token.split(" ") : [];

    if (error) {
        console.log(error);
        return sendResponse(res, 400, false, "token decode error", error);
    }

    let tokenUserData = tokenData.decoded ? tokenData.decoded.data : null;

    [error, userdata] = await to(models.Token.destroy({
        where: { user_id: tokenUserData.user_id, token: token[1] },
        // force: true
    }))


    if (error) {
        console.log(error);
        return sendResponse(res, 400, false, "Error", error)
    }

    return sendResponse(res, 200, true, "success")
}
module.exports.logout = logout;

const userList = async(req, res) => {
    let userList, error, responseObj = {};
    [error, tokenData] = await to(decoded_jwt(req))

    if (error) {
        return sendResponse(res, 400, false, "token decode error", error);
    }

    let tokenUserData = tokenData.decoded ? tokenData.decoded.data : null;

    [error, userList] = await to(models.User.findAll({
       where:{
           user_type:{
               [Op.gte]:tokenUserData.user_type
           }
       }
    }));



    if (error) {
        return sendResponse(res, 400, false, error)
    }

    sendResponse(res, 200, true, "success", userList)

}
module.exports.userList = userList;

