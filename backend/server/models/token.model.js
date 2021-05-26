module.exports = (sequelize, Sequelize) => {
    const Token = sequelize.define("Token", {
        token_id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        token: {
            type: Sequelize.TEXT
        },
        user_id: {
            type: Sequelize.INTEGER,
        },
        
    }, {
        paranoid: true,
        deletedAt: "deletedAt",
        timestamps: true,
        tableName: "token"
    });
  
    return Token;
};