import { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchJobs, setFilter } from '../features/jobs/jobsSlice';
import { Search, MapPin, Briefcase, SlidersHorizontal, X, ChevronDown, ChevronUp, Bookmark } from 'lucide-react';

/* ─── Filter Options ─── */
const WORK_MODE_OPTIONS = [
  { label: 'Work from Home', value: 'work_from_home' },
  { label: 'Work from Office', value: 'work_from_office' },
  { label: 'Field Job', value: 'field_job' },
];
const JOB_TYPE_OPTIONS = [
  { label: 'Full Time', value: 'full_time' },
  { label: 'Part Time', value: 'part_time' },
  { label: 'Night Shift', value: 'night_shift' },
];
const EXP_SIDEBAR = [
  { label: 'Fresher / No Experience', value: 0 },
  { label: '0 - 1 Year', value: 1 },
  { label: '1 - 2 Years', value: 2 },
  { label: '2 - 3 Years', value: 3 },
  { label: '3 - 5 Years', value: 5 },
  { label: '5 - 10 Years', value: 10 },
  { label: '10+ Years', value: 15 },
];
const EXP_DROPDOWN = [
  { label: 'Any Experience', value: -1 },
  { label: 'Fresher / 0 Year', value: 0 },
  { label: '0 - 1 Year', value: 1 },
  { label: '1 - 2 Years', value: 2 },
  { label: '2 - 3 Years', value: 3 },
  { label: '3 - 5 Years', value: 5 },
  { label: '5 - 7 Years', value: 7 },
  { label: '7 - 10 Years', value: 10 },
  { label: '10+ Years', value: 15 },
];
const DATE_OPTIONS = [
  { label: 'All', value: 'all' },
  { label: 'Last 24 hours', value: '24h' },
  { label: 'Last 3 days', value: '3d' },
  { label: 'Last 7 days', value: '7d' },
];
const SORT_OPTIONS = [
  { label: 'Relevance', value: 'relevance' },
  { label: 'Recent', value: 'recent' },
  { label: 'Salary (High to Low)', value: 'salary' },
];
const EDUCATION_OPTIONS = [
  { label: '10th or Below', value: '10th' },
  { label: '12th Pass', value: '12th' },
  { label: 'Diploma', value: 'diploma' },
  { label: 'Graduate', value: 'graduate' },
  { label: 'Post Graduate', value: 'post_graduate' },
];
const ENGLISH_OPTIONS = [
  { label: 'No English', value: 'no_english' },
  { label: 'Basic English', value: 'basic_english' },
  { label: 'Good English', value: 'good_english' },
  { label: 'Fluent English', value: 'fluent_english' },
];
const DEPARTMENT_OPTIONS = [
  'Sales','Finance','Engineering','Marketing','Operations',
  'Human Resources','Administration','Healthcare','IT','Creative',
  'Education','Legal','Logistics','Security','Kitchen',
];
const LOGO_COLORS = [
  'bg-blue-500','bg-green-600','bg-purple-500','bg-orange-500',
  'bg-red-500','bg-teal-500','bg-indigo-500','bg-pink-500','bg-cyan-600','bg-amber-600',
];

/* ─── Helpers ─── */
const G = '#14a97c'; // apna green

function fmtSalary(min?: number, max?: number): string {
  if (!min && !max) return '';
  const f = (v: number) => '\u20b9' + v.toLocaleString('en-IN');
  if (min && max && max > min) return `${f(min)} - ${f(max)} monthly`;
  if (min) return `${f(min)}+ monthly`;
  return `Up to ${f(max!)} monthly`;
}
function jobTypeLbl(t?: string) {
  if (!t) return '';
  return ({ full_time:'Full Time', part_time:'Part Time', work_from_home:'Work From Home', night_shift:'Night Shift' } as any)[t] || t.replace(/_/g,' ');
}
function workModeLbl(w?: string) {
  if (!w) return '';
  return ({ work_from_office:'Work from Office', work_from_home:'Work from Home', field_job:'Field Job' } as any)[w] || w.replace(/_/g,' ');
}
function expLbl(job: any): string {
  const type = job.experienceType;
  const min: number = job.experienceMin ?? 0;
  if (type === 'fresher_only') return 'Fresher';
  if (type === 'experienced_only' || min > 0) return `Min. ${min} yr${min === 1 ? '' : 's'}`;
  return '';
}
function engLbl(lv?: string) {
  if (!lv) return '';
  return ({ no_english:'No English', basic_english:'Basic English', good_english:'Good (Intermediate)', fluent_english:'Fluent English' } as any)[lv] || '';
}
function timeAgo(d?: string) {
  if (!d) return '';
  const ms = Date.now() - new Date(d).getTime();
  const mi = Math.floor(ms/60000), h = Math.floor(mi/60), dy = Math.floor(h/24);
  if (dy >= 30) return 'Over a month ago';
  if (dy > 0) return `${dy} day${dy>1?'s':''} ago`;
  if (h > 0) return `${h} hr${h>1?'s':''} ago`;
  if (mi > 0) return `${mi} min ago`;
  return 'Just now';
}
const isUrgent = (d?: string) => !!d && Date.now()-new Date(d).getTime() < 7*86400000;
const isNew    = (d?: string) => !!d && Date.now()-new Date(d).getTime() < 3*86400000;

/* ─── Collapsible filter section ─── */
function Sec({ title, children, open: defOpen=true }:{ title:string; children:React.ReactNode; open?:boolean }) {
  const [open,setOpen] = useState(defOpen);
  return (
    <div className="border-b border-gray-100 last:border-0 pb-3 mb-3 last:mb-0 last:pb-0">
      <button className="flex items-center justify-between w-full py-0.5 text-[13px] font-semibold text-gray-800 select-none" onClick={()=>setOpen(!open)}>
        {title}
        {open ? <ChevronUp className="h-3.5 w-3.5 text-gray-400"/> : <ChevronDown className="h-3.5 w-3.5 text-gray-400"/>}
      </button>
      {open && <div className="mt-2">{children}</div>}
    </div>
  );
}

/* ─── Small badge icons ─── */
const Ico = {
  building: () => <svg className="h-[11px] w-[11px] text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1"/></svg>,
  clock:    () => <svg className="h-[11px] w-[11px] text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>,
  chat:     () => <svg className="h-[11px] w-[11px] text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>,
  circle:   () => <svg className="h-[11px] w-[11px] text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="12" r="9" strokeWidth="2"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 8h4M10 12h3M10 8v8"/></svg>,
  pin:      () => <svg className="h-3 w-3 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>,
  rupee:    () => <svg className="h-3 w-3 text-gray-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 8h6M9 12h4a3 3 0 000-6H9v10l4-4"/></svg>,
  person:   () => <svg className="h-3 w-3 text-gray-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>,
  plus:     () => <svg className="h-3 w-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>,
  chevron:  () => <svg className="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{color:G}}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7"/></svg>,
};

/* ══════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════ */
export const JobsPage = () => {
  const dispatch = useAppDispatch();
  const { jobs, filters, meta, loading } = useAppSelector((s) => s.jobs);
  const [searchParams, setSearchParams] = useSearchParams();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [keyword, setKeyword]   = useState(filters.keyword || '');
  const [cityInput, setCityInput] = useState(filters.city || '');
  const [expOpen, setExpOpen]   = useState(false);
  const [selExp, setSelExp]     = useState<number>(-1);
  const [showAllDepts, setShowAllDepts] = useState(false);
  const expRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (expRef.current && !expRef.current.contains(e.target as Node)) setExpOpen(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  useEffect(() => {
    const fromUrl: any = {};
    searchParams.forEach((v, k) => { fromUrl[k] = v; });
    if (Object.keys(fromUrl).length > 0) dispatch(setFilter(fromUrl));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const p = new URLSearchParams();
    Object.entries(filters).forEach(([k,v]) => {
      if (v && v !== 'all' && v !== 0 && v !== 'relevance') p.set(k, String(v));
    });
    setSearchParams(p, { replace: true });
    dispatch(fetchJobs(filters));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const upd = (k: string, v: any) => dispatch(setFilter({ [k]: v }));

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(setFilter({ keyword, city: cityInput, exp_min: selExp >= 0 ? selExp : 0 }));
  };

  const clearAll = () => {
    setKeyword(''); setCityInput(''); setSelExp(-1);
    dispatch(setFilter({
      keyword:'', city:'', category:'', department:'', job_type:'',
      work_mode:'', salary_min:0, exp_min:0, gender:'',
      date_posted:'all', sort_by:'relevance', page:1,
    }));
  };

  const selExpLbl = EXP_DROPDOWN.find(e => e.value === selExp)?.label || 'Experience (Yrs)';
  const visibleDepts = showAllDepts ? DEPARTMENT_OPTIONS : DEPARTMENT_OPTIONS.slice(0, 5);

  /* active filter chips */
  const chips: { label: string; clear: () => void }[] = [];
  if (filters.date_posted !== 'all') chips.push({ label: DATE_OPTIONS.find(d=>d.value===filters.date_posted)?.label||'', clear:()=>upd('date_posted','all') });
  if (filters.work_mode)  chips.push({ label: WORK_MODE_OPTIONS.find(w=>w.value===filters.work_mode)?.label||'', clear:()=>upd('work_mode','') });
  if (filters.job_type)   chips.push({ label: JOB_TYPE_OPTIONS.find(j=>j.value===filters.job_type)?.label||'', clear:()=>upd('job_type','') });
  if (filters.exp_min>0)  chips.push({ label: `${filters.exp_min}+ yrs exp`, clear:()=>upd('exp_min',0) });
  if (filters.salary_min>0) chips.push({ label: `\u20b9${filters.salary_min.toLocaleString('en-IN')}+`, clear:()=>upd('salary_min',0) });

  /* radio helper */
  const Radio = ({ name, val, cur, onChange, label }:{name:string;val:string;cur:string;onChange:()=>void;label:string}) => (
    <label className="flex items-center gap-2 py-[3px] cursor-pointer group">
      <span className={`h-3.5 w-3.5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${cur===val?'border-[#14a97c]':'border-gray-300 group-hover:border-gray-400'}`}>
        {cur===val && <span className="h-2 w-2 rounded-full bg-[#14a97c]"/>}
      </span>
      <span className="text-[12px] text-gray-700">{label}</span>
      <input type="radio" name={name} className="sr-only" checked={cur===val} onChange={onChange}/>
    </label>
  );
  const Check = ({ checked, onChange, label }:{checked:boolean;onChange:()=>void;label:string}) => (
    <label className="flex items-center gap-2 py-[3px] cursor-pointer group">
      <span className={`h-3.5 w-3.5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${checked?'bg-[#14a97c] border-[#14a97c]':'border-gray-300 group-hover:border-gray-400'}`}>
        {checked && <svg className="h-2.5 w-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/></svg>}
      </span>
      <span className="text-[12px] text-gray-700">{label}</span>
      <input type="checkbox" className="sr-only" checked={checked} onChange={onChange}/>
    </label>
  );

  return (
    <div style={{backgroundColor:'#f0f0f0'}} className="min-h-screen">

      {/* ═══ SEARCH BAR ═══ */}
      <div className="bg-white border-b border-gray-200" style={{boxShadow:'0 1px 4px rgba(0,0,0,.06)'}}>
        <div className="max-w-[1200px] mx-auto px-4 py-3">
          <form onSubmit={handleSearch}>
            <div className="flex border border-gray-300 rounded-lg overflow-visible bg-white" style={{height:48}}>
              {/* Keyword */}
              <div className="flex-1 flex items-center border-r border-gray-200 px-3 gap-2 min-w-0">
                <Search className="h-4 w-4 text-gray-400 flex-shrink-0"/>
                <input
                  value={keyword} onChange={e=>setKeyword(e.target.value)}
                  placeholder="Search by job title, role or keyword"
                  className="flex-1 text-[13px] text-gray-800 placeholder-gray-400 focus:outline-none bg-transparent min-w-0"
                />
                {keyword && <button type="button" onClick={()=>setKeyword('')}><X className="h-3.5 w-3.5 text-gray-400"/></button>}
              </div>
              {/* Location */}
              <div className="w-44 flex items-center border-r border-gray-200 px-3 gap-2 flex-shrink-0">
                <Ico.pin/>
                <input
                  value={cityInput} onChange={e=>setCityInput(e.target.value)}
                  placeholder="Your Location"
                  className="flex-1 text-[13px] text-gray-800 placeholder-gray-400 focus:outline-none bg-transparent min-w-0"
                />
              </div>
              {/* Experience dropdown */}
              <div className="w-40 relative flex-shrink-0 border-r border-gray-200" ref={expRef}>
                <button type="button" onClick={()=>setExpOpen(!expOpen)}
                  className="w-full h-full flex items-center justify-between px-3 text-[13px] hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-2 min-w-0">
                    <Briefcase className="h-4 w-4 text-gray-400 flex-shrink-0"/>
                    <span className={`truncate ${selExp>=0?'text-gray-800 font-medium':'text-gray-400'}`}>
                      {selExp>=0 ? selExpLbl : 'Experience (Yrs)'}
                    </span>
                  </div>
                  <ChevronDown className="h-3.5 w-3.5 text-gray-400 ml-1 flex-shrink-0"/>
                </button>
                {expOpen && (
                  <div className="absolute top-full left-0 mt-1 w-52 bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-1">
                    {EXP_DROPDOWN.map(opt => (
                      <button key={opt.value} type="button"
                        onClick={()=>{ setSelExp(opt.value); setExpOpen(false); }}
                        className={`w-full text-left px-4 py-2 text-[13px] hover:bg-gray-50 ${selExp===opt.value?'font-semibold bg-green-50':'text-gray-700'}`}
                        style={selExp===opt.value?{color:G}:{}}>
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {/* Search button */}
              <button type="submit"
                className="flex items-center gap-2 px-6 text-white text-[13px] font-semibold flex-shrink-0 rounded-r-[7px] transition-opacity hover:opacity-90"
                style={{backgroundColor:G}}>
                <Search className="h-4 w-4"/>
                Find Jobs
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* ═══ MAIN CONTENT ═══ */}
      <div className="max-w-[1200px] mx-auto px-4 pt-4 pb-8">

        {/* Page title */}
        <h1 className="text-[15px] font-bold text-gray-900 mb-3">
          <span style={{color:G}}>{meta?.total ?? 0}</span>
          {' '}Explore &amp; Find ideal results
          {filters.keyword && <span className="font-normal text-gray-500"> for &ldquo;{filters.keyword}&rdquo;</span>}
          {filters.city && <span className="font-normal text-gray-500"> in {filters.city}</span>}
        </h1>

        <div className="flex gap-4 items-start">

          {/* ═════════ FILTER SIDEBAR ═════════ */}
          <aside className={`${mobileFiltersOpen?'fixed inset-0 z-50 overflow-y-auto bg-white p-4':'hidden'} lg:block lg:static lg:z-auto lg:overflow-visible lg:bg-transparent lg:p-0 w-full lg:w-[240px] flex-shrink-0`}>
            <div className="bg-white border border-gray-200 rounded-xl p-4" style={{boxShadow:'0 1px 3px rgba(0,0,0,.06)'}}>

              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1.5">
                  <SlidersHorizontal className="h-4 w-4 text-gray-600"/>
                  <span className="text-[14px] font-bold text-gray-900">
                    Filters{chips.length>0&&<span className="text-gray-500 font-normal"> ({chips.length})</span>}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={clearAll} className="text-[12px] font-medium hover:underline" style={{color:G}}>Clear all</button>
                  <button onClick={()=>setMobileFiltersOpen(false)} className="lg:hidden"><X className="h-5 w-5 text-gray-500"/></button>
                </div>
              </div>

              {/* Active chips */}
              {chips.length>0 && (
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {chips.map(c=>(
                    <span key={c.label} className="inline-flex items-center gap-1 text-[11px] border border-gray-400 rounded-full px-2.5 py-0.5 text-gray-700 bg-white">
                      {c.label}
                      <button onClick={c.clear}><X className="h-2.5 w-2.5"/></button>
                    </span>
                  ))}
                </div>
              )}

              {/* Experience */}
              <Sec title="Experience">
                <p className="text-[11px] text-gray-400 mb-2">Your work experience</p>
                <input type="range" min="0" max="31" step="1"
                  value={filters.exp_min||0}
                  onChange={e=>upd('exp_min',Number(e.target.value))}
                  className="w-full mb-1" style={{accentColor:G}}/>
                <div className="flex justify-between text-[11px] text-gray-500 mb-2">
                  <span>0 years</span>
                  <span className="text-[10px] font-semibold text-white px-2 py-0.5 rounded-full" style={{backgroundColor:G}}>
                    {filters.exp_min>0?`${filters.exp_min} yr`:'Any'}
                  </span>
                  <span>31 years</span>
                </div>
                <div className="space-y-0.5">
                  {EXP_SIDEBAR.map(o=>(
                    <Check key={o.value} checked={filters.exp_min===o.value&&o.value>0} onChange={()=>upd('exp_min',filters.exp_min===o.value?0:o.value)} label={o.label}/>
                  ))}
                </div>
              </Sec>

              {/* Date posted */}
              <Sec title="Date posted">
                <div className="space-y-0.5">
                  {DATE_OPTIONS.map(o=>(
                    <Radio key={o.value} name="date_posted" val={o.value} cur={filters.date_posted||'all'} onChange={()=>upd('date_posted',o.value)} label={o.label}/>
                  ))}
                </div>
              </Sec>

              {/* Salary */}
              <Sec title="Salary">
                <p className="text-[11px] text-gray-400 mb-2">Minimum monthly salary</p>
                <input type="range" min="0" max="150000" step="5000"
                  value={filters.salary_min||0}
                  onChange={e=>upd('salary_min',Number(e.target.value))}
                  className="w-full mb-1" style={{accentColor:G}}/>
                <div className="flex justify-between text-[11px] text-gray-500">
                  <span className="text-[10px] font-semibold text-white px-2 py-0.5 rounded-full" style={{backgroundColor:G}}>
                    \u20b9{(filters.salary_min||0).toLocaleString('en-IN')}
                  </span>
                  <span>1.5 Lakhs</span>
                </div>
              </Sec>

              {/* Highest Education */}
              <Sec title="Highest Education" open={false}>
                <div className="space-y-0.5">
                  {EDUCATION_OPTIONS.map(o=>(
                    <Check key={o.value} checked={(filters as any).education===o.value} onChange={()=>upd('education',(filters as any).education===o.value?'':o.value)} label={o.label}/>
                  ))}
                </div>
              </Sec>

              {/* Work Mode */}
              <Sec title="Work Mode" open={false}>
                <div className="space-y-0.5">
                  {WORK_MODE_OPTIONS.map(o=>(
                    <Check key={o.value} checked={filters.work_mode===o.value} onChange={()=>upd('work_mode',filters.work_mode===o.value?'':o.value)} label={o.label}/>
                  ))}
                </div>
              </Sec>

              {/* Work Type */}
              <Sec title="Work Type" open={false}>
                <div className="space-y-0.5">
                  {JOB_TYPE_OPTIONS.map(o=>(
                    <Check key={o.value} checked={filters.job_type===o.value} onChange={()=>upd('job_type',filters.job_type===o.value?'':o.value)} label={o.label}/>
                  ))}
                </div>
              </Sec>

              {/* Department */}
              <Sec title="Department" open={false}>
                <div className="space-y-0.5">
                  {visibleDepts.map(d=>(
                    <Check key={d} checked={filters.department===d} onChange={()=>upd('department',filters.department===d?'':d)} label={d}/>
                  ))}
                </div>
                <button onClick={()=>setShowAllDepts(!showAllDepts)} className="text-[11px] mt-1.5 hover:underline font-medium" style={{color:G}}>
                  {showAllDepts?'View Less':'View All'}
                </button>
              </Sec>

              {/* English Level */}
              <Sec title="English Level" open={false}>
                <div className="space-y-0.5">
                  {ENGLISH_OPTIONS.map(o=>(
                    <Check key={o.value} checked={(filters as any).english_level===o.value} onChange={()=>upd('english_level',(filters as any).english_level===o.value?'':o.value)} label={o.label}/>
                  ))}
                </div>
              </Sec>

              {/* Gender */}
              <Sec title="Gender" open={false}>
                <div className="space-y-0.5">
                  {[{label:'Male',value:'male'},{label:'Female',value:'female'},{label:'Any',value:'any'}].map(o=>(
                    <Check key={o.value} checked={filters.gender===o.value} onChange={()=>upd('gender',filters.gender===o.value?'':o.value)} label={o.label}/>
                  ))}
                </div>
              </Sec>

              {/* Sort By */}
              <Sec title="Sort By" open={false}>
                <div className="space-y-0.5">
                  {SORT_OPTIONS.map(o=>(
                    <Radio key={o.value} name="sort_by" val={o.value} cur={filters.sort_by||'relevance'} onChange={()=>upd('sort_by',o.value)} label={o.label}/>
                  ))}
                </div>
              </Sec>
            </div>
          </aside>

          {/* ═════════ JOB LIST ═════════ */}
          <div className="flex-1 min-w-0">

            {/* Mobile filter btn */}
            <div className="lg:hidden flex items-center justify-between mb-3">
              <p className="text-[13px] text-gray-600">{meta?.total||0} results</p>
              <button onClick={()=>setMobileFiltersOpen(true)}
                className="flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg text-[13px] text-gray-700 bg-white">
                <SlidersHorizontal className="h-4 w-4"/> Filters
              </button>
            </div>

            {/* Loading skeleton */}
            {loading ? (
              <div className="space-y-2">
                {[1,2,3,4,5].map(i=>(
                  <div key={i} className="bg-white border border-gray-200 rounded-xl p-4 animate-pulse">
                    <div className="flex gap-3">
                      <div className="h-10 w-10 bg-gray-200 rounded-xl flex-shrink-0"/>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"/>
                        <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"/>
                        <div className="h-3 bg-gray-200 rounded w-2/3 mb-2"/>
                        <div className="flex gap-2 mt-2">
                          {[1,2,3].map(j=><div key={j} className="h-5 bg-gray-200 rounded w-20"/>)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : jobs.length===0 ? (
              <div className="bg-white border border-gray-200 rounded-xl text-center py-16">
                <div className="text-5xl mb-4">&#128269;</div>
                <p className="text-base font-semibold text-gray-700">No jobs found</p>
                <p className="text-[13px] text-gray-500 mt-1">Try adjusting your search or filters</p>
                <button onClick={clearAll} className="mt-4 text-[13px] font-medium hover:underline" style={{color:G}}>
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {jobs.map((job,idx)=>{
                  const salary   = fmtSalary(job.salaryMin, job.salaryMax);
                  const expLabel = expLbl(job);
                  const jtBadge  = jobTypeLbl(job.jobType);
                  const wmBadge  = workModeLbl(job.workLocationType);
                  const engLabel = engLbl(job.englishLevel);
                  const posted   = timeAgo(job.createdAt);
                  const urgent   = isUrgent(job.createdAt);
                  const newJob   = isNew(job.createdAt);
                  const walkin   = job.isWalkin;
                  const showWM   = wmBadge && job.jobType !== 'work_from_home';

                  return (
                    <Link key={job.id} to={`/jobs/${job.id}`}
                      className={`block rounded-xl border overflow-hidden transition-all hover:shadow-md ${urgent?'border-orange-200':'border-gray-200 hover:border-gray-300'}`}>
                      {/* Urgently hiring banner */}
                      {urgent && (
                        <div className="bg-orange-50 border-b border-orange-100 px-4 py-1.5 flex items-center gap-1.5">
                          <span className="text-sm">&#128293;</span>
                          <span className="text-[12px] font-semibold text-orange-600">Urgently hiring</span>
                        </div>
                      )}
                      <div className={`p-4 ${urgent?'bg-[#fff8f4]':'bg-white'}`}>
                        <div className="flex gap-3">
                          {/* Logo */}
                          <div className={`h-10 w-10 ${LOGO_COLORS[idx%LOGO_COLORS.length]} rounded-xl flex items-center justify-center flex-shrink-0 text-white font-bold text-sm shadow-sm`}>
                            {(job.company?.name?.[0]||'C').toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            {/* Title row */}
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0">
                                <h3 className="text-[14px] font-semibold text-gray-900 leading-snug hover:text-[#14a97c] transition-colors truncate">{job.title}</h3>
                                <p className="text-[12px] text-gray-500 mt-0.5 truncate">{job.company?.name||'Company'}</p>
                              </div>
                              <div className="flex items-center gap-1 flex-shrink-0">
                                <button onClick={e=>e.preventDefault()} className="p-1 rounded hover:bg-gray-100 text-gray-400">
                                  <Bookmark className="h-4 w-4"/>
                                </button>
                                <Ico.chevron/>
                              </div>
                            </div>
                            {/* Location */}
                            {job.city && (
                              <div className="flex items-center gap-1 mt-1.5 text-[12px] text-gray-600">
                                <Ico.pin/><span>{job.city}</span>
                              </div>
                            )}
                            {/* Salary */}
                            {salary && (
                              <div className="flex items-center gap-1 mt-0.5 text-[12px] text-gray-700">
                                <Ico.rupee/><span className="font-medium">{salary}</span>
                              </div>
                            )}
                            {/* Type/Exp badges */}
                            <div className="flex flex-wrap gap-1.5 mt-2">
                              {showWM && wmBadge && (
                                <span className="inline-flex items-center gap-1 text-[11px] text-gray-600 bg-white border border-gray-200 px-2 py-[3px] rounded-[4px]">
                                  <Ico.building/>{wmBadge}
                                </span>
                              )}
                              {jtBadge && (
                                <span className="inline-flex items-center gap-1 text-[11px] text-gray-600 bg-white border border-gray-200 px-2 py-[3px] rounded-[4px]">
                                  <Ico.circle/>{jtBadge}
                                </span>
                              )}
                              {expLabel && (
                                <span className="inline-flex items-center gap-1 text-[11px] text-gray-600 bg-white border border-gray-200 px-2 py-[3px] rounded-[4px]">
                                  <Ico.clock/>{expLabel}
                                </span>
                              )}
                              {engLabel && (
                                <span className="inline-flex items-center gap-1 text-[11px] text-gray-600 bg-white border border-gray-200 px-2 py-[3px] rounded-[4px]">
                                  <Ico.chat/>{engLabel}
                                </span>
                              )}
                            </div>
                            {/* Walk-in / New / Posted / Openings */}
                            {(walkin||newJob||posted||job.openings>1) && (
                              <div className="flex flex-wrap items-center gap-x-4 gap-y-0.5 mt-1.5">
                                {walkin && (
                                  <span className="inline-flex items-center gap-1 text-[11px] text-gray-600">
                                    <Ico.person/>Walk-in interview
                                  </span>
                                )}
                                {newJob && (
                                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold" style={{color:G}}>
                                    <Ico.plus/>New
                                  </span>
                                )}
                                {posted && !newJob && <span className="text-[11px] text-gray-400">{posted}</span>}
                                {job.openings>1 && <span className="text-[11px] font-medium" style={{color:G}}>{job.openings} Openings</span>}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}

            {/* Pagination */}
            {meta && meta.totalPages>1 && (
              <div className="flex items-center justify-center gap-1 mt-5">
                <button disabled={meta.page<=1} onClick={()=>dispatch(setFilter({page:meta.page-1}))}
                  className="px-3 py-1.5 border border-gray-300 rounded-lg text-[13px] text-gray-600 disabled:opacity-40 hover:bg-gray-50 bg-white">&laquo; Prev</button>
                {(()=>{
                  const pages:number[]=[];const tot=meta.totalPages,cur=meta.page;
                  let s=Math.max(1,cur-2),e=Math.min(tot,s+4);
                  if(e-s<4)s=Math.max(1,e-4);
                  for(let p=s;p<=e;p++)pages.push(p);
                  return pages.map(p=>(
                    <button key={p} onClick={()=>dispatch(setFilter({page:p}))}
                      className={`w-8 h-8 rounded-lg text-[13px] font-medium ${p===cur?'text-white':'border border-gray-300 text-gray-600 hover:bg-gray-50 bg-white'}`}
                      style={p===cur?{backgroundColor:G}:{}}>{p}</button>
                  ));
                })()}
                <button disabled={meta.page>=meta.totalPages} onClick={()=>dispatch(setFilter({page:meta.page+1}))}
                  className="px-3 py-1.5 border border-gray-300 rounded-lg text-[13px] text-gray-600 disabled:opacity-40 hover:bg-gray-50 bg-white">Next &raquo;</button>
              </div>
            )}
          </div>

          {/* ═════════ RIGHT SIDEBAR ═════════ */}
          <aside className="hidden xl:block w-[230px] flex-shrink-0 space-y-3">
            {/* Know more */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden" style={{boxShadow:'0 1px 3px rgba(0,0,0,.06)'}}>
              <div className="p-4">
                <h4 className="text-[13px] font-bold text-gray-900 mb-1">Know more about latest jobs</h4>
                <ul className="space-y-1.5 mt-2">
                  {['Personalised job matches','Direct connect with HRs','Latest updates on the job'].map(item=>(
                    <li key={item} className="flex items-center gap-2 text-[12px] text-gray-700">
                      <span className="h-4 w-4 rounded-full flex items-center justify-center text-[9px] text-white font-bold flex-shrink-0" style={{backgroundColor:G}}>&#10003;</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              {/* Phone mockup */}
              <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 mx-4 rounded-xl h-36 flex items-center justify-center mb-3">
                <span className="text-5xl">&#128241;</span>
              </div>
              <div className="px-4 pb-4">
                <Link to="/register"
                  className="block w-full text-center text-white text-[13px] font-semibold py-2.5 rounded-xl transition-opacity hover:opacity-90"
                  style={{backgroundColor:G}}>
                  Create profile &rsaquo;
                </Link>
              </div>
            </div>

            {/* App download */}
            <div className="bg-white border border-gray-200 rounded-xl p-4" style={{boxShadow:'0 1px 3px rgba(0,0,0,.06)'}}>
              <h4 className="text-[13px] font-bold text-gray-900 mb-0.5">Apply on the go</h4>
              <p className="text-[11px] text-gray-500 mb-3">Get real time job updates on our App</p>
              <div className="space-y-2">
                {[{icon:'&#127822;',top:'Download on the',bot:'App Store'},{icon:'&#9654;',top:'Get it on',bot:'Google Play'}].map(a=>(
                  <a key={a.bot} href="#"
                    className="flex items-center gap-2.5 border border-gray-300 rounded-xl px-3 py-2 hover:bg-gray-50 transition-colors">
                    <span className="text-xl" dangerouslySetInnerHTML={{__html:a.icon}}/>
                    <div>
                      <div className="text-[10px] text-gray-500">{a.top}</div>
                      <div className="text-[12px] font-bold text-gray-800">{a.bot}</div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
};
