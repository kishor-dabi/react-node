module.exports = (sequelize, Sequelize) => {
    const OTP = sequelize.define("OTP", {
        otp_id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        user_id: {
            type: Sequelize.INTEGER,
            defaultValue: null
        },
        otp: {
            type: Sequelize.STRING,
            defaultValue: null
        },
        status: {
            type: Sequelize.INTEGER, // 1=>active 2=>deleted,
            defaultValue: null
        },
        otp_for: {
            type: Sequelize.INTEGER, // 1=>signup 2=>forgot password,
            defaultValue: null
        }
    }, {
        paranoid: true,
        deletedAt: "deletedAt",
        timestamps: true,
        tableName: "otp"
    });

    return OTP;
};