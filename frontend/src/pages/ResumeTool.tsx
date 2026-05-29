import { Link } from 'react-router-dom';
import { CheckCircle, Phone, Tag, BarChart2 } from 'lucide-react';

const templates = [
  { name: 'Professional', color: 'from-blue-700 to-blue-900', text: 'text-blue-100' },
  { name: 'Modern', color: 'from-green-600 to-emerald-800', text: 'text-green-100' },
  { name: 'Simple', color: 'from-gray-400 to-gray-600', text: 'text-gray-100' },
  { name: 'Creative', color: 'from-purple-600 to-purple-900', text: 'text-purple-100' },
];

const resumeTips = [
  { title: 'Keep it to 1 page', desc: 'Recruiters spend an average of 6 seconds on a resume. Make every word count.' },
  { title: 'Use action verbs', desc: 'Start bullet points with strong verbs like "Led", "Built", "Grew", or "Reduced".' },
  { title: 'Quantify achievements', desc: 'Numbers make impact tangible. e.g. "Increased sales by 35%" beats "Improved sales".' },
  { title: 'Tailor to each job', desc: 'Customise your resume for every application to match the job description.' },
  { title: 'Include keywords', desc: 'Many companies use ATS software. Match keywords from the job description.' },
  { title: 'Proofread carefully', desc: 'A single typo can cost you the interview. Read it twice and have someone else check it.' },
];

const employerLooks = [
  { icon: Phone, title: 'Clear contact info', desc: 'Name, email, phone number, and LinkedIn URL — front and centre.' },
  { icon: Tag, title: 'Relevant skills', desc: 'Skills that directly match the job requirements and industry standards.' },
  { icon: BarChart2, title: 'Quantified results', desc: 'Concrete numbers and outcomes that demonstrate your real-world impact.' },
];

export const ResumeToolPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero — split layout */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left */}
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                Build a resume that gets you hired
              </h1>
              <p className="text-gray-500 text-lg mb-8">
                Create a professional, ATS-friendly resume in minutes. Choose from expert-designed templates and stand out to recruiters.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/profile"
                  className="bg-primary text-white font-semibold px-6 py-3 rounded-lg hover:bg-primary-600 transition-colors text-center"
                >
                  Create Resume
                </Link>
                <Link
                  to="/profile"
                  className="border-2 border-primary text-primary font-semibold px-6 py-3 rounded-lg hover:bg-primary hover:text-white transition-colors text-center"
                >
                  Upload Resume
                </Link>
              </div>
            </div>

            {/* Right — mock resume preview */}
            <div className="bg-white border-2 border-gray-200 rounded-xl p-6 shadow-lg max-w-sm mx-auto w-full">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gray-200" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-gray-300 rounded w-3/4" />
                  <div className="h-2 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
              <div className="h-px bg-gray-200 mb-4" />
              <div className="space-y-2 mb-4">
                <div className="h-2 bg-gray-300 rounded w-1/3 mb-2" />
                <div className="h-2 bg-gray-200 rounded" />
                <div className="h-2 bg-gray-200 rounded w-5/6" />
                <div className="h-2 bg-gray-200 rounded w-4/5" />
              </div>
              <div className="h-px bg-gray-200 mb-4" />
              <div className="space-y-2 mb-4">
                <div className="h-2 bg-gray-300 rounded w-1/4 mb-2" />
                <div className="h-2 bg-gray-200 rounded w-3/4" />
                <div className="h-2 bg-gray-200 rounded w-2/3" />
              </div>
              <div className="h-px bg-gray-200 mb-4" />
              <div className="space-y-2">
                <div className="h-2 bg-gray-300 rounded w-1/3 mb-2" />
                <div className="flex gap-2 flex-wrap">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-5 w-16 bg-gray-200 rounded-full" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Templates */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Choose a Template</h2>
          <p className="text-gray-500 mb-8">Pick from our professionally designed templates</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {templates.map((t) => (
              <div key={t.name} className="flex flex-col gap-3">
                <div className={`h-44 rounded-xl bg-gradient-to-b ${t.color} flex items-end p-4`}>
                  <div className="space-y-1 w-full">
                    <div className={`h-2 rounded ${t.text} bg-current opacity-60 w-3/4`} />
                    <div className={`h-1.5 rounded ${t.text} bg-current opacity-40 w-full`} />
                    <div className={`h-1.5 rounded ${t.text} bg-current opacity-40 w-5/6`} />
                  </div>
                </div>
                <div className="text-center">
                  <div className="font-medium text-gray-900 mb-2">{t.name}</div>
                  <Link
                    to="/profile"
                    className="text-sm text-primary font-medium hover:underline"
                  >
                    Use Template
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Resume Tips */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Resume Tips</h2>
          <p className="text-gray-500 mb-8">Expert guidance to make your resume stand out</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {resumeTips.map((tip) => (
              <div key={tip.title} className="flex gap-3 bg-gray-50 border rounded-xl p-4 hover:shadow-md transition-shadow">
                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1 text-sm">{tip.title}</h3>
                  <p className="text-xs text-gray-500">{tip.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What employers look for */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">What employers look for</h2>
          <p className="text-gray-500 mb-8">Make sure your resume hits all the right notes</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {employerLooks.map((item) => (
              <div key={item.title} className="bg-white border-l-4 border-primary rounded-xl p-5 hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center mb-3">
                  <item.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Get started today</h2>
          <p className="text-green-100 mb-8 max-w-xl mx-auto">
            Your dream job is one great resume away. Build yours in minutes with Apna's free resume builder.
          </p>
          <Link
            to="/profile"
            className="bg-white text-primary font-semibold px-8 py-3 rounded-lg hover:bg-green-50 transition-colors inline-block"
          >
            Build My Resume
          </Link>
        </div>
      </section>
    </div>
  );
};
