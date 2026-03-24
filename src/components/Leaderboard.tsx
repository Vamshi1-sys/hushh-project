import React from 'react';
import { Trophy, Medal, Star } from 'lucide-react';
import { Ambassador } from '../types';
import { cn } from '../lib/utils';

interface LeaderboardProps {
  ambassadors: Ambassador[];
}

export default function Leaderboard({ ambassadors }: LeaderboardProps) {
  const sorted = [...ambassadors].sort((a, b) => b.score - a.score).slice(0, 10);

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0: return <Trophy className="text-amber-400" size={26} />;
      case 1: return <Medal className="text-slate-400" size={26} />;
      case 2: return <Medal className="text-amber-600" size={26} />;
      default: return <span className="font-bold text-slate-500 text-lg w-6 text-center">#{index + 1}</span>;
    }
  };

  return (
    <div className="card overflow-hidden">
      {/* Header */}
      <div className="p-8 border-b border-slate-200 dark:border-slate-800">
        <h2 className="text-3xl font-bold tracking-tight flex items-center gap-3 text-slate-900 dark:text-white">
          <Trophy className="text-amber-500" size={32} />
          Leaderboard
        </h2>
        <p className="text-slate-600 dark:text-slate-400 text-sm mt-2">Top performing ambassadors by engagement score</p>
      </div>

      {/* Rankings */}
      <div className="divide-y divide-slate-200 dark:divide-slate-800">
        {sorted.map((ambassador, i) => (
          <div key={ambassador.id} className="flex items-center gap-6 p-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
            {/* Rank */}
            <div className="w-12 flex justify-center flex-shrink-0">
              {getRankIcon(i)}
            </div>
            
            {/* Ambassador Info */}
            <div className="flex-1 flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                {ambassador.name[0]}
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white transition-colors">{ambassador.name}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-1">{ambassador.referralCode}</p>
              </div>
            </div>

            {/* Stats */}
            <div className="flex gap-8 text-right">
              <div className="flex flex-col items-end">
                <p className="text-xs text-slate-600 dark:text-slate-400 uppercase font-semibold tracking-wide">Signups</p>
                <p className="font-bold text-lg text-slate-900 dark:text-white mt-1">{ambassador.signupsCount}</p>
              </div>
              <div className="flex flex-col items-end">
                <p className="text-xs text-slate-600 dark:text-slate-400 uppercase font-semibold tracking-wide">Score</p>
                <p className="font-bold text-lg text-indigo-600 dark:text-indigo-400 mt-1">{ambassador.score}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {sorted.length === 0 && (
        <div className="px-8 py-12 text-center text-slate-500 italic">
          No ambassadors yet.
        </div>
      )}
    </div>
  );
}
