"use client";

import React, { useState } from "react";
import AnalyticalPanel from "./AnalyticalPanel";

export default function Workspace() {
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [analysisData, setAnalysisData] = useState<any>(null);

  const handleDirectTrigger = async () => {
    if (!text.trim() || isLoading) return;
    
    setIsLoading(true);
    setAnalysisData(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, framework: "usaid" }),
      });

      if (!response.ok) throw new Error("Server error");

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let accumulatedText = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          const chunk = decoder.decode(value, { stream: true });
          // Strip out typical Vercel AI SDK data streaming prefixes if present
          const cleanChunk = chunk.replace(/^0:"|^e:/gm, "").replace(/"$/gm, "");
          accumulatedText += cleanChunk;

          try {
            // Attempt to look for complete JSON blocks inside the stream
            const jsonStart = accumulatedText.indexOf("{");
            const jsonEnd = accumulatedText.lastIndexOf("}");
            if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
              const rawJson = accumulatedText.substring(jsonStart, jsonEnd + 1);
              const parsed = JSON.parse(rawJson);
              setAnalysisData(parsed);
            }
          } catch (e) {
            // Wait for next chunk to form a complete JSON object string
          }
        }
      }
    } catch (err) {
      console.error("Fetch operational error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 p-6 max-w-7xl mx-auto h-[calc(100vh-80px)]">
      <div className="flex-1 flex flex-col bg-white rounded-xl border border-slate-200 shadow-sm p-5 h-full">
        <label className="text-sm font-bold text-slate-700 tracking-wide uppercase block mb-4">
          Project Narrative Segment
        </label>
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
          {isLoading ? "⚡ Parsing Narrative Streams..." : "Run Optimization Run"}
        </button>
      </div>

      <AnalyticalPanel
        score={analysisData?.overallScore}
        strategicFit={analysisData?.frameworkAlignment?.map((item: string) => ({ issue: item, suggestion: "Align with framework specifications." }))}
        indicatorCompliance={analysisData?.narrativeStrengths?.map((item: string) => ({ issue: item, suggestion: "Review target criteria parameters." }))}
        wordingToneRealism={analysisData?.improvementAreas?.map((item: string) => ({ issue: item, suggestion: "Refine professional wording delivery." }))}
        isLoading={isLoading}
      />
    </div>
  );
}
