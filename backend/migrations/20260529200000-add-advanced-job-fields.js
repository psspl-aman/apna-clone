'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('jobs', 'work_location_type', {
      type: Sequelize.STRING(50),
      allowNull: true,
    });
    await queryInterface.addColumn('jobs', 'pay_type', {
      type: Sequelize.STRING(50),
      allowNull: true,
    });
    await queryInterface.addColumn('jobs', 'perks', {
      type: Sequelize.ARRAY(Sequelize.TEXT),
      defaultValue: [],
    });
    await queryInterface.addColumn('jobs', 'has_joining_fee', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    });
    await queryInterface.addColumn('jobs', 'is_night_shift', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    });
    await queryInterface.addColumn('jobs', 'english_level', {
      type: Sequelize.STRING(50),
      allowNull: true,
    });
    await queryInterface.addColumn('jobs', 'experience_type', {
      type: Sequelize.STRING(50),
      allowNull: true,
    });
    await queryInterface.addColumn('jobs', 'is_walkin', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    });
    await queryInterface.addColumn('jobs', 'contact_preference', {
      type: Sequelize.STRING(100),
      allowNull: true,
    });
    await queryInterface.addColumn('jobs', 'plan_type', {
      type: Sequelize.STRING(50),
      allowNull: true,
    });
    await queryInterface.addColumn('jobs', 'is_paid', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    });
    await queryInterface.addColumn('jobs', 'razorpay_payment_id', {
      type: Sequelize.STRING(255),
      allowNull: true,
    });
  },

  async down(queryInterface) {
    const cols = [
      'work_location_type','pay_type','perks','has_joining_fee','is_night_shift',
      'english_level','experience_type','is_walkin','contact_preference',
      'plan_type','is_paid','razorpay_payment_id',
    ];
    for (const col of cols) {
      await queryInterface.removeColumn('jobs', col);
    }
  },
};
