import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../app/hooks';
import { setFilter, clearFilters } from '../../features/jobs/jobsSlice';

interface JobsDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

interface LeftItem {
  label: string;
  params?: Record<string, string>;
  clear?: boolean;
}

interface RightItem {
  label: string;
  params: Record<string, string>;
}

const leftItems: LeftItem[] = [
  { label: 'Jobs For You', clear: true },
  { label: 'Work From Home Jobs', params: { job_type: 'work_from_home' } },
  { label: 'Part Time Jobs', params: { job_type: 'part_time' } },
  { label: 'Freshers Jobs', params: { exp_max: '0' } },
  { label: 'Women Jobs', params: { gender: 'female' } },
  { label: 'Full Time Jobs', params: { job_type: 'full_time' } },
  { label: 'Night Shift Jobs', params: { job_type: 'night_shift' } },
  { label: 'International Jobs', params: { city: 'international' } },
];

const rightItems: RightItem[] = [
  { label: 'Jobs By City', params: { browse: 'city' } },
  { label: 'Jobs By Department', params: { browse: 'department' } },
  { label: 'Jobs By Company', params: { browse: 'company' } },
  { label: 'Jobs By Qualification', params: { browse: 'qualification' } },
  { label: 'Others', params: { browse: 'others' } },
];

export const JobsDropdown = ({ isOpen, onClose }: JobsDropdownProps) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleLeftClick = (item: LeftItem) => {
    if (item.clear) {
      dispatch(clearFilters());
      navigate('/jobs');
    } else {
      const query = new URLSearchParams(item.params).toString();
      navigate(`/jobs?${query}`);
    }
    onClose();
  };

  const handleRightClick = (item: RightItem) => {
    const query = new URLSearchParams(item.params).toString();
    navigate(`/jobs?${query}`);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 z-50 p-5 min-w-[440px]"
    >
      <div className="grid grid-cols-2 gap-x-6">
        <div className="space-y-0.5">
          {leftItems.map((item) => (
            <div
              key={item.label}
              onClick={() => handleLeftClick(item)}
              className="block px-3 py-2 text-sm text-gray-700 hover:text-[#1a7d4e] cursor-pointer rounded hover:bg-gray-50 transition-colors"
            >
              {item.label}
            </div>
          ))}
        </div>
        <div className="border-l border-gray-100 pl-6 space-y-0.5">
          {rightItems.map((item) => (
            <div
              key={item.label}
              onClick={() => handleRightClick(item)}
              className="flex items-center justify-between px-3 py-2 text-sm text-gray-700 hover:text-[#1a7d4e] cursor-pointer rounded hover:bg-gray-50 transition-colors group"
            >
              <span>{item.label}</span>
              <span className="text-[#1a7d4e] text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                {'>'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
