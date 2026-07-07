"use client";

import React, { useState } from "react";
import AnalyticalPanel from "./AnalyticalPanel";

export default function Workspace() {
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisData, setAnalysisData] = useState<{
    overallScore?: number;
    frameworkAlignment?: string[];
    narrativeStrengths?: string[];
    improvementAreas?: string[];
  }>({});

  const handleDirectTrigger = async () => {
    if (!text.trim() || isLoading) return;
    
    setIsLoading(true);
    setError(null);
    setAnalysisData({});

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, framework: "usaid" }),
      });

      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let accumulatedText = "";

      if (!reader) {
        throw new Error("ReadableStream not supported by browser channel.");
      }

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        // Decode binary chunk to string string
        const chunk = decoder.decode(value, { stream: true });
        accumulatedText += chunk;

        // Clean out Vercel stream-protocol framing noise if present
        let cleanText = accumulatedText
          .replace(/^\d+:"/gm, "")
          .replace(/"$/gm, "")
          .replace(/\\n/g, "\n")
          .replace(/\\"/g, '"');

        // Extract valid JSON boundaries from stream accumulation
        const firstBrace = cleanText.indexOf("{");
        const lastBrace = cleanText.lastIndexOf("}");

        if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
          try {
            const potentialJson = cleanText.substring(firstBrace, lastBrace + 1);
            const parsed = JSON.parse(potentialJson);
            setAnalysisData(parsed);
          } catch (e) {
            // Incomplete JSON fragment chunk; continue accumulating
          }
        }
      }
    } catch (err: any) {
      console.error("Pipeline breakdown:", err);
      setError(err.message || "Failed to stream processing units.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 p-6 max-w-7xl mx-auto h-[calc(100vh-80px)]">
      {/* INPUT INTERFACE */}
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
          disabled={isLoading || !text.trim()}
          className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-100 disabled:text-slate-400 text-white font-bold py-3.5 rounded-xl transition text-sm cursor-pointer shadow-sm"
        >
          {isLoading ? "⚡ Parsing Infrastructure Streams..." : "Run Optimization Run"}
        </button>

        {error && (
          <div className="mt-3 p-3 bg-red-50 border border-red-100 rounded-lg text-xs text-red-600 font-mono">
            Error: {error}
          </div>
        )}
      </div>

      {/* COMPLIANCE CARD */}
      <AnalyticalPanel
        score={analysisData?.overallScore}
        strategicFit={analysisData?.frameworkAlignment || []}
        indicatorCompliance={analysisData?.narrativeStrengths || []}
        wordingToneRealism={analysisData?.improvementAreas || []}
        rawObject={analysisData}
        isLoading={isLoading}
      />
    </div>
  );
}
