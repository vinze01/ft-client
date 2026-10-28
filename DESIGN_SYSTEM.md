# Finance Tracker — Design System

Source of truth for all UI development in `ft-client`. Every view and
component must follow these standards.

---

## 1. Design philosophy

**Adaptive Premium Fintech** — minimalist, professional, calm, data-focused.

- Every visual element has a purpose. No decoration without meaning.
- Neutral surfaces carry the UI; color is reserved for information
  (income, expense, warnings, status) and the single user accent.
- Light and dark themes are first-class, driven entirely by CSS variables.
- Restraint everywhere: subtle borders instead of glow, small radii instead
  of pills, quiet motion instead of spectacle.

Strictly avoided: purple/blue gradients, glowing buttons, neon borders,
glassmorphism, floating decorative circles, oversized icon containers,
rainbow card backgrounds, uppercase-everything labels.

## 2. Color palette

All colors are CSS variables defined in `src/style.css` (`:root` for light,
`html.dark` for dark). Never hardcode hex values in components — use the
semantic Tailwind colors mapped below or `var(--token)` inline styles.

### Light theme

| Token | Value | Tailwind |
|---|---|---|
| `--bg` | `#F8FAFC` | `bg-canvas` |
| `--surface` | `#FFFFFF` | `bg-surface` |
| `--surface-elevated` | `#F1F5F9` | `bg-surface-elevated` |
| `--text-primary` | `#0F172A` | `text-ink` |
| `--text-secondary` | `#64748B` | `text-ink-secondary` |
| `--text-muted` | `#94A3B8` | `text-ink-muted` |
| `--border` | `#E2E8F0` | `border-line` |
| `--border-strong` | `#CBD5E1` | `border-line-strong` |
| `--income` | `#059669` | `text-income` |
| `--expense` | `#DC5C5C` | `text-expense` |
| `--warning` | `#D97706` | `text-warning` |

### Dark theme

| Token | Value |
|---|---|
| `--bg` | `#0B1120` |
| `--surface` | `#151E2E` |
| `--surface-elevated` | `#1E293B` |
| `--text-primary` | `#F1F5F9` |
| `--text-secondary` | `#94A3B8` |
| `--text-muted` | `#64748B` |
| `--border` | `#293548` |
| `--border-strong` | `#3B4A63` |
| `--income` | `#34D399` |
| `--expense` | `#FB7185` |
| `--warning` | `#FBBF24` |

Soft variants (`--income-soft`, `--expense-soft`, `--warning-soft`, ~12% alpha)
are for badge/chip/icon backgrounds: `bg-income-light`, `bg-expense-light`,
`bg-warning-light`.

### Accent color (user-customizable)

`themeStore` generates `--accent-color` and `--accent-50…900` (alpha steps of
the chosen hex) at runtime. Default: `#059669` (emerald). Components may use
`var(--accent-color)` and the alpha steps for focus rings, active nav states,
and selection highlights.

**Rules:**
1. The accent is the ONLY customizable color. `income`, `expense`, `warning`
   and all neutrals are fixed semantic tokens — never derive them from the
   accent.
2. Do not put the accent on borders of neutral containers; reserve it for
   interactive/selected states.
3. Zero balances use neutral text (`text-ink`), not income/expense color.
   Only positive/negative *non-zero* values get semantic color.

Legacy mapping: Tailwind `gray-*` resolves to the slate scale and `brand-*`
to the emerald scale, so older class names remain visually consistent while
views migrate to semantic tokens.

## 3. Typography

Inter, loaded in `style.css`. Body base size 14px.

| Role | Class / style | Spec |
|---|---|---|
| Page title | `.page-title` | 28px / 600 / tracking-tight |
| Section title | `.section-title` | 18px / 600 |
| Card heading | `.card-title` | 14px / 500 / secondary color |
| Financial amount | `.financial-amount` | tabular-nums, -0.025em, weight 600 |
| Body | default | 14px / 400 |
| Secondary text | `text-[13px]` | 13px / 400 / secondary color |
| Table heading | `.table th` | 12px / 600 / muted color, no uppercase |

Financial values (₱ amounts, percentages in tables/cards) must always carry
`.financial-amount` so digits align in tables and cards.

## 4. Spacing

4px base grid; 8px for major rhythm.

- Page padding: 24px desktop (`px-6`), 16px mobile (`px-4`).
- Card padding: 20px (`p-5`) standard, 16px dense.
- Section spacing: 24–32px (`mb-6` / `mb-8`).
- Component gaps: 12–16px (`gap-3` / `gap-4`).
- Form field spacing: 16–20px vertical.

## 5. Border radii

| Element | Radius | Tailwind |
|---|---|---|
| Cards / surfaces | 12px | `rounded-xl` |
| Buttons / inputs | 8px | `rounded-lg` |
| Modals | 16px | `rounded-2xl` |
| Badges | 6px | `rounded-md` |
| Icon chips | 8px | `rounded-lg` |

Avoid pill radii except for progress bars.

## 6. Shadows

Elevation is communicated primarily by borders + surface contrast; shadows
are subtle and defined via CSS vars so dark mode automatically flattens:

| Token | Light | Dark |
|---|---|---|
| `--shadow-card` | `0 1px 2px rgba(15,23,42,.05)` | `0 1px 3px rgba(0,0,0,.35)` |
| `--shadow-card-hover` | soft lift | soft lift |
| `--shadow-overlay` | modal/dropdown | modal/dropdown |

Tailwind: `shadow-card`, `shadow-card-hover`, `shadow-overlay`.
No colored/glow shadows anywhere.

## 7. Buttons

Classes: `.btn` + variant (`.btn-primary`, `.btn-secondary`, `.btn-danger`,
`.btn-ghost`) + optional `.btn-sm`.

- Primary: solid `var(--accent-color)`, white text, hover darkens 8%,
  active scales 0.98.
- Secondary: surface bg + border, hover elevates to `surface-elevated`.
- Danger: soft expense bg + expense text, hover adds inset ring.
- Ghost: text-only, hover surface-elevated.
- All: 8px radius, 150ms transitions, `focus-visible` ring (global), disabled
  50% opacity + no-cursor.

## 8. Inputs

`.input` + `.label`. 8px radius, surface bg, `--border` border, 14px text.
Focus: accent border + 3px `--accent-100` ring. Labels 13px/500 secondary.
Pair every input with a `<label>` (or `aria-label`). Show/hide password
buttons must be real `<button type="button">` with `aria-label`.

## 9. Cards

`.card` — surface bg, 1px `--border`, 12px radius, `shadow-card`.
`.card-hover` adds a subtle lift (1px translate + shadow, 180ms).
`.card-accent` highlights a selected/important card with accent border.
No gradient card backgrounds; soft semantic backgrounds only when they
communicate status.

## 10. Tables

`.table-container` > `.table`. Header row: `surface-elevated` bg, 12px/600
muted text, no uppercase. Rows separated by `--border`; hover row gets
`surface-elevated`. Money cells use `.financial-amount`. On mobile use the
`.mobile-card` list pattern (`.desktop-table` / `.mobile-card-list` toggles
at 768px).

## 11. Navigation

- Desktop (≥768px): collapsible sidebar (`Sidebar.vue`) — expanded 240px,
  collapsed 68px, grouped sections (Overview, Money, Planning, Tools,
  General), logo top, user card + logout bottom, tooltips when collapsed,
  active route = accent-soft bg + accent text + indicator.
- Mobile (<768px): `MobileTopbar.vue` + 5-item `BottomNav.vue`
  (Home, Income, Add, Budgets, More) with a slide-up "More" drawer for the
  remaining destinations. Content never hidden behind nav (`pb-20` on shell).
- Guest pages: no nav chrome.

## 12. Modals

`.modal-overlay` (black/50 + fade) > `.modal-content` (16px radius top-sheet
on mobile, centered dialog on desktop, `shadow-overlay`). Structure:
`.modal-header` / `.modal-body` / `.modal-footer`. Close on overlay click and
Escape where wired. Animations: 200ms fade + 0.97→1 scale.

## 13. Charts

Canvas-based (no chart library). Rules:

- Read colors from CSS vars at render time (`getComputedStyle`) so charts
  re-render correctly on theme/accent change.
- Income = `var(--income)`, Expenses = `var(--expense)` — always.
- Axis labels 11px `--text-muted`; subtle horizontal gridlines `--border`;
  no vertical gridlines; legend as small squares + labels.
- Rounded bar tops (4px). Empty data → `EmptyState`, not an empty chart box.

## 14. Components

Reusable building blocks in `src/components/`:

| Component | Purpose |
|---|---|
| `StatCard.vue` | Compact KPI card (label, value, icon, optional delta/progress) |
| `EmptyState.vue` | Icon + heading + description + optional action |
| `PageHeader.vue` | Page title + subtitle + actions slot |
| `PeriodSelector.vue` | Bi-monthly/monthly/yearly switcher + prev/next |
| `ProgressBar.vue` | Semantic progress bar with over-budget state |
| `ThemeToggle.vue` | Light/dark toggle bound to themeStore |
| `AuthLayout.vue` | Split-screen auth shell |
| `Toast.vue` / `ConfirmModal.vue` | Existing feedback system (`toast.*`, `await confirm(...)`) |

Do not create a component for one-off markup. All components must support
light/dark, keyboard access, and the spacing/radius standards above.

## 15. Animations

| Interaction | Duration |
|---|---|
| Button/hover transitions | 150ms |
| Card hover | 180ms |
| Page transition (fade/slide) | 200ms |
| Modal open | 200ms |
| Dropdown/drawer | 150–200ms |
| Sidebar collapse | 220ms |
| Progress fill | 450ms ease-out |

Use CSS transitions/animations (`animate-fade-in`, `animate-scale-in`,
`animate-slide-up`) and Vue `<Transition>` where state-driven. Everything is
disabled under `prefers-reduced-motion: reduce` (global rule in style.css).
No bouncing, glowing, or dramatic scaling.

## 16. Responsive breakpoints

Tailwind defaults: `sm` 640, `md` 768, `lg` 1024, `xl` 1280.

- **Mobile (<768px)**: bottom nav, 1–2 col stat grid, mobile card lists,
  16px page padding, bottom-sheet modals.
- **Tablet (768–1023px)**: collapsed-capable sidebar, 2-col stats,
  responsive charts/tables.
- **Desktop (≥1024px)**: full sidebar, 4-col stats, 2-col analytics,
  full tables, 24px page padding (max-width container).

Never: horizontal overflow, clipped amounts, content under fixed nav.

## 17. Accessibility (WCAG 2.2 AA)

- Global `:focus-visible` outline (2px accent, 2px offset).
- Semantic HTML: `nav`, `main`, `button`, `label`, headings in order.
- Every icon-only control has `aria-label` / `title`.
- Color is never the only signal — pair semantic color with text/badges
  (e.g. "Over Budget" badge, +/− signs).
- Touch targets ≥ 40px on mobile controls.
- `prefers-reduced-motion` honored globally.
- Modals: labelled headers, Escape/overlay close where wired.
