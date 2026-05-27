'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('certifications', {
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
      name: { type: Sequelize.STRING(255), allowNull: false },
      issuing_org: { type: Sequelize.STRING(255) },
      issue_date: { type: Sequelize.DATEONLY },
      expiry_date: { type: Sequelize.DATEONLY },
      credential_url: { type: Sequelize.TEXT },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false },
    });

    await queryInterface.addIndex('certifications', ['candidate_id']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('certifications');
  },
};
