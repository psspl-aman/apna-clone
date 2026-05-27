import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../app/hooks';
import { setFilter, clearFilters } from '../../features/jobs/jobsSlice';
import { JobFilters } from '../../types';

interface LeftMenuItem {
  label: string;
  filter?: Partial<JobFilters>;
  clear?: boolean;
}

interface RightMenuItem {
  label: string;
  browse: string;
  submenuKey: string;
}

interface SubmenuItem {
  label: string;
  filter?: Record<string, string>;
}

interface SubmenuConfig {
  items: SubmenuItem[];
  viewAll: { label: string; href: string };
}

const leftItems: LeftMenuItem[] = [
  { label: 'Jobs For You', clear: true },
  { label: 'Work From Home Jobs', filter: { job_type: 'work_from_home' } },
  { label: 'Part Time Jobs', filter: { job_type: 'part_time' } },
  { label: 'Freshers Jobs', filter: { exp_max: 0 } },
  { label: 'Women Jobs', filter: { gender: 'female' } },
  { label: 'Full Time Jobs', filter: { job_type: 'full_time' } },
  { label: 'Night Shift Jobs', filter: { job_type: 'night_shift' } },
  { label: 'International Jobs', filter: { city: 'international' } },
];

const rightItems: RightMenuItem[] = [
  { label: 'Jobs By City', browse: 'city', submenuKey: 'city' },
  { label: 'Jobs By Department', browse: 'department', submenuKey: 'department' },
  { label: 'Jobs By Company', browse: 'company', submenuKey: 'company' },
  { label: 'Jobs By Qualification', browse: 'qualification', submenuKey: 'qualification' },
  { label: 'Others', browse: 'others', submenuKey: 'others' },
];

const cityItems: SubmenuItem[] = [
  { label: 'Jobs in Agra', filter: { city: 'agra' } },
  { label: 'Jobs in Ahmedabad', filter: { city: 'ahmedabad' } },
  { label: 'Jobs in Bengaluru', filter: { city: 'bengaluru' } },
  { label: 'Jobs in Bhopal', filter: { city: 'bhopal' } },
  { label: 'Jobs in Chandigarh', filter: { city: 'chandigarh' } },
  { label: 'Jobs in Chennai', filter: { city: 'chennai' } },
  { label: 'Jobs in Coimbatore', filter: { city: 'coimbatore' } },
  { label: 'Jobs in Dehradun', filter: { city: 'dehradun' } },
  { label: 'Jobs in Delhi-NCR', filter: { city: 'delhi-ncr' } },
  { label: 'Jobs in Goa', filter: { city: 'goa' } },
  { label: 'Jobs in Gurgaon', filter: { city: 'gurgaon' } },
  { label: 'Jobs in Hyderabad', filter: { city: 'hyderabad' } },
  { label: 'Jobs in Indore', filter: { city: 'indore' } },
  { label: 'Jobs in Jaipur', filter: { city: 'jaipur' } },
  { label: 'Jobs in Kanpur', filter: { city: 'kanpur' } },
  { label: 'Jobs in Kochi', filter: { city: 'kochi' } },
  { label: 'Jobs in Kolkata', filter: { city: 'kolkata' } },
  { label: 'Jobs in Lucknow', filter: { city: 'lucknow' } },
  { label: 'Jobs in Mumbai', filter: { city: 'mumbai' } },
  { label: 'Jobs in Mysore', filter: { city: 'mysore' } },
  { label: 'Jobs in Nagpur', filter: { city: 'nagpur' } },
  { label: 'Jobs in Nashik', filter: { city: 'nashik' } },
  { label: 'Jobs in Noida', filter: { city: 'noida' } },
  { label: 'Jobs in Patna', filter: { city: 'patna' } },
  { label: 'Jobs in Pune', filter: { city: 'pune' } },
  { label: 'Jobs in Rajkot', filter: { city: 'rajkot' } },
  { label: 'Jobs in Ranchi', filter: { city: 'ranchi' } },
  { label: 'Jobs in Surat', filter: { city: 'surat' } },
  { label: 'Jobs in Vadodara', filter: { city: 'vadodara' } },
  { label: 'Jobs in Visakhapatnam', filter: { city: 'visakhapatnam' } },
];

const departmentItems: SubmenuItem[] = [
  { label: 'Admin / Back Office', filter: { category: 'admin_office_assistant' } },
  { label: 'Advertising / Communications', filter: { category: 'content_writing' } },
  { label: 'Aviation & Aerospace', filter: { category: 'hospitality_hotel_event_management' } },
  { label: 'Banking / Insurance', filter: { category: 'accounts_finance' } },
  { label: 'Beauty, Fitness & Spa', filter: { category: 'beautician_hair_stylist' } },
  { label: 'Construction & Site', filter: { category: 'civil_engineer_architect' } },
  { label: 'Consulting', filter: { category: 'business_development' } },
  { label: 'Content, Editorial & Journalism', filter: { category: 'content_writing' } },
  { label: 'CSR & Social Service', filter: { category: 'business_development' } },
  { label: 'Customer Support', filter: { category: 'telecalling_bpo_telesales' } },
  { label: 'Data Science & Analytics', filter: { category: 'software_web_developer' } },
  { label: 'Delivery / Driver', filter: { category: 'delivery_person' } },
  { label: 'Domestic Worker', filter: { category: 'housekeeping' } },
  { label: 'Electrician / Wireman', filter: { category: 'electrician_wireman' } },
  { label: 'Energy & Mining', filter: { category: 'manufacturing_production' } },
  { label: 'Engineering - Hardware', filter: { category: 'hardware_network_engineer' } },
  { label: 'Environment Health & Safety', filter: { category: 'civil_engineer_architect' } },
  { label: 'Fashion / Garments / Merchandising', filter: { category: 'fashion_designer' } },
  { label: 'Finance / Accounts', filter: { category: 'accounts_finance' } },
  { label: 'Fitness Trainer / Dietician', filter: { category: 'fitness_trainer_dietician' } },
  { label: 'Food / Bakery / Restaurant', filter: { category: 'cook_chef_baker' } },
  { label: 'Graphic / Web Design', filter: { category: 'graphic_designer' } },
  { label: 'Hospitality / Hotel / Event', filter: { category: 'hospitality_hotel_event_management' } },
  { label: 'Housekeeping / Cleaning', filter: { category: 'housekeeping' } },
  { label: 'HR / Recruitment', filter: { category: 'human_resource' } },
  { label: 'IT / Software Development', filter: { category: 'software_web_developer' } },
  { label: 'IT Support / Hardware', filter: { category: 'it_support' } },
  { label: 'Legal / Law', filter: { category: 'legal' } },
  { label: 'Logistics / Warehouse', filter: { category: 'logistics_warehouse_operations' } },
  { label: 'Manufacturing / Production', filter: { category: 'manufacturing_production' } },
  { label: 'Marketing / Branding', filter: { category: 'marketing' } },
  { label: 'Mechanical / Electrical Engg', filter: { category: 'mechanical_engineer' } },
  { label: 'Nurse / Patient Care', filter: { category: 'nurse_patient_care' } },
  { label: 'Online / Digital Marketing', filter: { category: 'digital_online_marketing' } },
  { label: 'Photography / Video Editing', filter: { category: 'photography_video_editing' } },
  { label: 'Sales / Business Development', filter: { category: 'field_sales' } },
  { label: 'Security / Safety', filter: { category: 'security_guard' } },
  { label: 'Teacher / Tutor / Faculty', filter: { category: 'teacher_faculty_tutor' } },
  { label: 'Technician / Mechanic', filter: { category: 'technician' } },
  { label: 'Telecalling / BPO', filter: { category: 'telecalling_bpo_telesales' } },
];

const companyItems: SubmenuItem[] = [
  { label: 'Jobs in Top MNCs', filter: { company: 'top_mncs' } },
  { label: 'Jobs in Startups', filter: { company: 'startups' } },
  { label: 'Jobs in Government', filter: { company: 'government' } },
  { label: 'Jobs in Banks', filter: { company: 'banks' } },
  { label: 'Jobs in Hospitals', filter: { company: 'hospitals' } },
];

const qualificationItems: SubmenuItem[] = [
  { label: '10th Pass Jobs', filter: { education: '10th' } },
  { label: '12th Pass Jobs', filter: { education: '12th' } },
  { label: 'Graduate Jobs', filter: { education: 'graduate' } },
  { label: 'Post Graduate Jobs', filter: { education: 'post_graduate' } },
  { label: 'Diploma Jobs', filter: { education: 'diploma' } },
  { label: 'ITI Jobs', filter: { education: 'iti' } },
];

const otherItems: SubmenuItem[] = [
  { label: 'Walk-in Interviews', filter: { date_posted: 'walkin' } },
  { label: 'Urgent Openings', filter: { date_posted: '3' } },
  { label: 'Government Jobs', filter: { category: 'government' } },
  { label: 'Internships', filter: { job_type: 'internship' } },
  { label: 'Night Shift Jobs', filter: { job_type: 'night_shift' } },
];

const submenuData: Record<string, SubmenuConfig> = {
  city: {
    items: cityItems,
    viewAll: { label: 'View All 74 Cities', href: '/jobs?browse=city' },
  },
  department: {
    items: departmentItems,
    viewAll: { label: 'View All 43 Departments', href: '/jobs?browse=department' },
  },
  company: {
    items: companyItems,
    viewAll: { label: 'View All Companies', href: '/jobs?browse=company' },
  },
  qualification: {
    items: qualificationItems,
    viewAll: { label: 'View All Qualifications', href: '/jobs?browse=qualification' },
  },
  others: {
    items: otherItems,
    viewAll: { label: 'View All', href: '/jobs?browse=others' },
  },
};

interface JobsDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export const JobsDropdown = ({ isOpen, onClose }: JobsDropdownProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) setActiveSubmenu(null);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleLeftClick = (item: LeftMenuItem) => {
    if (item.clear) {
      dispatch(clearFilters());
      navigate('/jobs');
    } else if (item.filter) {
      dispatch(setFilter(item.filter));
      const params = new URLSearchParams();
      Object.entries(item.filter).forEach(([key, val]) => {
        if (val !== undefined && val !== '') {
          params.set(key, String(val));
        }
      });
      navigate(`/jobs?${params.toString()}`);
    }
    onClose();
  };

  const handleRightClick = (item: RightMenuItem) => {
    if (activeSubmenu === item.submenuKey) {
      setActiveSubmenu(null);
    } else {
      setActiveSubmenu(item.submenuKey);
    }
  };

  const handleSubmenuItemClick = (filter?: Record<string, string>) => {
    if (filter) {
      const params = new URLSearchParams();
      Object.entries(filter).forEach(([key, val]) => {
        if (val) params.set(key, val);
      });
      dispatch(setFilter(filter as Partial<JobFilters>));
      navigate(`/jobs?${params.toString()}`);
    } else {
      navigate('/jobs');
    }
    onClose();
  };

  const activeConfig = activeSubmenu ? submenuData[activeSubmenu] : null;

  const mainPanel = (
    <div className="bg-white rounded-lg shadow-xl border border-gray-100 p-4 min-w-[420px]">
      <div className="grid grid-cols-2 gap-x-8 gap-y-1">
        <div className="space-y-1">
          {leftItems.map((item) => (
            <div
              key={item.label}
              onClick={() => handleLeftClick(item)}
              className="block px-2 py-1.5 text-sm text-gray-700 hover:text-[#1a7d4e] cursor-pointer rounded hover:bg-gray-50"
            >
              {item.label}
            </div>
          ))}
        </div>

        <div className="space-y-1">
          {rightItems.map((item) => (
            <div
              key={item.label}
              onClick={() => handleRightClick(item)}
              className={`flex items-center justify-between px-2 py-1.5 text-sm cursor-pointer rounded ${
                activeSubmenu === item.submenuKey
                  ? 'text-[#1a7d4e] bg-gray-50'
                  : 'text-gray-700 hover:text-[#1a7d4e] hover:bg-gray-50'
              }`}
            >
              <span>{item.label}</span>
              <span className="text-[#1a7d4e] text-xs font-bold">&gt;</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const subPanel = activeConfig ? (
    <div className="bg-white rounded-lg shadow-xl border border-gray-100 p-4 min-w-[240px] max-w-[280px]">
      <div className="max-h-72 overflow-y-auto space-y-1 pr-1">
        {activeConfig.items.map((subItem) => (
          <div
            key={subItem.label}
            onClick={() => handleSubmenuItemClick(subItem.filter)}
            className="block px-2 py-1.5 text-sm text-gray-700 hover:text-[#1a7d4e] cursor-pointer rounded hover:bg-gray-50 truncate"
          >
            {subItem.label}
          </div>
        ))}
      </div>
      <div
        onClick={() => { navigate(activeConfig.viewAll.href); onClose(); }}
        className="block px-2 py-2 mt-1 text-sm font-medium text-[#1a7d4e] hover:text-[#166534] cursor-pointer rounded hover:bg-gray-50 border-t border-gray-100"
      >
        {activeConfig.viewAll.label}
      </div>
    </div>
  ) : null;

  return (
    <div
      ref={dropdownRef}
      className="absolute top-full left-0 mt-2 z-50 flex gap-2"
    >
      {mainPanel}
      {subPanel}
    </div>
  );
};
