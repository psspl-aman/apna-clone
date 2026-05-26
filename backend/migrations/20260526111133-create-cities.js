'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('cities', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      slug: { type: Sequelize.STRING(100), allowNull: false, unique: true },
      name: { type: Sequelize.STRING(100), allowNull: false },
      state: { type: Sequelize.STRING(100) },
      is_active: { type: Sequelize.BOOLEAN, defaultValue: true },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('cities');
  },
};
