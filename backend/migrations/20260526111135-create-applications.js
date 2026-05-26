'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('applications', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
        primaryKey: true,
      },
      job_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'jobs', key: 'id' },
        onDelete: 'CASCADE',
      },
      candidate_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'candidate_profiles', key: 'id' },
        onDelete: 'CASCADE',
      },
      status: {
        type: Sequelize.STRING(50),
        defaultValue: 'applied',
      },
      applied_at: { type: Sequelize.DATE, allowNull: false },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false },
    });

    await queryInterface.addIndex('applications', ['candidate_id']);
    await queryInterface.addIndex('applications', ['job_id']);
    await queryInterface.addConstraint('applications', {
      fields: ['job_id', 'candidate_id'],
      type: 'unique',
      name: 'unique_job_candidate',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('applications');
  },
};
