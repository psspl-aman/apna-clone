'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('work_experiences', {
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
      job_title: { type: Sequelize.STRING(255), allowNull: false },
      company_name: { type: Sequelize.STRING(255), allowNull: false },
      job_roles: { type: Sequelize.ARRAY(Sequelize.TEXT), defaultValue: [] },
      industry: { type: Sequelize.STRING(100) },
      description: { type: Sequelize.TEXT },
      skills: { type: Sequelize.ARRAY(Sequelize.TEXT), defaultValue: [] },
      start_date: { type: Sequelize.DATEONLY },
      end_date: { type: Sequelize.DATEONLY },
      is_current: { type: Sequelize.BOOLEAN, defaultValue: false },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false },
    });

    await queryInterface.addIndex('work_experiences', ['candidate_id']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('work_experiences');
  },
};
