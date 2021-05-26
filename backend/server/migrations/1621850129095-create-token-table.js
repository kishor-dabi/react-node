module.exports = {
    up(queryInterface, Sequelize) {
        return queryInterface.createTable('token', {
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
                // type: "FOREIGN KEY",
                // name: 'user_id',
                references: {
                    model: 'users',
                    // field: 'user_id'
                    key: 'user_id',
                },
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

