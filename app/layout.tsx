import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SITE_URL } from "./site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const TITLE = "Vidi Ilham Ramadhan | Full-Stack & AI Agent Developer";
const DESCRIPTION =
  "Full-stack and AI agent developer at Kalbe International, Jakarta. Sole developer of a production AI agent backend on Google ADK, FastAPI and MCP tool calling.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/" },
  // og:image, its dimensions and alt text are added automatically from
  // app/opengraph-image.jpg and opengraph-image.alt.txt.
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Vidi Ilham Ramadhan",
    title: TITLE,
    description: DESCRIPTION,
  },
  twitter: {
    // Without this the card renders as a small thumbnail beside the text
    // rather than the full-width image.
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

const THEME_INIT_SCRIPT = `(function(){try{var s=localStorage.getItem("theme");var t=s==="light"||s==="dark"?s:(window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");document.documentElement.setAttribute("data-theme",t)}catch(e){}})()`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-theme="light"
      /* Next 16 no longer overrides scroll-behavior during navigation unless
         this is set — without it, route changes would animate instead of
         jumping instantly. In-page anchors still scroll smoothly. */
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="min-h-dvh flex flex-col font-sans">{children}</body>
    </html>
  );
}
