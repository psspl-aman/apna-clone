import { Link } from 'react-router-dom';
import { Clock, DollarSign, TrendingUp, Users, Calendar, Award } from 'lucide-react';

const partners = [
  'IGNOU',
  'Amity University',
  'Manipal University',
  'LPU',
  'UPES',
];

const courses = [
  { name: 'MBA', duration: '2 years', fee: '\u20b91.5L–2L/year' },
  { name: 'B.Tech CSE', duration: '4 years', fee: '\u20b975K–1.5L/year' },
  { name: 'BBA', duration: '3 years', fee: '\u20b950K–1L/year' },
  { name: 'M.Sc Data Science', duration: '2 years', fee: '\u20b980K–1.5L/year' },
  { name: 'B.Sc IT', duration: '3 years', fee: '\u20b950K–75K/year' },
  { name: 'MBA Finance', duration: '2 years', fee: '\u20b91L–2L/year' },
  { name: 'PG Diploma HR', duration: '1 year', fee: '\u20b960K–90K/year' },
  { name: 'B.Com', duration: '3 years', fee: '\u20b940K–80K/year' },
];

const benefits = [
  { icon: Calendar, title: 'Flexible Schedule', desc: 'Study at your own pace. No need to quit your job to pursue a degree.' },
  { icon: Award, title: 'UGC Recognised', desc: 'All programs are UGC-DEB approved and legally equivalent to on-campus degrees.' },
  { icon: TrendingUp, title: 'Career Advancement', desc: 'Graduates report an average 40% salary hike within 2 years of completing their degree.' },
  { icon: Users, title: 'Industry Mentors', desc: 'Learn from industry practitioners with live sessions and mentorship programmes.' },
];

const faqs = [
  {
    q: 'Are these degrees recognised by employers?',
    a: 'Yes. All our partner universities are UGC-approved and their online degrees carry the same legal validity as regular on-campus degrees.',
  },
  {
    q: 'Can I study while working full-time?',
    a: 'Absolutely. The programs are designed for working professionals. Course materials are available 24/7 and live sessions are recorded.',
  },
  {
    q: 'What is the admission process?',
    a: 'You can apply directly through our platform. Most programs require only a graduation certificate (or equivalent) and do not require an entrance exam.',
  },
];

export const DegreePage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-indigo-600 to-blue-700 text-white py-20">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Earn a degree while you work</h1>
          <p className="text-indigo-100 text-lg md:text-xl max-w-2xl mx-auto mb-8">
            UGC-approved online degrees from India's top universities. Advance your career without pausing your life.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#courses"
              className="bg-white text-indigo-700 font-semibold px-8 py-3 rounded-lg hover:bg-indigo-50 transition-colors inline-block"
            >
              Explore Courses
            </a>
            <a
              href="#partners"
              className="border-2 border-white text-white font-semibold px-8 py-3 rounded-lg hover:bg-white hover:text-indigo-700 transition-colors inline-block"
            >
              Our Partners
            </a>
          </div>
        </div>
      </section>

      {/* Partners */}
      <section id="partners" className="py-10 bg-white border-b">
        <div className="max-w-6xl mx-auto px-4">
          <p className="text-center text-sm text-gray-400 uppercase tracking-widest font-medium mb-6">Partnered Universities</p>
          <div className="flex flex-wrap justify-center gap-4">
            {partners.map((p) => (
              <div
                key={p}
                className="bg-gray-50 border rounded-lg px-6 py-3 text-sm font-semibold text-gray-700 hover:shadow-sm transition-shadow"
              >
                {p}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Courses */}
      <section id="courses" className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Popular Courses</h2>
          <p className="text-gray-500 mb-8">Industry-relevant programs to accelerate your growth</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {courses.map((course) => (
              <div key={course.name} className="bg-white border rounded-xl p-5 hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-gray-900 mb-3">{course.name}</h3>
                <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                  <Clock className="w-3 h-3" />
                  {course.duration}
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500 mb-4">
                  <DollarSign className="w-3 h-3" />
                  {course.fee}
                </div>
                <button className="w-full border border-primary text-primary font-medium py-1.5 rounded-lg text-xs hover:bg-primary hover:text-white transition-colors">
                  Learn More
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Online Degree */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Why pursue an online degree?</h2>
          <p className="text-gray-500 mb-8">The smart way to level up without stepping away from your career</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {benefits.map((b) => (
              <div key={b.title} className="flex gap-4 bg-indigo-50 border border-indigo-100 rounded-xl p-5 hover:shadow-md transition-shadow">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                  <b.icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{b.title}</h3>
                  <p className="text-sm text-gray-600">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Frequently Asked Questions</h2>
          <p className="text-gray-500 mb-8">Everything you need to know before enrolling</p>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <div key={faq.q} className="bg-white border rounded-xl p-5">
                <h3 className="font-semibold text-gray-900 mb-2">{faq.q}</h3>
                <p className="text-sm text-gray-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Start your degree journey today</h2>
          <p className="text-green-100 mb-8 max-w-xl mx-auto">
            Join over 2 lakh professionals who have already enrolled in our partner university programs.
          </p>
          <Link
            to="/jobs"
            className="bg-white text-primary font-semibold px-8 py-3 rounded-lg hover:bg-green-50 transition-colors inline-block"
          >
            Browse Jobs
          </Link>
        </div>
      </section>
    </div>
  );
};
