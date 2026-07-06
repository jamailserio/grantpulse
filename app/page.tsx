'use client';

import React, { useState } from 'react';
import { experimental_useObject as useObject } from 'ai/react';
import { z } from 'zod';
import AnalyticalPanel from '@/components/AnalyticalPanel';

const analysisSchema = z.object({
  score: z.number().min(0).max(100),
  strategicFit: z.array(z.object({ issue: z.string(), suggestion: z.string() })),
  indicatorCompliance: z.array(z.object({ issue: z.string(), suggestion: z.string() })),
  wordingToneRealism: z.array(z.object({ issue: z.string(), suggestion: z.string() })),
});

export default function GrantPulseWorkspace() {
  const [text, setText] = useState('');
  const [framework, setFramework] = useState('usaid');

  // Stream data from our API on-the-fly into React component states
  const { object, submit, isLoading } = useObject({
    api: '/api/analyze',
    schema: analysisSchema,
  });

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || isLoading) return;
    submit({ text, framework });
  };

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Bar Configuration Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="h-9 w-9 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-extrabold text-base shadow-sm">
            GP
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 tracking-tight">GrantPulse</h1>
            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">CARE International Deployment Workspace</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <label htmlFor="framework-select" className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Target Rubric:
          </label>
          <select 
            id="framework-select"
            value={framework}
            onChange={(e) => setFramework(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-700 rounded-lg py-2 px-3 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition shadow-sm"
          >
            <option value="usaid">USAID Humanitarian Assistance</option>
            <option value="echo">European Union (ECHO)</option>
            <option value="un_ocha">UN OCHA Core Indicators</option>
          </select>
        </div>
      </header>

      {/* Main Dual-Pane Area */}
      <div className="flex-1 flex flex-col md:flex-row p-6 gap-6 overflow-hidden h-[calc(100vh-73px)]">
        
        {/* Left Pane: Interactive Input/Drafting Station */}
        <div className="flex-1 flex flex-col bg-white rounded-xl border border-slate-200 shadow-sm p-4 overflow-hidden">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-xs font-bold text-slate-500 tracking-wider uppercase">Project Narrative Segment</h2>
            <span className="text-xs font-mono text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
              {text.trim() === '' ? 0 : text.trim().split(/\s+/).length} words
            </span>
          </div>
          
          <textarea
            className="flex-1 w-full p-4 border border-slate-200 rounded-lg resize-none font-sans text-sm text-slate-700 leading-relaxed focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 transition"
            placeholder="Paste your specific section narrative drafts here (e.g., local stakeholder mobilization strategies, protection gender markers)..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          <button
            onClick={handleAnalyze}
            disabled={isLoading || !text.trim()}
            className="mt-4 w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-100 disabled:text-slate-400 text-white font-semibold py-3 px-4 rounded-xl transition shadow-sm flex items-center justify-center text-sm"
          >
            {isLoading ? "Streaming Evaluation Metrics..." : "Run Optimization Run"}
          </button>
        </div>

        {/* Right Pane: Analytical Panel (Safely handles undefined streaming data chunks) */}
        <AnalyticalPanel 
          score={object?.score}
          strategicFit={object?.strategicFit}
          indicatorCompliance={object?.indicatorCompliance}
          wordingToneRealism={object?.wordingToneRealism}
          isLoading={isLoading}
        />
      </div>
    </main>
  );
}