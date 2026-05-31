'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('payments', {
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
      job_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: { model: 'jobs', key: 'id' },
        onDelete: 'SET NULL',
      },
      plan_type: { type: Sequelize.STRING(50), allowNull: false },
      plan_label: { type: Sequelize.STRING(100) },
      amount: { type: Sequelize.INTEGER, allowNull: false },
      gst_amount: { type: Sequelize.INTEGER, defaultValue: 0 },
      total_amount: { type: Sequelize.INTEGER, allowNull: false },
      razorpay_order_id: { type: Sequelize.STRING(150) },
      razorpay_payment_id: { type: Sequelize.STRING(150) },
      status: {
        type: Sequelize.ENUM('pending', 'success', 'failed'),
        defaultValue: 'pending',
      },
      plan_start_at: { type: Sequelize.DATE },
      plan_expires_at: { type: Sequelize.DATE },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false },
    });

    await queryInterface.addIndex('payments', ['company_id']);
    await queryInterface.addIndex('payments', ['job_id']);
    await queryInterface.addIndex('payments', ['status']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('payments');
    // Drop the ENUM type created by Postgres
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_payments_status";');
  },
};
