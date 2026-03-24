import React, { useState, useEffect } from 'react';
import { Sparkles, RefreshCw } from 'lucide-react';
import Markdown from 'react-markdown';
import { getAmbassadorInsights } from '../services/geminiService';
import { Ambassador } from '../types';

interface AIInsightsProps {
  ambassadors: Ambassador[];
}

export default function AIInsights({ ambassadors }: AIInsightsProps) {
  const [insights, setInsights] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const fetchInsights = async () => {
    if (ambassadors.length === 0) return;
    setIsLoading(true);
    const result = await getAmbassadorInsights(ambassadors);
    setInsights(result || '');
    setIsLoading(false);
  };

  useEffect(() => {
    fetchInsights();
  }, [ambassadors.length]);

  return (
    <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-purple-700 rounded-2xl p-8 text-white shadow-2xl shadow-indigo-500/30 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute top-0 right-0 p-12 opacity-5">
        <Sparkles size={200} />
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/15 backdrop-blur-md border border-white/20 rounded-lg">
              <Sparkles size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold tracking-tight">AI Growth Insights</h3>
              <p className="text-indigo-100 text-sm mt-0.5">Intelligence powered by Gemini AI</p>
            </div>
          </div>
          <button 
            onClick={fetchInsights}
            disabled={isLoading}
            className="p-2.5 hover:bg-white/10 rounded-lg transition-all disabled:opacity-50"
            title="Refresh insights"
          >
            <RefreshCw size={20} className={isLoading ? 'animate-spin' : ''} />
          </button>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            <div className="h-4 bg-white/15 rounded w-3/4 animate-pulse"></div>
            <div className="h-4 bg-white/15 rounded w-2/3 animate-pulse"></div>
            <div className="h-4 bg-white/15 rounded w-4/5 animate-pulse"></div>
            <div className="h-4 bg-white/15 rounded w-1/2 animate-pulse"></div>
          </div>
        ) : insights ? (
          <div className="prose prose-invert max-w-none prose-sm text-indigo-50 leading-relaxed">
            <Markdown>{insights}</Markdown>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-indigo-100">No insights available yet. Make sure you have ambassador data.</p>
          </div>
        )}
      </div>
    </div>
  );
}
