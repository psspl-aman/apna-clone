import { Link } from 'react-router-dom';
import {
  Trophy,
  Users,
  Calendar,
  Gift,
  ClipboardList,
  Medal,
} from 'lucide-react';

const liveContests = [
  {
    title: 'Sales Champion Challenge',
    category: 'Sales',
    categoryColor: 'text-blue-600 bg-blue-50',
    prize: '\u20b910,000',
    participants: '1,240',
    daysLeft: 3,
  },
  {
    title: 'Full-Stack Developer Sprint',
    category: 'Tech',
    categoryColor: 'text-purple-600 bg-purple-50',
    prize: '\u20b925,000',
    participants: '890',
    daysLeft: 7,
  },
  {
    title: 'Finance & Investment Quiz',
    category: 'Finance',
    categoryColor: 'text-green-600 bg-green-50',
    prize: '\u20b915,000',
    participants: '630',
    daysLeft: 5,
  },
];

const howItWorks = [
  { step: 1, icon: ClipboardList, title: 'Register', desc: 'Sign up for any open contest with a single click. No prerequisites required.' },
  { step: 2, icon: Trophy, title: 'Attempt Contest', desc: 'Complete the timed assessment at your convenience within the contest window.' },
  { step: 3, icon: Gift, title: 'Win Rewards', desc: 'Top performers win cash prizes and get featured on the leaderboard.' },
];

const pastWinners = [
  { initials: 'RK', name: 'Ravi Kumar', role: 'Sales Executive', contest: 'Sales Champion Challenge', prize: '\u20b910,000' },
  { initials: 'PM', name: 'Priya Mehta', role: 'Software Engineer', contest: 'Full-Stack Developer Sprint', prize: '\u20b925,000' },
  { initials: 'AS', name: 'Arjun Sharma', role: 'Financial Analyst', contest: 'Finance & Investment Quiz', prize: '\u20b915,000' },
];

export const ContestPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-purple-600 to-indigo-700 text-white py-20">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Challenge yourself, win rewards</h1>
          <p className="text-purple-100 text-lg md:text-xl max-w-2xl mx-auto mb-8">
            Demonstrate your skills through competitive assessments and earn prizes, recognition, and career-boosting opportunities.
          </p>
          <a
            href="#live-contests"
            className="bg-white text-purple-700 font-semibold px-8 py-3 rounded-lg hover:bg-purple-50 transition-colors inline-block"
          >
            View Contests
          </a>
        </div>
      </section>

      {/* Live Contests */}
      <section id="live-contests" className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Live Contests</h2>
            <span className="flex items-center gap-1 text-xs font-medium text-red-600 bg-red-50 border border-red-200 px-2 py-1 rounded-full">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              LIVE
            </span>
          </div>
          <p className="text-gray-500 mb-8">Compete with thousands of professionals across India</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {liveContests.map((contest) => (
              <div key={contest.title} className="bg-white border rounded-xl p-5 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-gray-900 leading-snug">{contest.title}</h3>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full flex-shrink-0 ml-2 ${contest.categoryColor}`}>
                    {contest.category}
                  </span>
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <Trophy className="w-4 h-4 text-yellow-500" />
                  <span className="text-lg font-bold text-gray-900">{contest.prize}</span>
                  <span className="text-sm text-gray-400">prize</span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-500 mb-5">
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {contest.participants} joined
                  </span>
                  <span className="flex items-center gap-1 text-orange-600 font-medium">
                    <Calendar className="w-4 h-4" />
                    {contest.daysLeft}d left
                  </span>
                </div>
                <button className="w-full bg-primary text-white font-medium py-2 rounded-lg text-sm hover:bg-primary-600 transition-colors">
                  Register Now
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">How it Works</h2>
          <p className="text-gray-500 mb-10">Three simple steps to win</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {howItWorks.map((step, idx) => (
              <div key={step.step} className="flex flex-col items-center text-center relative">
                {idx < howItWorks.length - 1 && (
                  <div className="hidden md:block absolute top-6 left-1/2 w-full h-0.5 bg-purple-100" />
                )}
                <div className="relative z-10 w-12 h-12 rounded-full bg-purple-600 text-white flex items-center justify-center text-lg font-bold mb-4">
                  {step.step}
                </div>
                <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center mb-3">
                  <step.icon className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-sm text-gray-500">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Past Winners */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Past Winners</h2>
          <p className="text-gray-500 mb-8">Meet the champions who claimed their prizes</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pastWinners.map((winner) => (
              <div key={winner.name} className="bg-white border rounded-xl p-5 hover:shadow-md transition-shadow flex gap-4 items-start">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                  {winner.initials}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{winner.name}</div>
                  <div className="text-xs text-gray-500 mb-2">{winner.role}</div>
                  <div className="text-xs text-gray-400">{winner.contest}</div>
                  <div className="flex items-center gap-1 mt-2">
                    <Medal className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm font-semibold text-gray-800">{winner.prize} won</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 bg-primary">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to test your skills?</h2>
          <p className="text-green-100 mb-8 max-w-xl mx-auto">
            Join thousands of professionals competing for recognition and rewards. Your next win is one click away.
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
