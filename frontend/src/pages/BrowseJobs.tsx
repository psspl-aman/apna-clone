import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAppDispatch } from '../app/hooks';
import { setFilter } from '../features/jobs/jobsSlice';
import { Search } from 'lucide-react';

/* ─── Data ─── */
const CITIES: { label: string; slug: string }[] = [
  { label: 'Chennai', slug: 'chennai' },
  { label: 'Pune', slug: 'pune' },
  { label: 'Chandigarh', slug: 'chandigarh' },
  { label: 'Jaipur', slug: 'jaipur' },
  { label: 'Kolkata', slug: 'kolkata' },
  { label: 'Mumbai', slug: 'mumbai' },
  { label: 'Delhi-NCR', slug: 'delhi-ncr' },
  { label: 'Bengaluru', slug: 'bengaluru' },
  { label: 'Hyderabad', slug: 'hyderabad' },
  { label: 'Ahmedabad', slug: 'ahmedabad' },
  { label: 'Surat', slug: 'surat' },
  { label: 'Indore', slug: 'indore' },
  { label: 'Lucknow', slug: 'lucknow' },
  { label: 'Vadodara', slug: 'vadodara' },
  { label: 'Coimbatore', slug: 'coimbatore' },
  { label: 'Patna', slug: 'patna' },
  { label: 'Nagpur', slug: 'nagpur' },
  { label: 'Ludhiana', slug: 'ludhiana' },
  { label: 'Udaipur', slug: 'udaipur' },
  { label: 'Bhopal', slug: 'bhopal' },
  { label: 'Goa', slug: 'goa' },
  { label: 'Kanpur', slug: 'kanpur' },
  { label: 'Vijayawada', slug: 'vijayawada' },
  { label: 'Visakhapatnam', slug: 'visakhapatnam' },
  { label: 'Bhubaneswar', slug: 'bhubaneswar' },
  { label: 'Ranchi', slug: 'ranchi' },
  { label: 'Kochi', slug: 'kochi' },
  { label: 'Mangalore', slug: 'mangalore' },
  { label: 'Raipur', slug: 'raipur' },
  { label: 'Rajkot', slug: 'rajkot' },
  { label: 'Nashik', slug: 'nashik' },
  { label: 'Agra', slug: 'agra' },
  { label: 'Dehradun', slug: 'dehradun' },
  { label: 'Jalandhar', slug: 'jalandhar' },
  { label: 'Varanasi', slug: 'varanasi' },
  { label: 'Amritsar', slug: 'amritsar' },
  { label: 'Jodhpur', slug: 'jodhpur' },
  { label: 'Jabalpur', slug: 'jabalpur' },
  { label: 'Gorakhpur', slug: 'gorakhpur' },
  { label: 'Aurangabad', slug: 'aurangabad' },
  { label: 'Gwalior', slug: 'gwalior' },
  { label: 'Madurai', slug: 'madurai' },
  { label: 'Meerut', slug: 'meerut' },
  { label: 'Thiruvananthapuram', slug: 'thiruvananthapuram' },
  { label: 'Jamshedpur', slug: 'jamshedpur' },
  { label: 'Prayagraj', slug: 'prayagraj' },
  { label: 'Mysuru', slug: 'mysuru' },
  { label: 'Cuttack', slug: 'cuttack' },
  { label: 'Bhilai', slug: 'bhilai' },
  { label: 'Salem', slug: 'salem' },
  { label: 'Trichy', slug: 'trichy' },
  { label: 'Kota', slug: 'kota' },
  { label: 'Kolhapur', slug: 'kolhapur' },
  { label: 'Hubli', slug: 'hubli' },
  { label: 'Dhanbad', slug: 'dhanbad' },
  { label: 'Panipat', slug: 'panipat' },
  { label: 'Aligarh', slug: 'aligarh' },
  { label: 'Bareilly', slug: 'bareilly' },
  { label: 'Bikaner', slug: 'bikaner' },
  { label: 'Solapur', slug: 'solapur' },
  { label: 'Guntur', slug: 'guntur' },
  { label: 'Ujjain', slug: 'ujjain' },
  { label: 'Ahmednagar', slug: 'ahmednagar' },
  { label: 'Bhavnagar', slug: 'bhavnagar' },
  { label: 'Puducherry', slug: 'puducherry' },
  { label: 'Malappuram', slug: 'malappuram' },
  { label: 'Belagavi', slug: 'belagavi' },
  { label: 'Warangal', slug: 'warangal' },
  { label: 'Saharanpur', slug: 'saharanpur' },
  { label: 'Asansol', slug: 'asansol' },
  { label: 'Kannur', slug: 'kannur' },
  { label: 'Jamnagar', slug: 'jamnagar' },
  { label: 'Noida', slug: 'noida' },
  { label: 'Gurgaon', slug: 'gurgaon' },
  { label: 'Faridabad', slug: 'faridabad' },
  { label: 'Thane', slug: 'thane' },
];

const COMPANIES: string[] = [
  'Blinkit Private Limited', 'Swiggy', 'Blinkit Grocery', 'Mannekeng Solutions Private Limited',
  'Zepto', 'Phonepe', 'Big Basket', 'i way solutions',
  'Paytm Services Private Limited', 'Sr Fast Connect Services', 'Everest Fleet Pvt. Ltd.', 'Teleperformance',
  'Genius Hrtech Ltd', 'EGT Rent A Car Private Limited', 'Everest Fleet North Private Limited', 'Supro Info Solutions Private Limited',
  'Uber', 'Flipkart India Private Limited', 'Hdfc Life Insurance Company', 'Cultfit',
  'Muthoot Finance', 'Bayleaf Hr Solutions Private Limited', 'Netambit Infosource And E S', 'Bajaj Life Insurance Company',
  'Quess Corp Limited', 'Flipkart', 'Shriram Life Insurance Company', 'Netambit Value First Service',
  'Axis Bank Pvt Ltd', 'Kotak Life Insurance', 'Bajaj Allianz Life Insurance Limited', 'Bajaj Life Insurance Limited',
  'Randstad India Private Limited', 'Bestal HR', 'Digitide Solutions Limited', 'HDB Financial Services Limited',
  'Sbi Life Insurance Company', 'Life Insurance Corporation Of India', 'Zomato', 'Altruist Technologies Pvt Ltd',
  'Career Guideline', 'Sprs Solutions Private Limited', 'Livehood Workforce', 'FR8 Logistics',
  'Tech Mahindra Ltd', 'Square Yards', 'Teamspace Financial Services', 'Reliance Jio',
  'Sbi Cards And Payment Services', 'Teamlease Services Limited', 'Aditya Birla Capital Limited', 'Manpower Groups',
  'Axis Bank', 'Connectify Solutions', 'Airtel', 'Swiggy Instamart',
  'Apnatime', 'Truemeds', 'V5 Global', 'Eversub India Private Limited',
  'Dream Consulting', 'Mohini Enterprises', 'Jeena Sikho Lifecare Limited', 'SP Consultancy',
  'Airtel Payments Bank', 'Sat Kartar Shopping Limited', 'Avenue Ecommerce Limited', '2Coms Consulting Pvt. Ltd.',
  'Kushals Retail Pvt Ltd', 'Ebac Technologies Private Limited', 'Jana Small Finance Bank', 'Ola Electric Mobility',
  'Apna Payment Services Private', 'ICICI Prudential Life Insurance', 'PNB Metlife India Insurance', 'Costco Infotech',
  'Okaygo', 'Xpheno', 'Vizza Insurance', 'VGM Consultant Pvt Ltd',
  'Greentech Logistics', 'Aramya', 'Swachh Saathi Private Limited', 'Earlyjobs',
  'Cogent E Services Pvt Ltd', 'Intellismith Consultancy Private', 'Bangalore Job Hub', 'Globiva Services Private Limited',
  'Grab', 'KAP Call Center Pvt Ltd', 'Burger King India Private Limited', 'Tata Starbucks Private Limited',
  'Moneymile Marketing Services', 'Ava Infotech Private Limited', 'Ashweera Vision X Technologies', 'Candidate Express',
  'Eureka Outsourcing Solutions', 'JFS Services', 'Rajati Education Private Limited', 'MJS Aditi Enterprises',
  'Landmark Group', 'JEMKON Pvt Ltd', 'Call 2 Connect Private Limited', 'Careergate Solutions',
  'Mahindra Anant Cars', 'Vijaya Management Services', 'Big Tree Resource Management', 'Magnum Environment Management',
  'Medplus', 'Intuino Business Consulting', 'Aditya Birla Sun Life Insurance', 'Futurzz HR',
  'Pole Star Services', 'Bhima Jewellery Madurai', 'Bharat Pe', 'Cafe Coffee Day',
  'Jobox Hire Private Limited', 'Platinum Hospitals Private Limited', 'Krazybee Services Private Limited', 'Human Heroes Management',
  'Optisupply Chain Solution', 'Integrated Personnel Services', 'Chain Reaction Consulting', 'House Construct',
  'The Exotic Grill', 'Bajaj Finserv Limited', 'Bajaj Capital', 'Elevate X Solutions',
  'Career Job Solution', 'Teleminds Infotech', 'SBI Card', 'Edugenius Softwares',
  'Layam', 'Euphoria Hospitality Private', 'P2G Mobility Tech Private Limited', 'Burma Burma Restaurant & Tea',
  'Indoralibus Travel Private Limited', 'Inep Credit Capital Pvt. Ltd.', 'DoctorC', 'Suvidha Staffing Solutions',
  'Modi Auto Group Private Limited', 'One Mobikwik Systems Limited', 'Vibrant Pro HR Private Limited', 'Ikamate',
];

const DEPARTMENTS: { label: string; slug: string }[] = [
  { label: 'Admin / Back Office / Comp...', slug: 'admin_office_assistant' },
  { label: 'Advertising / Communication', slug: 'content_writing' },
  { label: 'Aviation & Aerospace', slug: 'hospitality_hotel_event_management' },
  { label: 'Banking / Insurance / Financ...', slug: 'accounts_finance' },
  { label: 'Beauty, Fitness & Personal C...', slug: 'beautician_hair_stylist' },
  { label: 'Construction & Site Engineer...', slug: 'civil_engineer_architect' },
  { label: 'Consulting', slug: 'business_development' },
  { label: 'Content, Editorial & Journali...', slug: 'content_writing' },
  { label: 'CSR & Social Service', slug: 'business_development' },
  { label: 'Customer Support', slug: 'telecalling_bpo_telesales' },
  { label: 'Data Science & Analytics', slug: 'software_web_developer' },
  { label: 'Delivery / Driver / Logistics', slug: 'delivery_person' },
  { label: 'Domestic Worker', slug: 'housekeeping' },
  { label: 'Energy & Mining', slug: 'manufacturing_production' },
  { label: 'Engineering - Hardware & N...', slug: 'hardware_network_engineer' },
  { label: 'Environment Health & Safety', slug: 'civil_engineer_architect' },
  { label: 'Facility Management', slug: 'admin_office_assistant' },
  { label: 'Finance / Accounts', slug: 'accounts_finance' },
  { label: 'Fitness Trainer / Dietician', slug: 'fitness_trainer_dietician' },
  { label: 'Food / Bakery / Restaurant', slug: 'cook_chef_baker' },
  { label: 'Graphic / Web Design', slug: 'graphic_designer' },
  { label: 'Healthcare / Doctor / Hospit...', slug: 'nurse_patient_care' },
  { label: 'Hospitality / Hotel / To...', slug: 'hospitality_hotel_event_management' },
  { label: 'Housekeeping / Cleaning', slug: 'housekeeping' },
  { label: 'HR / Recruitment', slug: 'human_resource' },
  { label: 'IT & Information Security', slug: 'software_web_developer' },
  { label: 'IT / Software Development', slug: 'software_web_developer' },
  { label: 'Legal & Regulatory', slug: 'legal' },
  { label: 'Logistics / Warehouse', slug: 'logistics_warehouse_operations' },
  { label: 'Maintenance Services', slug: 'technician' },
  { label: 'Manufacturing / Production /...', slug: 'manufacturing_production' },
  { label: 'Marketing / Branding / Digit...', slug: 'digital_online_marketing' },
  { label: 'Media Production & Entertai...', slug: 'photography_video_editing' },
  { label: 'Mechanical / Electrical Engg', slug: 'mechanical_engineer' },
  { label: 'Nurse / Patient Care', slug: 'nurse_patient_care' },
  { label: 'Operations', slug: 'logistics_warehouse_operations' },
  { label: 'Photography / Video Editing', slug: 'photography_video_editing' },
  { label: 'Production / Manufacturing /...', slug: 'manufacturing_production' },
  { label: 'Project & Program Managem...', slug: 'business_development' },
  { label: 'Purchase & Supply Chain', slug: 'logistics_warehouse_operations' },
  { label: 'Quality Assurance', slug: 'manufacturing_production' },
  { label: 'Research & Development', slug: 'software_web_developer' },
  { label: 'Restaurant / Hospitality / To...', slug: 'hospitality_hotel_event_management' },
  { label: 'Retail & eCommerce', slug: 'field_sales' },
  { label: 'Risk Management & Complia...', slug: 'accounts_finance' },
  { label: 'Sales & BD', slug: 'field_sales' },
  { label: 'Security Services', slug: 'security_guard' },
  { label: 'Shipping & Maritime', slug: 'logistics_warehouse_operations' },
  { label: 'Software Engineering', slug: 'software_web_developer' },
  { label: 'Strategic & Top Management', slug: 'business_development' },
  { label: 'Tailoring, Apparel & Home F...', slug: 'fashion_designer' },
  { label: 'Teaching & Training', slug: 'teacher_faculty_tutor' },
  { label: 'UX, Design & Architecture', slug: 'graphic_designer' },
];

/* ══════════════════════════════════
   BROWSE JOBS PAGE
══════════════════════════════════ */
export const BrowseJobsPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState('');

  // Scroll to section from URL hash on mount
  useEffect(() => {
    const section = searchParams.get('section');
    if (section) {
      setTimeout(() => {
        document.getElementById(section)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [searchParams]);

  const q = query.toLowerCase();
  const filteredCities = CITIES.filter(c => c.label.toLowerCase().includes(q));
  const filteredCompanies = COMPANIES.filter(c => c.toLowerCase().includes(q));
  const filteredDepts = DEPARTMENTS.filter(d => d.label.toLowerCase().includes(q));

  const goCity = (slug: string) => {
    dispatch(setFilter({ city: slug }));
    navigate(`/jobs?city=${encodeURIComponent(slug)}`);
  };

  const goCompany = (name: string) => {
    dispatch(setFilter({ keyword: name }));
    navigate(`/jobs?keyword=${encodeURIComponent(name)}`);
  };

  const goDept = (slug: string) => {
    dispatch(setFilter({ category: slug }));
    navigate(`/jobs?category=${encodeURIComponent(slug)}`);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Search bar */}
      <div className="bg-white border-b py-6 px-4">
        <div className="max-w-xl mx-auto relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search for city or department or company"
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#14a97c] focus:border-transparent"
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-14">

        {/* ── Jobs By City ── */}
        <section id="city">
          <h2 className="text-base font-bold text-gray-900 mb-5">Jobs By City</h2>
          {filteredCities.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-6 gap-y-3">
              {filteredCities.map(city => (
                <button
                  key={city.slug}
                  onClick={() => goCity(city.slug)}
                  className="text-left text-sm text-[#14a97c] hover:text-[#0d7a5a] hover:underline truncate"
                >
                  {city.label}
                </button>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400">No cities match your search.</p>
          )}
        </section>

        <hr className="border-gray-100" />

        {/* ── Jobs By Company ── */}
        <section id="company">
          <h2 className="text-base font-bold text-gray-900 mb-5">Jobs By Company</h2>
          {filteredCompanies.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-6 gap-y-3">
              {filteredCompanies.map(company => (
                <button
                  key={company}
                  onClick={() => goCompany(company)}
                  className="text-left text-sm text-[#14a97c] hover:text-[#0d7a5a] hover:underline truncate"
                >
                  {company}
                </button>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400">No companies match your search.</p>
          )}
        </section>

        <hr className="border-gray-100" />

        {/* ── Jobs By Department ── */}
        <section id="department">
          <h2 className="text-base font-bold text-gray-900 mb-5">Jobs By Department</h2>
          {filteredDepts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-6 gap-y-3">
              {filteredDepts.map(dept => (
                <button
                  key={dept.slug + dept.label}
                  onClick={() => goDept(dept.slug)}
                  className="text-left text-sm text-[#14a97c] hover:text-[#0d7a5a] hover:underline truncate"
                >
                  {dept.label}
                </button>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400">No departments match your search.</p>
          )}
        </section>

      </div>
    </div>
  );
};
