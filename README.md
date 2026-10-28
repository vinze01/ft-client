# ft-client — Finance Tracker frontend

Vue 3 + TypeScript + Vite single-page app for the Finance Tracker. It talks to the Express API in [`../ft-server`](../ft-server) and covers every feature that has a UI: dashboard, income/expense tracking, budgets, accounts and transfers, bills, goals, recurring transactions, insights, tags, savings, automations, notifications, and settings (profile, 2FA, sessions, export/import).

See the [root README](../README.md) for the full feature matrix, API map, and known limitations.

## Tech stack

- **Vue 3.5** — Options API with `defineComponent`. There is no `<script setup>` in this codebase.
- **TypeScript** — `strict: false` in `tsconfig.app.json`; `vue-tsc` is installed but not wired to a script.
- **Vite 5** — dev server and build.
- **vue-router 4** — history mode, `requiresAuth` / `guest` meta guards.
- **Pinia 2** — Options stores with manual `localStorage` persistence (no persisted-state plugin).
- **axios** — no shared client or interceptors; each store/view defines its own `API_URL`.
- **Tailwind CSS 3** — `darkMode: 'class'`, custom `brand`/`income`/`expense`/`warning` colors plus accent CSS variables.
- **dayjs** — date formatting.
- **thesvg** — icon components.

## Requirements

- Node.js (current LTS) and npm
- The backend running at `http://localhost:3001` (see [`../ft-server/README.md`](../ft-server/README.md))

The API base URL is hardcoded as `http://localhost:3001/api` in each store/view. There is no `VITE_*` environment variable, so the backend port must be `3001` unless you change the constants.

## Getting started

```bash
cd ft-client
npm install
npm run dev        # vite → http://localhost:5173
```

Then open http://localhost:5173 and register an account (or log in).

## Scripts

| Script | Command | Purpose |
|---|---|---|
| `npm run dev` | `vite` | Dev server with HMR on port `5173` |
| `npm run build` | `vite build` | Production build to `dist/` |
| `npm run preview` | `vite preview` | Serve the built `dist/` locally |

There are **no** test, lint, format, or typecheck scripts. `vue-tsc`/`typescript` exist as dev dependencies but are not wired to npm scripts. Do not assume `npm test` works — it is not defined.

## Project structure

```text
ft-client/
├── index.html
├── vite.config.ts            # Vue plugin + less preprocessor support
├── tailwind.config.js        # darkMode: 'class', brand/income/expense/warning colors
├── postcss.config.js
├── tsconfig.json / tsconfig.app.json / tsconfig.node.json
└── src/
    ├── main.ts               # app bootstrap, token header, themeStore.init()
    ├── App.vue               # auth-gated layout, Toast + ConfirmModal hosts
    ├── style.css             # theme variables + .btn/.card/.input/.table/.badge classes
    ├── utils.ts              # getFullName, getGreetings, getInitials
    ├── vite-env.d.ts
    ├── router/index.ts       # 17 page routes + `/` redirect + auth/guest guards
    ├── views/                # 17 pages
    ├── components/           # Navbar, BottomNav, Toast, ConfirmModal, SideCard (legacy, unused)
    ├── stores/               # 10 Pinia Options stores
    └── types/index.ts        # shared interfaces
```

### Pages

| Route | View | Notes |
|---|---|---|
| `/login`, `/register`, `/reset-password` | `Login`, `Register`, `ResetPassword` | Guest-only (`meta.guest`); unauthenticated redirect target is `/login` |
| `/dashboard` | `Dashboard.vue` | Period switcher (bi-monthly / monthly / yearly) + half-month selector |
| `/expenses` | `Expenses.vue` | CRUD, search, category/month filters |
| `/incomes` | `Incomes.vue` | Bulk create across months × half-months |
| `/budgets` | `Budgets.vue` | Per-category budgets with the same period model |
| `/accounts` | `Accounts.vue` | Balances, summary, transfers |
| `/bills` | `Bills.vue` | Due dates, mark paid/unpaid, subscriptions |
| `/goals` | `Goals.vue` | Contributions and progress |
| `/recurring` | `Recurring.vue` | Templates, manual execution |
| `/insights` | `Insights.vue` | Analytics charts (trends, burn rate, net worth, savings rate) |
| `/tags` | `Tags.vue` | Tag CRUD + link income/expense rows |
| `/savings` | `Savings.vue` | Savings plan config, allocations, projections |
| `/automations` | `Automations.vue` | Rule CRUD, dry-run test, run-all |
| `/notifications` | `Notifications.vue` | Center + delivery preferences |
| `/settings` | `Settings.vue` | Profile, avatar, password, 2FA, sessions, export/import, theme |

Navigation lives in `components/Navbar.vue` (desktop, includes the notification bell) and `components/BottomNav.vue` (mobile). `SideCard.vue` is legacy and unused.

### Stores

`auth`, `account`, `bill`, `goal`, `recurring`, `tag`, `savings`, `automation`, `notification`, `theme` — all Pinia Options stores (`defineStore(id, { state, getters, actions })`). `authStore` owns the token/user writes and `axios.defaults` header; `themeStore` owns dark mode and accent CSS variables.

## Conventions

- **Axios per file** — every store/view declares `const API_URL = 'http://localhost:3001/api'` and sends `Authorization: Bearer <token>` manually (stores) or relies on `axios.defaults` set at login/boot. Do not centralize this without being asked.
- **Auth** — token + user in `localStorage`; router guards are the only client-side access control. The API enforces per-row `userId` isolation.
- **Feedback** — `toast.success/error/warning/info(msg)` from `components/Toast.vue` and `await confirm({ title, content, confirmText })` from `components/ConfirmModal.vue`; both are reachable globally via `window.__toastRef` / `window.__confirmRef` mounted by `App.vue`.
- **Styling** — Tailwind utilities plus shared classes from `src/style.css` (`.btn`, `.btn-primary`, `.btn-secondary`, `.btn-danger`, `.card`, `.input`, `.label`, `.badge-*`, `.table*`). Use `dark:` variants for dark mode and `var(--accent-*)` for accent colors — never hardcode indigo/purple hex values.
- **Dates** — `dayjs`. Server-side income/budget periods use month names (`"January"`) plus `type` (`monthly | yearly | bi-monthly`) and `halfMonth` (`1 | 2 | null`).

## Known limitations

- `Login.vue` and `Register.vue` use a local dark-mode toggle instead of `themeStore`.
- `Accounts.vue` transfer/history UI is thin; filtering logic lives in the store/API.
- `SideCard.vue` is dead code (references Ant Design tags, calls `JSON.parse` on an object).
- Bills and recurring transactions expose account, reminder, and notes fields in their forms, but their `category_id` columns have no UI: there is no categories table to pick values from, so those columns stay null until a category entity exists.

## Testing and linting

None configured. There is no test runner, no ESLint/Prettier config, and no `.editorconfig` in this package. Follow the surrounding code style.

## License

No `license` field is declared in `package.json`, and no license file exists for the client.
