import { Search, MapPin, ChevronRight, Star, TrendingUp, Award, Users, Building, Shield, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const categories = [
  { name: 'Telecalling / BPO', icon: '📞', count: '12,345', color: 'bg-blue-50' },
  { name: 'Sales & Marketing', icon: '📊', count: '8,920', color: 'bg-green-50' },
  { name: 'Delivery', icon: '🚚', count: '6,780', color: 'bg-yellow-50' },
  { name: 'Driver', icon: '🚗', count: '5,432', color: 'bg-red-50' },
  { name: 'Accounts / Finance', icon: '💰', count: '4,567', color: 'bg-purple-50' },
  { name: 'Security Guard', icon: '🛡️', count: '3,890', color: 'bg-indigo-50' },
  { name: 'Housekeeping', icon: '🧹', count: '3,456', color: 'bg-pink-50' },
  { name: 'Technician', icon: '🔧', count: '2,901', color: 'bg-orange-50' },
];

const cities = [
  'Delhi-NCR', 'Mumbai', 'Bengaluru', 'Hyderabad', 'Pune', 'Chennai',
  'Kolkata', 'Ahmedabad', 'Jaipur', 'Lucknow', 'Surat', 'Chandigarh',
];

const departments = [
  'Telecalling', 'Accounts', 'Delivery', 'Field Sales', 'Marketing',
  'Back Office', 'Driver', 'Human Resource', 'Digital Marketing', 'Cook',
  'Technician', 'Teacher', 'Housekeeping', 'Security', 'Software',
  'Graphic Design', 'Content Writing', 'Nursing', 'Civil Engineering',
];

const testimonials = [
  { name: 'Priya S.', role: 'Delivery Executive', text: 'Found my dream job within a week! Apna made it so easy to connect with employers.', rating: 5, location: 'Mumbai' },
  { name: 'Rahul K.', role: 'Sales Associate', text: 'The platform is very user-friendly. I got multiple job offers and chose the best one.', rating: 5, location: 'Delhi-NCR' },
  { name: 'Amit S.', role: 'Security Guard', text: 'Thanks to Apna, I found a job with good salary near my home. Highly recommended!', rating: 4, location: 'Bengaluru' },
];

const trendingSearches = [
  { rank: 1, title: 'Telecaller', count: '3,200+ openings', tag: 'Hot', tagColor: 'bg-orange-500' },
  { rank: 2, title: 'Sales Executive', count: '2,800+ openings', tag: 'Trending', tagColor: 'bg-blue-500' },
  { rank: 3, title: 'Delivery Boy', count: '2,500+ openings', tag: 'New', tagColor: 'bg-green-500' },
  { rank: 4, title: 'Accountant', count: '1,900+ openings', tag: null, tagColor: '' },
  { rank: 5, title: 'Business Development', count: '1,700+ openings', tag: null, tagColor: '' },
  { rank: 6, title: 'Driver', count: '1,500+ openings', tag: null, tagColor: '' },
];

const trustedCompanies = [
  'Amazon', 'Flipkart', 'Swiggy', 'Zomato', 'Tata', 'Reliance',
  'Deloitte', 'Byjus', 'Unacademy', 'Urban Company', 'Rapido', 'BigBasket',
];

export const HomePage = () => {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');
  const [city, setCity] = useState('');
  const [experience, setExperience] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keyword) params.set('keyword', keyword);
    if (city) params.set('city', city);
    if (experience) params.set('exp_min', experience);
    navigate(`/jobs?${params.toString()}`);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 px-4 py-16 md:py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-green-50 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-6">
            <Award className="h-4 w-4" />
            INDIA'S #1 JOB PLATFORM
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 leading-tight">
            Your job search ends here
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8">
            Discover <span className="text-primary font-semibold">50 lakh+</span> career opportunities
          </p>

          <form onSubmit={handleSearch} className="bg-white rounded-xl shadow-lg p-3 flex flex-col md:flex-row gap-3 max-w-3xl mx-auto">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search for jobs..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="w-full md:w-40">
              <select
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white text-gray-700"
              >
                <option value="">Experience</option>
                <option value="0">Fresher</option>
                <option value="1">1 year</option>
                <option value="2">2 years</option>
                <option value="3">3 years</option>
                <option value="5">5+ years</option>
                <option value="10">10+ years</option>
              </select>
            </div>
            <div className="flex-1 relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Enter city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <button
              type="submit"
              className="bg-primary text-white px-8 py-3 rounded-lg font-medium hover:bg-primary-600 transition-colors"
            >
              Search jobs
            </button>
          </form>
        </div>
      </section>

      {/* Proud to Support */}
      <section className="py-12 bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-6">Proud to support</p>
          <div className="flex items-center justify-center gap-8 md:gap-12 flex-wrap">
            <div className="flex items-center gap-3 bg-gray-50 px-6 py-3 rounded-lg">
              <Building className="h-8 w-8 text-blue-600" />
              <span className="font-semibold text-gray-700">NSDC</span>
            </div>
            <div className="flex items-center gap-3 bg-gray-50 px-6 py-3 rounded-lg">
              <Shield className="h-8 w-8 text-green-600" />
              <span className="font-semibold text-gray-700">Skill India</span>
            </div>
            <div className="flex items-center gap-3 bg-gray-50 px-6 py-3 rounded-lg">
              <Award className="h-8 w-8 text-purple-600" />
              <span className="font-semibold text-gray-700">Ministry of Labour</span>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted by enterprises */}
      <section className="py-12 bg-gray-50 overflow-hidden">
        <div className="max-w-6xl mx-auto px-4">
          <p className="text-center text-gray-500 text-sm font-medium uppercase tracking-wider mb-8">Trusted by leading enterprises</p>
          <div className="flex gap-8 animate-scroll overflow-x-hidden">
            {[...trustedCompanies, ...trustedCompanies].map((name, i) => (
              <div key={i} className="flex-shrink-0 bg-white px-6 py-3 rounded-lg shadow-sm border">
                <span className="font-bold text-gray-400 text-lg whitespace-nowrap">{name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Searches */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Trending Searches</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {trendingSearches.map((item) => (
              <Link
                key={item.rank}
                to={`/jobs?keyword=${encodeURIComponent(item.title)}`}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-primary">#{item.rank}</span>
                  <div>
                    <p className="font-medium text-gray-900">{item.title}</p>
                    <p className="text-sm text-gray-500">{item.count}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {item.tag && (
                    <span className={`${item.tagColor} text-white text-xs px-2 py-0.5 rounded-full`}>
                      {item.tag}
                    </span>
                  )}
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Job Categories */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Popular job categories</h2>
          <p className="text-gray-500 mb-8">Explore your next opportunity</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                to={`/jobs?category=${encodeURIComponent(cat.name.toLowerCase())}`}
                className={`${cat.color} p-5 rounded-xl hover:shadow-md transition-shadow`}
              >
                <span className="text-3xl mb-3 block">{cat.icon}</span>
                <h3 className="font-semibold text-gray-900">{cat.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{cat.count} openings</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">What our users say</h2>
          <p className="text-gray-500 mb-8">Real stories from real people</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="p-6 bg-gray-50 rounded-xl">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">"{t.text}"</p>
                <div>
                  <p className="font-semibold text-gray-900">{t.name}</p>
                  <p className="text-sm text-gray-500">{t.role} · {t.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Jobs by City */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Jobs by City</h2>
          <p className="text-gray-500 mb-8">Find jobs in your city</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {cities.map((c) => (
              <Link
                key={c}
                to={`/jobs?city=${encodeURIComponent(c)}`}
                className="flex items-center justify-between p-4 bg-white rounded-xl border hover:shadow-md transition-shadow"
              >
                <span className="font-medium text-gray-900">{c}</span>
                <ArrowRight className="h-4 w-4 text-gray-400" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Jobs by Department */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Jobs by Department</h2>
          <p className="text-gray-500 mb-8">Browse opportunities by department</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {departments.map((dept) => (
              <Link
                key={dept}
                to={`/jobs?keyword=${encodeURIComponent(dept)}`}
                className="p-3 bg-gray-50 rounded-lg text-gray-700 hover:bg-primary-50 hover:text-primary transition-colors"
              >
                {dept}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-primary">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            <div>
              <p className="text-4xl font-bold">50L+</p>
              <p className="text-primary-50 mt-2">Jobs Available</p>
            </div>
            <div>
              <p className="text-4xl font-bold">10Cr+</p>
              <p className="text-primary-50 mt-2">Registered Users</p>
            </div>
            <div>
              <p className="text-4xl font-bold">5L+</p>
              <p className="text-primary-50 mt-2">Companies</p>
            </div>
            <div>
              <p className="text-4xl font-bold">95%</p>
              <p className="text-primary-50 mt-2">Satisfaction Rate</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
