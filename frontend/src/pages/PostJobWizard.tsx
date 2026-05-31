import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Check, ChevronLeft, HelpCircle, X, Info } from 'lucide-react';

/* ─── Types ─── */
interface JobData {
  // Step 1
  title: string;
  job_type: string[];       // 'full_time' | 'part_time'
  is_night_shift: boolean;
  work_location_type: string; // 'work_from_office' | 'work_from_home' | 'field_job'
  city: string;
  salary_min: number;
  salary_max: number;
  pay_type: string;         // 'fixed_only' | 'fixed_incentive' | 'incentive_only'
  perks: string[];
  has_joining_fee: boolean;
  // Step 2
  education: string;
  english_level: string;
  experience_type: string;
  gender: string;
  skills: string[];
  description: string;
  category: string;
  openings: number;
  experience_min: number;
  experience_max: number;
  // Step 3
  is_walkin: boolean | null;
  contact_preference: string;
  // Step 5
  plan_type: string;
}

const INITIAL: JobData = {
  title: '', job_type: ['full_time'], is_night_shift: false,
  work_location_type: 'work_from_office', city: '', salary_min: 0, salary_max: 0,
  pay_type: 'fixed_only', perks: [], has_joining_fee: false,
  education: '10th', english_level: 'no_english', experience_type: 'any',
  gender: 'any', skills: [], description: '', category: '', openings: 1,
  experience_min: 0, experience_max: 5,
  is_walkin: null, contact_preference: 'to_myself',
  plan_type: 'classic',
};

const PERKS = [
  'Flexible Working Hours','Weekly Payout','Overtime Pay','Joining Bonus',
  'Annual Bonus','PF','Travel Allowance (TA)','Petrol Allowance','Mobile Allowance',
  'Internet Allowance','Laptop','Health Insurance','ESI (ESIC)','Food/Meals',
  'Accommodation','5 Working Days','One-Way Cab','Two-Way Cab',
];

const PLANS = [
  {
    id: 'classic', label: 'Classic Job', price: 699,
    features: ['Job will be active for 15 days','Basic visibility'],
    noFeatures: ['WhatsApp notifications to top candidates','Featured with \'Urgently hiring\' tag','AI Calling Agent'],
  },
  {
    id: 'premium', label: 'Premium Job', price: 1399,
    features: ['Job will be active for 15 days','Higher visibility','WhatsApp notifications to top candidates','Featured with \'Urgently hiring\' tag'],
    noFeatures: ['AI Calling Agent'],
  },
  {
    id: 'super_premium', label: 'Super premium Job 🚀', price: 2799,
    features: ['Job will be active for 15 days','Maximum visibility','2x Priority WhatsApp notifications to top candidates','Featured with \'Urgently hiring\' tag','Top placements in job listings'],
    noFeatures: ['AI Calling Agent'],
  },
];

/* ─── Pill toggle button ─── */
const Pill = ({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) => (
  <button
    type="button"
    onClick={onClick}
    className={`px-4 py-1.5 rounded-full border text-sm font-medium transition-colors ${
      active ? 'border-[#1a7d4e] text-[#1a7d4e] bg-[#f0fdf4]' : 'border-gray-300 text-gray-600 hover:border-gray-400'
    }`}
  >
    {children}
  </button>
);

/* ─── Step progress bar ─── */
const STEP_LABELS = ['Job details', 'Candidate requirements', 'Interviewer information', 'Job preview', 'Publish job'];

const StepBar = ({ current }: { current: number }) => (
  <div className="flex items-center gap-0 px-4 py-4 max-w-3xl mx-auto">
    {STEP_LABELS.map((label, idx) => {
      const done = idx < current;
      const active = idx === current;
      return (
        <React.Fragment key={idx}>
          <div className="flex flex-col items-center min-w-0">
            <div
              className={`h-7 w-7 rounded-full flex items-center justify-center text-sm font-bold border-2 flex-shrink-0 ${
                done ? 'bg-[#1a7d4e] border-[#1a7d4e] text-white'
                : active ? 'bg-white border-[#1a7d4e] text-[#1a7d4e]'
                : 'bg-white border-gray-300 text-gray-400'
              }`}
            >
              {done ? <Check className="h-4 w-4" /> : idx + 1}
            </div>
            {active && <span className="text-xs text-[#1a7d4e] font-medium mt-1 whitespace-nowrap">{label}</span>}
          </div>
          {idx < STEP_LABELS.length - 1 && (
            <div className={`flex-1 h-px mx-1 ${done ? 'bg-[#1a7d4e]' : 'bg-gray-300'}`} />
          )}
        </React.Fragment>
      );
    })}
  </div>
);

/* ══════════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════════ */
export const PostJobWizard = () => {
  const location = useLocation();
  const locationState = (location.state as any) || {};

  const [step, setStep] = useState<number>(locationState.initialStep ?? 0);
  const [data, setData] = useState<JobData>(() => {
    if (locationState.prefill) {
      const p = locationState.prefill;
      return {
        title: p.title || '',
        job_type: Array.isArray(p.job_type) ? p.job_type : [p.job_type || 'full_time'],
        is_night_shift: p.is_night_shift || false,
        work_location_type: p.work_location_type || 'work_from_office',
        city: p.city || '',
        salary_min: p.salary_min || 0,
        salary_max: p.salary_max || 0,
        pay_type: p.pay_type || 'fixed_only',
        perks: p.perks || [],
        has_joining_fee: p.has_joining_fee || false,
        education: p.education || '10th',
        english_level: p.english_level || 'no_english',
        experience_type: p.experience_type || 'any',
        gender: p.gender || 'any',
        skills: p.skills || [],
        description: p.description || '',
        category: p.category || '',
        openings: p.openings || 1,
        experience_min: p.experience_min || 0,
        experience_max: p.experience_max || 5,
        is_walkin: p.is_walkin ?? null,
        contact_preference: p.contact_preference || 'to_myself',
        plan_type: p.plan_type || 'classic',
      };
    }
    return INITIAL;
  });
  const [jobId, setJobId] = useState<string | null>(locationState.jobId || null);
  const [savingDraft, setSavingDraft] = useState(false);
  const [company, setCompany] = useState<any>(null);
  const [cities, setCities] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [skillInput, setSkillInput] = useState('');
  const [publishing, setPublishing] = useState(false);
  const { user } = useAppSelector((s) => s.auth);
  const navigate = useNavigate();

  // isPaid: when navigating from dashboard for an already-paid job edit
  const isPaidEdit = locationState.isPaid === true;

  useEffect(() => {
    Promise.all([
      api.get('/companies/me'),
      api.get('/cities'),
      api.get('/categories'),
    ]).then(([c, ci, cat]) => {
      setCompany(c.data.data);
      setCities(ci.data.data || []);
      setCategories(cat.data.data || []);
    }).catch(() => {});
  }, []);

  const set = (field: keyof JobData, value: any) => setData((d) => ({ ...d, [field]: value }));

  /** Build the job payload from current wizard data */
  const buildJobPayload = () => ({
    title: data.title,
    job_type: data.job_type.length === 2 ? 'full_time' : data.job_type[0],
    is_night_shift: data.is_night_shift,
    work_location_type: data.work_location_type,
    city: data.city,
    salary_min: data.salary_min,
    salary_max: data.salary_max,
    pay_type: data.pay_type,
    perks: data.perks,
    has_joining_fee: data.has_joining_fee,
    education: data.education,
    english_level: data.english_level,
    experience_type: data.experience_type,
    gender: data.gender,
    skills: data.skills,
    description: data.description,
    category: data.category,
    openings: data.openings,
    experience_min: data.experience_min,
    experience_max: data.experience_max,
    is_walkin: data.is_walkin,
    contact_preference: data.contact_preference,
    plan_type: data.plan_type,
  });

  /**
   * Save or update the draft job (without payment).
   * Called when advancing from step 2 → step 3 (preview).
   */
  const saveDraft = async (): Promise<string | null> => {
    setSavingDraft(true);
    try {
      const payload = { ...buildJobPayload(), is_paid: false, is_active: false };
      if (jobId) {
        // Update existing draft
        await api.put(`/jobs/${jobId}`, payload);
        return jobId;
      } else {
        const res = await api.post('/jobs', payload);
        const newId = res.data.data?.id;
        setJobId(newId);
        return newId;
      }
    } catch {
      toast.error('Failed to save draft. Please try again.');
      return null;
    } finally {
      setSavingDraft(false);
    }
  };

  const toggleJobType = (type: string) => {
    setData((d) => {
      const cur = d.job_type;
      if (cur.includes(type)) return { ...d, job_type: cur.filter((t) => t !== type) || ['full_time'] };
      return { ...d, job_type: [...cur, type] };
    });
  };

  const togglePerk = (perk: string) => {
    setData((d) => ({
      ...d,
      perks: d.perks.includes(perk) ? d.perks.filter((p) => p !== perk) : [...d.perks, perk],
    }));
  };

  const addSkill = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      e.preventDefault();
      setData((d) => ({ ...d, skills: Array.from(new Set([...d.skills, skillInput.trim()])) }));
      setSkillInput('');
    }
  };

  /* ─── Razorpay checkout ─── */
  const loadRazorpay = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if ((window as any).Razorpay) { resolve(true); return; }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  /** Save changes to an already-paid job (no payment required) */
  const handleSavePaidEdit = async () => {
    if (!jobId) return;
    setPublishing(true);
    try {
      await api.put(`/jobs/${jobId}`, buildJobPayload());
      toast.success('Job updated successfully!');
      navigate('/employer/dashboard');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update job');
    } finally {
      setPublishing(false);
    }
  };

  const handlePublish = async () => {
    setPublishing(true);
    try {
      const currentJobId = jobId;
      const jobPayload = buildJobPayload();

      // 1. Create Razorpay order (pass jobId so backend can link the payment record)
      const orderRes = await api.post('/payments/create-order', {
        plan: data.plan_type,
        jobId: currentJobId,
      });
      const order = orderRes.data.data;

      // 2. Mock mode (no real Razorpay keys) → publish directly
      if (order.mock) {
        await api.post('/payments/publish-job', {
          jobId: currentJobId,
          jobData: jobPayload,
          payment: {
            razorpay_order_id: order.id,
            razorpay_payment_id: `mock_pay_${Date.now()}`,
            razorpay_signature: 'mock',
          },
        });
        toast.success('Job published successfully! 🎉');
        navigate('/employer/dashboard');
        return;
      }

      // 3. Real Razorpay checkout
      const loaded = await loadRazorpay();
      if (!loaded) { toast.error('Could not load Razorpay. Check internet connection.'); return; }

      const plan = PLANS.find((p) => p.id === data.plan_type);
      const RazorpayInstance = (window as any).Razorpay;
      const rzp = new RazorpayInstance({
        key: process.env.REACT_APP_RAZORPAY_KEY_ID || '',
        amount: order.amount,
        currency: order.currency,
        name: 'Apna Clone',
        description: `${plan?.label} - Job Posting`,
        order_id: order.id,
        prefill: { email: user?.email || '' },
        theme: { color: '#1a7d4e' },
        handler: async (response: any) => {
          try {
            await api.post('/payments/publish-job', {
              jobId: currentJobId,
              jobData: jobPayload,
              payment: {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
            });
            toast.success('Payment successful! Job published 🎉');
            navigate('/employer/dashboard');
          } catch {
            toast.error('Payment succeeded but job creation failed. Contact support.');
          }
        },
        modal: { ondismiss: () => setPublishing(false) },
      });
      rzp.open();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to initiate payment');
      setPublishing(false);
    }
  };

  const gst = (amount: number) => Math.round(amount * 0.18);
  const selectedPlan = PLANS.find((p) => p.id === data.plan_type)!;

  /* ══════════════ RENDER ══════════════ */
  return (
    <div className="min-h-screen bg-[#f5f5f5] flex flex-col">
      {/* Top bar */}
      <div className="bg-white border-b px-6 h-14 flex items-center justify-between flex-shrink-0">
        <button onClick={() => step > 0 ? setStep(step - 1) : navigate('/employer/dashboard')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm font-medium">
          <ChevronLeft className="h-5 w-5" /> Post job
        </button>
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700">
            <HelpCircle className="h-4 w-4" /> Support
          </button>
          <button onClick={() => navigate('/employer/dashboard')} className="text-gray-400 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Step bar (steps 1-4 only, step 5 uses its own header) */}
      {step < 4 && (
        <div className="bg-white border-b">
          <StepBar current={step} />
        </div>
      )}
      {step === 4 && (
        <div className="bg-white border-b">
          <div className="flex items-center gap-0 px-4 py-4 max-w-3xl mx-auto">
            {[0,1,2,3].map((i) => (
              <React.Fragment key={i}>
                <div className="h-7 w-7 rounded-full bg-[#1a7d4e] border-2 border-[#1a7d4e] text-white flex items-center justify-center">
                  <Check className="h-4 w-4" />
                </div>
                <div className="flex-1 h-px mx-1 bg-[#1a7d4e]" />
              </React.Fragment>
            ))}
            <div className="flex flex-col items-center">
              <div className="h-7 w-7 rounded-full bg-white border-2 border-[#1a7d4e] text-[#1a7d4e] flex items-center justify-center text-sm font-bold">5</div>
              <span className="text-xs text-[#1a7d4e] font-medium mt-1 whitespace-nowrap">Publish job</span>
            </div>
          </div>
        </div>
      )}

      <main className="flex-1 overflow-y-auto py-6 px-4">
        <div className="max-w-3xl mx-auto space-y-4">

          {/* ═══════════════ STEP 1: JOB DETAILS ═══════════════ */}
          {step === 0 && (
            <>
              <div className="bg-white rounded-xl border p-6">
                <h2 className="font-bold text-gray-900 mb-0.5">Job details</h2>
                <p className="text-sm text-gray-500 mb-1">We use this information to find the best candidates for the job.</p>
                <p className="text-xs text-red-500 mb-5">*Marked fields are mandatory</p>

                {/* Company */}
                <div className="mb-5">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Company you're hiring for *</label>
                  <div className="flex items-center border rounded-lg px-4 py-3">
                    <span className="flex-1 text-gray-700">{company?.name || 'Your Company'}</span>
                    <button className="text-[#1a7d4e] text-sm font-medium">Change</button>
                  </div>
                </div>

                {/* Job title */}
                <div className="mb-5">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Job title / Designation *</label>
                  <div className="flex gap-3 items-start">
                    <input
                      value={data.title}
                      onChange={(e) => set('title', e.target.value)}
                      placeholder="Eg. Accountant"
                      className="flex-1 px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a7d4e]"
                    />
                    <div className="flex items-center gap-1.5 text-xs text-blue-600 pt-3 whitespace-nowrap">
                      <Info className="h-4 w-4" />
                      <span className="hidden md:inline">Only similar job title edits are allowed after publishing</span>
                    </div>
                  </div>
                </div>

                {/* Job type */}
                <div className="mb-5">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type of Job *</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {[{val:'full_time',label:'Full Time'},{val:'part_time',label:'Part Time'}].map((t) => (
                      <Pill key={t.val} active={data.job_type.includes(t.val)} onClick={() => toggleJobType(t.val)}>{t.label}</Pill>
                    ))}
                    <Pill active={data.job_type.includes('full_time') && data.job_type.includes('part_time')}
                      onClick={() => setData((d) => ({ ...d, job_type: ['full_time', 'part_time'] }))}>
                      Both (Full-Time And Part-Time)
                    </Pill>
                  </div>
                  <label className="flex items-center gap-2 text-sm text-gray-600">
                    <input type="checkbox" checked={data.is_night_shift} onChange={(e) => set('is_night_shift', e.target.checked)}
                      className="rounded" />
                    This is a night shift job
                  </label>
                </div>
              </div>

              {/* Location */}
              <div className="bg-white rounded-xl border p-6">
                <h2 className="font-bold text-gray-900 mb-0.5">Location</h2>
                <p className="text-sm text-gray-500 mb-4">Let candidates know where they will be working from.</p>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Work location type *</label>
                  <div className="flex flex-wrap gap-2">
                    {[{val:'work_from_office',label:'Work From Office'},{val:'work_from_home',label:'Work From Home'},{val:'field_job',label:'Field Job'}].map((t) => (
                      <Pill key={t.val} active={data.work_location_type === t.val} onClick={() => set('work_location_type', t.val)}>{t.label}</Pill>
                    ))}
                  </div>
                </div>
                {data.work_location_type !== 'work_from_home' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Job Location / City *</label>
                    <input
                      value={data.city} onChange={(e) => set('city', e.target.value)}
                      list="wizard-cities" placeholder="e.g. Mumbai, Delhi-NCR"
                      className="w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a7d4e]"
                    />
                    <datalist id="wizard-cities">{cities.map((c: any) => <option key={c.id} value={c.name} />)}</datalist>
                  </div>
                )}
              </div>

              {/* Compensation */}
              <div className="bg-white rounded-xl border p-6">
                <h2 className="font-bold text-gray-900 mb-0.5">Compensation</h2>
                <p className="text-sm text-gray-500 mb-4">Job postings with right salary & incentives will help you find the right candidates.</p>

                <div className="mb-4 grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Min Salary (₹/month)</label>
                    <input type="number" min="0" value={data.salary_min || ''} onChange={(e) => set('salary_min', Number(e.target.value))}
                      placeholder="e.g. 15000" className="w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a7d4e]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Max Salary (₹/month)</label>
                    <input type="number" min="0" value={data.salary_max || ''} onChange={(e) => set('salary_max', Number(e.target.value))}
                      placeholder="e.g. 30000" className="w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a7d4e]" />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">What is the pay type? *</label>
                  <div className="flex flex-wrap gap-2">
                    {[{val:'fixed_only',label:'Fixed Only'},{val:'fixed_incentive',label:'Fixed + Incentive'},{val:'incentive_only',label:'Incentive Only'}].map((t) => (
                      <Pill key={t.val} active={data.pay_type === t.val} onClick={() => set('pay_type', t.val)}>{t.label}</Pill>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Do you offer any additional perks?</label>
                  <div className="flex flex-wrap gap-2">
                    {PERKS.map((perk) => (
                      <button key={perk} type="button" onClick={() => togglePerk(perk)}
                        className={`flex items-center gap-1 px-3 py-1 rounded-full border text-sm transition-colors ${
                          data.perks.includes(perk) ? 'bg-[#e8f5ef] border-[#1a7d4e] text-[#1a7d4e]' : 'border-gray-300 text-gray-600 hover:border-gray-400'
                        }`}>
                        {perk} {data.perks.includes(perk) ? <Check className="h-3 w-3" /> : <span className="text-gray-400">+</span>}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Is there any joining fee or deposit required from the candidate? *</label>
                  <div className="flex gap-2">
                    <Pill active={data.has_joining_fee} onClick={() => set('has_joining_fee', true)}>Yes</Pill>
                    <Pill active={!data.has_joining_fee} onClick={() => set('has_joining_fee', false)}>No</Pill>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ═══════════════ STEP 2: CANDIDATE REQUIREMENTS ═══════════════ */}
          {step === 1 && (
            <>
              <div className="bg-white rounded-xl border p-6">
                <h2 className="font-bold text-gray-900 mb-0.5">Basic Requirements</h2>
                <p className="text-sm text-gray-500 mb-4">We'll use these requirement details to make your job visible to the right candidates.</p>

                <div className="mb-5">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Education *</label>
                  <div className="flex flex-wrap gap-2">
                    {[{val:'10th',label:'10th Or Below 10th'},{val:'12th',label:'12th Pass'},{val:'diploma',label:'Diploma'},{val:'graduate',label:'Graduate'},{val:'post_graduate',label:'Post Graduate'}].map((e) => (
                      <Pill key={e.val} active={data.education === e.val} onClick={() => set('education', e.val)}>{e.label}</Pill>
                    ))}
                  </div>
                </div>

                <div className="mb-5">
                  <label className="block text-sm font-medium text-gray-700 mb-2">English level required *</label>
                  <div className="flex flex-wrap gap-2">
                    {[{val:'no_english',label:'No English'},{val:'basic_english',label:'Basic English'},{val:'good_english',label:'Good English'}].map((e) => (
                      <Pill key={e.val} active={data.english_level === e.val} onClick={() => set('english_level', e.val)}>{e.label}</Pill>
                    ))}
                  </div>
                </div>

                <div className="mb-5">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Total experience required *</label>
                  <div className="flex flex-wrap gap-2">
                    {[{val:'any',label:'Any'},{val:'experienced_only',label:'Experienced Only'},{val:'fresher_only',label:'Fresher Only'}].map((e) => (
                      <Pill key={e.val} active={data.experience_type === e.val} onClick={() => set('experience_type', e.val)}>{e.label}</Pill>
                    ))}
                  </div>
                  {data.experience_type === 'experienced_only' && (
                    <div className="flex gap-4 mt-3">
                      <div className="flex-1">
                        <label className="text-xs text-gray-500 mb-1 block">Min years</label>
                        <input type="number" min="0" value={data.experience_min} onChange={(e) => set('experience_min', Number(e.target.value))}
                          className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a7d4e]" />
                      </div>
                      <div className="flex-1">
                        <label className="text-xs text-gray-500 mb-1 block">Max years</label>
                        <input type="number" min="0" value={data.experience_max} onChange={(e) => set('experience_max', Number(e.target.value))}
                          className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a7d4e]" />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-xl border p-6">
                <h2 className="font-bold text-gray-900 mb-0.5">Additional Requirements <span className="text-gray-400 font-normal">(Optional)</span></h2>
                <p className="text-sm text-gray-500 mb-4">Add additional requirement so that we can help you find the right candidates</p>

                <div className="grid grid-cols-2 gap-4 mb-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Gender Preference</label>
                    <div className="flex gap-2">
                      {[{val:'any',label:'Any'},{val:'male',label:'Male'},{val:'female',label:'Female'}].map((g) => (
                        <Pill key={g.val} active={data.gender === g.val} onClick={() => set('gender', g.val)}>{g.label}</Pill>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
                    <select value={data.category} onChange={(e) => set('category', e.target.value)}
                      className="w-full px-3 py-2.5 border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1a7d4e]">
                      <option value="">Select...</option>
                      {categories.map((c: any) => <option key={c.id} value={c.slug}>{c.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Number of Openings</label>
                    <input type="number" min="1" value={data.openings} onChange={(e) => set('openings', Number(e.target.value))}
                      className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a7d4e]" />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Skills Required</label>
                  <input value={skillInput} onChange={(e) => setSkillInput(e.target.value)} onKeyDown={addSkill}
                    placeholder="Type skill and press Enter..." className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a7d4e]" />
                  <div className="flex flex-wrap gap-2 mt-2">
                    {data.skills.map((s) => (
                      <span key={s} className="flex items-center gap-1 bg-[#e8f5ef] text-[#1a7d4e] text-xs px-2.5 py-1 rounded-full">
                        {s}
                        <button onClick={() => setData((d) => ({ ...d, skills: d.skills.filter((x) => x !== s) }))}><X className="h-3 w-3" /></button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border p-6">
                <h2 className="font-bold text-gray-900 mb-0.5">Job Description</h2>
                <p className="text-sm text-gray-500 mb-4">Describe the responsibilities of this job and other specific requirements here.</p>
                <div className="border rounded-lg overflow-hidden">
                  <div className="border-b bg-gray-50 px-3 py-2 flex gap-3">
                    {['B','I','U'].map((f) => (
                      <button key={f} type="button" className={`text-sm font-${f === 'B' ? 'bold' : f === 'I' ? 'normal italic' : 'normal'} text-gray-600 hover:text-gray-900 w-6 h-6 rounded hover:bg-gray-200`}>{f}</button>
                    ))}
                    <div className="w-px bg-gray-300 mx-1" />
                    <button type="button" className="text-gray-600 hover:text-gray-900 text-xs">≡</button>
                    <button type="button" className="text-gray-600 hover:text-gray-900 text-xs">≣</button>
                  </div>
                  <textarea value={data.description} onChange={(e) => set('description', e.target.value)}
                    rows={6} placeholder="Enter the job description, including the main responsibility and tasks..."
                    className="w-full px-4 py-3 text-sm focus:outline-none resize-none" />
                </div>
              </div>
            </>
          )}

          {/* ═══════════════ STEP 3: INTERVIEWER INFO ═══════════════ */}
          {step === 2 && (
            <>
              <div className="bg-white rounded-xl border p-6">
                <h2 className="font-bold text-gray-900 mb-0.5">Interview method and address</h2>
                <p className="text-sm text-gray-500 mb-5">Let candidates know how interview will be conducted for this job.</p>
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-3">
                    Is this a walk-in interview? *
                    <span className="ml-2 text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">New</span>
                  </p>
                  <div className="space-y-3">
                    {[{val:true,label:'Yes'},{val:false,label:'No'}].map((o) => (
                      <label key={String(o.val)} className="flex items-center gap-3 cursor-pointer">
                        <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${
                          data.is_walkin === o.val ? 'border-[#1a7d4e]' : 'border-gray-300'
                        }`} onClick={() => set('is_walkin', o.val)}>
                          {data.is_walkin === o.val && <div className="h-2.5 w-2.5 rounded-full bg-[#1a7d4e]" />}
                        </div>
                        <span className="text-sm text-gray-700">{o.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border p-6">
                <h2 className="font-bold text-gray-900 mb-4">Communication Preferences</h2>
                <p className="text-sm font-medium text-gray-700 mb-3">
                  Do you want candidates to contact you via Call / Whatsapp after they apply? *
                </p>
                <div className="space-y-3">
                  {[
                    {val:'to_myself',label:'Yes, to myself'},
                    {val:'to_other',label:'Yes, to other recruiter'},
                    {val:'no_contact',label:'No, I will contact candidates first'},
                  ].map((o) => (
                    <label key={o.val} className="flex items-center gap-3 cursor-pointer">
                      <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${
                        data.contact_preference === o.val ? 'border-[#1a7d4e]' : 'border-gray-300'
                      }`} onClick={() => set('contact_preference', o.val)}>
                        {data.contact_preference === o.val && <div className="h-2.5 w-2.5 rounded-full bg-[#1a7d4e]" />}
                      </div>
                      <span className="text-sm text-gray-700">{o.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* ═══════════════ STEP 4: JOB PREVIEW ═══════════════ */}
          {step === 3 && (
            <>
              {/* Job Details card */}
              <div className="bg-white rounded-xl border">
                <div className="flex items-center justify-between p-5 border-b">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">💼</span>
                    <h2 className="font-bold text-gray-900">Job Details</h2>
                  </div>
                  <button onClick={() => setStep(0)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                  </button>
                </div>
                <div className="p-5 grid grid-cols-2 gap-y-3 text-sm">
                  {[
                    ['Company name', company?.name || 'Your Company'],
                    ['Job title', data.title],
                    ['Job role / category', data.category || 'Not set'],
                    ['Job type', data.job_type.join(' | ').replace(/_/g,' ')],
                    ['Work type', data.work_location_type.replace(/_/g,' ')],
                    ['Job location', data.city || 'Remote'],
                    ['Monthly Salary | Pay Type', `₹${(data.salary_min||0).toLocaleString()} - ₹${(data.salary_max||0).toLocaleString()} per month (${data.pay_type.replace(/_/g,' ')})`],
                    ['Additional perks', data.perks.length ? data.perks.join(', ') : 'None'],
                    ['Joining Fee', data.has_joining_fee ? 'Yes' : 'No'],
                  ].map(([k,v]) => (
                    <React.Fragment key={k}>
                      <span className="text-[#1a7d4e] font-medium">{k}</span>
                      <span className="text-gray-800">{v}</span>
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* Candidate Requirements card */}
              <div className="bg-white rounded-xl border">
                <div className="flex items-center justify-between p-5 border-b">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">👥</span>
                    <h2 className="font-bold text-gray-900">Candidate Requirements</h2>
                  </div>
                  <button onClick={() => setStep(1)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                  </button>
                </div>
                <div className="m-4 bg-blue-50 rounded-lg p-3 text-sm text-blue-800">
                  <p className="font-semibold">Eligible requirements</p>
                  <p className="text-xs mt-0.5">Your job will only be visible to the candidates who meet these requirements.</p>
                </div>
                <div className="px-5 pb-5 grid grid-cols-2 gap-y-3 text-sm">
                  {[
                    ['Minimum Education', data.education.replace(/_/g,' ')],
                    ['Experience Required', data.experience_type.replace(/_/g,' ')],
                    ['English', data.english_level.replace(/_/g,' ')],
                    ['Gender', data.gender],
                    ['Skills', data.skills.join(', ') || 'Any'],
                    ['Job Description', data.description || 'Not provided'],
                  ].map(([k,v]) => (
                    <React.Fragment key={k}>
                      <span className="text-[#1a7d4e] font-medium">{k}</span>
                      <span className="text-gray-800 truncate">{v}</span>
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* Interview Info card */}
              <div className="bg-white rounded-xl border">
                <div className="flex items-center justify-between p-5 border-b">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">🎙️</span>
                    <h2 className="font-bold text-gray-900">Interview Information</h2>
                  </div>
                  <button onClick={() => setStep(2)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                  </button>
                </div>
                <div className="p-5 grid grid-cols-2 gap-y-3 text-sm">
                  {[
                    ['Walk-in Interview', data.is_walkin === null ? 'Not specified' : data.is_walkin ? 'Yes' : 'No'],
                    ['Contact Preference', data.contact_preference.replace(/_/g,' ')],
                  ].map(([k,v]) => (
                    <React.Fragment key={k}>
                      <span className="text-[#1a7d4e] font-medium">{k}</span>
                      <span className="text-gray-800">{v}</span>
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* ═══════════════ STEP 5: PUBLISH / PAYMENT ═══════════════ */}
          {step === 4 && (
            <>
              <h2 className="text-xl font-bold text-gray-900 text-center mb-4">Choose a job basis your hiring needs</h2>

              {/* Plan cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {PLANS.map((plan) => (
                  <div
                    key={plan.id}
                    onClick={() => set('plan_type', plan.id)}
                    className={`bg-white rounded-xl border-2 p-5 cursor-pointer transition-all ${
                      data.plan_type === plan.id ? 'border-[#1a7d4e] shadow-md' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-bold text-gray-900">{plan.label}</h3>
                      <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${
                        data.plan_type === plan.id ? 'border-[#1a7d4e]' : 'border-gray-300'
                      }`}>
                        {data.plan_type === plan.id && <div className="h-2.5 w-2.5 rounded-full bg-[#1a7d4e]" />}
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 mb-3">₹{plan.price.toLocaleString()}</p>
                    <div className="space-y-1.5 text-sm">
                      {plan.features.map((f) => (
                        <div key={f} className="flex items-start gap-2 text-gray-700">
                          <Check className="h-4 w-4 text-[#1a7d4e] flex-shrink-0 mt-0.5" />{f}
                        </div>
                      ))}
                      {plan.noFeatures.map((f) => (
                        <div key={f} className="flex items-start gap-2 text-gray-400 line-through">
                          <X className="h-4 w-4 flex-shrink-0 mt-0.5" />{f}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <p className="text-xs text-gray-400 text-center mb-6">*All prices are excluding taxes.</p>

              {/* Checkout */}
              <div className="bg-white rounded-xl border p-6">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span>≡</span> Checkout
                </h3>

                <div className="border rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center border-[#1a7d4e]`}>
                      <div className="h-2.5 w-2.5 rounded-full bg-[#1a7d4e]" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">Buy 1 job credit to post this job</p>
                      <p className="font-bold text-gray-900">₹{selectedPlan?.price.toLocaleString()}</p>
                      <p className="text-xs text-gray-400">(~₹{selectedPlan?.price}/jobcredit)</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 border-t pt-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">{selectedPlan?.label}</span>
                    <span className="font-medium">₹{selectedPlan?.price.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sub total</span>
                    <span className="font-medium">₹{selectedPlan?.price.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">GST (18%)</span>
                    <span className="font-medium">₹{gst(selectedPlan?.price || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2 font-bold text-base">
                    <span>Total <span className="text-xs font-normal text-gray-400">(Inc tax)</span></span>
                    <span>₹{((selectedPlan?.price || 0) + gst(selectedPlan?.price || 0)).toLocaleString()}</span>
                  </div>
                </div>

                <div className="mt-4 bg-blue-50 rounded-lg p-3 text-sm text-blue-800 flex items-start gap-2">
                  <Info className="h-4 w-4 flex-shrink-0 mt-0.5" />
                  <span>You are using 1 job credit to post <strong>1 {selectedPlan?.label}</strong>. This job will be active for <strong>15 days</strong>.</span>
                </div>
              </div>

              {/* Trusted brands */}
              <div className="bg-white rounded-xl border p-5 text-center">
                <p className="text-sm text-gray-500 mb-3">Trusted by 1000+ enterprises and 7 lakh+ MSMEs for hiring</p>
                <div className="flex flex-wrap justify-center gap-6 text-sm font-bold text-gray-500">
                  {['Zomato','Uber','Swiggy','HDFC Bank','Flipkart','TechMahindra'].map((b) => (
                    <span key={b}>{b}</span>
                  ))}
                </div>
              </div>
            </>
          )}

        </div>
      </main>

      {/* Bottom action bar */}
      <div className="bg-white border-t px-6 py-4 flex items-center justify-center gap-4 flex-shrink-0">
        {step > 0 && (
          <button onClick={() => setStep(step - 1)}
            className="px-8 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg text-sm hover:bg-gray-50">
            Back
          </button>
        )}
        {step < 4 ? (
          <button
            disabled={savingDraft}
            onClick={async () => {
              if (step === 0 && !data.title.trim()) { toast.error('Job title is required'); return; }
              // On step 2 → 3 (Interviewer Info → Preview): save draft first
              if (step === 2) {
                const id = await saveDraft();
                if (!id) return; // draft save failed, stay on step
              }
              setStep(step + 1);
            }}
            className="px-10 py-3 text-white font-semibold rounded-lg text-sm disabled:opacity-60"
            style={{ backgroundColor: '#1a7d4e' }}
          >
            {savingDraft ? 'Saving…' : 'Continue'}
          </button>
        ) : isPaidEdit ? (
          // Editing an already-paid job — just save, no payment
          <button
            onClick={handleSavePaidEdit}
            disabled={publishing}
            className="px-10 py-3 text-white font-semibold rounded-lg text-sm disabled:opacity-60"
            style={{ backgroundColor: '#1a7d4e' }}
          >
            {publishing ? 'Saving…' : 'Save Changes'}
          </button>
        ) : (
          <button
            onClick={handlePublish}
            disabled={publishing}
            className="px-10 py-3 text-white font-semibold rounded-lg text-sm disabled:opacity-60"
            style={{ backgroundColor: '#1a7d4e' }}
          >
            {publishing ? 'Processing…' : `Pay ₹${((selectedPlan?.price || 0) + gst(selectedPlan?.price || 0)).toLocaleString()} & Publish`}
          </button>
        )}
      </div>
    </div>
  );
};
