module.exports = {
    up(queryInterface, Sequelize) {
        return queryInterface.createTable('otp', {
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
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('NOW()')
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('NOW()')
            },
            deletedAt: Sequelize.DATE,
        });
    },
  
    down(queryInterface, Sequelize) {
      // logic for reverting the changes
      
    },
  };

