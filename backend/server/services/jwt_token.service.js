
const bcrypt = require('bcrypt');
const saltRounds = 10;
var jwt = require('jsonwebtoken');

const env = process.env.NODE_ENV || 'development';

const config = require(__dirname + '/../config/config.json')[env];


async function decoded_jwt(req) {
    let token = req.headers.authorization
    token = token ? token.split(" ") : [];

    var decoded = await jwt.verify(token[1], config.jwt);
    // console.log(decoded) // bar

    if (decoded) {
        return { verified: true, decoded }

    } else {
        return { verified: false }
    }

}

module.exports.decoded_jwt = decoded_jwt;

async function create_jwt(user_data) {

    let token = jwt.sign({
        exp: Math.floor(Date.now() / 1000) + ((config.jwt_expiry_days || 1) * 24 * 60 * 60),
        data: user_data
    }, config.jwt);
    return token;
}

module.exports.create_jwt = create_jwt;
