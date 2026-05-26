'use strict';

const bcrypt = require('bcrypt');

const jobTypes = ['full_time', 'part_time', 'work_from_home', 'night_shift'];
const categories = [
  'telecalling_bpo_telesales', 'accounts_finance', 'delivery_person', 'field_sales',
  'business_development', 'retail_counter_sales', 'logistics_warehouse_operations',
  'marketing', 'back_office', 'driver', 'human_resource', 'digital_online_marketing',
  'cook_chef_baker', 'technician', 'admin_office_assistant', 'teacher_faculty_tutor',
  'housekeeping', 'security_guard', 'software_web_developer', 'graphic_designer',
];
const cities = [
  'Delhi-NCR', 'Mumbai', 'Bengaluru', 'Hyderabad', 'Pune', 'Chennai',
  'Kolkata', 'Ahmedabad', 'Jaipur', 'Lucknow', 'Surat', 'Noida', 'Gurgaon',
  'Chandigarh', 'Indore', 'Bhopal', 'Patna', 'Nagpur',
];
const companyNames = [
  'TechVista Solutions', 'GreenLeaf Enterprises', 'Urban Hub Retail',
  'Skyline Logistics', 'PrimeCare Health', 'EduWise Academy',
  'BuildRight Construction', 'FreshMart Groceries', 'SafeGuard Security',
  'QuickServe Food Chain',
];
const jobTemplates = [
  { title: 'Customer Support Executive', dept: 'Customer Service' },
  { title: 'Sales Associate', dept: 'Sales' },
  { title: 'Accountant', dept: 'Finance' },
  { title: 'Delivery Boy', dept: 'Operations' },
  { title: 'Business Development Manager', dept: 'Sales' },
  { title: 'Store Manager', dept: 'Retail' },
  { title: 'Warehouse Associate', dept: 'Logistics' },
  { title: 'Digital Marketing Executive', dept: 'Marketing' },
  { title: 'Back Office Executive', dept: 'Administration' },
  { title: 'Driver', dept: 'Operations' },
  { title: 'HR Executive', dept: 'Human Resources' },
  { title: 'Graphic Designer', dept: 'Creative' },
  { title: 'Receptionist', dept: 'Administration' },
  { title: 'Security Guard', dept: 'Security' },
  { title: 'Software Developer', dept: 'Engineering' },
  { title: 'Electrician', dept: 'Maintenance' },
  { title: 'Plumber', dept: 'Maintenance' },
  { title: 'Carpenter', dept: 'Maintenance' },
  { title: 'Teacher', dept: 'Education' },
  { title: 'Nurse', dept: 'Healthcare' },
  { title: 'Account Executive', dept: 'Finance' },
  { title: 'Field Sales Officer', dept: 'Sales' },
  { title: 'Telecaller', dept: 'Telecalling' },
  { title: 'Content Writer', dept: 'Marketing' },
  { title: 'IT Support Engineer', dept: 'IT' },
  { title: 'Data Entry Operator', dept: 'Administration' },
  { title: 'Cook', dept: 'Kitchen' },
  { title: 'Housekeeping Staff', dept: 'Housekeeping' },
  { title: 'Beautician', dept: 'Beauty' },
  { title: 'Fitness Trainer', dept: 'Fitness' },
  { title: 'Pharmacist', dept: 'Healthcare' },
  { title: 'Civil Engineer', dept: 'Engineering' },
  { title: 'Mechanical Engineer', dept: 'Engineering' },
  { title: 'Lab Technician', dept: 'Healthcare' },
  { title: 'Office Assistant', dept: 'Administration' },
  { title: 'Relationship Manager', dept: 'Sales' },
  { title: 'Operations Executive', dept: 'Operations' },
  { title: 'Business Analyst', dept: 'Analytics' },
  { title: 'Quality Analyst', dept: 'Quality' },
  { title: 'Team Leader', dept: 'Operations' },
  { title: 'Branch Manager', dept: 'Management' },
  { title: 'Assistant Manager', dept: 'Management' },
  { title: 'Social Media Executive', dept: 'Marketing' },
  { title: 'Video Editor', dept: 'Creative' },
  { title: 'Photographer', dept: 'Creative' },
  { title: 'Interior Designer', dept: 'Design' },
  { title: 'Fashion Designer', dept: 'Design' },
  { title: 'Legal Assistant', dept: 'Legal' },
  { title: 'Hospitality Executive', dept: 'Hospitality' },
  { title: 'Event Coordinator', dept: 'Events' },
];

module.exports = {
  async up(queryInterface) {
    const passwordHash = await bcrypt.hash('password123', 12);

    // Create 10 employer users
    const employerUsers = companyNames.map((name, i) => ({
      id: require('crypto').randomUUID(),
      email: `employer${i + 1}@example.com`,
      phone: `9876543${String(i).padStart(3, '0')}`,
      password_hash: passwordHash,
      role: 'employer',
      is_active: true,
      created_at: new Date(),
      updated_at: new Date(),
    }));

    await queryInterface.bulkInsert('users', employerUsers);

    // Create 10 companies
    const companies = companyNames.map((name, i) => ({
      id: require('crypto').randomUUID(),
      user_id: employerUsers[i].id,
      name,
      description: `${name} is a leading company in ${['technology', 'retail', 'healthcare', 'education', 'logistics', 'food', 'security', 'construction', 'finance', 'manufacturing'][i]} sector, providing excellent career opportunities.`,
      logo_url: null,
      website: `https://${name.toLowerCase().replace(/\s+/g, '')}.com`,
      city: cities[i % cities.length],
      employee_size: `${(i + 1) * 10}-${(i + 1) * 10 + 50}`,
      industry: ['Technology', 'Retail', 'Healthcare', 'Education', 'Logistics', 'Food', 'Security', 'Construction', 'Finance', 'Manufacturing'][i],
      created_at: new Date(),
      updated_at: new Date(),
    }));

    await queryInterface.bulkInsert('companies', companies);

    // Create 50 jobs
    const jobs = Array.from({ length: 50 }, (_, i) => {
      const template = jobTemplates[i];
      const companyIdx = i % 10;
      const salaryMin = (Math.floor(Math.random() * 15) + 2) * 5000;
      const salaryMax = salaryMin + (Math.floor(Math.random() * 10) + 3) * 5000;
      const expMin = Math.floor(Math.random() * 3);
      const expMax = expMin + Math.floor(Math.random() * 5) + 1;

      return {
        id: require('crypto').randomUUID(),
        company_id: companies[companyIdx].id,
        title: template.title,
        description: `We are looking for an experienced ${template.title} to join our team at ${companies[companyIdx].name}. The ideal candidate should have ${expMin}-${expMax} years of experience and a passion for excellence in the ${template.dept.toLowerCase()} department.`,
        category: categories[i % categories.length],
        department: template.dept,
        city: cities[i % cities.length],
        job_type: jobTypes[i % 4],
        salary_min: salaryMin,
        salary_max: salaryMax,
        experience_min: expMin,
        experience_max: expMax,
        education: ['10th', '12th', 'Graduate', 'Post Graduate', 'Diploma'][i % 5],
        gender: ['any', 'male', 'female'][i % 3],
        openings: Math.floor(Math.random() * 5) + 1,
        is_active: true,
        created_at: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000),
        updated_at: new Date(),
      };
    });

    await queryInterface.bulkInsert('jobs', jobs);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('jobs', null, {});
    await queryInterface.bulkDelete('companies', null, {});
    await queryInterface.bulkDelete('users', { role: 'employer' }, {});
  },
};
