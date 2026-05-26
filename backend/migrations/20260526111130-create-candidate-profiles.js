'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('candidate_profiles', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
        primaryKey: true,
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        unique: true,
        references: { model: 'users', key: 'id' },
        onDelete: 'CASCADE',
      },
      full_name: { type: Sequelize.STRING(255) },
      resume_url: { type: Sequelize.TEXT },
      experience: { type: Sequelize.INTEGER, defaultValue: 0 },
      skills: { type: Sequelize.ARRAY(Sequelize.TEXT), defaultValue: [] },
      education: { type: Sequelize.STRING(100) },
      city: { type: Sequelize.STRING(100) },
      gender: { type: Sequelize.STRING(20) },
      dob: { type: Sequelize.DATEONLY },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false },
    });

    await queryInterface.addIndex('candidate_profiles', ['user_id']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('candidate_profiles');
  },
};
