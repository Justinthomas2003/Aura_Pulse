
import React, { useState } from 'react';
import { Activity, ActivityCategory } from '../types';

interface ActivityFormProps {
  onAdd: (activity: Activity) => void;
}

export const ActivityForm: React.FC<ActivityFormProps> = ({ onAdd }) => {
  const [title, setTitle] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [category, setCategory] = useState<ActivityCategory>(ActivityCategory.WORK);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    onAdd({
      id: crypto.randomUUID(),
      date: '',
      title,
      startTime,
      endTime,
      category,
    });
    setTitle('');
  };

  return (
    <div className="glass p-8 rounded-[2rem]">
      <h3 className="text-xl font-black text-white mb-8 tracking-tight">Sync Pulse</h3>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-[10px] font-black text-cyan-400 uppercase tracking-widest mb-2 ml-1">Activity Detail</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl focus:border-cyan-400 text-white font-bold outline-none transition placeholder-white/20 shadow-inner"
            placeholder="Focus Session, Deep Work, Gym..."
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-5">
          <div>
            <label className="block text-[10px] font-black text-white/40 uppercase tracking-widest mb-2 ml-1">Start</label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl focus:border-cyan-400 text-white font-bold outline-none transition [color-scheme:dark]"
              required
            />
          </div>
          <div>
            <label className="block text-[10px] font-black text-white/40 uppercase tracking-widest mb-2 ml-1">End</label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl focus:border-cyan-400 text-white font-bold outline-none transition [color-scheme:dark]"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-black text-white/40 uppercase tracking-widest mb-2 ml-1">Intensity Cluster</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as ActivityCategory)}
            className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl focus:border-cyan-400 text-white font-bold outline-none transition appearance-none cursor-pointer"
          >
            {Object.values(ActivityCategory).map((cat) => (
              <option key={cat} value={cat} className="bg-slate-900 text-white">{cat}</option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-indigo-600 to-cyan-600 text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-indigo-600/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          Inject to Flow
        </button>
      </form>
    </div>
  );
};
