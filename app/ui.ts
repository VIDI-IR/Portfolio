/*
 * Class strings shared between page.tsx and the header. Anything used in only
 * one file stays inline in that file — this is deliberately just the overlap.
 *
 * Three focus variants exist because the offset that reads well differs by
 * context: a bordered pill wants a gap, a bare text link wants a wider one,
 * and a control already inside a bordered box wants none. See the note in the
 * cleanup summary — collapsing these to one style would be a visual change.
 */
export const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background";

export const focusRingWide =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-background";

export const focusRingFlush =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent";
