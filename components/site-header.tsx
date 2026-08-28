import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { focusRingWide, focusRingFlush } from "@/app/ui";

const SECTIONS = [
  { href: "#work", label: "Work" },
  { href: "#experience", label: "Experience" },
  { href: "#skills", label: "Skills" },
  { href: "#contact", label: "Contact" },
];

export function SiteHeader() {
  return (
    /*
     * Sticky is justified here only because the header carries navigation:
     * NN/g measured ~22% faster navigation from persistent headers, but that
     * saving comes from the nav being reachable, not from the bar existing.
     *
     * Height is held to 60px (py-2 + the 44px touch target) = ~9% of a 667px
     * phone viewport, inside NN/g's "under 10%" guidance. It was 84px / 12.6%.
     */
    <header className="site-header sticky top-0 z-20 w-full">
      {/*
        Skip link (WCAG 2.4.1 Bypass Blocks). Visually hidden until focused, so
        it is the first thing a keyboard user reaches and nobody else sees it.
      */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-30 focus:rounded-full focus:bg-foreground focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-background"
      >
        Skip to content
      </a>

      {/* Chrome only appears once actually stuck — see globals.css. */}
      <div className="header-bar relative flex w-full items-center justify-between px-6 py-2">
        {/* Reading progress. Decorative, so kept out of the a11y tree. */}
        <div
          aria-hidden
          className="scroll-progress absolute inset-x-0 bottom-0 h-px bg-accent"
        />

        <Link
          href="/"
          className={`rounded-sm text-sm font-medium tracking-tight text-foreground transition-colors hover:text-accent ${focusRingWide}`}
        >
          Vidi Ilham Ramadhan
        </Link>

        <div className="flex items-center gap-1">
          {/*
            Hidden below md. NN/g's mobile guidance is to strip a persistent
            header back to brand + control; keeping four links would push the
            bar past the height budget on exactly the screens where users
            react worst to an oversized header.
          */}
          <nav aria-label="Sections" className="hidden md:block">
            <ul className="flex items-center gap-1">
              {SECTIONS.map((s) => (
                <li key={s.href}>
                  <a
                    href={s.href}
                    className={`rounded-full px-3 py-2 font-mono text-sm text-muted transition-colors hover:text-accent ${focusRingFlush}`}
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
