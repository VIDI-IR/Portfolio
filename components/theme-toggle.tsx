"use client";

import { useLayoutEffect } from "react";
import { focusRing } from "@/app/ui";

type Theme = "light" | "dark";

function readStoredTheme(): Theme {
  const stored = window.localStorage.getItem("theme");
  if (stored === "light" || stored === "dark") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

/*
 * The `data-theme` attribute on <html> is the single source of truth, set by
 * the inline script in the root layout before first paint. This component
 * holds no state of its own: both icons are rendered and CSS picks one off
 * that attribute, so the right icon is painted from the very first frame
 * rather than after hydration.
 */
export function ThemeToggle() {
  useLayoutEffect(() => {
    // React's dev Strict Mode remount resets <html> to the attributes it
    // manages from JSX, dropping the one the inline script set. Re-apply it.
    // No-op in production, where the remount never happens.
    document.documentElement.setAttribute("data-theme", readStoredTheme());
  }, []);

  /*
   * The theme flip itself is two lines. The rest is a circular wipe that grows
   * from the button, drawn by the View Transitions API.
   *
   * It earns its place because it is *communicative*, which is the line NN/g
   * draws between animation that helps and animation that annoys: the new
   * theme visibly spreads out of the control that caused it, so the cause and
   * the effect are tied together. It also runs only on a deliberate click, so
   * nobody meets it by scrolling past.
   *
   * 400ms is the top of NN/g's 100-400ms band, reserved for "big movements
   * across large screens", which a full-viewport wipe is. Past 500ms they
   * measure animations starting to feel like a drag.
   *
   * Two exits back to an instant flip: reduced-motion, and any browser without
   * the API. Same-document view transitions only reached Baseline in Oct 2025.
   */
  function toggle(event: React.MouseEvent<HTMLButtonElement>) {
    const root = document.documentElement;
    const next: Theme =
      root.getAttribute("data-theme") === "dark" ? "light" : "dark";

    const apply = () => {
      root.setAttribute("data-theme", next);
      window.localStorage.setItem("theme", next);
    };

    if (
      typeof document.startViewTransition !== "function" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      apply();
      return;
    }

    // Origin is the button's centre; the radius is the distance to the
    // furthest corner, so the circle always finishes by covering the viewport.
    const box = event.currentTarget.getBoundingClientRect();
    const x = box.left + box.width / 2;
    const y = box.top + box.height / 2;
    const radius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    );

    root.style.setProperty("--wipe-x", `${x}px`);
    root.style.setProperty("--wipe-y", `${y}px`);
    root.style.setProperty("--wipe-r", `${radius}px`);
    // Scopes the CSS below to this transition rather than every view
    // transition the page might ever run.
    root.dataset.themeWipe = "";

    document.startViewTransition(apply).finished.finally(() => {
      delete root.dataset.themeWipe;
    });
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle theme"
      /* 44x44 is the documented minimum touch target (Apple HIG / WCAG 2.5.8);
         the icon inside stays visually small. */
      className={`flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-foreground/10 ${focusRing}`}
    >
      {/* Sun — shown in dark mode, i.e. "switch to light". */}
      <svg
        aria-hidden
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="theme-icon-sun h-4.5 w-4.5"
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
      </svg>

      {/* Moon — shown in light mode, i.e. "switch to dark". */}
      <svg
        aria-hidden
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="theme-icon-moon h-4.5 w-4.5"
      >
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
      </svg>
    </button>
  );
}
