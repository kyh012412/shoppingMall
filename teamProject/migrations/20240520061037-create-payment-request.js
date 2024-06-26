'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('PaymentRequests', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING(40)
      },
      amount: {
        type: Sequelize.INTEGER,
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id'
        }
      },
      items: {
        type: Sequelize.JSON,
      },
      mainAddress: {
        type: Sequelize.STRING(100),
      },
      detailAddress: {
        type: Sequelize.STRING(100),
      },
      carryMessage: {
        type: Sequelize.STRING(100),
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("now"),
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('PaymentRequests');
  }
};
