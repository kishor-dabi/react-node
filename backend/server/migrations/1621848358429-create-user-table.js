module.exports = {
    up(queryInterface, Sequelize) {
        return queryInterface.createTable('users', {
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

