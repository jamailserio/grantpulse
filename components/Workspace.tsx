"use client";

import React from "react";
import { experimental_useObject as useObject } from "ai/react";
import { z } from "zod";
import AnalyticalPanel from "./AnalyticalPanel";

const analysisSchema = z.object({
  overallScore: z.number().optional(),
  frameworkAlignment: z.array(z.string()).optional(),
  narrativeStrengths: z.array(z.string()).optional(),
  improvementAreas: z.array(z.string()).optional()
});

export default function Workspace() {
  const [text, setText] = React.useState("");

  const { object, submit, isLoading, error } = useObject({
    api: "/api/analyze",
    schema: analysisSchema,
  });

  const handleDirectTrigger = () => {
    if (isLoading) return;
    submit({ text: text || "Bypass empty validation input", framework: "usaid" });
  };

  const currentScore = object?.overallScore ?? (object as any)?.overallScore;
  const alignmentItems = object?.frameworkAlignment ?? (object as any)?.frameworkAlignment ?? [];
  const strengthItems = object?.narrativeStrengths ?? (object as any)?.narrativeStrengths ?? [];
  const improvementItems = object?.improvementAreas ?? (object as any)?.improvementAreas ?? [];

  return (
    <div className="flex flex-col md:flex-row gap-6 p-6 max-w-7xl mx-auto h-[calc(100vh-80px)]">
      {/* INPUT PANEL */}
      <div className="flex-1 flex flex-col bg-white rounded-xl border border-slate-200 shadow-sm p-5 h-full">
        <div className="flex justify-between items-center mb-4">
          <label className="text-sm font-bold text-slate-700 tracking-wide uppercase block">
            Project Narrative Segment
          </label>
          <span className="text-xs text-slate-400 font-mono bg-slate-50 border border-slate-100 px-2 py-1 rounded">
            {text.split(/\s+/).filter(Boolean).length} words
          </span>
        </div>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste your operational proposal narrative segment here..."
          className="flex-1 w-full p-4 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm resize-none mb-4 shadow-inner"
        />

        <button
          type="button"
          onClick={handleDirectTrigger}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl transition text-sm cursor-pointer shadow-md"
        >
          {isLoading ? "⚡ Streaming Evaluation Matrix..." : "Run Optimization Run"}
        </button>

        {error && (
          <div className="mt-3 p-3 bg-red-50 border border-red-100 rounded-lg text-xs text-red-600">
            Pipeline Alert: {error.message}
          </div>
        )}
      </div>

      {/* SCORECARD PANEL */}
      <AnalyticalPanel
        score={currentScore}
        strategicFit={alignmentItems}
        indicatorCompliance={strengthItems}
        wordingToneRealism={improvementItems}
        rawObject={object}
        isLoading={isLoading}
      />
    </div>
  );
}
