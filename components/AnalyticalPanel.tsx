"use client";

import React, { useState } from "react";

interface FeedbackItem {
  issue: string;
  suggestion: string;
}

interface AnalyticalPanelProps {
  score?: number;
  strategicFit?: FeedbackItem[];
  indicatorCompliance?: FeedbackItem[];
  wordingToneRealism?: FeedbackItem[];
  isLoading?: boolean;
}

// Fixed data definitions
const SECTION_CONFIGS = [
  { key: "strategicFit", title: "Strategic Fit", icon: "🛡️", color: "border-amber-500" },
  { key: "indicatorCompliance", title: "Indicator Compliance", icon: "📊", color: "border-emerald-500" },
  { key: "wordingToneRealism", title: "Wording & Tone Realism", icon: "✍️", color: "border-indigo-500" },
];

export default function AnalyticalPanel({
  score,
  strategicFit = [],
  indicatorCompliance = [],
  wordingToneRealism = [],
  isLoading = false,
}: AnalyticalPanelProps) {
  const [openSection, setOpenSection] = useState<string | null>("strategicFit");

  const getScoreStyles = (currentScore?: number) => {
    if (currentScore === undefined || currentScore === null) return "bg-slate-100 text-slate-400 border-slate-200";
    if (currentScore < 50) return "bg-red-50 text-red-700 border-red-300";
    if (currentScore < 80) return "bg-amber-50 text-amber-700 border-amber-300";
    return "bg-emerald-50 text-emerald-700 border-emerald-300 font-extrabold";
  };

  // Safe mapping array to read incoming items cleanly
  const dataMap: Record<string, FeedbackItem[]> = {
    strategicFit,
    indicatorCompliance,
    wordingToneRealism,
  };

  return (
    <div className="w-full md:w-[480px] bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col h-full overflow-y-auto">
      <h2 className="text-sm font-bold text-slate-700 tracking-wide uppercase mb-4">
        Compliance Scorecard
      </h2>

      <div className="flex items-center space-x-4 p-4 rounded-xl bg-slate-50 border border-slate-100 mb-6">
        <div className={`h-16 w-16 rounded-full border-2 flex items-center justify-center font-bold text-xl transition-all duration-300 ${getScoreStyles(score)}`}>
          {score !== undefined ? `${score}%` : "--"}
        </div>
        <div>
          <p className="text-sm font-bold text-slate-800">Overall Compliance Index</p>
          <p className="text-xs text-slate-500">Evaluates performance across key institutional operational milestones.</p>
        </div>
      </div>

      {/* The Map Loop that was breaking is now completely sanitized */}
      <div className="space-y-4 flex-1">
        {SECTION_CONFIGS.map((section) => {
          const items = dataMap[section.key] || [];
          return (
            <AccordionSection
              key={section.key}
              title={section.title}
              icon={section.icon}
              borderColor={section.color}
              summary={items}
              isOpen={openSection === section.key}
              onToggle={() => setOpenSection(openSection === section.key ? null : section.key)}
            />
          );
        })}
      </div>

      {isLoading && (
        <div className="mt-4 p-3 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-center space-x-2 text-xs text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span>Ingesting secure LLM tokens natively in-memory...</span>
        </div>
      )}
    </div>
  );
}

interface AccordionSectionProps {
  title: string;
  icon: string;
  borderColor: string;
  summary: FeedbackItem[];
  isOpen: boolean;
  onToggle: () => void;
}

function AccordionSection({
  title,
  icon,
  borderColor,
  summary,
  isOpen,
  onToggle,
}: AccordionSectionProps) {
  return (
    <div className="border border-slate-200/80 rounded-xl overflow-hidden shadow-sm bg-white transition-all">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 bg-slate-50/70 hover:bg-slate-50 transition text-left focus:outline-none"
      >
        <span className="font-bold text-slate-700 text-sm flex items-center gap-2.5">
          <span className="text-base select-none">{icon}</span> {title}
        </span>
        <span className="text-slate-400 text-[10px] tracking-widest font-black uppercase">
          {isOpen ? "✕ CLOSE" : "⚡ VIEW"}
        </span>
      </button>

      {isOpen && (
        <div className="p-4 bg-white divide-y divide-slate-100/60 max-h-[300px] overflow-y-auto">
          {summary && summary.length > 0 ? (
            summary.map((item, idx) => (
              <div key={idx} className={`py-3.5 first:pt-0 last:pb-0 border-l-4 ${borderColor} pl-3.5 my-2 bg-slate-50/40 rounded-r-lg`}>
                <strong className="text-xs text-slate-800 block font-semibold mb-1.5 leading-snug">
                  ⚠️ Issue: {item.issue}
                </strong>
                <span className="text-xs text-emerald-800 block bg-emerald-50/50 p-2.5 rounded-md border border-emerald-100/70 leading-relaxed">
                  💡 Recommendation: {item.suggestion}
                </span>
              </div>
            ))
          ) : (
            <p className="text-xs text-slate-400 italic py-3 text-center">
              No structural alignment issues flag this component dimension.
            </p>
          )}
        </div>
      )}
    </div>
  );
}