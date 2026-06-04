# Design — Prompt Journal

A locked design system for this app. Every page redesign reads this file before emitting code. Do not regenerate per page — extend or amend this file when the system needs to grow.

## Genre
modern-minimal

## Macrostructure family
- Marketing pages: Ecosystem Index (public index / homepage)
- App pages:       Workbench (admin pages)
- Content pages:   Long Document (public chat pages)

## Theme
- `--color-paper`: oklch(98.5% 0.004 250) (cool light white)
- `--color-paper-2`: oklch(96.5% 0.006 250)
- `--color-paper-3`: oklch(94.5% 0.008 250)
- `--color-ink`: oklch(24% 0.02 258) (cool charcoal)
- `--color-ink-2`: oklch(34% 0.018 257) (lighter charcoal body text)
- `--color-rule`: oklch(91% 0.005 250) (cool ruler hairlines)
- `--color-rule-2`: oklch(85% 0.01 250) (deeper divider lines)
- `--color-accent`: oklch(58% 0.20 256) (electric cobalt blue)
- `--color-accent-ink`: oklch(98.5% 0.004 250) (contrast text on cobalt)
- `--color-focus`: oklch(58% 0.20 256 / 0.4)
- `--color-graphite`: oklch(22% 0.016 260) (dark code/terminal panel background)

## Typography
- Display: Space Grotesk, weight 600, style normal
- Body:    Inter, weight 400
- Mono:    JetBrains Mono, weight 400
- Display tracking: -0.02em
- Type scale anchor: clamp(2.25rem, 4vw + 0.5rem, 3.5rem)

## Spacing
4-point named scale. The values are in `app/globals.css`. Pages must use named spacing classes (e.g. `p-4` / `gap-4` maps to `1.5rem`), never arbitrary values.

## Motion
- Easings: cubic-bezier(0.16, 1, 0.3, 1) named `--ease-out`
- Reveal pattern: fade + slide rising ~10px, ease-out 600ms
- Reduced-motion fallback: opacity-only, <= 150ms.

## Microinteractions stance
- Hover: 1px cobalt underline-grow on nav/links; 1px border-color shift to cobalt on cards/inputs
- Transition delay: hover/focus 0ms

## CTA voice
- Primary CTA: solid cobalt background, 6px border-radius, lowercase label, Space Grotesk / Inter
- Secondary CTA: bordered hairline, 6px border-radius, lowercase label

## Per-page allowances
- Marketing pages: Ecosystem index. Technical code hero visual with inline tags and filters.
- App pages: Workbench dashboard with quick action headers, simple stat strips, and itemized tabular Spec lists.
- Content pages: Long Document. Focus entirely on typography, markdown layout correctness, copy button actions, and clean message streams.

## What pages MUST share
- The wordmark / logotype "Prompt Journal" in Space Grotesk.
- The accent color and its placement (<= 5% per viewport).
- The display, body, and mono fonts.
- The CTA voice (button shape, 6px border-radius, padding rhythm).
- Section heading rhythm (JetBrains Mono uppercase indicator + Space Grotesk displays).

## What pages MAY differ on
- Macrostructure layout (Ecosystem Index vs Workbench vs Long Document).
- Column count and card placement within the grid structure.
