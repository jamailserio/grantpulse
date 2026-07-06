"use client";

import { useState } from "react";
import { experimental_useObject as useObject } from "@ai-sdk/react";
import { DraftingStation } from "@/components/DraftingStation";
//  CORRECT: Default import matching our file configuration
import AnalyticalPanel from "@/components/AnalyticalPanel";
import { analysisResultSchema, type Framework } from "@/lib/schemas";
import { meetsNarrativeBaseline } from "@/lib/constants";

export function Workspace() {
  const [text, setText] = useState("");
  const [framework, setFramework] = useState<Framework>("usaid");

  const { object, submit, isLoading, error, stop } = useObject({
    api: "/api/analyze",
    schema: analysisResultSchema,
  });

  const handleAnalyze = () => {
    if (!meetsNarrativeBaseline(text)) {
      return;
    }

    submit({ text, framework });
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-care-navy/10 bg-white px-6 py-4">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-care-orange">
              GrantPulse MVP
            </p>
            <h1 className="text-2xl font-semibold text-care-navy">
              Humanitarian Narrative Workspace
            </h1>
            <p className="mt-1 text-sm text-care-slate">
              Ephemeral session only. Refreshing or closing this tab purges all
              inputs and scores.
            </p>
          </div>
          <div className="rounded-full border border-care-navy/10 bg-care-mist px-4 py-2 text-xs font-medium text-care-slate">
            Zero backend data retention
          </div>
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-[1600px] flex-1 gap-6 p-6 lg:grid-cols-2">
        <DraftingStation
          text={text}
          framework={framework}
          isLoading={isLoading}
          onTextChange={setText}
          onFrameworkChange={setFramework}
          onAnalyze={handleAnalyze}
          onStop={stop}
        />
      <AnalyticalPanel
        score={object?.overallScore}
        strategicFit={object?.frameworkAlignment?.items?.map((item: any) => ({ issue: item, suggestion: "Review alignment criteria" })) as any}
        indicatorCompliance={object?.narrativeStrengths?.items?.map((item: any) => ({ issue: item, suggestion: "Check target indicator metrics" })) as any}
        wordingToneRealism={object?.improvementAreas?.items?.map((item: any) => ({ issue: item, suggestion: "Verify operational tone delivery" })) as any}
        isLoading={isLoading}
      />
      </main>
    </div>
  );
}
