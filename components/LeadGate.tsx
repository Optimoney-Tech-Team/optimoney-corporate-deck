"use client";

import { useState } from "react";
import Image from "next/image";
import { CheckCircle2, Loader2 } from "lucide-react";

type Status = "idle" | "loading" | "success" | "error";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface LeadGateProps {
  apiEndpoint: string;
  eyebrow: string;
  headlinePlain: string;
  headlineBold: string;
  subtitle: string;
  stats: [{ num: string; desc: string }, { num: string; desc: string }, { num: string; desc: string }];
  quote?: string;
  introText?: string; // omit for a shorter, corporate-deck-style page (hero straight into the form)
  badges?: string[]; // small pills under the subtitle, e.g. ["TMS-AGNOSTIC", "API-FIRST"]
  documentLabel: string; // used in the card copy, e.g. "Lifting the Diligence Burden"
  fields?: "full" | "basic"; // full = name/title/email/company; basic = name/email only
}

export default function LeadGate(props: LeadGateProps) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", title: "", email: "", company: "" });
  const isBasic = props.fields === "basic";

  const update = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const isValid =
    form.name.trim() !== "" &&
    (isBasic || form.company.trim() !== "") &&
    EMAIL_REGEX.test(form.email);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setError("");

    try {
      const res = await fetch(props.apiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setStatus("success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setStatus("error");
    }
  };

  return (
    <main className="min-h-screen bg-cream text-ink font-work">
      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0a2e27] via-[#0f4a3b] to-[#157a5e] text-[#F5F3EE] px-6 md:px-12 py-16 md:py-24">
        <div className="pointer-events-none absolute -top-36 -right-20 w-[420px] h-[420px] rounded-full border border-white/10" />
        <div className="pointer-events-none absolute -top-5 right-16 w-[260px] h-[260px] rounded-full border border-white/10" />

        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="inline-flex items-center bg-white rounded-2xl px-6 py-4 mb-10">
            <Image src="/logo.svg" alt="Optimoney" width={222} height={125} priority className="h-14 w-auto" />
          </div>

          <p className="font-mono text-[11px] tracking-[0.3em] uppercase text-white/65 mb-6">
            {props.eyebrow}
          </p>

          <h1 className="font-playfair text-4xl md:text-6xl leading-[1.15] mb-5">
            {props.headlinePlain}
            <br />
            <strong className="font-bold">{props.headlineBold}</strong>
          </h1>

          <p className="text-lg md:text-xl text-white/70 mb-6">{props.subtitle}</p>

          {props.badges && (
            <div className="flex flex-wrap gap-3 mb-10">
              {props.badges.map((b) => (
                <span
                  key={b}
                  className="font-mono text-[10px] tracking-[0.15em] uppercase text-white bg-white/10 border border-white/25 rounded-full px-4 py-2"
                >
                  {b}
                </span>
              ))}
            </div>
          )}

          <div className="flex flex-wrap gap-6 border-t border-white/15 pt-6">
            {props.stats.map((s) => (
              <div key={s.num} className="flex-1 min-w-[140px]">
                <p className="font-playfair text-2xl md:text-3xl text-emerald-400 mb-1.5">{s.num}</p>
                <p className="text-xs text-white/60 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>

          {props.quote && (
            <blockquote className="mt-10 border-l-2 border-emerald-500 pl-5 italic text-lg leading-relaxed text-white/90 font-playfair">
              {props.quote}
            </blockquote>
          )}
        </div>
      </section>

      {/* ── BODY ── */}
      <div className={`max-w-3xl mx-auto px-6 md:px-12 ${props.introText ? "py-14 md:py-20" : "py-10 md:py-14"}`}>
        {props.introText && (
          <>
            <p className="text-lg text-ink/75 leading-relaxed mb-12">{props.introText}</p>
            <div className="h-px bg-ink/[0.08] mb-12" />
          </>
        )}

        <div className="bg-white border border-ink/[0.06] rounded-3xl p-8 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.06)]">
          {status === "success" ? (
            <div className="text-center py-6">
              <div className="w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto mb-5">
                <CheckCircle2 size={28} />
              </div>
              <h2 className="font-playfair text-2xl font-medium mb-2">Check your inbox.</h2>
              <p className="text-sm text-ink/60 leading-relaxed">
                We&apos;ve sent the complete document to {form.email}.
              </p>
            </div>
          ) : (
            <>
              <h2 className="font-playfair text-2xl md:text-3xl font-medium mb-2">Get the Report</h2>
              <p className="text-sm text-ink/55 leading-relaxed mb-8">
                Enter your details and we&apos;ll send &ldquo;{props.documentLabel},&rdquo; straight to
                your inbox.
              </p>

              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Field label="Full Name">
                    <input
                      type="text"
                      required
                      placeholder="Mihir Mehta"
                      value={form.name}
                      onChange={update("name")}
                      className="input"
                    />
                  </Field>
                  <Field label="Work Email">
                    <input
                      type="email"
                      required
                      placeholder="mihirmehta@optimoneytech.com"
                      value={form.email}
                      onChange={update("email")}
                      className="input"
                    />
                  </Field>
                </div>

                {!isBasic && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Field label="Title / Role">
                      <input
                        type="text"
                        placeholder="Chief Compliance Officer"
                        value={form.title}
                        onChange={update("title")}
                        className="input"
                      />
                    </Field>
                    <Field label="Company">
                      <input
                        type="text"
                        required
                        placeholder="Organization Name"
                        value={form.company}
                        onChange={update("company")}
                        className="input"
                      />
                    </Field>
                  </div>
                )}

                {status === "error" && <p className="text-sm text-red-600">{error}</p>}

                <button
                  type="submit"
                  disabled={status === "loading" || !isValid}
                  className="mt-2 w-full bg-ink text-cream py-4 rounded-full font-mono text-xs tracking-[0.18em] uppercase flex items-center justify-center gap-2.5 hover:bg-[#1a1d24] transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-ink"
                >
                  {status === "loading" && <Loader2 size={16} className="animate-spin" />}
                  Send Me the Report
                </button>
              </form>
            </>
          )}
        </div>
      </div>

      <footer className="max-w-3xl mx-auto px-6 md:px-12 py-10 border-t border-ink/[0.06]">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <Image src="/logo.svg" alt="Optimoney" width={148} height={83} className="h-8 w-auto opacity-80" />
          <div className="text-right">
            <p className="text-xs text-ink/40 mb-1">© 2026 Optimoney Technologies Pvt. Ltd.</p>
            <a
              href="mailto:mihirmehta@optimoneytech.com"
              className="text-xs text-ink/50 hover:text-emerald-600 transition-colors"
            >
              mihirmehta@optimoneytech.com
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block font-mono text-[10px] tracking-[0.2em] uppercase text-ink/50 mb-2.5">
        {label}
      </label>
      {children}
    </div>
  );
}
