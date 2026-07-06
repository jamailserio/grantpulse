"use client";

import { FRAMEWORKS } from "@/lib/frameworks";
import { MIN_NARRATIVE_LENGTH, meetsNarrativeBaseline } from "@/lib/constants";
import type { Framework } from "@/lib/schemas";

type DraftingStationProps = {
  text: string;
  framework: Framework;
  isLoading: boolean;
  onTextChange: (value: string) => void;
  onFrameworkChange: (value: Framework) => void;
  onAnalyze: () => void;
  onStop: () => void;
};

export function DraftingStation({
  text,
  framework,
  isLoading,
  onTextChange,
  onFrameworkChange,
  onAnalyze,
  onStop,
}: DraftingStationProps) {
  const canSubmit = meetsNarrativeBaseline(text);

  return (
    <section className="flex min-h-[70vh] flex-col rounded-2xl border border-care-navy/10 bg-white shadow-sm">
      <div className="border-b border-care-navy/10 px-5 py-4">
        <h2 className="text-lg font-semibold text-care-navy">Drafting Station</h2>
        <p className="mt-1 text-sm text-care-slate">
          Paste or draft your project narrative. Native paste shortcuts are
          supported.
        </p>
      </div>

      <div className="border-b border-care-navy/10 px-5 py-4">
        <label
          htmlFor="framework"
          className="mb-2 block text-sm font-medium text-care-navy"
        >
          Donor framework
        </label>
        <select
          id="framework"
          value={framework}
          onChange={(event) =>
            onFrameworkChange(event.target.value as Framework)
          }
          className="w-full rounded-lg border border-care-navy/15 bg-care-mist px-3 py-2 text-sm text-care-navy outline-none ring-care-orange focus:ring-2"
        >
          {FRAMEWORKS.map((item) => (
            <option key={item.id} value={item.id}>
              {item.label}
            </option>
          ))}
        </select>
        <p className="mt-2 text-xs text-care-slate">
          {FRAMEWORKS.find((item) => item.id === framework)?.description}
        </p>
      </div>

      <div className="flex flex-1 flex-col px-5 py-4">
        <label htmlFor="narrative" className="sr-only">
          Project narrative
        </label>
        <textarea
          id="narrative"
          value={text}
          onChange={(event) => onTextChange(event.target.value)}
          placeholder="Paste your humanitarian project narrative here..."
          className="min-h-[420px] flex-1 resize-none rounded-xl border border-care-navy/10 bg-care-mist/60 px-4 py-4 text-sm leading-7 text-care-navy outline-none ring-care-orange focus:ring-2"
        />
        <div className="mt-4 flex items-center justify-between gap-3">
          <p className="text-xs text-care-slate">
            {text.length.toLocaleString()} characters in local memory
            {!canSubmit
              ? ` · minimum ${MIN_NARRATIVE_LENGTH} required`
              : null}
          </p>
          <div className="flex gap-2">
            {isLoading ? (
              <button
                type="button"
                onClick={onStop}
                className="rounded-lg border border-care-navy/15 px-4 py-2 text-sm font-medium text-care-navy transition hover:bg-care-mist"
              >
                Stop
              </button>
            ) : null}
            <button
              type="button"
              onClick={onAnalyze}
              disabled={!canSubmit || isLoading}
              className="rounded-lg bg-care-orange px-5 py-2 text-sm font-semibold text-white transition hover:bg-care-orange/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? "Analyzing..." : "Analyze Narrative"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
