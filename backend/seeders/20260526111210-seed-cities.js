'use strict';

const cities = [
  { slug: 'delhi_ncr', name: 'Delhi-NCR', state: 'Delhi' },
  { slug: 'mumbai_bombay', name: 'Mumbai', state: 'Maharashtra' },
  { slug: 'bengaluru_bangalore', name: 'Bengaluru', state: 'Karnataka' },
  { slug: 'hyderabad', name: 'Hyderabad', state: 'Telangana' },
  { slug: 'ahmedabad', name: 'Ahmedabad', state: 'Gujarat' },
  { slug: 'chennai', name: 'Chennai', state: 'Tamil Nadu' },
  { slug: 'kolkata_calcutta', name: 'Kolkata', state: 'West Bengal' },
  { slug: 'pune', name: 'Pune', state: 'Maharashtra' },
  { slug: 'jaipur', name: 'Jaipur', state: 'Rajasthan' },
  { slug: 'surat', name: 'Surat', state: 'Gujarat' },
  { slug: 'lucknow', name: 'Lucknow', state: 'Uttar Pradesh' },
  { slug: 'kanpur', name: 'Kanpur', state: 'Uttar Pradesh' },
  { slug: 'nagpur', name: 'Nagpur', state: 'Maharashtra' },
  { slug: 'indore', name: 'Indore', state: 'Madhya Pradesh' },
  { slug: 'bhopal', name: 'Bhopal', state: 'Madhya Pradesh' },
  { slug: 'patna', name: 'Patna', state: 'Bihar' },
  { slug: 'vadodara', name: 'Vadodara', state: 'Gujarat' },
  { slug: 'chandigarh', name: 'Chandigarh', state: 'Punjab' },
  { slug: 'kochi', name: 'Kochi', state: 'Kerala' },
  { slug: 'coimbatore', name: 'Coimbatore', state: 'Tamil Nadu' },
  { slug: 'goa', name: 'Goa', state: 'Goa' },
  { slug: 'visakhapatnam', name: 'Visakhapatnam', state: 'Andhra Pradesh' },
  { slug: 'noida', name: 'Noida', state: 'Uttar Pradesh' },
  { slug: 'gurgaon', name: 'Gurgaon', state: 'Haryana' },
  { slug: 'mysore_mysuru', name: 'Mysore', state: 'Karnataka' },
  { slug: 'rajkot', name: 'Rajkot', state: 'Gujarat' },
  { slug: 'agra', name: 'Agra', state: 'Uttar Pradesh' },
  { slug: 'nashik', name: 'Nashik', state: 'Maharashtra' },
  { slug: 'ranchi', name: 'Ranchi', state: 'Jharkhand' },
  { slug: 'dehradun', name: 'Dehradun', state: 'Uttarakhand' },
];

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('cities', cities.map((c) => ({ ...c, is_active: true })));
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('cities', null, {});
  },
};
