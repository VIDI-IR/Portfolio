"use client";

import { useEffect, useRef, useState } from "react";
import { focusRing } from "@/app/ui";

/*
 * A mailto link assumes a configured mail client. Plenty of recruiters work
 * out of webmail, where it opens nothing, so the address itself is offered as
 * a copy target beside it.
 *
 * The confirmation is the point. Nielsen's response-time limits put 0.1s as
 * the threshold below which a system feels instantaneous, so the state flips
 * on the same frame as the click and the icon swap runs at 100ms, which is
 * NN/g's figure for simple feedback animations like a checkbox. It holds for
 * two seconds, then returns, so the control is never stuck in a state the user
 * has to clear.
 */
const EMAIL = "vidiilhamramadhan@gmail.com";
const HOLD_MS = 2000;

export function CopyEmail({ email = EMAIL }: { email?: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
    } catch {
      // Clipboard access can be refused (insecure context, denied permission).
      // Say nothing and change nothing: the address is on screen to select by
      // hand, and the mailto button beside this one is unaffected.
      return;
    }

    setCopied(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), HOLD_MS);
  }

  return (
    <button
      type="button"
      onClick={copy}
      data-copied={copied ? "" : undefined}
      /* The visible label changes, so the accessible name would change with
         it. This keeps the name fixed and lets the live region below carry
         the result instead. */
      aria-label={`Copy email address ${email}`}
      className={`copy-email group flex h-11 items-center gap-2 rounded-full border border-border px-5 font-mono text-sm text-muted transition-colors hover:border-accent hover:text-accent ${focusRing}`}
    >
      <span className="relative flex h-4 w-4 shrink-0 items-center justify-center">
        <svg
          aria-hidden
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="copy-icon-idle absolute h-4 w-4"
        >
          <rect x="9" y="9" width="11" height="11" rx="2" />
          <path d="M5 15V5a2 2 0 0 1 2-2h10" />
        </svg>
        <svg
          aria-hidden
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.25"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="copy-icon-done absolute h-4 w-4 text-accent"
        >
          <path d="m4 12.5 5.5 5.5L20 7" />
        </svg>
      </span>

      {/* Both labels occupy the same grid cell, so the button is always as
          wide as the address and confirming never shifts the layout. */}
      <span aria-hidden className="grid">
        <span className="copy-label-idle col-start-1 row-start-1">{email}</span>
        <span className="copy-label-done col-start-1 row-start-1 text-accent">
          Copied
        </span>
      </span>

      {/* Screen readers get the confirmation the icon gives everyone else. */}
      <span aria-live="polite" className="sr-only">
        {copied ? "Email address copied to clipboard" : ""}
      </span>
    </button>
  );
}
