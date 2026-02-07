
import React, { useState } from 'react';
import { GoalType, LongTermGoal } from '../types';
import { estimateGoalDuration } from '../services/geminiService';

interface GoalPlannerProps {
  goals: LongTermGoal[];
  onAdd: (goal: LongTermGoal) => void;
}

export const GoalPlanner: React.FC<GoalPlannerProps> = ({ goals, onAdd }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [creator, setCreator] = useState('');
  const [type, setType] = useState<GoalType>(GoalType.BOOK);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const estimation = await estimateGoalDuration(title, creator, type);
    const newGoal: LongTermGoal = {
      id: crypto.randomUUID(),
      title,
      creator,
      type,
      estimatedTotalHours: estimation.hours,
      completedHours: 0,
      targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      dailyRequirementMinutes: Math.ceil((estimation.hours * 60) / 30),
    };
    onAdd(newGoal);
    setTitle('');
    setCreator('');
    setLoading(false);
    setIsOpen(false);
  };

  return (
    <div className="glass rounded-[2rem] p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h3 className="text-xl font-black text-white tracking-tight">Long-Term Orbit</h3>
          <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest mt-1">Goal Trajectory</p>
        </div>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-lg ${isOpen ? 'bg-rose-500 text-white rotate-45' : 'bg-cyan-500 text-white hover:scale-110'}`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4"/></svg>
        </button>
      </div>

      {isOpen && (
        <form onSubmit={handleSubmit} className="mb-10 space-y-5 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="grid grid-cols-2 gap-3 p-1 bg-white/5 rounded-2xl border border-white/5">
            <button 
              type="button" 
              onClick={() => setType(GoalType.BOOK)}
              className={`py-3 rounded-xl text-xs font-black transition-all ${type === GoalType.BOOK ? 'bg-indigo-600 text-white shadow-lg' : 'text-white/40 hover:text-white'}`}
            >
              Novel
            </button>
            <button 
              type="button" 
              onClick={() => setType(GoalType.COURSE)}
              className={`py-3 rounded-xl text-xs font-black transition-all ${type === GoalType.COURSE ? 'bg-indigo-600 text-white shadow-lg' : 'text-white/40 hover:text-white'}`}
            >
              Academy
            </button>
          </div>
          <input
            type="text"
            placeholder={type === GoalType.BOOK ? "Book Name" : "Specialization"}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-cyan-400 text-white font-bold transition placeholder-white/20"
            required
          />
          <input
            type="text"
            placeholder={type === GoalType.BOOK ? "Author" : "Platform"}
            value={creator}
            onChange={(e) => setCreator(e.target.value)}
            className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-cyan-400 text-white font-bold transition placeholder-white/20"
            required
          />
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-white text-indigo-900 py-4 rounded-2xl font-black text-lg hover:bg-cyan-100 disabled:opacity-50 transition-all shadow-xl"
          >
            {loading ? 'AI Orbiting...' : 'Lock In Goal'}
          </button>
        </form>
      )}

      <div className="space-y-6">
        {goals.map(goal => (
          <div key={goal.id} className="p-6 bg-white/5 rounded-[1.5rem] border border-white/10 group hover:border-indigo-500 transition-all">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="font-black text-white text-base tracking-tight">{goal.title}</h4>
                <p className="text-[9px] text-cyan-400 font-bold uppercase tracking-widest">{goal.creator}</p>
              </div>
              <span className={`px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest ${goal.type === GoalType.BOOK ? 'bg-amber-500/20 text-amber-400' : 'bg-indigo-500/20 text-indigo-400'}`}>
                {goal.type}
              </span>
            </div>
            <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden mb-3">
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-1000" 
                style={{ width: `${(goal.completedHours / goal.estimatedTotalHours) * 100}%` }}
              ></div>
            </div>
            <div className="flex justify-between items-center text-[9px] font-bold text-white/40 uppercase tracking-widest">
              <span>{goal.dailyRequirementMinutes}m daily pulse</span>
              <span>By {new Date(goal.targetDate).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
        {goals.length === 0 && !isOpen && (
          <p className="text-center py-10 text-xs text-white/20 font-bold uppercase tracking-widest">No Active Orbits</p>
        )}
      </div>
    </div>
  );
};
