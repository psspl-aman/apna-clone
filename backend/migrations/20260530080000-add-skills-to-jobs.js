'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('jobs', 'skills', {
      type: Sequelize.ARRAY(Sequelize.TEXT),
      defaultValue: [],
      allowNull: true,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('jobs', 'skills');
  },
};
