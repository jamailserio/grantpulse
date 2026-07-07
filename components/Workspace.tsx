"use client";

import React, { useState } from "react";
import AnalyticalPanel from "./AnalyticalPanel";

export default function Workspace() {
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [debugLog, setDebugLog] = useState<string>("System initialized. Ready for text.");
  const [analysisData, setAnalysisData] = useState<any>({});

  const handleDirectTrigger = async () => {
    setDebugLog("Button clicked. Starting analysis...");
    setIsLoading(true);

    try {
      setDebugLog("Sending POST request to /api/analyze...");
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: text || "Sample proposal text to bypass empty inputs", framework: "usaid" }),
      });

      setDebugLog(`Server responded with status: ${response.status}`);
      if (!response.ok) throw new Error(`HTTP Error ${response.status}`);

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No readable stream channel available.");

      const decoder = new TextDecoder();
      let rawBuffer = "";

      setDebugLog("Reading data stream...");
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        rawBuffer += chunk;

        // Strip text protocol anomalies if present
        let clean = rawBuffer.replace(/^\d+:"/gm, "").replace(/"$/gm, "");

        const start = clean.indexOf("{");
        const end = clean.lastIndexOf("}");

        if (start !== -1 && end !== -1 && end > start) {
          try {
            const parsed = JSON.parse(clean.substring(start, end + 1));
            setAnalysisData(parsed);
            setDebugLog(`Data updating live! Score: ${parsed.overallScore || "Processing"}`);
          } catch (e) {
            // Keep waiting for data completion
          }
        }
      }
      setDebugLog("Stream parsing complete!");
    } catch (err: any) {
      setDebugLog(`Pipeline Error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 p-6 max-w-7xl mx-auto h-[calc(100vh-80px)]">
      {/* INPUT INTERFACE */}
      <div className="flex-1 flex flex-col bg-white rounded-xl border border-slate-200 shadow-sm p-5 h-full">
        <div className="mb-4">
          <label className="text-sm font-bold text-slate-700 tracking-wide uppercase block">
            Project Narrative Segment
          </label>
        </div>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste your operational proposal narrative segment here..."
          className="flex-1 w-full p-4 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm resize-none mb-4 shadow-inner"
        />

        {/* Dynamic status log bar right inside the view */}
        <div className="mb-3 p-2.5 bg-slate-900 text-amber-400 font-mono text-[11px] rounded-lg border border-slate-800 shadow-sm">
          📟 Status: {debugLog}
        </div>

        <button
          type="button"
          onClick={handleDirectTrigger}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl transition text-sm cursor-pointer shadow-md active:translate-y-0.5"
        >
          {isLoading ? "⚡ Running Processing Stream..." : "Run Optimization Run"}
        </button>
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
