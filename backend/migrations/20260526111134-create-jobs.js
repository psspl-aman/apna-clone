'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('jobs', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
        primaryKey: true,
      },
      company_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'companies', key: 'id' },
        onDelete: 'CASCADE',
      },
      title: { type: Sequelize.STRING(255), allowNull: false },
      description: { type: Sequelize.TEXT },
      category: { type: Sequelize.STRING(100) },
      department: { type: Sequelize.STRING(100) },
      city: { type: Sequelize.STRING(100) },
      job_type: {
        type: Sequelize.ENUM('full_time', 'part_time', 'work_from_home', 'night_shift'),
      },
      salary_min: { type: Sequelize.INTEGER, defaultValue: 0 },
      salary_max: { type: Sequelize.INTEGER },
      experience_min: { type: Sequelize.INTEGER, defaultValue: 0 },
      experience_max: { type: Sequelize.INTEGER },
      education: { type: Sequelize.STRING(100) },
      gender: { type: Sequelize.STRING(20), defaultValue: 'any' },
      openings: { type: Sequelize.INTEGER, defaultValue: 1 },
      is_active: { type: Sequelize.BOOLEAN, defaultValue: true },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false },
    });

    await queryInterface.addIndex('jobs', ['city']);
    await queryInterface.addIndex('jobs', ['category']);
    await queryInterface.addIndex('jobs', ['job_type']);
    await queryInterface.addIndex('jobs', ['is_active']);
    await queryInterface.addIndex('jobs', ['created_at']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('jobs');
  },
};
