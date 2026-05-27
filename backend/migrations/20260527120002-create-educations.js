'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('educations', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
        primaryKey: true,
      },
      candidate_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'candidate_profiles', key: 'id' },
        onDelete: 'CASCADE',
      },
      degree: { type: Sequelize.STRING(255) },
      field_of_study: { type: Sequelize.STRING(255) },
      institution: { type: Sequelize.STRING(255) },
      education_level: { type: Sequelize.STRING(50) },
      batch_year: { type: Sequelize.INTEGER },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false },
    });

    await queryInterface.addIndex('educations', ['candidate_id']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('educations');
  },
};
