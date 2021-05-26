module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("User", {
        user_id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        full_name: {
            type: Sequelize.STRING
        },
        email: {
            type: Sequelize.STRING,
            unique: true // 
        },
        phone_number: {
            type: Sequelize.STRING //DATE
        },
        password: {
            type: Sequelize.STRING
        },
        avatar_image_url: {
            type: Sequelize.TEXT
        },
       
        is_verified: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        gender: {
            type: Sequelize.INTEGER
        },
        age: {
            type: Sequelize.INTEGER,
            defaultValue: null
        },
        status: {
            type: Sequelize.INTEGER,
            defaultValue: null
        },
        user_type: {
            type: Sequelize.INTEGER, // 1=>admin 2=>users
            defaultValue: null
        },
       
    }, {
        paranoid: true,
        deletedAt: "deletedAt",
        timestamps: true,
        tableName: "users"
    });


    // User.associate = function(models) {
    //     User.belongsTo(models.Weight, {
    //         foreignKey: 'goal_weight_id',
    //         as: 'goal_weight',
    //         key: "weight_id"
    //     });
    //     User.belongsToMany(models.GoalType, { through: models.UserGoalPlan, foreignKey: 'user_id', as: "goal_type", unique: false, });
    //     User.hasMany(models.UserPayment, {
    //         foreignKey: 'user_id',
    //         as: "payment",
    //         constraints: false
    //     });
  
    // }

    // User.associate = function(models) {
    //     User.belongsToMany(models.Allergies, { through: "UserAllergies" });
    // }    
    return User;
};