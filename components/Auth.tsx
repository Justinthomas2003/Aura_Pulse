
import React, { useState } from 'react';

interface AuthProps {
  onLogin: (name: string) => void;
}

export const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const validateEmail = (email: string) => {
    return String(email).toLowerCase().match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setError('Invalid professional email address.');
      return;
    }
    setError('');
    onLogin(name || email.split('@')[0]);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative">
      <div className="max-w-5xl w-full grid lg:grid-cols-2 glass rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/60">
        
        {/* Left Side: Professional Visuals */}
        <div className="hidden lg:flex relative bg-indigo-700 p-12 flex-col justify-between overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-8">
              <svg className="w-10 h-10 text-white" viewBox="0 0 40 40" fill="none">
                <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="3" strokeDasharray="80 20"/>
                <path d="M12 24L18 18L22 22L28 16" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="text-2xl font-black text-white tracking-tighter">AuraPulse</span>
            </div>
            <h2 className="text-4xl font-extrabold text-white leading-tight">
              Optimize your <br/> professional rhythm.
            </h2>
            <p className="text-indigo-100 mt-4 font-medium opacity-80">
              The intelligent framework for daily performance and long-term mastery.
            </p>
          </div>

          <div className="relative z-10 grid grid-cols-2 gap-4">
            <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-md border border-white/10">
              <p className="text-white font-bold text-xl">98%</p>
              <p className="text-indigo-200 text-xs">Efficiency Gain</p>
            </div>
            <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-md border border-white/10">
              <p className="text-white font-bold text-xl">AI-Driven</p>
              <p className="text-indigo-200 text-xs">Path Analysis</p>
            </div>
          </div>

          {/* Moving background pattern inside left panel */}
          <div className="absolute inset-0 z-0">
             <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500 rounded-full blur-[100px] opacity-30 animate-pulse"></div>
             <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-400 rounded-full blur-[120px] opacity-40"></div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="p-8 lg:p-16 bg-white/90">
          <div className="mb-10 text-center lg:text-left">
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">
              {isLogin ? 'Professional Login' : 'Create Global Account'}
            </h1>
            <p className="text-gray-600 mt-2 font-medium">Enter your credentials to access your flow.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-widest mb-2 ml-1">Company / Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-5 py-4 bg-white border-2 border-gray-100 rounded-2xl focus:border-indigo-500 text-gray-900 font-semibold outline-none transition placeholder-gray-400"
                  placeholder="John Smith"
                  required
                />
              </div>
            )}
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-widest mb-2 ml-1">Work Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-5 py-4 bg-white border-2 border-gray-100 rounded-2xl focus:border-indigo-500 text-gray-900 font-semibold outline-none transition placeholder-gray-400"
                placeholder="name@company.com"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-widest mb-2 ml-1">Secure Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-5 py-4 bg-white border-2 border-gray-100 rounded-2xl focus:border-indigo-500 text-gray-900 font-semibold outline-none transition placeholder-gray-400"
                placeholder="••••••••"
                required
              />
            </div>

            {error && <p className="text-rose-600 text-xs font-bold px-2">{error}</p>}

            <button
              type="submit"
              className="w-full bg-gray-900 text-white py-5 rounded-2xl font-bold text-lg shadow-xl hover:bg-black transition transform active:scale-[0.98] mt-4"
            >
              {isLogin ? 'Enter Workspace' : 'Get Started'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <button
              onClick={() => { setIsLogin(!isLogin); setError(''); }}
              className="text-indigo-600 hover:text-indigo-800 text-sm font-extrabold"
            >
              {isLogin ? "No account? Join the network" : 'Existing member? Sign in'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
