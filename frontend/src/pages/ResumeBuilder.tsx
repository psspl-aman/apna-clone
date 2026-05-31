import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';
import api from '../services/api';
import toast from 'react-hot-toast';
import {
  ChevronLeft, ChevronDown, ChevronUp,
  Plus, X, Save, Download,
  User, Briefcase, GraduationCap, Target, Globe,
  Clipboard, Code2, Award, Heart, BookOpen, Link2, Trophy,
  Sparkles, LayoutTemplate,
} from 'lucide-react';
import {
  ResumeData, ResumeExpItem, ResumeEduItem, ResumeLanguage,
  getStoredResumes, saveStoredResumes, ResumeDocument,
} from './CareerCompass';

/* ─── Helpers ─── */
const genId = () => Math.random().toString(36).substr(2, 9);
const dateLbl = () => new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' });

const makeEmpty = (): ResumeData => ({
  id: genId(),
  name: `Resume ${dateLbl()}`,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  personal: {
    fullName: '', email: '', phone: '',
    title: 'Curriculum Vitae',
    city: '', experienceLevel: 'experience', preferredTitle: '',
  },
  summary: '', experience: [], education: [], skills: [], languages: [],
});

/* ─── Accordion section definitions ─── */
const CORE_SECTIONS = [
  { id: 'personal',   label: 'Personal Information', Icon: User },
  { id: 'experience', label: 'Work Experience',       Icon: Briefcase },
  { id: 'education',  label: 'Education',             Icon: GraduationCap },
  { id: 'skills',     label: 'Skills',                Icon: Target },
  { id: 'languages',  label: 'Languages',             Icon: Globe },
] as const;

type CoreSectionId = typeof CORE_SECTIONS[number]['id'];

const OPTIONAL_SECTIONS = [
  { id: 'internships',    label: 'Internship Experience',    Icon: Clipboard },
  { id: 'projects',       label: 'Projects',                 Icon: Code2 },
  { id: 'certifications', label: 'Licence / Certifications', Icon: Award },
  { id: 'awards',         label: 'Awards / Honours',         Icon: Trophy },
  { id: 'hobbies',        label: 'Hobbies',                  Icon: Heart },
  { id: 'publications',   label: 'Publications',             Icon: BookOpen },
  { id: 'socialLinks',    label: 'Social media links',       Icon: Link2 },
] as const;

/* ─── Shared field label ─── */
const Lbl = ({ text, required }: { text: string; required?: boolean }) => (
  <label className="block text-xs font-medium text-gray-600 mb-1">
    {text}{required && <span className="text-red-500 ml-0.5">*</span>}
  </label>
);

const inp = 'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a7d4e] bg-white';

/* ═══════════════════════════════════════════════════════════
   RESUME BUILDER PAGE
═══════════════════════════════════════════════════════════ */
export const ResumeBuilderPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const { user } = useAppSelector(s => s.auth);

  const [resume, setResume] = useState<ResumeData>(() => {
    if (id) {
      const found = getStoredResumes().find(r => r.id === id);
      if (found) return found;
    }
    return makeEmpty();
  });

  const [openSections, setOpenSections] = useState<Set<CoreSectionId>>(new Set<CoreSectionId>(['personal']));
  const [addedOptional, setAddedOptional] = useState<Set<string>>(new Set());
  const [skillInput, setSkillInput] = useState('');
  const [langInput, setLangInput] = useState({ name: '', level: '' });
  const [saving, setSaving] = useState(false);
  const summaryRef = useRef<HTMLDivElement>(null);

  /* Sync contenteditable when pre-fill updates summary from outside */
  useEffect(() => {
    if (summaryRef.current && document.activeElement !== summaryRef.current) {
      summaryRef.current.innerHTML = resume.summary || '';
    }
  }, [resume.summary]);

  const toggleSection = (sId: CoreSectionId) =>
    setOpenSections(prev => {
      const n = new Set(prev);
      n.has(sId) ? n.delete(sId) : n.add(sId);
      return n;
    });

  /* ── Generic setters ── */
  const set = <K extends keyof ResumeData>(k: K, v: ResumeData[K]) =>
    setResume(prev => ({ ...prev, [k]: v }));

  const setP = (k: keyof ResumeData['personal'], v: string) =>
    setResume(prev => ({ ...prev, personal: { ...prev.personal, [k]: v } }));

  /* ── Experience CRUD ── */
  const addExp = () => setResume(prev => ({
    ...prev,
    experience: [...prev.experience, {
      id: genId(), company: '', role: '', startDate: '', endDate: '', isCurrent: false, description: '',
    }],
  }));
  const setExp = (eId: string, k: keyof ResumeExpItem, v: string | boolean) =>
    setResume(prev => ({ ...prev, experience: prev.experience.map(e => e.id === eId ? { ...e, [k]: v } : e) }));
  const removeExp = (eId: string) =>
    setResume(prev => ({ ...prev, experience: prev.experience.filter(e => e.id !== eId) }));

  /* ── Education CRUD ── */
  const addEdu = () => setResume(prev => ({
    ...prev,
    education: [...prev.education, {
      id: genId(), degree: '', institution: '', field: '', startYear: '', endYear: '',
    }],
  }));
  const setEdu = (eId: string, k: keyof ResumeEduItem, v: string) =>
    setResume(prev => ({ ...prev, education: prev.education.map(e => e.id === eId ? { ...e, [k]: v } : e) }));
  const removeEdu = (eId: string) =>
    setResume(prev => ({ ...prev, education: prev.education.filter(e => e.id !== eId) }));

  /* ── Skills ── */
  const addSkill = () => {
    const s = skillInput.trim();
    if (!s) return;
    setResume(prev => ({ ...prev, skills: Array.from(new Set([...prev.skills, s])) }));
    setSkillInput('');
  };
  const removeSkill = (s: string) =>
    setResume(prev => ({ ...prev, skills: prev.skills.filter(sk => sk !== s) }));

  /* ── Languages ── */
  const addLang = () => {
    if (!langInput.name.trim()) return;
    const lang: ResumeLanguage = { id: genId(), name: langInput.name.trim(), level: langInput.level };
    setResume(prev => ({ ...prev, languages: [...(prev.languages ?? []), lang] }));
    setLangInput({ name: '', level: '' });
  };
  const removeLang = (lId: string) =>
    setResume(prev => ({ ...prev, languages: (prev.languages ?? []).filter(l => l.id !== lId) }));

  /* ── Rich-text toolbar ── */
  const execFmt = (cmd: string) => {
    document.execCommand(cmd, false, undefined);
    summaryRef.current?.focus();
  };

  /* ── Pre-fill from profile ── */
  const handlePrefill = async () => {
    try {
      const { data: resp } = await api.get('/candidates/profile');
      // API shape: { data: { profile: { fullName, skills, languages, workExperiences:[], educations:[] }, workExperiences:[], educations:[], profileCompletion } }
      const d = resp?.data;
      if (!d?.profile) { toast.error('No profile data found.'); return; }
      const prof = d.profile;

      // workExperiences / educations are BOTH nested inside profile (Sequelize includes)
      // and at the top-level. Prefer the top-level; fall back to nested if top-level is empty.
      const toDateMonth = (v?: string | null) => v ? String(v).slice(0, 7) : '';

      const rawExps: any[] = (
        d.workExperiences?.length ? d.workExperiences : (prof.workExperiences || [])
      );
      const rawEdus: any[] = (
        d.educations?.length ? d.educations : (prof.educations || [])
      );

      const newExps = rawExps.length
        ? rawExps.map((w: any) => ({
            id:          genId(),
            company:     w.companyName || '',
            role:        w.jobTitle    || '',
            startDate:   toDateMonth(w.startDate),
            endDate:     toDateMonth(w.endDate),
            isCurrent:   w.isCurrent  || false,
            description: Array.isArray(w.jobRoles) && w.jobRoles.length
              ? w.jobRoles.join('\n')
              : (w.description || ''),
          }))
        : null;

      const newEdus = rawEdus.length
        ? rawEdus.map((e: any) => ({
            id:          genId(),
            degree:      e.degree       || '',
            institution: e.institution  || '',
            field:       e.fieldOfStudy || '',
            startYear:   '',
            endYear:     e.batchYear ? String(e.batchYear) : '',
          }))
        : null;

      const newSkills = (prof.skills?.length) ? prof.skills as string[] : null;
      const newLangs  = (prof.languages?.length)
        ? (prof.languages as any[]).map((l: any) => ({ id: genId(), name: l.name || '', level: l.level || '' }))
        : null;

      // Auto-generate summary from profile data (only if summary is currently empty)
      const buildSummary = (): string => {
        const parts: string[] = [];
        const title   = prof.preferredJobTitles?.[0] || '';
        const expYrs  = prof.totalExperience ?? 0;
        const city    = prof.currentLocation || prof.city || '';
        const topSkills = (prof.skills as string[] | undefined)?.slice(0, 4).join(', ') || '';
        const latestEdu = rawEdus[0];

        if (title && expYrs > 0)
          parts.push(`Experienced ${title} with ${expYrs}+ year${expYrs === 1 ? '' : 's'} of experience.`);
        else if (title)
          parts.push(`${title} professional.`);

        if (latestEdu?.institution)
          parts.push(`${latestEdu.degree ? latestEdu.degree + ' from ' : ''}${latestEdu.institution}.`);

        if (topSkills) parts.push(`Skilled in ${topSkills}.`);
        if (city)      parts.push(`Based in ${city}.`);

        return parts.join(' ');
      };

      // Decide which sections to open
      const toOpen = new Set<CoreSectionId>(['personal']);
      if (newExps)   toOpen.add('experience');
      if (newEdus)   toOpen.add('education');
      if (newSkills) toOpen.add('skills');
      if (newLangs)  toOpen.add('languages');

      setResume(prev => {
        const generatedSummary = prev.summary ? prev.summary : buildSummary();
        return {
          ...prev,
          personal: {
            ...prev.personal,
            fullName:        prof.fullName                        || prev.personal.fullName,
            email:           user?.email                         || prev.personal.email,
            phone:           (user as any)?.phone                || prev.personal.phone,
            city:            prof.currentLocation || prof.city   || prev.personal.city,
            preferredTitle:  prof.preferredJobTitles?.[0]        || prev.personal.preferredTitle,
            experienceLevel: (prof.totalExperience ?? 0) > 0 ? 'experience' : 'fresher',
          },
          summary:    generatedSummary,
          skills:     newSkills ?? prev.skills,
          languages:  newLangs  ?? prev.languages,
          experience: newExps   ?? prev.experience,
          education:  newEdus   ?? prev.education,
        };
      });

      setOpenSections(toOpen);
      toast.success('Profile data loaded!');
    } catch (err) {
      console.error('Prefill error:', err);
      toast.error('Could not load profile — make sure you are logged in as a candidate.');
    }
  };

  /* ── Save ── */
  const handleSave = () => {
    if (!resume.personal.fullName.trim()) {
      toast.error('Please enter your full name');
      setOpenSections(prev => { const n = new Set<CoreSectionId>(prev); n.add('personal'); return n; });
      return;
    }
    setSaving(true);
    try {
      const toSave: ResumeData = {
        ...resume,
        summary: summaryRef.current?.innerHTML || resume.summary,
        updatedAt: new Date().toISOString(),
      };
      const stored = getStoredResumes();
      const idx = stored.findIndex(r => r.id === toSave.id);
      if (idx >= 0) stored[idx] = toSave;
      else stored.unshift(toSave);
      saveStoredResumes(stored);
      toast.success('Resume saved!');
      navigate('/career-compass');
    } catch {
      toast.error('Failed to save resume');
    } finally {
      setSaving(false);
    }
  };

  /* ── Download (print) ── */
  const handleDownload = () => {
    const styleId = 'apna-resume-print';
    const old = document.getElementById(styleId);
    if (old) old.remove();
    const style = document.createElement('style');
    style.id = styleId;
    style.innerHTML = `
      @media print {
        body > * { display: none !important; }
        #resume-print-target { display: block !important; position: fixed; inset: 0; }
      }
    `;
    document.head.appendChild(style);
    window.print();
    setTimeout(() => style.remove(), 2000);
  };

  /* ═══════ RENDER ═══════ */
  return (
    // h-[calc(100vh-4rem)] accounts for the 4rem (64px) Navbar above
    <div className="flex flex-col h-[calc(100vh-4rem)] overflow-hidden bg-white">

      {/* ━━━━━━ TOP BAR ━━━━━━ */}
      <div className="flex items-center justify-between px-5 h-14 border-b bg-white flex-shrink-0 gap-3">
        {/* Left */}
        <div className="flex items-center gap-2 min-w-0">
          <button onClick={() => navigate('/career-compass')} className="text-gray-500 hover:text-gray-800 flex-shrink-0">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <input
            value={resume.name}
            onChange={e => set('name', e.target.value)}
            className="text-sm font-semibold text-gray-900 focus:outline-none border-b border-transparent hover:border-gray-300 focus:border-[#1a7d4e] bg-transparent min-w-0 truncate max-w-[200px]"
          />
        </div>

        {/* Right */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button onClick={() => toast('Resume analysis coming soon!', { icon: '✨' })}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 rounded-lg text-xs text-gray-600 hover:bg-gray-50">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" /> Resume analysis
          </button>
          <button onClick={() => toast('Templates coming soon!', { icon: '🎨' })}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 rounded-lg text-xs text-gray-600 hover:bg-gray-50">
            <LayoutTemplate className="h-3.5 w-3.5 text-blue-500" /> Templates
          </button>
          <button onClick={handleDownload}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-semibold text-white"
            style={{ backgroundColor: '#1a7d4e' }}>
            <Download className="h-4 w-4" /> Download
          </button>
        </div>
      </div>

      {/* ━━━━━━ BODY ━━━━━━ */}
      <div className="flex flex-1 overflow-hidden">

        {/* ━━ LEFT FORM ━━ */}
        <div className="w-full lg:w-[480px] flex-shrink-0 overflow-y-auto bg-gray-50 border-r">
          <div className="p-4 space-y-3">

            {/* Pre-fill & Save row */}
            <div className="flex items-center justify-between gap-2">
              <button onClick={handlePrefill}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-[#1a7d4e] text-[#1a7d4e] rounded-lg text-xs font-medium hover:bg-[#f0fdf4]">
                Use Profile
              </button>
              <button onClick={handleSave} disabled={saving}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold text-white disabled:opacity-60"
                style={{ backgroundColor: '#1a7d4e' }}>
                <Save className="h-3.5 w-3.5" /> {saving ? 'Saving…' : 'Save'}
              </button>
            </div>

            {/* ── Core accordion sections ── */}
            {CORE_SECTIONS.map(({ id: sId, label, Icon }) => (
              <div key={sId} className="bg-white rounded-xl border border-gray-200 overflow-hidden">

                {/* Header */}
                <button
                  onClick={() => toggleSection(sId)}
                  className="w-full flex items-center justify-between px-4 py-3.5 text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="h-4 w-4 text-gray-500 flex-shrink-0" />
                    <span className="text-sm font-semibold text-gray-800">{label}</span>
                  </div>
                  {openSections.has(sId)
                    ? <ChevronUp className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    : <ChevronDown className="h-4 w-4 text-gray-400 flex-shrink-0" />}
                </button>

                {/* Content */}
                {openSections.has(sId) && (
                  <div className="px-4 pb-5 pt-2 border-t border-gray-100 space-y-3">

                    {/* ── PERSONAL INFORMATION ── */}
                    {sId === 'personal' && (
                      <>
                        {/* Full Name + Upload photo */}
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Lbl text="Full Name" required />
                            <input className={inp} value={resume.personal.fullName}
                              onChange={e => setP('fullName', e.target.value)} placeholder="Full Name" />
                          </div>
                          <div className="border border-dashed border-gray-300 rounded-lg px-3 py-2.5 flex items-center gap-2 cursor-pointer hover:bg-gray-50 group">
                            <div className="h-9 w-9 rounded-full bg-gray-100 group-hover:bg-gray-200 flex items-center justify-center flex-shrink-0 transition-colors">
                              <User className="h-5 w-5 text-gray-400" />
                            </div>
                            <div>
                              <p className="text-xs font-medium text-[#1a7d4e]">Upload photo</p>
                              <p className="text-[10px] text-gray-400 leading-tight">Allowed file formats: jpg, png</p>
                            </div>
                          </div>
                        </div>

                        {/* Email + Mobile */}
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Lbl text="Email" />
                            <input type="email" className={inp} value={resume.personal.email}
                              onChange={e => setP('email', e.target.value)} placeholder="Email" />
                          </div>
                          <div>
                            <Lbl text="Mobile Number" required />
                            <input className={inp} value={resume.personal.phone}
                              onChange={e => setP('phone', e.target.value)} placeholder="Enter Mobile Number" />
                          </div>
                        </div>

                        {/* Current city */}
                        <div>
                          <Lbl text="Current city" />
                          <input className={inp} value={resume.personal.city ?? ''}
                            onChange={e => setP('city', e.target.value)} placeholder="Enter City" />
                        </div>

                        {/* Experience level */}
                        <div>
                          <Lbl text="Experience level" />
                          <div className="flex items-center gap-6 mt-1">
                            {(['fresher', 'experience'] as const).map(lv => (
                              <label key={lv} className="flex items-center gap-2 cursor-pointer select-none">
                                <input type="radio" name="exp-level" value={lv}
                                  checked={(resume.personal.experienceLevel ?? 'experience') === lv}
                                  onChange={() => setP('experienceLevel', lv)}
                                  className="accent-[#1a7d4e]" />
                                <span className="text-sm text-gray-700">
                                  {lv === 'fresher' ? 'Fresher' : 'Experience'}
                                </span>
                              </label>
                            ))}
                          </div>
                        </div>

                        {/* Preferred job title */}
                        <div>
                          <Lbl text="Preferred job title/role" />
                          <input className={inp} value={resume.personal.preferredTitle ?? ''}
                            onChange={e => setP('preferredTitle', e.target.value)}
                            placeholder="e.g. Full-stack Developer" />
                        </div>

                        {/* Professional Summary — rich text */}
                        <div>
                          <Lbl text="Professional Summary" />
                          <div className="border border-gray-300 rounded-lg overflow-hidden">
                            {/* Toolbar */}
                            <div className="flex items-center gap-0.5 border-b border-gray-200 px-2 py-1.5 bg-gray-50">
                              {[
                                { cmd: 'bold',                label: 'B', cls: 'font-bold' },
                                { cmd: 'italic',              label: 'I', cls: 'italic' },
                                { cmd: 'insertUnorderedList', label: '≡', cls: '' },
                                { cmd: 'insertOrderedList',   label: '≣', cls: '' },
                                { cmd: 'underline',           label: 'U', cls: 'underline' },
                              ].map(btn => (
                                <button key={btn.cmd} type="button"
                                  onMouseDown={e => { e.preventDefault(); execFmt(btn.cmd); }}
                                  className={`h-6 w-6 text-xs text-gray-600 rounded hover:bg-gray-200 flex items-center justify-center ${btn.cls}`}>
                                  {btn.label}
                                </button>
                              ))}
                            </div>
                            {/* Editable */}
                            <div
                              ref={summaryRef}
                              contentEditable
                              suppressContentEditableWarning
                              onInput={() => {
                                if (summaryRef.current)
                                  setResume(prev => ({ ...prev, summary: summaryRef.current!.innerHTML }));
                              }}
                              className="min-h-[100px] p-3 text-sm focus:outline-none text-gray-700 leading-relaxed"
                            />
                          </div>
                        </div>
                      </>
                    )}

                    {/* ── WORK EXPERIENCE ── */}
                    {sId === 'experience' && (
                      <>
                        {resume.experience.map((exp, i) => (
                          <div key={exp.id} className="border border-gray-200 rounded-xl p-3 space-y-2.5">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Experience {i + 1}</span>
                              <button onClick={() => removeExp(exp.id)} className="text-gray-400 hover:text-red-500">
                                <X className="h-3.5 w-3.5" />
                              </button>
                            </div>
                            <input className={inp} value={exp.role}
                              onChange={e => setExp(exp.id, 'role', e.target.value)} placeholder="Job Title / Role" />
                            <input className={inp} value={exp.company}
                              onChange={e => setExp(exp.id, 'company', e.target.value)} placeholder="Company Name" />
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <Lbl text="Start Date" />
                                <input type="month" className={inp} value={exp.startDate}
                                  onChange={e => setExp(exp.id, 'startDate', e.target.value)} />
                              </div>
                              <div>
                                <Lbl text="End Date" />
                                <input type="month" className={inp} value={exp.endDate}
                                  disabled={exp.isCurrent}
                                  onChange={e => setExp(exp.id, 'endDate', e.target.value)} />
                              </div>
                            </div>
                            <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer select-none">
                              <input type="checkbox" checked={exp.isCurrent} className="accent-[#1a7d4e]"
                                onChange={e => setExp(exp.id, 'isCurrent', e.target.checked)} />
                              Currently working here
                            </label>
                            <textarea className={`${inp} resize-none`} rows={3}
                              value={exp.description}
                              onChange={e => setExp(exp.id, 'description', e.target.value)}
                              placeholder="Describe your responsibilities and achievements…" />
                          </div>
                        ))}
                        <button onClick={addExp}
                          className="w-full py-2.5 border-2 border-dashed border-gray-300 rounded-xl text-sm text-gray-500 hover:border-[#1a7d4e] hover:text-[#1a7d4e] flex items-center justify-center gap-1.5 transition-colors">
                          <Plus className="h-4 w-4" /> Add work experience
                        </button>
                      </>
                    )}

                    {/* ── EDUCATION ── */}
                    {sId === 'education' && (
                      <>
                        {resume.education.map((edu, i) => (
                          <div key={edu.id} className="border border-gray-200 rounded-xl p-3 space-y-2.5">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Education {i + 1}</span>
                              <button onClick={() => removeEdu(edu.id)} className="text-gray-400 hover:text-red-500">
                                <X className="h-3.5 w-3.5" />
                              </button>
                            </div>
                            <input className={inp} value={edu.degree}
                              onChange={e => setEdu(edu.id, 'degree', e.target.value)} placeholder="Degree (e.g. B.Tech, MBA)" />
                            <input className={inp} value={edu.institution}
                              onChange={e => setEdu(edu.id, 'institution', e.target.value)} placeholder="University / Institution" />
                            <input className={inp} value={edu.field}
                              onChange={e => setEdu(edu.id, 'field', e.target.value)} placeholder="Field of Study" />
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <Lbl text="Start Year" />
                                <input type="number" className={inp} value={edu.startYear}
                                  onChange={e => setEdu(edu.id, 'startYear', e.target.value)} placeholder="2019" />
                              </div>
                              <div>
                                <Lbl text="End Year" />
                                <input type="number" className={inp} value={edu.endYear}
                                  onChange={e => setEdu(edu.id, 'endYear', e.target.value)} placeholder="2023" />
                              </div>
                            </div>
                          </div>
                        ))}
                        <button onClick={addEdu}
                          className="w-full py-2.5 border-2 border-dashed border-gray-300 rounded-xl text-sm text-gray-500 hover:border-[#1a7d4e] hover:text-[#1a7d4e] flex items-center justify-center gap-1.5 transition-colors">
                          <Plus className="h-4 w-4" /> Add education
                        </button>
                      </>
                    )}

                    {/* ── SKILLS ── */}
                    {sId === 'skills' && (
                      <>
                        <div className="flex gap-2">
                          <input className={`${inp} flex-1`} value={skillInput}
                            onChange={e => setSkillInput(e.target.value)}
                            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }}
                            placeholder="Type a skill and press Enter or click Add" />
                          <button type="button" onClick={addSkill} disabled={!skillInput.trim()}
                            className="px-3 py-2 border border-[#1a7d4e] text-[#1a7d4e] rounded-lg text-sm font-medium hover:bg-[#f0fdf4] disabled:opacity-40 flex-shrink-0">
                            + Add
                          </button>
                        </div>
                        {resume.skills.length > 0 ? (
                          <div className="flex flex-wrap gap-1.5">
                            {resume.skills.map(s => (
                              <span key={s} className="flex items-center gap-1 bg-[#e8f5ef] text-[#1a7d4e] text-xs px-2.5 py-1 rounded-full">
                                {s}
                                <button type="button" onClick={() => removeSkill(s)}>
                                  <X className="h-3 w-3" />
                                </button>
                              </span>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs text-gray-400">No skills added yet.</p>
                        )}
                      </>
                    )}

                    {/* ── LANGUAGES ── */}
                    {sId === 'languages' && (
                      <>
                        {(resume.languages ?? []).map(lang => (
                          <div key={lang.id} className="flex items-center justify-between gap-2 py-1">
                            <span className="text-sm text-gray-700 flex-1">
                              {lang.name}{lang.level ? ` — ${lang.level}` : ''}
                            </span>
                            <button onClick={() => removeLang(lang.id)} className="text-gray-400 hover:text-red-500 flex-shrink-0">
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ))}
                        <div className="flex gap-2">
                          <input className={`${inp} flex-1`} value={langInput.name}
                            onChange={e => setLangInput(p => ({ ...p, name: e.target.value }))}
                            onKeyDown={e => { if (e.key === 'Enter') addLang(); }}
                            placeholder="Language (e.g. English)" />
                          <select className={`${inp} w-32 flex-shrink-0`} value={langInput.level}
                            onChange={e => setLangInput(p => ({ ...p, level: e.target.value }))}>
                            <option value="">Level</option>
                            {['Native', 'Fluent', 'Professional', 'Conversational', 'Basic'].map(l => (
                              <option key={l} value={l}>{l}</option>
                            ))}
                          </select>
                          <button type="button" onClick={addLang} disabled={!langInput.name.trim()}
                            className="px-3 py-2 border border-[#1a7d4e] text-[#1a7d4e] rounded-lg text-sm font-medium hover:bg-[#f0fdf4] disabled:opacity-40 flex-shrink-0">
                            + Add
                          </button>
                        </div>
                      </>
                    )}

                  </div>
                )}
              </div>
            ))}

            {/* ── Activated optional sections ── */}
            {OPTIONAL_SECTIONS.filter(s => addedOptional.has(s.id)).map(({ id: sId, label, Icon }) => (
              <div key={sId} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <Icon className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-semibold text-gray-800">{label}</span>
                  </div>
                  <button
                    onClick={() => setAddedOptional(prev => { const n = new Set(prev); n.delete(sId); return n; })}
                    className="text-gray-400 hover:text-red-500">
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="px-4 pb-3 border-t border-gray-100 pt-2">
                  <p className="text-xs text-gray-400">This section will be customizable soon.</p>
                </div>
              </div>
            ))}

            {/* ── Add Other Sections grid ── */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center gap-2 mb-4">
                <Plus className="h-4 w-4 text-[#1a7d4e]" />
                <span className="text-sm font-semibold text-gray-800">Add Other sections</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {OPTIONAL_SECTIONS.filter(s => !addedOptional.has(s.id)).map(({ id: sId, label, Icon }) => (
                  <button
                    key={sId}
                    onClick={() => setAddedOptional(prev => { const n = new Set<string>(prev); n.add(sId); return n; })}
                    className="flex items-center gap-2 px-3 py-2.5 border border-gray-200 rounded-lg text-xs text-gray-600 hover:border-[#1a7d4e] hover:text-[#1a7d4e] hover:bg-[#f0fdf4] transition-colors text-left"
                  >
                    <Icon className="h-3.5 w-3.5 flex-shrink-0" />
                    <span className="truncate">{label}</span>
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* ━━ RIGHT PREVIEW ━━ */}
        <div className="hidden lg:flex flex-1 flex-col overflow-hidden bg-gray-100">
          <div className="flex-1 overflow-auto p-6 flex justify-center items-start">
            <div
              id="resume-print-target"
              className="shadow-lg border border-gray-200 bg-white"
              style={{ zoom: 0.6, width: '794px' }}
            >
              {/* Use resume.summary directly — it's kept in sync by onInput handler */}
              <ResumeDocument data={resume} />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
