"use client";

import { useState } from "react";
import { X, FileText, Loader2, Copy, Check } from "lucide-react";
import type { UnifiedListing } from "@/lib/types";
import { formatCHF } from "@/lib/utils";

interface Props {
  listing: UnifiedListing;
  onClose: () => void;
}

type LetterTone = "formal" | "personal" | "confident";

export function ApplicationLetterModal({ listing, onClose }: Props) {
  const [tone, setTone] = useState<LetterTone>("formal");
  const [letter, setLetter] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateLetter = async () => {
    setIsGenerating(true);
    setError(null);
    setLetter("");

    const toneDesc = {
      formal: "Very formal and professional Swiss German business letter style",
      personal: "Warm and personal, showing genuine interest in the apartment and neighborhood",
      confident: "Confident and direct, highlighting strong financial position and stable employment",
    };

    const prompt = `Generate a professional apartment application letter (Bewerbungsschreiben) in German for this listing:

Title: ${listing.title}
Address: ${listing.address}
Rent: ${formatCHF(listing.rent)}/month
Rooms: ${listing.rooms ?? "unknown"}
Size: ${listing.sqm ? `${listing.sqm} m²` : "unknown"}
Kreis: ${listing.kreis}

Applicant profile:
- Name: Peter Blazsik
- Age: 49, Hungarian nationality
- Moving to Zurich July 1, 2026
- Employer: Zurich Insurance Group (Finance AI & Innovation Lead)
- Gross salary: CHF 180,000+/year
- Current residence: Vienna, Austria
- B permit (will be obtained)
- Non-smoker, no pets
- Single, quiet lifestyle
- Daughter Katie (9) visits from Vienna every 2-3 weeks

Tone: ${toneDesc[tone]}

Write the letter in German with:
1. Professional salutation (Sehr geehrte Damen und Herren)
2. Clear interest in the specific apartment with address reference
3. Brief personal introduction
4. Employment and financial stability emphasis
5. Why this neighborhood/Kreis appeals
6. Availability for viewing (flexible, can travel from Vienna)
7. List of documents available (Betreibungsauskunft, salary slips, employer reference, passport)
8. Professional closing

Keep it concise — max 300 words. Do not include English translations.`;

    try {
      const res = await window.fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: prompt }],
        }),
      });

      if (!res.ok) {
        setError("AI service unavailable. Please try again.");
        setIsGenerating(false);
        return;
      }

      const reader = res.body?.getReader();
      if (!reader) {
        setError("Failed to stream response.");
        setIsGenerating(false);
        return;
      }

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") continue;
            try {
              const parsed = JSON.parse(data);
              if (parsed.text) {
                setLetter((prev) => prev + parsed.text);
              }
            } catch {
              // skip malformed chunks
            }
          }
        }
      }
    } catch {
      setError("Network error. Please check your connection.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(letter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/60 z-[60]" onClick={onClose} />
      <div className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[640px] md:max-h-[80vh] bg-[var(--bg-primary)] border border-[var(--border-default)] rounded-xl z-[61] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--border-default)]">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-blue-500/15 p-1.5 border border-blue-500/30">
              <FileText className="h-4 w-4 text-blue-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                Bewerbungsschreiben Generator
              </h3>
              <p className="text-[10px] text-[var(--text-tertiary)]">
                AI-generated application letter for {listing.address}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-tertiary)]">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Tone selector */}
          <div>
            <div className="text-[10px] text-[var(--text-tertiary)] uppercase tracking-wider mb-2">
              Letter tone
            </div>
            <div className="flex gap-2">
              {(["formal", "personal", "confident"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTone(t)}
                  className={`flex-1 text-xs py-2 px-3 rounded-lg border transition-colors ${
                    tone === t
                      ? "border-[var(--accent-primary)] bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]"
                      : "border-[var(--border-default)] bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:border-[var(--text-tertiary)]"
                  }`}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Listing summary */}
          <div className="rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-default)] p-3 text-xs">
            <div className="font-medium text-[var(--text-primary)] mb-1">{listing.title}</div>
            <div className="text-[var(--text-tertiary)]">
              {listing.address} · {formatCHF(listing.rent)}/mo · {listing.rooms ?? "?"} rooms · K{listing.kreis}
            </div>
          </div>

          {/* Generate button */}
          {!letter && !isGenerating && (
            <button
              onClick={generateLetter}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-[var(--accent-primary)] px-4 py-3 text-sm font-medium text-white hover:bg-[var(--accent-hover)] transition-colors"
            >
              <FileText className="h-4 w-4" />
              Generate Application Letter
            </button>
          )}

          {/* Loading */}
          {isGenerating && !letter && (
            <div className="flex items-center justify-center gap-2 py-8">
              <Loader2 className="h-5 w-5 animate-spin text-[var(--accent-primary)]" />
              <span className="text-sm text-[var(--text-tertiary)]">Generating letter...</span>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="rounded-lg bg-red-500/10 border border-red-500/30 p-3 text-xs text-red-400">
              {error}
            </div>
          )}

          {/* Letter output */}
          {letter && (
            <div className="relative">
              <div className="rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-default)] p-4">
                <pre className="text-xs text-[var(--text-primary)] whitespace-pre-wrap font-sans leading-relaxed">
                  {letter}
                </pre>
                {isGenerating && (
                  <span className="inline-block w-2 h-4 bg-[var(--accent-primary)] animate-pulse ml-0.5" />
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {letter && !isGenerating && (
          <div className="p-4 border-t border-[var(--border-default)] flex gap-2">
            <button
              onClick={handleCopy}
              className="flex-1 flex items-center justify-center gap-2 rounded-lg border border-[var(--border-default)] bg-[var(--bg-secondary)] px-4 py-2.5 text-xs font-medium text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-colors"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? "Copied!" : "Copy to Clipboard"}
            </button>
            <button
              onClick={() => { setLetter(""); generateLetter(); }}
              className="flex items-center justify-center gap-2 rounded-lg bg-[var(--accent-primary)] px-4 py-2.5 text-xs font-medium text-white hover:bg-[var(--accent-hover)] transition-colors"
            >
              Regenerate
            </button>
          </div>
        )}
      </div>
    </>
  );
}
