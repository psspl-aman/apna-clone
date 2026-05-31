import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Plus, MoreVertical, FileText, Edit2, Trash2 } from 'lucide-react';

/* ═══════════════════════════════════════════════════════════
   SHARED TYPES
═══════════════════════════════════════════════════════════ */
export interface ResumePersonal {
  fullName: string;
  email: string;
  phone: string;
  title: string;                             // document type: "Curriculum Vitae"
  city?: string;
  experienceLevel?: 'fresher' | 'experience';
  preferredTitle?: string;                   // job title: "Full-stack Developer"
}

export interface ResumeLanguage {
  id: string;
  name: string;
  level: string;
}

export interface ResumeExpItem {
  id: string;
  company: string;
  role: string;
  startDate: string;   // "YYYY-MM"
  endDate: string;     // "YYYY-MM"
  isCurrent: boolean;
  description: string;
}

export interface ResumeEduItem {
  id: string;
  degree: string;
  institution: string;
  field: string;
  startYear: string;
  endYear: string;
}

export interface ResumeData {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  personal: ResumePersonal;
  summary: string;
  experience: ResumeExpItem[];
  education: ResumeEduItem[];
  skills: string[];
  languages?: ResumeLanguage[];
}

/* ═══════════════════════════════════════════════════════════
   LOCALSTORAGE HELPERS
═══════════════════════════════════════════════════════════ */
const STORAGE_KEY = 'apna_career_resumes';

export const getStoredResumes = (): ResumeData[] => {
  try {
    const raw: any[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    // Migrate older records that may be missing new fields
    return raw.map(r => ({
      languages: [],
      ...r,
      personal: {
        city: '',
        experienceLevel: 'experience' as const,
        preferredTitle: '',
        ...r.personal,
      },
    }));
  } catch { return []; }
};

export const saveStoredResumes = (list: ResumeData[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
};

/* ═══════════════════════════════════════════════════════════
   RESUME DOCUMENT  (shared between card preview & full preview)
═══════════════════════════════════════════════════════════ */
const G = '#1a7d4e';

const fmtMonth = (ym?: string) => {
  if (!ym) return '';
  try {
    const [y, m] = ym.split('-');
    return new Date(Number(y), Number(m) - 1).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
  } catch { return ym; }
};

export const ResumeDocument = ({ data }: { data: ResumeData }) => (
  <div className="bg-white font-sans text-gray-800 px-10 py-8" style={{ width: '794px', minHeight: '1100px' }}>
    {/* Header */}
    <div className="flex justify-between items-start mb-3">
      <div>
        <h1 className="text-[22px] font-bold text-gray-900 leading-tight">
          {data.personal.fullName || 'Your Name'}
        </h1>
        <p className="text-sm text-gray-500 italic">{data.personal.title || 'Curriculum Vitae'}</p>
      </div>
      <div className="text-right text-xs text-gray-500 mt-1 space-y-0.5">
        {data.personal.email && <p>{data.personal.email}</p>}
        {data.personal.phone && <p>{data.personal.phone}</p>}
      </div>
    </div>
    <div className="mb-5 border-t-2" style={{ borderColor: G }} />

    {/* Summary */}
    {data.summary && (
      <section className="mb-5">
        <h2 className="text-sm font-bold mb-0.5" style={{ color: G }}>Summary</h2>
        <div className="mb-2 border-t" style={{ borderColor: G }} />
        <p className="text-xs leading-relaxed text-gray-700">{data.summary}</p>
      </section>
    )}

    {/* Experience */}
    {data.experience.length > 0 && (
      <section className="mb-5">
        <h2 className="text-sm font-bold mb-0.5" style={{ color: G }}>Experience</h2>
        <div className="mb-2 border-t" style={{ borderColor: G }} />
        {data.experience.map(exp => (
          <div key={exp.id} className="flex gap-5 mb-3">
            <div className="text-[10px] text-gray-400 w-20 flex-shrink-0 pt-0.5 space-y-0.5">
              <p>{fmtMonth(exp.startDate)}</p>
              <p>{exp.isCurrent ? 'Ongoing' : fmtMonth(exp.endDate)}</p>
            </div>
            <div className="flex-1">
              <p className="text-xs font-semibold text-gray-900">
                {exp.role}{exp.company ? ` - ${exp.company}` : ''}
              </p>
              {exp.description && (
                <p className="text-[11px] text-gray-600 mt-0.5 leading-relaxed">{exp.description}</p>
              )}
            </div>
          </div>
        ))}
      </section>
    )}

    {/* Education */}
    {data.education.length > 0 && (
      <section className="mb-5">
        <h2 className="text-sm font-bold mb-0.5" style={{ color: G }}>Education</h2>
        <div className="mb-2 border-t" style={{ borderColor: G }} />
        {data.education.map(edu => (
          <div key={edu.id} className="flex gap-5 mb-3">
            <div className="text-[10px] text-gray-400 w-20 flex-shrink-0 pt-0.5">
              {edu.endYear && <p>to {edu.endYear}</p>}
            </div>
            <div className="flex-1">
              <p className="text-xs font-semibold text-gray-900">{edu.degree}</p>
              {edu.institution && <p className="text-xs text-gray-700">{edu.institution}</p>}
              {edu.field && <p className="text-[11px] text-gray-500">{edu.field}</p>}
            </div>
          </div>
        ))}
      </section>
    )}

    {/* Skills */}
    {data.skills.length > 0 && (
      <section className="mb-5">
        <h2 className="text-sm font-bold mb-0.5" style={{ color: G }}>Skills</h2>
        <div className="mb-2 border-t" style={{ borderColor: G }} />
        <ul className="list-disc list-inside space-y-0.5">
          {data.skills.map(s => (
            <li key={s} className="text-xs text-gray-700">{s}</li>
          ))}
        </ul>
      </section>
    )}

    {/* Languages */}
    {(data.languages ?? []).length > 0 && (
      <section className="mb-5">
        <h2 className="text-sm font-bold mb-0.5" style={{ color: G }}>Languages</h2>
        <div className="mb-2 border-t" style={{ borderColor: G }} />
        <ul className="list-disc list-inside space-y-0.5">
          {(data.languages ?? []).map(lang => (
            <li key={lang.id} className="text-xs text-gray-700">
              {lang.name}{lang.level ? ` - ${lang.level}` : ''}
            </li>
          ))}
        </ul>
      </section>
    )}
  </div>
);

/* ─── Scaled-down card version ─── */
export const ResumePreviewCard = ({ data }: { data: ResumeData }) => (
  <div className="overflow-hidden w-full bg-white" style={{ height: '250px' }}>
    {/* scale(0.32) → visual width = 794*0.32 ≈ 254px; layout width stays 794px so clip with overflow:hidden */}
    <div style={{ transform: 'scale(0.32)', transformOrigin: 'top left', width: '794px' }}>
      <ResumeDocument data={data} />
    </div>
  </div>
);

/* ═══════════════════════════════════════════════════════════
   CAREER COMPASS PAGE
═══════════════════════════════════════════════════════════ */
export const CareerCompassPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [tab, setTab] = useState<'resumes' | 'cover-letters'>(
    searchParams.get('tab') === 'cover-letters' ? 'cover-letters' : 'resumes',
  );
  const [resumes, setResumes] = useState<ResumeData[]>([]);
  const [createOpen, setCreateOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [renaming, setRenaming] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const createRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setResumes(getStoredResumes());
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (createRef.current && !createRef.current.contains(e.target as Node)) setCreateOpen(false);
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpenMenu(null);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleDelete = (id: string) => {
    if (!window.confirm('Delete this resume?')) return;
    const updated = resumes.filter(r => r.id !== id);
    saveStoredResumes(updated);
    setResumes(updated);
    setOpenMenu(null);
  };

  const handleRenameSubmit = (id: string) => {
    const name = renameValue.trim();
    if (!name) { setRenaming(null); return; }
    const updated = resumes.map(r =>
      r.id === id ? { ...r, name, updatedAt: new Date().toISOString() } : r,
    );
    saveStoredResumes(updated);
    setResumes(updated);
    setRenaming(null);
    setRenameValue('');
  };

  const startRename = (resume: ResumeData) => {
    setRenaming(resume.id);
    setRenameValue(resume.name);
    setOpenMenu(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Career Compass</h1>
        <div className="relative" ref={createRef}>
          <button
            onClick={() => setCreateOpen(o => !o)}
            className="flex items-center gap-2 px-4 py-2.5 text-white text-sm font-semibold rounded-lg"
            style={{ backgroundColor: G }}
          >
            <Plus className="h-4 w-4" /> Create new
          </button>
          {createOpen && (
            <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-xl border z-50 py-1">
              <button
                onClick={() => { navigate('/career-compass/new'); setCreateOpen(false); }}
                className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
              >
                <FileText className="h-4 w-4 text-gray-400" /> Resume
              </button>
              <button
                onClick={() => { setTab('cover-letters'); setCreateOpen(false); }}
                className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
              >
                <Edit2 className="h-4 w-4 text-gray-400" /> Cover letter
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-8">
        {([{ id: 'resumes', label: 'Resumes' }, { id: 'cover-letters', label: 'Cover Letters' }] as const).map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-1 mr-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              tab === t.id
                ? 'border-[#1a7d4e] text-[#1a7d4e]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Resumes tab ── */}
      {tab === 'resumes' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5" ref={menuRef}>

          {/* New Resume card */}
          <button
            onClick={() => navigate('/career-compass/new')}
            className="border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center py-10 px-4 hover:border-[#1a7d4e] hover:bg-[#f0fdf4] transition-colors text-center group"
            style={{ minHeight: '295px' }}
          >
            <div className="h-14 w-14 rounded-full bg-gray-200 group-hover:bg-[#1a7d4e] flex items-center justify-center mb-3 transition-colors">
              <Plus className="h-6 w-6 text-gray-500 group-hover:text-white" />
            </div>
            <p className="text-sm font-bold text-gray-900 mb-1">New Resume</p>
            <p className="text-xs text-gray-500 leading-relaxed">
              Create a new resume from scratch or pre-fill with your apna profile
            </p>
          </button>

          {/* Existing resume cards */}
          {resumes.map(resume => (
            <div key={resume.id} className="rounded-xl border border-gray-200 overflow-hidden flex flex-col shadow-sm hover:shadow-md transition-shadow">
              {/* Mini preview — clickable to edit */}
              <div
                className="flex-1 cursor-pointer overflow-hidden"
                onClick={() => navigate(`/career-compass/edit/${resume.id}`)}
              >
                <ResumePreviewCard data={resume} />
              </div>

              {/* Footer */}
              <div className="px-3 py-2.5 border-t bg-white flex items-center justify-between gap-2 flex-shrink-0">
                <div className="min-w-0 flex-1">
                  {renaming === resume.id ? (
                    <input
                      autoFocus
                      value={renameValue}
                      onChange={e => setRenameValue(e.target.value)}
                      onBlur={() => handleRenameSubmit(resume.id)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') handleRenameSubmit(resume.id);
                        if (e.key === 'Escape') setRenaming(null);
                      }}
                      className="text-sm font-semibold text-gray-900 border-b border-[#1a7d4e] focus:outline-none w-full bg-transparent"
                    />
                  ) : (
                    <p className="text-sm font-semibold text-gray-900 truncate">{resume.name}</p>
                  )}
                  <p className="text-xs text-gray-400 mt-0.5">
                    Updated on{' '}
                    {new Date(resume.updatedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </p>
                </div>

                <div className="relative flex-shrink-0">
                  <button
                    onClick={() => setOpenMenu(openMenu === resume.id ? null : resume.id)}
                    className="p-1.5 rounded hover:bg-gray-100 text-gray-500"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </button>
                  {openMenu === resume.id && (
                    <div className="absolute right-0 bottom-full mb-1 w-40 bg-white rounded-xl shadow-xl border z-50 py-1">
                      <button
                        onClick={() => { navigate(`/career-compass/edit/${resume.id}`); setOpenMenu(null); }}
                        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <Edit2 className="h-3.5 w-3.5" /> Edit
                      </button>
                      <button
                        onClick={() => startRename(resume)}
                        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <FileText className="h-3.5 w-3.5" /> Rename
                      </button>
                      <button
                        onClick={() => handleDelete(resume.id)}
                        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-3.5 w-3.5" /> Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Cover Letters tab ── */}
      {tab === 'cover-letters' && (
        <div className="bg-white rounded-xl border p-16 text-center">
          <Edit2 className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-700 font-medium mb-1">Cover letter builder</p>
          <p className="text-gray-400 text-sm">Coming soon. Stay tuned!</p>
        </div>
      )}
    </div>
  );
};
