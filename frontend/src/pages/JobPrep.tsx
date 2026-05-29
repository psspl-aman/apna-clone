import { Link } from 'react-router-dom';
import {
  MessageSquare,
  Clock,
  Star,
  BarChart2,
  Search,
  Briefcase,
} from 'lucide-react';

const prepCategories = [
  { emoji: '🤝', title: 'HR Interview', subtitle: '250+ questions', description: 'Master behavioral and situational HR questions' },
  { emoji: '💻', title: 'Technical Interview', subtitle: '300+ questions', description: 'Coding, system design, and problem solving' },
  { emoji: '🧠', title: 'Aptitude & Reasoning', subtitle: '200+ questions', description: 'Quantitative, logical and verbal reasoning' },
  { emoji: '📚', title: 'English Skills', subtitle: '150+ questions', description: 'Grammar, vocabulary and comprehension' },
  { emoji: '📝', title: 'Resume Writing', subtitle: '50+ templates', description: 'Craft resumes that stand out to recruiters' },
  { emoji: '🗣️', title: 'Group Discussion', subtitle: '100+ topics', description: 'Techniques to excel in GD rounds' },
];

const mockTests = [
  { title: 'Sales Aptitude Test', questions: 25, time: 20, difficulty: 'Easy', color: 'text-green-600 bg-green-50' },
  { title: 'Logical Reasoning Test', questions: 30, time: 25, difficulty: 'Medium', color: 'text-yellow-600 bg-yellow-50' },
  { title: 'Technical Skills Test', questions: 20, time: 30, difficulty: 'Hard', color: 'text-red-600 bg-red-50' },
];

const interviewTips = [
  { icon: Search, title: 'Research the Company', desc: "Understand the company's products, mission, culture, and recent news before your interview." },
  { icon: Star, title: 'Prepare STAR Answers', desc: 'Use Situation, Task, Action, Result format for behavioural questions to give clear, structured answers.' },
  { icon: Briefcase, title: 'Dress Professionally', desc: 'First impressions matter. Dress appropriately for the company culture — when in doubt, overdress.' },
  { icon: MessageSquare, title: 'Ask Thoughtful Questions', desc: 'Prepare 3–5 smart questions to ask the interviewer to show your genuine interest and engagement.' },
];

export const JobPrepPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-purple-600 to-indigo-700 text-white py-20">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Ace your next interview</h1>
          <p className="text-purple-100 text-lg md:text-xl max-w-2xl mx-auto mb-8">
            Crack your dream job with expert preparation — practice questions, mock tests, and proven tips curated by industry professionals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/jobs"
              className="bg-white text-purple-700 font-semibold px-8 py-3 rounded-lg hover:bg-purple-50 transition-colors"
            >
              Browse Jobs
            </Link>
            <button className="border-2 border-white text-white font-semibold px-8 py-3 rounded-lg hover:bg-white hover:text-purple-700 transition-colors">
              Practice Now
            </button>
          </div>
          {/* Stats */}
          <div className="mt-12 grid grid-cols-3 gap-6 max-w-lg mx-auto">
            <div>
              <div className="text-3xl font-bold">50K+</div>
              <div className="text-purple-200 text-sm mt-1">Questions</div>
            </div>
            <div>
              <div className="text-3xl font-bold">10K+</div>
              <div className="text-purple-200 text-sm mt-1">Mock Tests</div>
            </div>
            <div>
              <div className="text-3xl font-bold">95%</div>
              <div className="text-purple-200 text-sm mt-1">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Prep Categories */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Preparation Categories</h2>
          <p className="text-gray-500 mb-8">Choose your focus area and start practising</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {prepCategories.map((cat) => (
              <div
                key={cat.title}
                className="bg-white border rounded-xl p-5 hover:shadow-md transition-shadow cursor-pointer group"
              >
                <div className="text-3xl mb-3">{cat.emoji}</div>
                <h3 className="font-semibold text-gray-900 group-hover:text-purple-700 transition-colors">{cat.title}</h3>
                <p className="text-xs text-purple-600 font-medium mt-1">{cat.subtitle}</p>
                <p className="text-sm text-gray-500 mt-2">{cat.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mock Tests */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Mock Tests</h2>
          <p className="text-gray-500 mb-8">Simulate real interview conditions with timed assessments</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mockTests.map((test) => (
              <div key={test.title} className="bg-white border rounded-xl p-5 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">{test.title}</h3>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${test.color}`}>
                    {test.difficulty}
                  </span>
                </div>
                <div className="flex gap-4 text-sm text-gray-500 mb-5">
                  <span className="flex items-center gap-1">
                    <BarChart2 className="w-4 h-4" />
                    {test.questions} questions
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {test.time} min
                  </span>
                </div>
                <button
                  disabled
                  className="w-full bg-gray-100 text-gray-400 font-medium py-2 rounded-lg text-sm cursor-not-allowed"
                  title="Coming soon"
                >
                  Take Test — Coming Soon
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interview Tips */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Interview Tips</h2>
          <p className="text-gray-500 mb-8">Expert advice to help you shine on interview day</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {interviewTips.map((tip) => (
              <div key={tip.title} className="bg-white border rounded-xl p-5 hover:shadow-md transition-shadow flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <tip.icon className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{tip.title}</h3>
                  <p className="text-sm text-gray-500">{tip.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 bg-primary">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Start preparing today</h2>
          <p className="text-green-100 mb-8 max-w-xl mx-auto">
            Thousands of candidates have cracked their dream jobs with our preparation resources. Your turn is next.
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
