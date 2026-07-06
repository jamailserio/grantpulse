"use client";

import React, { useState } from "react";
import { experimental_useObject as useObject } from "ai/react";
import { z } from "zod";
import AnalyticalPanel from "./AnalyticalPanel";

// Explicitly define the schema structure directly on the client to guide the hook
const analysisSchema = z.object({
  overallScore: z.number(),
  frameworkAlignment: z.object({ items: z.array(z.string()) }),
  narrativeStrengths: z.object({ items: z.array(z.string()) }),
  improvementAreas: z.object({ items: z.array(z.string()) })
});

export default function Workspace() {
  const [text, setText] = useState("");
  const [framework, setFramework] = useState("usaid");

  // Wire up the official modern Vercel AI SDK react hook
  const { object, submit, isLoading, error } = useObject({
    api: "/api/analyze",
    schema: analysisSchema,
  });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Stop Windows from breaking or reloading the page
    if (!text.trim() || isLoading) return;

    console.log("Form submission caught! Transmitting payload to /api/analyze...");

    // This forces the modern engine to fire a POST request under your network tab
    submit({ text, framework });
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 p-6 max-w-7xl mx-auto h-[calc(100vh-80px)]">
      {/* INPUT INTERFACE */}
      <form onSubmit={handleFormSubmit} className="flex-1 flex flex-col bg-white rounded-xl border border-slate-200 shadow-sm p-5 h-full">
        <div className="flex justify-between items-center mb-4">
          <div>
            <label className="text-sm font-bold text-slate-700 tracking-wide uppercase block">
              Project Narrative Segment
            </label>
            <span className="text-xs text-slate-400">
              Provide your active draft text below for compliance optimization.
            </span>
          </div>
          <span className="text-xs text-slate-400 font-mono bg-slate-50 border border-slate-100 px-2 py-1 rounded">
            {text.split(/\s+/).filter(Boolean).length} words
          </span>
        </div>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste your operational proposal narrative segment here..."
          className="flex-1 w-full p-4 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm resize-none leading-relaxed text-slate-700 mb-4 shadow-inner"
        />

        <button
          type="submit"
          disabled={isLoading || !text.trim()}
          className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-100 disabled:text-slate-400 text-white font-bold py-3.5 px-4 rounded-xl transition shadow-sm flex items-center justify-center space-x-2 text-sm cursor-pointer disabled:cursor-not-allowed"
        >
          {isLoading ? "⚡ Attaching Cloud Streaming Pipes..." : "Run Optimization Run"}
        </button>

        {error && (
          <div className="mt-3 p-3 bg-red-50 border border-red-100 rounded-lg text-xs text-red-600 font-mono">
            Error: {error.message || "Failed to establish edge pipeline connect."}
          </div>
        )}
      </form>

      {/* COMPLIANCE DISPLAY */}
      <AnalyticalPanel
        score={(object as any)?.overallScore}
        strategicFit={(object as any)?.frameworkAlignment?.items?.map((item: any) => ({ issue: item, suggestion: "Align with framework specifications." }))}
        indicatorCompliance={(object as any)?.narrativeStrengths?.items?.map((item: any) => ({ issue: item, suggestion: "Review target compliance indicators." }))}
        wordingToneRealism={(object as any)?.improvementAreas?.items?.map((item: any) => ({ issue: item, suggestion: "Refine professional wording delivery." }))}
        isLoading={isLoading}
      />
    </div>
  );
}