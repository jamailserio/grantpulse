"use client";

import React, { useState } from "react";
import { experimental_useObject as useObject } from "ai/react";
import { z } from "zod";
import AnalyticalPanel from "./AnalyticalPanel";

// The matching validation schema to let the client handle protocol fragments automatically
const analysisSchema = z.object({
  overallScore: z.number(),
  frameworkAlignment: z.object({ items: z.array(z.string()) }),
  narrativeStrengths: z.object({ items: z.array(z.string()) }),
  improvementAreas: z.object({ items: z.array(z.string()) })
});

export default function Workspace() {
  const [text, setText] = useState("");

  // Use the native SDK hook which natively parses the '0:"..."' protocol packets
  const { object, submit, isLoading, error } = useObject({
    api: "/api/analyze",
    schema: analysisSchema,
  });

  const handleDirectTrigger = () => {
    if (!text.trim() || isLoading) return;
    submit({ text, framework: "usaid" });
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 p-6 max-w-7xl mx-auto h-[calc(100vh-80px)]">
      {/* INPUT PANEL */}
      <div className="flex-1 flex flex-col bg-white rounded-xl border border-slate-200 shadow-sm p-5 h-full">
        <div className="flex justify-between items-center mb-4">
          <div>
            <label className="text-sm font-bold text-slate-700 tracking-wide uppercase block">
              Project Narrative Segment
            </label>
          </div>
          <span className="text-xs text-slate-400 font-mono bg-slate-50 border border-slate-100 px-2 py-1 rounded">
            {text.split(/\s+/).filter(Boolean).length} words
          </span>
        </div>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste your operational proposal narrative segment here..."
          className="flex-1 w-full p-4 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm resize-none mb-4"
        />

        <button
          type="button"
          onClick={handleDirectTrigger}
          disabled={isLoading || !text.trim()}
          className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-100 disabled:text-slate-400 text-white font-bold py-3.5 rounded-xl transition text-sm cursor-pointer"
        >
          {isLoading ? "⚡ Streaming Analytics..." : "Run Optimization Run"}
        </button>

        {error && (
          <div className="mt-3 p-3 bg-red-50 border border-red-100 rounded-lg text-xs text-red-600">
            Pipeline Connection Alert: {error.message}
          </div>
        )}
      </div>
      {/* SCORECARD PANEL */}
      <AnalyticalPanel
        score={(object as any)?.overallScore}
        strategicFit={(object as any)?.frameworkAlignment?.map((item: any) => ({ issue: item, suggestion: "Review framework criteria alignment." }))}
        indicatorCompliance={(object as any)?.narrativeStrengths?.map((item: any) => ({ issue: item, suggestion: "Review narrative metric strengths." }))}
        wordingToneRealism={(object as any)?.improvementAreas?.map((item: any) => ({ issue: item, suggestion: "Address target improvement recommendation." }))}
        isLoading={isLoading}
      />
    </div>
  );
}
