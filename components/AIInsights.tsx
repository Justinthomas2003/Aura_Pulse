
import React from 'react';
import { OptimizationSuggestion } from '../types';

interface AIInsightsProps {
  suggestions: OptimizationSuggestion[];
  loading: boolean;
  onRefresh: () => void;
}

export const AIInsights: React.FC<AIInsightsProps> = ({ suggestions, loading, onRefresh }) => {
  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'High': return 'bg-red-100 text-red-700';
      case 'Medium': return 'bg-yellow-100 text-yellow-700';
      case 'Low': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="bg-indigo-900 text-white p-6 rounded-xl shadow-xl overflow-hidden relative">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-bold flex items-center gap-2">
            <span className="text-yellow-400">✨</span> AI Insights
          </h3>
          <p className="text-indigo-200 text-sm">Personalized optimization for your day</p>
        </div>
        <button
          onClick={onRefresh}
          disabled={loading}
          className="px-4 py-2 bg-indigo-700 hover:bg-indigo-600 rounded-lg text-sm transition disabled:opacity-50"
        >
          {loading ? 'Analyzing...' : 'Refresh'}
        </button>
      </div>

      <div className="space-y-4">
        {loading ? (
          Array(3).fill(0).map((_, i) => (
            <div key={i} className="animate-pulse bg-indigo-800 h-24 rounded-lg"></div>
          ))
        ) : suggestions.length > 0 ? (
          suggestions.map((s, idx) => (
            <div key={idx} className="bg-indigo-800/50 p-4 rounded-lg border border-indigo-700/50 hover:bg-indigo-800 transition">
              <div className="flex items-center gap-3 mb-2">
                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${getImpactColor(s.impact)}`}>
                  {s.impact} Impact
                </span>
                <h4 className="font-semibold">{s.title}</h4>
              </div>
              <p className="text-indigo-100 text-sm leading-relaxed">{s.suggestion}</p>
            </div>
          ))
        ) : (
          <p className="text-center text-indigo-300 py-8 italic">Add more activities to unlock AI coaching insights.</p>
        )}
      </div>

      {/* Background decoration */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
    </div>
  );
};
