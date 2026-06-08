# Frontend Rules

- Mobile-first always — design for 375px, max-width 560px
- Light theme: `--bg: #f2f2f7`, `--card: #ffffff`, `--ink: #1c1c1e`
- Accent: `--lime: #7ee787` (fills/buttons), `--lime-dark: #28a745` (icons/text on light), `--lime-surface: #e8f5e9`
- Muted: `--muted: #6c6c70`, Border: `--border: #e5e7eb`
- Fonts: Barlow Condensed (headings/labels) + DM Mono (body/data)
- No external UI component libraries
- Cards: white with two-layer shadow `0 1px 3px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.04)`, border-radius 16px
- Bottom nav: frosted glass `rgba(255,255,255,0.85)` + `backdrop-filter: blur(20px)`
- All interactive elements must be touch-friendly (min 44px tap target)
- Empty states: short muted text centered in the content area
- Inline styles for layout, CSS variables for theming
