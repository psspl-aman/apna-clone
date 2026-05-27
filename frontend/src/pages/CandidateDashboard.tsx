import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchFullProfile, updateProfile, uploadResume, addWorkExperience, updateWorkExperience, deleteWorkExperience, addEducation, updateEducation, deleteEducation, addCertification, updateCertification, deleteCertification } from '../features/candidates/candidateSlice';
import { Briefcase, MapPin, ChevronRight, Plus, Pencil, FileText, Trash2 } from 'lucide-react';
import { Modal } from '../components/Modal/Modal';
import toast from 'react-hot-toast';

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const formatDate = (d?: string) => {
  if (!d) return '';
  const date = new Date(d);
  const day = date.getDate();
  const suffix = day === 1 ? 'st' : day === 2 ? 'nd' : day === 3 ? 'rd' : 'th';
  return `${day}${suffix} ${monthNames[date.getMonth()]} ${date.getFullYear()}`;
};

const formatMonthYear = (d?: string) => {
  if (!d) return '';
  const date = new Date(d);
  return `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
};

const getCompletionColor = (pct: number) => {
  if (pct >= 70) return 'bg-green-500';
  if (pct >= 40) return 'bg-orange-500';
  return 'bg-red-500';
};

const initials = (name?: string) => {
  if (!name) return '?';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};

export const CandidateDashboard = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { profile, workExperiences, educations, certifications, profileCompletion, loading, uploadingResume } = useAppSelector((s) => s.candidates);
  const { user } = useAppSelector((s) => s.auth);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [editData, setEditData] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    dispatch(fetchFullProfile());
  }, [dispatch]);

  const openModal = (section: string, data?: any) => {
    setActiveSection(section);
    setEditData(data || null);
  };

  const closeModal = () => {
    setActiveSection(null);
    setEditData(null);
  };

  const dispatchAndToast = async (action: any, successMsg: string) => {
    const result = await dispatch(action);
    if (result.meta.requestStatus === 'fulfilled') {
      toast.success(successMsg);
      return true;
    } else {
      toast.error(typeof result.payload === 'string' ? result.payload : 'Something went wrong');
      return false;
    }
  };

  const handleSaveBasicInfo = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const data = Object.fromEntries(form.entries());
    const ok = await dispatchAndToast(updateProfile(data as any), 'Basic info updated');
    if (ok) closeModal();
  };

  const handleSaveSalary = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const salary = parseInt(form.get('currentSalary') as string) || 0;
    const ok = await dispatchAndToast(updateProfile({ currentSalary: salary } as any), 'Salary updated');
    if (ok) closeModal();
  };

  const handleSaveLanguages = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const items = form.querySelectorAll('.lang-item');
    const languages = Array.from(items).map((item: any) => ({
      name: item.querySelector('.lang-name')?.value || '',
      level: item.querySelector('.lang-level')?.value || 'Basic',
    }));
    const ok = await dispatchAndToast(updateProfile({ languages } as any), 'Languages updated');
    if (ok) closeModal();
  };

  const handleSaveSkills = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const input = e.currentTarget.querySelector('[name="skills"]') as HTMLInputElement;
    const skills = input.value.split(',').map(s => s.trim()).filter(Boolean);
    const ok = await dispatchAndToast(updateProfile({ skills } as any), 'Skills updated');
    if (ok) closeModal();
  };

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.name.match(/\.(pdf|doc|docx)$/)) {
      toast.error('Only PDF, DOC, DOCX files are allowed');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be under 5MB');
      return;
    }
    const ok = await dispatchAndToast(uploadResume(file), 'Resume uploaded');
    if (!ok) e.target.value = '';
  };

  const handleSaveWorkExp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const data: any = {
      jobTitle: form.get('jobTitle') as string,
      companyName: form.get('companyName') as string,
      industry: form.get('industry') as string,
      description: form.get('description') as string,
      isCurrent: form.get('isCurrent') === 'on',
      startDate: form.get('startDate') as string,
      endDate: form.get('endDate') as string || null,
    };
    const rolesStr = form.get('jobRoles') as string;
    data.jobRoles = rolesStr ? rolesStr.split(',').map(s => s.trim()).filter(Boolean) : [];
    const skillsStr = form.get('skills') as string;
    data.skills = skillsStr ? skillsStr.split(',').map(s => s.trim()).filter(Boolean) : [];

    let ok: boolean;
    if (editData?.id) {
      ok = await dispatchAndToast(updateWorkExperience({ id: editData.id, data }), 'Work experience updated');
    } else {
      ok = await dispatchAndToast(addWorkExperience(data), 'Work experience added');
    }
    if (ok) closeModal();
  };

  const handleDeleteWorkExp = async (id: string) => {
    if (window.confirm('Delete this work experience?')) {
      const ok = await dispatchAndToast(deleteWorkExperience(id), 'Work experience deleted');
    }
  };

  const handleSaveEducation = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const data: any = {
      degree: form.get('degree') as string,
      fieldOfStudy: form.get('fieldOfStudy') as string,
      institution: form.get('institution') as string,
      educationLevel: form.get('educationLevel') as string,
      batchYear: parseInt(form.get('batchYear') as string) || 0,
    };
    let ok: boolean;
    if (editData?.id) {
      ok = await dispatchAndToast(updateEducation({ id: editData.id, data }), 'Education updated');
    } else {
      ok = await dispatchAndToast(addEducation(data), 'Education added');
    }
    if (ok) closeModal();
  };

  const handleDeleteEducation = async (id: string) => {
    if (window.confirm('Delete this education?')) {
      await dispatchAndToast(deleteEducation(id), 'Education deleted');
    }
  };

  const handleSaveCert = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const data: any = {
      name: form.get('name') as string,
      issuingOrg: form.get('issuingOrg') as string,
      issueDate: form.get('issueDate') as string,
      credentialUrl: form.get('credentialUrl') as string,
    };
    const noExpiry = form.get('noExpiry') === 'on';
    if (!noExpiry) data.expiryDate = form.get('expiryDate') as string;

    let ok: boolean;
    if (editData?.id) {
      ok = await dispatchAndToast(updateCertification({ id: editData.id, data }), 'Certification updated');
    } else {
      ok = await dispatchAndToast(addCertification(data), 'Certification added');
    }
    if (ok) closeModal();
  };

  const handleDeleteCert = async (id: string) => {
    if (window.confirm('Delete this certification?')) {
      await dispatchAndToast(deleteCertification(id), 'Certification deleted');
    }
  };

  const infoRows = [
    { label: 'Email ID', value: user?.email },
    { label: 'Mobile Number', value: profile?.phone || 'Not added' },
    { label: 'Date of Birth', value: profile?.dateOfBirth ? formatDate(profile.dateOfBirth) : 'Not added' },
    { label: 'Gender', value: profile?.gender || 'Not added' },
    { label: 'Current Location', value: profile?.currentLocation || profile?.city || 'Not added' },
    { label: 'Home Town', value: profile?.homeTown || 'Not added' },
  ];

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* LEFT SIDEBAR */}
          <aside className="w-full lg:w-[340px] flex-shrink-0 space-y-4">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-purple-800 text-white font-bold text-xl flex items-center justify-center mb-3">
                  {initials(profile?.fullName)}
                </div>
                <h2 className="font-semibold text-gray-900 text-lg">{profile?.fullName || 'Candidate'}</h2>
                <p className="text-sm text-gray-500">Job Title • Company</p>
                <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {profile?.currentLocation || profile?.city || 'Location'}
                </div>
              </div>

              <div className="mt-4 pt-4 border-t grid grid-cols-2 gap-x-3 gap-y-3 text-sm">
                {infoRows.map((row) => (
                  <div key={row.label} className={row.label === 'Email ID' ? 'col-span-2' : ''}>
                    <p className="text-gray-400 text-xs">{row.label}</p>
                    <p className="text-gray-800 font-medium text-xs truncate">{row.value || '-'}</p>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">Profile Completion</span>
                  <span className="text-sm font-bold text-[#1a7d4e]">{profileCompletion}%</span>
                </div>
                <div className="bg-gray-200 rounded-full h-2.5">
                  <div className={`${getCompletionColor(profileCompletion)} h-2.5 rounded-full transition-all`} style={{ width: `${profileCompletion}%` }} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">My Activities</h3>
              <div
                onClick={() => navigate('/profile?tab=applications')}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
              >
                <Briefcase className="h-5 w-5 text-gray-400" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">My Applications</p>
                  <p className="text-xs text-gray-400">Check all your jobs applied and Interview Invites here</p>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          </aside>

          {/* RIGHT CONTENT */}
          <div className="flex-1 space-y-4">

            {/* WORK EXPERIENCE */}
            <section className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900">Work Experience</h3>
                <button onClick={() => openModal('workExp')} className="text-[#1a7d4e] font-medium text-sm flex items-center gap-1">
                  <Plus className="h-4 w-4" /> Add
                </button>
              </div>
              {workExperiences.length === 0 && (
                <p className="text-sm text-gray-400 py-2">No work experience added yet.</p>
              )}
              {workExperiences.map((exp) => (
                <div key={exp.id} className="border rounded-lg p-4 mb-3 relative group">
                  <button onClick={() => handleDeleteWorkExp(exp.id)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition">
                    <Trash2 className="h-4 w-4" />
                  </button>
                  <div className="flex gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center text-gray-500 font-bold text-sm flex-shrink-0">
                      {initials(exp.companyName)}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{exp.jobTitle}</h4>
                      <p className="text-sm text-gray-600">{exp.companyName}</p>
                      {exp.jobRoles?.length > 0 && (
                        <p className="text-xs text-gray-500 mt-1">Job Roles: {exp.jobRoles.join(', ')}</p>
                      )}
                      {exp.industry && <p className="text-xs text-gray-500">Industry: {exp.industry}</p>}
                      {exp.description && <p className="text-xs text-gray-500 mt-1">{exp.description}</p>}
                      {exp.skills?.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {exp.skills.map(s => <span key={s} className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded">{s}</span>)}
                        </div>
                      )}
                      <p className="text-xs text-gray-400 mt-2">
                        {exp.startDate ? formatMonthYear(exp.startDate) : ''} - {exp.isCurrent ? 'Present' : exp.endDate ? formatMonthYear(exp.endDate) : ''}
                      </p>
                    </div>
                    <button onClick={() => openModal('workExp', exp)} className="text-[#1a7d4e] text-sm flex items-center gap-1 self-start">
                      <Pencil className="h-3.5 w-3.5" /> Edit
                    </button>
                  </div>
                </div>
              ))}
              <div className="border-t pt-3 space-y-2 mt-3">
                <div onClick={() => openModal('totalExperience')} className="flex items-center justify-between py-2 cursor-pointer hover:bg-gray-50 rounded px-2">
                  <span className="text-sm text-gray-700">Total Years of Experience:</span>
                  <span className="text-sm text-gray-900 font-medium flex items-center gap-1">{profile?.totalExperience || 0} years <ChevronRight className="h-4 w-4 text-gray-400" /></span>
                </div>
                <div onClick={() => openModal('salary')} className="flex items-center justify-between py-2 cursor-pointer hover:bg-gray-50 rounded px-2">
                  <div>
                    <span className="text-sm text-gray-700">Current Monthly Salary:</span>
                    <p className="text-xs text-gray-400">Only visible to HRs</p>
                  </div>
                  <span className="text-sm text-gray-900 font-medium flex items-center gap-1">
                    {profile?.currentSalary ? `₹ ${profile.currentSalary.toLocaleString()}` : 'Not added'}
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </span>
                </div>
              </div>
            </section>

            {/* EDUCATION */}
            <section className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900">Education</h3>
                <button onClick={() => openModal('education')} className="text-[#1a7d4e] font-medium text-sm flex items-center gap-1">
                  <Plus className="h-4 w-4" /> Add
                </button>
              </div>
              <div onClick={() => openModal('highestEducation')} className="flex items-center justify-between py-2 border-b cursor-pointer hover:bg-gray-50 rounded px-2">
                <span className="text-sm text-gray-700">Highest education:</span>
                <span className="text-sm text-gray-900 font-medium flex items-center gap-1">{profile?.highestEducation || 'Not set'} <ChevronRight className="h-4 w-4 text-gray-400" /></span>
              </div>
              <div onClick={() => openModal('schoolMedium')} className="flex items-center justify-between py-2 border-b cursor-pointer hover:bg-gray-50 rounded px-2">
                <span className="text-sm text-gray-700">School medium:</span>
                <span className="text-sm text-gray-900 font-medium flex items-center gap-1">{profile?.schoolMedium || 'Not set'} <ChevronRight className="h-4 w-4 text-gray-400" /></span>
              </div>
              {educations.length === 0 && (
                <p className="text-sm text-gray-400 py-2">No education added yet.</p>
              )}
              {educations.map((edu) => (
                <div key={edu.id} className="flex items-start gap-3 border rounded-lg p-4 mt-2 relative group">
                  <button onClick={() => handleDeleteEducation(edu.id)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition">
                    <Trash2 className="h-4 w-4" />
                  </button>
                  <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center flex-shrink-0">
                    <FileText className="h-5 w-5 text-gray-500" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{edu.degree}{edu.fieldOfStudy ? `, ${edu.fieldOfStudy}` : ''}</h4>
                    <p className="text-sm text-gray-600">{edu.institution}{edu.educationLevel ? ` • ${edu.educationLevel}` : ''}</p>
                    {edu.batchYear && <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded mt-1">Batch of {edu.batchYear}</span>}
                  </div>
                  <button onClick={() => openModal('education', edu)} className="text-[#1a7d4e] text-sm flex items-center gap-1 self-start">
                    <Pencil className="h-3.5 w-3.5" /> Edit
                  </button>
                </div>
              ))}
            </section>

            {/* SKILLS */}
            <section className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900">Skills</h3>
                <button onClick={() => openModal('skills')} className="text-[#1a7d4e] font-medium text-sm flex items-center gap-1">
                  <Pencil className="h-3.5 w-3.5" /> Edit
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {profile?.skills?.map((skill) => (
                  <span key={skill} className="bg-gray-100 text-gray-700 rounded px-3 py-1 text-sm">{skill}</span>
                ))}
                {(!profile?.skills || profile.skills.length === 0) && (
                  <p className="text-sm text-gray-400">No skills added yet.</p>
                )}
              </div>
            </section>

            {/* CERTIFICATIONS */}
            <section className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900">Certifications</h3>
                <button onClick={() => openModal('certification')} className="text-[#1a7d4e] font-medium text-sm flex items-center gap-1">
                  <Plus className="h-4 w-4" /> Add
                </button>
              </div>
              {certifications.length === 0 && (
                <p className="text-sm text-gray-400">No certification added</p>
              )}
              {certifications.map((cert) => (
                <div key={cert.id} className="flex items-start gap-3 border rounded-lg p-4 mt-2 relative group">
                  <button onClick={() => handleDeleteCert(cert.id)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition">
                    <Trash2 className="h-4 w-4" />
                  </button>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{cert.name}</h4>
                    <p className="text-sm text-gray-600">{cert.issuingOrg}</p>
                    <p className="text-xs text-gray-400">
                      {cert.issueDate ? `Issued: ${formatDate(cert.issueDate)}` : ''}
                      {cert.expiryDate ? ` • Expires: ${formatDate(cert.expiryDate)}` : ''}
                    </p>
                    {cert.credentialUrl && <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-[#1a7d4e] hover:underline">View credential</a>}
                  </div>
                  <button onClick={() => openModal('certification', cert)} className="text-[#1a7d4e] text-sm flex items-center gap-1 self-start">
                    <Pencil className="h-3.5 w-3.5" /> Edit
                  </button>
                </div>
              ))}
            </section>

            {/* LANGUAGES */}
            <section className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900">Languages Known</h3>
                <button onClick={() => openModal('languages')} className="text-[#1a7d4e] font-medium text-sm flex items-center gap-1">
                  <Pencil className="h-3.5 w-3.5" /> Edit
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {profile?.languages?.map((lang, i) => (
                  <span key={i} className="bg-gray-100 text-gray-700 rounded px-3 py-1 text-sm flex items-center gap-1.5">
                    {lang.name}
                    {lang.level && (
                      <span className={`inline-block w-2 h-2 rounded-full ${lang.level === 'Basic' ? 'bg-gray-400' : lang.level === 'Medium' ? 'bg-blue-500' : 'bg-green-500'}`} />
                    )}
                    {lang.level}
                  </span>
                ))}
                {(!profile?.languages || profile.languages.length === 0) && (
                  <p className="text-sm text-gray-400">No languages added</p>
                )}
              </div>
            </section>

            {/* SPOKEN ENGLISH */}
            <section className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="text-lg font-semibold text-gray-900">Spoken English</h3>
              <p className="text-xs text-gray-400 mb-2">Only visible to HRs</p>
              <p className="text-sm text-gray-600 mb-3">{profile?.spokenEnglishLevel || 'Not verified yet'}</p>
              <button className="w-full border border-[#1a7d4e] text-[#1a7d4e] rounded-lg py-2 text-sm font-medium hover:bg-green-50">+ Verify now</button>
            </section>

            {/* RESUME */}
            <section className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="text-lg font-semibold text-gray-900">Resume</h3>
              <p className="text-xs text-gray-400 mb-3">Only visible to HRs</p>
              {profile?.resumeUrl ? (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <FileText className="h-8 w-8 text-red-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{profile.resumeFileName || 'Resume'}</p>
                    {profile.resumeUpdatedAt && <p className="text-xs text-gray-400">Last updated {formatDate(profile.resumeUpdatedAt)}</p>}
                  </div>
                  <button onClick={() => fileInputRef.current?.click()} className="text-[#1a7d4e] text-sm flex items-center gap-1">
                    <Pencil className="h-3.5 w-3.5" /> Edit
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-[#1a7d4e]"
                >
                  <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Upload your resume (PDF, DOC, DOCX, max 5MB)</p>
                  {uploadingResume && <p className="text-xs text-[#1a7d4e] mt-1">Uploading...</p>}
                </div>
              )}
              <input ref={fileInputRef} type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={handleResumeUpload} />
            </section>

            {/* OTHER DETAILS */}
            <section className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Other Details</h3>
              <p className="text-xs text-gray-400 mb-3">Only visible to HRs</p>
              <div onClick={() => openModal('preferredJobs')} className="flex items-center justify-between py-3 border-b cursor-pointer hover:bg-gray-50 rounded px-2">
                <span className="text-sm text-gray-700">Preferred job title/role</span>
                <span className="text-sm text-gray-900 font-medium flex items-center gap-1">
                  {profile?.preferredJobTitles?.length ? profile.preferredJobTitles.join(', ') : 'Not set'}
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </span>
              </div>
              <div onClick={() => openModal('preferredLocations')} className="flex items-center justify-between py-3 border-b cursor-pointer hover:bg-gray-50 rounded px-2">
                <span className="text-sm text-gray-700">Location</span>
                <span className="text-sm text-gray-900 font-medium flex items-center gap-1">
                  {profile?.preferredLocations?.length ? profile.preferredLocations.join(', ') : 'Add Hometown • Current location • Preferred location'}
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </span>
              </div>
              <div className="flex items-center justify-between py-3 border-b px-2">
                <div>
                  <span className="text-sm text-gray-700">Job preference</span>
                  <p className="text-xs text-gray-400">No job preferences added. Add details...</p>
                </div>
                <button className="text-[#1a7d4e] text-sm font-medium">+ Add job preference</button>
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* MODALS */}

      <Modal isOpen={activeSection === 'basicInfo'} onClose={closeModal} title="Edit Basic Info">
        <form onSubmit={handleSaveBasicInfo} className="space-y-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label><input name="fullName" defaultValue={profile?.fullName} className="w-full border rounded-lg px-3 py-2 text-sm" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label><input name="dateOfBirth" type="date" defaultValue={profile?.dateOfBirth} className="w-full border rounded-lg px-3 py-2 text-sm" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
            <div className="flex gap-4"><label className="flex items-center gap-1.5 text-sm"><input type="radio" name="gender" value="Male" defaultChecked={profile?.gender === 'Male'} /> Male</label><label className="flex items-center gap-1.5 text-sm"><input type="radio" name="gender" value="Female" defaultChecked={profile?.gender === 'Female'} /> Female</label><label className="flex items-center gap-1.5 text-sm"><input type="radio" name="gender" value="Other" defaultChecked={profile?.gender === 'Other'} /> Other</label></div>
          </div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Current Location</label><input name="currentLocation" defaultValue={profile?.currentLocation || profile?.city} className="w-full border rounded-lg px-3 py-2 text-sm" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Home Town</label><input name="homeTown" defaultValue={profile?.homeTown} className="w-full border rounded-lg px-3 py-2 text-sm" /></div>
          <button type="submit" className="w-full bg-[#1a7d4e] text-white rounded-lg py-2 text-sm font-medium hover:bg-[#166534]">Save</button>
        </form>
      </Modal>

      <Modal isOpen={activeSection === 'salary'} onClose={closeModal} title="Current Monthly Salary">
        <form onSubmit={handleSaveSalary} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Salary (₹)</label>
            <input name="currentSalary" type="number" min="0" defaultValue={profile?.currentSalary || ''} className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="e.g. 41666" />
            <p className="text-xs text-gray-400 mt-1">Only visible to HRs</p>
          </div>
          <button type="submit" className="w-full bg-[#1a7d4e] text-white rounded-lg py-2 text-sm font-medium hover:bg-[#166534]">Save</button>
        </form>
      </Modal>

      <Modal isOpen={activeSection === 'workExp'} onClose={closeModal} title={editData?.id ? 'Edit Work Experience' : 'Add Work Experience'}>
        <form onSubmit={handleSaveWorkExp} className="space-y-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Job Title *</label><input name="jobTitle" defaultValue={editData?.jobTitle || ''} required className="w-full border rounded-lg px-3 py-2 text-sm" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Company Name *</label><input name="companyName" defaultValue={editData?.companyName || ''} required className="w-full border rounded-lg px-3 py-2 text-sm" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Industry</label><input name="industry" defaultValue={editData?.industry || ''} className="w-full border rounded-lg px-3 py-2 text-sm" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Job Roles (comma separated)</label><input name="jobRoles" defaultValue={editData?.jobRoles?.join(', ') || ''} className="w-full border rounded-lg px-3 py-2 text-sm" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Skills (comma separated)</label><input name="skills" defaultValue={editData?.skills?.join(', ') || ''} className="w-full border rounded-lg px-3 py-2 text-sm" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Description</label><textarea name="description" defaultValue={editData?.description || ''} rows={3} className="w-full border rounded-lg px-3 py-2 text-sm" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label><input name="startDate" type="date" defaultValue={editData?.startDate || ''} className="w-full border rounded-lg px-3 py-2 text-sm" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">End Date</label><input name="endDate" type="date" defaultValue={editData?.endDate || ''} className="w-full border rounded-lg px-3 py-2 text-sm" /></div>
          </div>
          <label className="flex items-center gap-2 text-sm"><input name="isCurrent" type="checkbox" defaultChecked={editData?.isCurrent || false} /> I currently work here</label>
          <button type="submit" className="w-full bg-[#1a7d4e] text-white rounded-lg py-2 text-sm font-medium hover:bg-[#166534]">{editData?.id ? 'Update' : 'Add'}</button>
        </form>
      </Modal>

      <Modal isOpen={activeSection === 'education'} onClose={closeModal} title={editData?.id ? 'Edit Education' : 'Add Education'}>
        <form onSubmit={handleSaveEducation} className="space-y-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Degree</label><input name="degree" defaultValue={editData?.degree || ''} className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="e.g. Master of Computer Management" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Field of Study</label><input name="fieldOfStudy" defaultValue={editData?.fieldOfStudy || ''} className="w-full border rounded-lg px-3 py-2 text-sm" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Institution</label><input name="institution" defaultValue={editData?.institution || ''} className="w-full border rounded-lg px-3 py-2 text-sm" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Education Level</label>
            <select name="educationLevel" defaultValue={editData?.educationLevel || ''} className="w-full border rounded-lg px-3 py-2 text-sm">
              <option value="">Select...</option><option value="10th">10th</option><option value="12th">12th</option><option value="graduate">Graduate</option><option value="post_graduate">Post Graduate</option>
            </select>
          </div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Batch Year</label><input name="batchYear" type="number" min="1900" max="2030" defaultValue={editData?.batchYear || ''} className="w-full border rounded-lg px-3 py-2 text-sm" /></div>
          <button type="submit" className="w-full bg-[#1a7d4e] text-white rounded-lg py-2 text-sm font-medium hover:bg-[#166534]">{editData?.id ? 'Update' : 'Add'}</button>
        </form>
      </Modal>

      <Modal isOpen={activeSection === 'skills'} onClose={closeModal} title="Edit Skills">
        <form onSubmit={handleSaveSkills} className="space-y-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Skills (comma separated)</label>
            <input name="skills" defaultValue={profile?.skills?.join(', ') || ''} className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="e.g. JavaScript, React, Node.js" /></div>
          <button type="submit" className="w-full bg-[#1a7d4e] text-white rounded-lg py-2 text-sm font-medium hover:bg-[#166534]">Save</button>
        </form>
      </Modal>

      <Modal isOpen={activeSection === 'languages'} onClose={closeModal} title="Edit Languages">
        <form onSubmit={handleSaveLanguages} className="space-y-4">
          {profile?.languages?.map((lang, i) => (
            <div key={i} className="lang-item flex gap-2 items-start">
              <input className="lang-name border rounded px-3 py-2 text-sm flex-1" defaultValue={lang.name} placeholder="Language" />
              <select className="lang-level border rounded px-3 py-2 text-sm" defaultValue={lang.level}>
                <option value="Basic">Basic</option><option value="Medium">Medium</option><option value="Fluent">Fluent</option>
              </select>
            </div>
          ))}
          <button type="button" onClick={() => {
            const container = document.querySelector('[data-lang-container]');
            const div = document.createElement('div');
            div.className = 'lang-item flex gap-2 items-start';
            div.innerHTML = '<input class="lang-name border rounded px-3 py-2 text-sm flex-1" placeholder="Language" /><select class="lang-level border rounded px-3 py-2 text-sm"><option value="Basic">Basic</option><option value="Medium">Medium</option><option value="Fluent">Fluent</option></select>';
            container?.appendChild(div);
          }} className="text-[#1a7d4e] text-sm font-medium">+ Add Language</button>
          <div data-lang-container />
          <button type="submit" className="w-full bg-[#1a7d4e] text-white rounded-lg py-2 text-sm font-medium hover:bg-[#166534]">Save</button>
        </form>
      </Modal>

      <Modal isOpen={activeSection === 'certification'} onClose={closeModal} title={editData?.id ? 'Edit Certification' : 'Add Certification'}>
        <form onSubmit={handleSaveCert} className="space-y-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Certificate Name *</label><input name="name" defaultValue={editData?.name || ''} required className="w-full border rounded-lg px-3 py-2 text-sm" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Issuing Organization</label><input name="issuingOrg" defaultValue={editData?.issuingOrg || ''} className="w-full border rounded-lg px-3 py-2 text-sm" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Issue Date</label><input name="issueDate" type="date" defaultValue={editData?.issueDate || ''} className="w-full border rounded-lg px-3 py-2 text-sm" /></div>
          <div><label className="flex items-center gap-2 text-sm"><input name="noExpiry" type="checkbox" /> Does not expire</label></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label><input name="expiryDate" type="date" defaultValue={editData?.expiryDate || ''} className="w-full border rounded-lg px-3 py-2 text-sm" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Credential URL</label><input name="credentialUrl" defaultValue={editData?.credentialUrl || ''} className="w-full border rounded-lg px-3 py-2 text-sm" /></div>
          <button type="submit" className="w-full bg-[#1a7d4e] text-white rounded-lg py-2 text-sm font-medium hover:bg-[#166534]">{editData?.id ? 'Update' : 'Add'}</button>
        </form>
      </Modal>
    </div>
  );
};
