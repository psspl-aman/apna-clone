'use strict';

const categories = [
  { slug: 'telecalling_bpo_telesales', label: 'Telecalling / BPO / Telesales' },
  { slug: 'accounts_finance', label: 'Accounts / Finance' },
  { slug: 'delivery_person', label: 'Delivery Person' },
  { slug: 'field_sales', label: 'Field Sales' },
  { slug: 'business_development', label: 'Business Development' },
  { slug: 'retail_counter_sales', label: 'Retail / Counter Sales' },
  { slug: 'logistics_warehouse_operations', label: 'Logistics / Warehouse operations' },
  { slug: 'marketing', label: 'Marketing' },
  { slug: 'back_office', label: 'Back Office' },
  { slug: 'driver', label: 'Driver' },
  { slug: 'human_resource', label: 'Human Resource' },
  { slug: 'digital_online_marketing', label: 'Digital / Online Marketing' },
  { slug: 'cook_chef_baker', label: 'Cook / Chef / Baker' },
  { slug: 'technician', label: 'Technician' },
  { slug: 'admin_office_assistant', label: 'Admin / Office Assistant' },
  { slug: 'teacher_faculty_tutor', label: 'Teacher / Faculty / Tutor' },
  { slug: 'housekeeping', label: 'Housekeeping' },
  { slug: 'security_guard', label: 'Security Guard' },
  { slug: 'software_web_developer', label: 'Software / Web Developer' },
  { slug: 'graphic_designer', label: 'Graphic Designer' },
  { slug: 'content_writing', label: 'Content Writing' },
  { slug: 'it_support', label: 'IT Support' },
  { slug: 'electrician_wireman', label: 'Electrician / Wireman' },
  { slug: 'plumber', label: 'Plumber' },
  { slug: 'carpenter', label: 'Carpenter' },
  { slug: 'nurse_patient_care', label: 'Nurse / Patient Care' },
  { slug: 'doctor_dentist', label: 'Doctor / Dentist' },
  { slug: 'pharmacist', label: 'Pharmacist' },
  { slug: 'civil_engineer_architect', label: 'Civil Engineer / Architect' },
  { slug: 'mechanical_engineer', label: 'Mechanical Engineer' },
  { slug: 'electrical_engineer', label: 'Electrical Engineer' },
  { slug: 'hardware_network_engineer', label: 'Hardware & Network Engineer' },
  { slug: 'legal', label: 'Legal' },
  { slug: 'beautician_hair_stylist', label: 'Beautician / Hair Stylist' },
  { slug: 'fitness_trainer_dietician', label: 'Fitness Trainer / Dietician' },
  { slug: 'interior_designer', label: 'Interior Designer' },
  { slug: 'photography_video_editing', label: 'Photography / Video Editing' },
  { slug: 'fashion_designer', label: 'Fashion Designer' },
  { slug: 'manufacturing_production', label: 'Manufacturing / Production' },
  { slug: 'hospitality_hotel_event', label: 'Hospitality / Hotel / Event Management' },
];

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('categories', categories.map((c) => ({ ...c, is_active: true })));
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('categories', null, {});
  },
};
