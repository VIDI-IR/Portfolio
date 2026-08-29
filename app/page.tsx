import Image from "next/image";
import { SiteHeader } from "@/components/site-header";
import { CopyEmail } from "@/components/copy-email";
import { focusRing, focusRingFlush } from "@/app/ui";

/*
 * Portrait crop, expressed directly in source pixels of the original 4000x6000
 * frame. x / y = top-left corner, w / h = its size. The container derives its
 * aspect ratio from w/h, so these stay the single source of truth — move them
 * and nothing else needs to change.
 *
 * Landmarks: pupils y≈1295, face centre x≈2000, hair top y≈930.
 * Eyes sit on the upper rule-of-thirds line, i.e. y + h/3 ≈ 1295.
 *
 * A 4:5 portrait rather than a square: it wastes far fewer source pixels, so
 * the photo stays sharp at hero scale without a heavier file.
 */
const SRC_W = 4000;
const SRC_H = 6000;
const CROP = { x: 800, y: 295, w: 2400, h: 3000 };

const EXPERIENCE = [
  {
    company: "Kalbe International",
    location: "Jakarta, Indonesia",
    /* No dedicated site — Kalbe International is a subsidiary of PT Kalbe
       Farma, so this points at the group's corporate portal. */
    url: "https://kalbeinternational.com/about-us/",
    urlLabel: "Kalbe group site",
    roles: [
      {
        title: "Fullstack Developer & Agentic AI Developer Intern",
        period: "Jan 2026 – Present",
        blurb:
          "Build AI agent backends and enterprise web applications for internal business systems. Sole developer of KIAI, a production agent backend on Google ADK and FastAPI with MCP tool calling, and builder of transaction modules in the freight expense system that post automatically to GL and AP. Also review and test third-party AI deliverables against Kalbe's own business logic before acceptance, rather than taking vendor architecture on trust.",
      },
      {
        title: "Fullstack Developer Intern",
        period: "Jul 2024 – Nov 2024",
        blurb:
          "Sole developer on a legacy enterprise system modernization, from requirements gathering to delivery. Reverse-engineered a .NET system without access to its source code, reconstructing business rules and data models from observed behaviour, then rebuilt it in React across roughly ten master data modules and one transaction module. Gathered requirements directly with business users and designed the interface in Figma before building it.",
      },
    ],
  },
];

/*
 * Deliberately four facts and no prose. For a technical role the projects
 * below carry the weight; a long education block competes with them for the
 * few seconds a recruiter spends scanning. Awards are omitted for the same
 * reason. Add `gpa` back into the list below if it should appear.
 */
const EDUCATION = {
  degree: "BSc (Hons) Computer Science, Artificial Intelligence",
  period: "Sep 2022 – Oct 2025",
  schools: [
    {
      name: "Asia Pacific University of Technology & Innovation (APU)",
      note: "Kuala Lumpur, Malaysia",
      url: "https://www.apu.edu.my/about-apu",
      urlLabel: "apu.edu.my",
    },
    {
      name: "De Montfort University",
      note: "Leicester, United Kingdom. Dual award.",
      url: "https://www.dmu.ac.uk/about-dmu/index.aspx",
      urlLabel: "dmu.ac.uk",
    },
  ],
};

/* url is optional: the Kalbe systems are internal and have nothing public to
   link to. Typed explicitly so the optional field is legible at a glance. */
type Project = {
  name: string;
  full: string;
  role: string;
  org: string;
  year: string;
  summary: string;
  points: string[];
  stack: string[];
  url?: string;
  urlLabel?: string;
};

const PROJECTS: Project[] = [
  {
    name: "KIAI",
    full: "Kalbe International Artificial Intelligence",
    role: "Sole developer",
    org: "Kalbe International",
    year: "2026",
    summary:
      "Production AI agent backend on Google ADK, FastAPI and MCP tool calling.",
    points: [
      "Built a production AI agent backend on Google Agent Development Kit (ADK) and FastAPI, including the agent instructions and the tool schema the agent calls.",
      "Integrated Google Calendar as an agent tool through an MCP subprocess authenticated with GCP domain-wide delegation. Added slowapi rate limiting and an SSE streaming endpoint for real-time responses.",
      "Routed model calls through LiteLLM and OpenRouter for provider portability. Chose GPT-4o-mini because a smaller model was sufficient without excess latency.",
    ],
    stack: ["Google ADK", "FastAPI", "MCP", "GCP", "LiteLLM", "SSE"],
  },
  {
    name: "AAF",
    full: "Accrual Actual Freight",
    role: "Freight expense system with GL and AP integration",
    org: "Kalbe International",
    year: "2026",
    summary:
      "Resolved a production data-integrity incident. The manual resubmits stopped.",
    points: [
      "Resolved a production data-integrity incident in the financial posting flow: bulk inserts into GL Journal and AP Invoice completed with rows silently missing, forcing manual resubmission of each affected batch. Remediated the records and refactored the bulk insert path to surface failures. The manual resubmits stopped.",
      "Built bulk Excel upload handling 100+ rows per upload, with row-level validation and error reporting against 3 master data sources. Users see which row failed and why.",
      "Implemented document lifecycle states with automated GL and AP posting and error-log diagnostics. Built 1 core transaction module and contributed to 2 others.",
    ],
    stack: ["SQL Server", "Data Validation", "GL / AP Posting", "Excel Upload"],
  },
  {
    name: "KI Commercial AI Chatbot",
    full: "Technical review and testing",
    role: "Reviewer",
    org: "Kalbe International",
    year: "2026",
    summary:
      "Technical review and hands-on testing of a third-party ADK system on GCP.",
    points: [
      "Review and test a third-party AI chatbot built on Google ADK microservices, FastAPI, Django and React across GCP (Vertex AI, BigQuery, Cloud SQL, Cloud Run).",
      "Assess architecture documents, exercise the system hands-on, and escalate findings so the solution fits Kalbe business logic rather than a repackaged template.",
    ],
    stack: ["Google ADK", "Vertex AI", "BigQuery", "Cloud Run", "Django"],
  },
  {
    name: "KIFAST",
    full: "Legacy .NET modernization",
    role: "Sole developer",
    org: "Kalbe International",
    year: "2024",
    summary:
      "Legacy .NET system reverse-engineered and rebuilt in React, delivered solo in 4 months.",
    points: [
      "Delivered KIFAST end to end as the only developer over a 4-month timeline. Gathered requirements with business users, designed the UI in Figma, and built ~10 master data modules and 1 transaction module.",
      "Reverse-engineered a legacy .NET system without access to source code, reconstructing business rules and data models from observed UI behaviour, then migrated it to React.",
      "Users worked from Excel but the legacy UI did not resize, blocking side-by-side entry. Rebuilt the interface responsively to speed up data entry.",
    ],
    stack: ["React", "Node.js", "Express.js", "Figma"],
  },
  {
    name: "Portfolio",
    full: "This site",
    role: "Designed and built solo",
    org: "Personal",
    year: "2026",
    summary:
      "Designed and built from scratch, with no template or component library.",
    url: "https://github.com/VIDI-IR/Portfolio",
    urlLabel: "Source on GitHub",
    points: [
      "Designed it as well as built it: the layout, colour system, typography and motion are all mine rather than a theme I filled in.",
      "Kept it fast. The whole page is 226 KB and served as static files, with the animation written in plain CSS so there is no library to download and scrolling stays smooth.",
      "Built to work for everyone. Keyboard navigation, screen readers and reduced-motion settings are all supported, and every colour pairing was measured against WCAG contrast thresholds rather than assumed.",
      "Degrades gracefully. On older browsers the effects switch off and the content is still complete and readable, instead of breaking.",
    ],
    stack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Accessibility"],
  },
];

const SKILLS = [
  {
    group: "AI & Agents",
    items: [
      "AI Agent Development",
      "Google ADK",
      "Model Context Protocol (MCP)",
      "Tool Calling",
      "LLM Integration",
      "LiteLLM",
      "OpenRouter",
    ],
  },
  {
    group: "Backend",
    items: [
      "FastAPI",
      "Node.js",
      "Express.js",
      "REST API Design",
      "JWT Auth",
      "Server-Sent Events",
    ],
  },
  {
    group: "Frontend",
    items: ["React", "HTML", "CSS", "Responsive Web Design", "Figma"],
  },
  {
    group: "Data",
    items: [
      "SQL",
      "SQL Server",
      "Database Design",
      "Data Validation",
      "Data Integrity",
      "Bulk Data Upload",
    ],
  },
  {
    group: "Languages",
    items: ["Python", "JavaScript", "SQL", "Java", "C", "Dart"],
  },
  {
    group: "Cloud & Practices",
    items: [
      "Google Cloud Platform",
      "Google Calendar API",
      "Domain-Wide Delegation",
      "Git",
      "Requirements Gathering",
      "Technical Review",
    ],
  },
];

/* Mono on labels and metadata — not body copy, where it would hurt reading
   speed. Category conventions live mostly in type, and this is the cheapest
   technical signal available: the face is already loaded for the chips. */
const eyebrow =
  "font-mono text-xs font-medium uppercase tracking-[0.2em] text-accent";
const heading = "mt-3 text-3xl font-semibold tracking-tight";
const chip =
  "rounded-full border border-border px-3 py-1 font-mono text-xs text-muted";

/* One container for every section, so headings and rules share a left and
   right edge down the whole page. It matches the hero's max-w-5xl, which is
   the widest thing on the page and therefore sets the column. */
const section = "mx-auto w-full max-w-5xl px-6 py-24";

/* The container is wider than body copy should be. 70ch lands inside the
   45-75 character measure that reading research treats as comfortable; at the
   full 5xl width a line would run past 110. Applied to running prose only,
   never to headings, chips or metadata. */
const measure = "max-w-[70ch] text-pretty text-base leading-relaxed text-muted";

const extLink = `inline-flex items-center gap-1 rounded-sm underline decoration-border underline-offset-4 transition-colors hover:text-accent hover:decoration-accent ${focusRing}`;

/* Arrow marks the link as leaving the site; the sr-only text says so out loud,
   since a visual-only cue tells screen-reader users nothing (WCAG G201). */
function ExternalLink({
  href,
  children,
  label,
}: {
  href: string;
  children: React.ReactNode;
  label: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={extLink}
    >
      {children}
      <svg
        aria-hidden
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-3.5 w-3.5 shrink-0"
      >
        <path d="M7 17 17 7M9 7h8v8" />
      </svg>
      <span className="sr-only">{label} (opens in a new tab)</span>
    </a>
  );
}

export default function Home() {
  return (
    <>
      <SiteHeader />

      <main id="main">
        {/* ---------------------------------------------------------- Hero */}
        <section className="relative flex min-h-[calc(100dvh-4rem)] flex-col items-center justify-center px-6 py-16">
          <div className="hero-exit grid w-full max-w-5xl items-center gap-10 md:grid-cols-[minmax(0,0.85fr)_1fr] md:gap-16">
            {/*
              Portrait panel. Aspect ratio comes straight from the CROP
              constants, so the frame can never disagree with the crop maths.
              A soft bottom fade keeps the "dissolving into the page" feel the
              circle had, without a radial mask mangling a rectangle.
            */}
            <div
              className="rise relative w-full overflow-hidden rounded-2xl bg-foreground/5"
              style={{
                aspectRatio: `${CROP.w} / ${CROP.h}`,
                WebkitMaskImage:
                  "linear-gradient(to bottom, black 78%, transparent 100%)",
                maskImage:
                  "linear-gradient(to bottom, black 78%, transparent 100%)",
              }}
            >
              <Image
                src="/profile-web.webp"
                alt="Vidi Ilham Ramadhan"
                width={SRC_W}
                height={SRC_H}
                unoptimized
                priority
                className="absolute max-w-none"
                style={{
                  width: `${(SRC_W / CROP.w) * 100}%`,
                  height: "auto",
                  left: `${(-CROP.x / CROP.w) * 100}%`,
                  top: `${(-CROP.y / CROP.h) * 100}%`,
                  filter: "saturate(0.8) hue-rotate(5deg)",
                }}
              />
            </div>

            <div className="flex flex-col items-center text-center md:items-start md:text-left">
              <p
                className={`rise ${eyebrow}`}
                style={{ animationDelay: "60ms" }}
              >
                Full-Stack &amp; AI Agent Developer
              </p>

              <h1
                className="rise mt-3 text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl"
                style={{ animationDelay: "120ms" }}
              >
                Vidi Ilham Ramadhan
              </h1>

              <p
                className="rise mt-6 max-w-md text-balance text-lg italic leading-snug text-foreground/75 sm:text-xl"
                style={{ animationDelay: "180ms" }}
              >
                &ldquo;Learning is a road with no end, walked only by those
                strong enough to keep going.&rdquo;
              </p>

              <div
                className="rise mt-8 h-px w-10 bg-border"
                style={{ animationDelay: "240ms" }}
              />

              <p
                className="rise mt-8 max-w-lg text-pretty text-base leading-relaxed text-muted"
                style={{ animationDelay: "300ms" }}
              >
                I&apos;m a full-stack and AI agent developer at Kalbe
                International, part of the Kalbe Farma group. I&apos;m the sole
                developer of a production AI agent backend built on
                Google&apos;s Agent Development Kit, FastAPI and MCP tool
                calling, and I build enterprise systems with bulk data upload,
                row-level validation against master data, and automated GL and
                AP posting. Based in Jakarta, open to onsite, hybrid and remote.
              </p>
            </div>
          </div>

          {/* Scroll affordance. There is content below the fold now. */}
          <a
            href="#experience"
            className={`rise absolute bottom-8 rounded-sm px-3 py-2 text-xs uppercase tracking-[0.18em] text-muted transition-colors hover:text-accent ${focusRingFlush}`}
            style={{ animationDelay: "420ms" }}
          >
            Scroll
          </a>
        </section>

        {/* ---------------------------------------------------- Experience */}
        <section
          id="experience"
          aria-labelledby="experience-heading"
          className={section}
        >
          <p className={`reveal ${eyebrow}`}>Experience</p>
          <h2 id="experience-heading" className={`reveal ${heading}`}>
            Where I&apos;ve worked
          </h2>

          <div className="mt-10 space-y-10">
            {EXPERIENCE.map((e) => (
              <div key={e.company} className="reveal">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                  <h3 className="text-xl font-semibold tracking-tight">
                    <ExternalLink href={e.url} label={e.urlLabel}>
                      {e.company}
                    </ExternalLink>
                  </h3>
                  <span className="font-mono text-xs text-muted">
                    {e.location}
                  </span>
                </div>

                <ol className="mt-5 space-y-5 border-l border-border pl-6">
                  {e.roles.map((r) => (
                    <li key={r.title}>
                      <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                        <h4 className="font-medium">{r.title}</h4>
                        <span className="font-mono text-xs text-muted">
                          {r.period}
                        </span>
                      </div>
                      <p className={`mt-2 ${measure}`}>{r.blurb}</p>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </section>

        {/* ------------------------------------------------------ Projects */}
        <section
          id="work"
          aria-labelledby="work-heading"
          className={section}
        >
          <div className="reveal">
            <p className={eyebrow}>Projects</p>
            <h2 id="work-heading" className={heading}>
              Things I&apos;ve built
            </h2>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-muted">
              Systems shipped at Kalbe International, from AI agent backends to
              enterprise financial tooling. Open any row for the detail.
            </p>
          </div>

          {/*
            Numbered index with progressive disclosure. Native <details>/<summary>
            rather than a JS accordion: it is focusable and toggles on Enter/Space
            for free, announces its expanded/collapsed state to screen readers,
            and still works with JS disabled. The collapsed row carries the
            impact line, so the section stays scannable — which is how hiring
            managers actually read a portfolio — while the detail stays one
            keystroke away instead of dumped on the page.
          */}
          <ol className="mt-12 border-t border-border">
            {PROJECTS.map((p, i) => (
              <li key={p.name} className="reveal border-b border-border">
                <details className="disclosure group">
                  {/* The wash tells you the whole row is the target, not just
                      the control at its end. Negative margin lets it bleed
                      past the text without moving any of it. */}
                  <summary className="-mx-3 flex cursor-pointer list-none items-start gap-4 rounded-lg px-3 py-6 transition-colors hover:bg-accent/6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-background group-open:bg-accent/6 [&::-webkit-details-marker]:hidden">
                    <span className="mt-1 font-mono text-xs text-muted tabular-nums">
                      {String(i + 1).padStart(2, "0")}
                    </span>

                    <span className="flex-1">
                      {/* A heading, not a styled span: screen reader users
                          navigate by heading, and five projects with none
                          meant your work was unreachable that way. */}
                      <h3 className="text-xl font-semibold tracking-tight transition-colors group-hover:text-accent">
                        {p.name}
                      </h3>
                      <span className="mt-1 block text-pretty text-base leading-relaxed text-muted">
                        {p.summary}
                      </span>
                    </span>

                    <span className="mt-1.5 hidden shrink-0 font-mono text-xs text-muted tabular-nums sm:block">
                      {p.year}
                    </span>

                    {/*
                      A bare icon read as decoration and was missed. This is a
                      bordered, tinted, labelled control instead: an explicit
                      verb plus an icon that rotates 45° into a close mark.
                      aria-hidden because <summary> already announces its own
                      expanded/collapsed state, so the label would double up.
                    */}
                    <span
                      aria-hidden
                      className="mt-0.5 flex shrink-0 items-center gap-1.5 rounded-full border border-accent/45 bg-accent/10 px-3 py-1.5 font-mono text-xs font-medium text-accent transition-colors group-hover:border-accent group-hover:bg-accent/20"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        className="h-3.5 w-3.5 transition-transform duration-200 group-open:rotate-45"
                      >
                        <path d="M12 5v14M5 12h14" />
                      </svg>
                      <span className="group-open:hidden">Details</span>
                      <span className="hidden group-open:inline">Close</span>
                    </span>
                  </summary>

                  <div className="pb-8 sm:pl-10">
                    <p className="text-sm text-muted">
                      {p.full} · {p.role} · {p.org}
                    </p>

                    <ul className="mt-4 space-y-3">
                      {p.points.map((pt) => (
                        <li key={pt.slice(0, 40)} className={measure}>
                          {pt}
                        </li>
                      ))}
                    </ul>

                    <ul className="mt-5 flex flex-wrap gap-2">
                      {p.stack.map((s) => (
                        <li key={s} className={chip}>
                          {s}
                        </li>
                      ))}
                    </ul>

                    {/*
                      Deliberately inside the expanded panel, not the summary
                      row: a link nested in <summary> is interactive content
                      inside interactive content, so activating it would also
                      toggle the disclosure.
                    */}
                    {p.url && (
                      <p className="mt-5 font-mono text-sm">
                        <ExternalLink href={p.url} label={p.urlLabel ?? p.name}>
                          {p.urlLabel ?? "View source"}
                        </ExternalLink>
                      </p>
                    )}
                  </div>
                </details>
              </li>
            ))}
          </ol>
        </section>

        {/*
          ---------------------------------------------------------- Skills

          Sits after Projects, so it reads as the index to the work above
          rather than a list of claims made before any evidence.
        */}
        <section
          id="skills"
          aria-labelledby="skills-heading"
          className={section}
        >
          <p className={`reveal ${eyebrow}`}>Skills</p>
          <h2 id="skills-heading" className={`reveal ${heading}`}>
            What I work with
          </h2>

          <dl className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {SKILLS.map((s) => (
              <div key={s.group} className="reveal">
                <dt className="font-mono text-sm font-medium">{s.group}</dt>
                <dd>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {s.items.map((i) => (
                      <li key={i} className={chip}>
                        {i}
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
            ))}
          </dl>
        </section>

        {/*
          ------------------------------------------------------- Education

          Last of the credential sections and deliberately short. For a
          technical role the work above carries the decision, so this answers
          the qualification question without competing for attention.
        */}
        <section
          id="education"
          aria-labelledby="education-heading"
          className={section}
        >
          <p className={`reveal ${eyebrow}`}>Education</p>
          <h2 id="education-heading" className={`reveal ${heading}`}>
            What I studied
          </h2>

          <div className="reveal mt-10">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4">
              <h3 className="text-xl font-semibold tracking-tight">
                {EDUCATION.degree}
              </h3>
              <span className="font-mono text-xs text-muted">
                {EDUCATION.period}
              </span>
            </div>

            <ul className="mt-4 space-y-1.5">
              {EDUCATION.schools.map((s) => (
                <li key={s.name} className="text-base text-muted">
                  <ExternalLink href={s.url} label={s.urlLabel}>
                    {s.name}
                  </ExternalLink>{" "}
                  <span className="text-sm">{s.note}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ------------------------------------------------------- Contact */}
        <section
          id="contact"
          aria-labelledby="contact-heading"
          className={section}
        >
          {/* The section keeps the page's shared container so its edges line up
              with everything above; this inner column is what keeps the centred
              block from stretching across the full width. */}
          <div className="mx-auto max-w-2xl text-center">
            <p className={`reveal ${eyebrow}`}>Contact</p>
            <h2
              id="contact-heading"
              className="reveal mt-3 text-balance text-3xl font-semibold tracking-tight sm:text-4xl"
            >
              Let&apos;s build something
            </h2>
            <p className="reveal mt-5 text-pretty text-base leading-relaxed text-muted">
              Open to onsite, hybrid and fully remote roles. Based in Jakarta
              (Jabodetabek).
            </p>

            <div className="reveal mt-10 flex flex-wrap items-center justify-center gap-3">
              <a
                href="mailto:vidiilhamramadhan@gmail.com"
                className={`flex h-11 items-center rounded-full bg-foreground px-6 text-sm font-medium text-background transition-opacity hover:opacity-90 ${focusRing}`}
              >
                Email me
              </a>
              <a
                href="https://linkedin.com/in/vidi-ilham-ramadhan"
                target="_blank"
                rel="noopener noreferrer"
                className={`flex h-11 items-center rounded-full border border-border px-6 text-sm font-medium transition-colors hover:border-accent hover:text-accent ${focusRing}`}
              >
                LinkedIn
              </a>
            </div>

            {/* Second row so the address does not compete with the two primary
                actions above it. */}
            <div className="reveal mt-4 flex justify-center">
              <CopyEmail />
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
