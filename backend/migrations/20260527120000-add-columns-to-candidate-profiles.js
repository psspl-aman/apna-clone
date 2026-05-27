'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('candidate_profiles', 'date_of_birth', {
      type: Sequelize.DATEONLY,
    });
    await queryInterface.addColumn('candidate_profiles', 'home_town', {
      type: Sequelize.STRING(100),
    });
    await queryInterface.addColumn('candidate_profiles', 'current_location', {
      type: Sequelize.STRING(100),
    });
    await queryInterface.addColumn('candidate_profiles', 'current_salary', {
      type: Sequelize.INTEGER,
    });
    await queryInterface.addColumn('candidate_profiles', 'total_experience', {
      type: Sequelize.INTEGER,
    });
    await queryInterface.addColumn('candidate_profiles', 'spoken_english_level', {
      type: Sequelize.STRING(20),
    });
    await queryInterface.addColumn('candidate_profiles', 'school_medium', {
      type: Sequelize.STRING(50),
    });
    await queryInterface.addColumn('candidate_profiles', 'highest_education', {
      type: Sequelize.STRING(100),
    });
    await queryInterface.addColumn('candidate_profiles', 'preferred_job_titles', {
      type: Sequelize.ARRAY(Sequelize.TEXT),
      defaultValue: [],
    });
    await queryInterface.addColumn('candidate_profiles', 'preferred_locations', {
      type: Sequelize.ARRAY(Sequelize.TEXT),
      defaultValue: [],
    });
    await queryInterface.addColumn('candidate_profiles', 'languages', {
      type: Sequelize.JSONB,
      defaultValue: [],
    });
    await queryInterface.addColumn('candidate_profiles', 'profile_completion', {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    });
    await queryInterface.addColumn('candidate_profiles', 'resume_file_name', {
      type: Sequelize.STRING(255),
    });
    await queryInterface.addColumn('candidate_profiles', 'resume_updated_at', {
      type: Sequelize.DATE,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('candidate_profiles', 'date_of_birth');
    await queryInterface.removeColumn('candidate_profiles', 'home_town');
    await queryInterface.removeColumn('candidate_profiles', 'current_location');
    await queryInterface.removeColumn('candidate_profiles', 'current_salary');
    await queryInterface.removeColumn('candidate_profiles', 'total_experience');
    await queryInterface.removeColumn('candidate_profiles', 'spoken_english_level');
    await queryInterface.removeColumn('candidate_profiles', 'school_medium');
    await queryInterface.removeColumn('candidate_profiles', 'highest_education');
    await queryInterface.removeColumn('candidate_profiles', 'preferred_job_titles');
    await queryInterface.removeColumn('candidate_profiles', 'preferred_locations');
    await queryInterface.removeColumn('candidate_profiles', 'languages');
    await queryInterface.removeColumn('candidate_profiles', 'profile_completion');
    await queryInterface.removeColumn('candidate_profiles', 'resume_file_name');
    await queryInterface.removeColumn('candidate_profiles', 'resume_updated_at');
  },
};
