
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Auth } from './components/Auth';
import { ActivityForm } from './components/ActivityForm';
import { AnalyticsChart } from './components/AnalyticsChart';
import { AIInsights } from './components/AIInsights';
import { GoalPlanner } from './components/GoalPlanner';
import { Activity, OptimizationSuggestion, LongTermGoal, ActivityCategory } from './types';
import { getScheduleOptimization } from './services/geminiService';

const CATEGORY_IMAGES: Record<string, string> = {
  [ActivityCategory.WORK]: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=400',
  [ActivityCategory.HEALTH]: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=400',
  [ActivityCategory.LEISURE]: 'https://images.unsplash.com/photo-1511733334857-e8908ee87821?auto=format&fit=crop&q=80&w=400',
  [ActivityCategory.EDUCATION]: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&q=80&w=400',
  [ActivityCategory.CHORES]: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=400',
  [ActivityCategory.SLEEP]: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&q=80&w=400',
  [ActivityCategory.OTHER]: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&q=80&w=400',
};

const App: React.FC = () => {
  const [user, setUser] = useState<string | null>(null);
  const [allActivities, setAllActivities] = useState<Activity[]>([]);
  const [goals, setGoals] = useState<LongTermGoal[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [suggestions, setSuggestions] = useState<OptimizationSuggestion[]>([]);
  const [isAiLoading, setIsAiLoading] = useState(false);

  useEffect(() => {
    const savedActs = localStorage.getItem('aura_activities');
    const savedGoals = localStorage.getItem('aura_goals');
    if (savedActs) setAllActivities(JSON.parse(savedActs));
    if (savedGoals) setGoals(JSON.parse(savedGoals));
  }, []);

  useEffect(() => {
    localStorage.setItem('aura_activities', JSON.stringify(allActivities));
    localStorage.setItem('aura_goals', JSON.stringify(goals));
  }, [allActivities, goals]);

  const dailyActivities = useMemo(() => {
    return allActivities
      .filter(a => a.date === selectedDate)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  }, [allActivities, selectedDate]);

  const handleLogin = (name: string) => setUser(name);
  const handleAddActivity = (newActivity: Activity) => {
    setAllActivities(prev => [...prev, { ...newActivity, date: selectedDate }]);
  };
  const handleRemoveActivity = (id: string) => {
    setAllActivities(prev => prev.filter(a => a.id !== id));
  };
  const handleAddGoal = (goal: LongTermGoal) => setGoals(prev => [...prev, goal]);

  const refreshAiSuggestions = useCallback(async () => {
    if (dailyActivities.length === 0 && goals.length === 0) return;
    setIsAiLoading(true);
    try {
      const result = await getScheduleOptimization(dailyActivities, goals);
      setSuggestions(result);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAiLoading(false);
    }
  }, [dailyActivities, goals]);

  useEffect(() => {
    if (dailyActivities.length >= 2 || goals.length > 0) {
      refreshAiSuggestions();
    }
  }, [selectedDate, dailyActivities.length, goals.length, refreshAiSuggestions]);

  if (!user) return <Auth onLogin={handleLogin} />;

  return (
    <div className="min-h-screen flex flex-col relative z-10 text-slate-100">
      
      <div className="ticker-wrap">
        <div className="ticker-move">
          AuraPulse Nebula Active • Cognitive Load: 42% • Active Projects: {goals.length} • User Context: {user} • Focus Optimization Enabled • Data Integrity: Verified • System Pulse: Optimal 
        </div>
      </div>

      <header className="glass sticky top-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4 group">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-xl shadow-white/5 transition group-hover:rotate-6">
              <svg className="w-7 h-7 text-indigo-900" viewBox="0 0 40 40" fill="none">
                <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="3" strokeDasharray="80 20"/>
                <path d="M12 24L18 18L22 22L28 16" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-black text-white tracking-tighter leading-none">AuraPulse</h1>
              <p className="text-[9px] text-cyan-400 font-extrabold uppercase tracking-[0.3em] mt-1">Vivid Intelligence</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 lg:gap-8">
            <div className="flex items-center bg-white/5 p-1 rounded-2xl border border-white/10 backdrop-blur-md">
              <button 
                onClick={() => {
                  const d = new Date(selectedDate);
                  d.setDate(d.getDate() - 1);
                  setSelectedDate(d.toISOString().split('T')[0]);
                }}
                className="w-9 h-9 flex items-center justify-center hover:bg-white/10 rounded-xl transition text-white/50 hover:text-white"
              >
                ←
              </button>
              <input 
                type="date" 
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-transparent px-4 text-sm font-extrabold text-white outline-none border-none focus:ring-0 [color-scheme:dark]"
              />
              <button 
                onClick={() => {
                  const d = new Date(selectedDate);
                  d.setDate(d.getDate() + 1);
                  setSelectedDate(d.toISOString().split('T')[0]);
                }}
                className="w-9 h-9 flex items-center justify-center hover:bg-white/10 rounded-xl transition text-white/50 hover:text-white"
              >
                →
              </button>
            </div>
            
            <div className="flex items-center gap-3">
               <div className="hidden sm:block text-right">
                  <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest leading-none">Session</p>
                  <p className="text-sm font-black text-white mt-1">{user}</p>
               </div>
               <button onClick={() => setUser(null)} className="p-3 bg-rose-500/10 hover:bg-rose-500/20 rounded-xl transition text-rose-400">
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                 </svg>
               </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          <div className="lg:col-span-4 space-y-10">
            <ActivityForm onAdd={handleAddActivity} />
            <GoalPlanner goals={goals} onAdd={handleAddGoal} />
          </div>

          <div className="lg:col-span-8 space-y-10">
            <AIInsights suggestions={suggestions} loading={isAiLoading} onRefresh={refreshAiSuggestions} />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="glass rounded-[2rem] p-8">
                <h3 className="text-lg font-black text-white tracking-tight mb-8 flex items-center justify-between">
                  Daily Flow
                  <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest">{dailyActivities.length} Steps</span>
                </h3>
                <div className="space-y-6 max-h-[550px] overflow-y-auto pr-3 custom-scrollbar">
                  {dailyActivities.length === 0 ? (
                    <div className="py-20 text-center opacity-40">
                       <p className="italic">No performance data.</p>
                    </div>
                  ) : (
                    dailyActivities.map(act => (
                      <div key={act.id} className="group relative bg-white/5 border border-white/10 rounded-3xl overflow-hidden hover:bg-white/10 transition-all duration-500 hover:scale-[1.02]">
                        <div className="h-20 w-full relative">
                           <img src={CATEGORY_IMAGES[act.category]} className="w-full h-full object-cover opacity-40 grayscale group-hover:grayscale-0 transition-all duration-700" alt={act.category} />
                           <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
                           <span className="absolute bottom-2 left-4 text-[10px] font-black text-cyan-400 uppercase tracking-widest">{act.category}</span>
                        </div>
                        <div className="p-5 flex justify-between items-center">
                          <div>
                            <p className="text-base font-black text-white leading-tight">{act.title}</p>
                            <p className="text-[10px] text-white/50 font-bold mt-1">{act.startTime} — {act.endTime}</p>
                          </div>
                          <button onClick={() => handleRemoveActivity(act.id)} className="w-8 h-8 flex items-center justify-center rounded-full bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white transition">✕</button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
              <AnalyticsChart activities={dailyActivities} />
            </div>

            <div className="glass p-10 rounded-[2.5rem]">
              <div className="flex justify-between items-end mb-8">
                <div>
                  <h3 className="text-xl font-black text-white tracking-tight">Intensity Aura</h3>
                  <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest mt-1">Biometric Flow Mapping</p>
                </div>
              </div>
              <div className="relative h-24 bg-white/5 rounded-3xl overflow-hidden flex border border-white/5 shadow-2xl">
                {dailyActivities.map((a) => {
                  const [sh, sm] = a.startTime.split(':').map(Number);
                  const [eh, em] = a.endTime.split(':').map(Number);
                  const startPos = (sh * 60 + sm) / (24 * 60) * 100;
                  const duration = (eh * 60 + em) - (sh * 60 + sm);
                  const width = (duration < 0 ? duration + 24 * 60 : duration) / (24 * 60) * 100;
                  
                  const colors: Record<string, string> = {
                    Work: 'bg-indigo-500',
                    'Health & Fitness': 'bg-emerald-400',
                    Leisure: 'bg-pink-500',
                    Education: 'bg-cyan-400',
                    Chores: 'bg-amber-400',
                    Sleep: 'bg-slate-800',
                    Other: 'bg-white/20',
                  };

                  return (
                    <div 
                      key={a.id}
                      className={`absolute h-full ${colors[a.category] || 'bg-white/10'} border-r border-black/20 hover:brightness-125 transition-all group`}
                      style={{ left: `${startPos}%`, width: `${width}%` }}
                    >
                       <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition"></div>
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-between mt-6 px-1">
                {['00:00', '08:00', '16:00', '23:59'].map(t => (
                  <span key={t} className="text-[9px] text-white/30 font-extrabold tracking-widest">{t}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="text-center py-16 opacity-30">
        <p className="text-[10px] font-bold uppercase tracking-[0.5em]">
          © 2024 AuraPulse • Vivid Protocol v3.0
        </p>
      </footer>
    </div>
  );
};

export default App;
