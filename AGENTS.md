<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# STAKEWISE Project Rules

## Current Stack

- Next.js 16.2.4 App Router
- React 19.2.4
- TypeScript strict mode
- Tailwind CSS v4
- Lucide React icons
- File-based logging through `src/app/api/logs/route.ts`

## Source Organization

- Keep `src/app/page.tsx` thin. It should only render the feature entry component.
- The main STAKEWISE feature lives in `src/features/stakewise/`.
- The lightweight game layer lives in `src/features/forecast-world/`.
- `src/features/stakewise/StakewiseTerminal.tsx` is the page orchestrator only: state, effects, handlers, and wiring child components.
- Do not add large JSX blocks back into `StakewiseTerminal.tsx`.
- Put feature UI in `src/features/stakewise/components/`.
- Put feature modals in `src/features/stakewise/components/modals/`.
- Put Forecast World UI, movement hooks, item catalog, and map types in `src/features/forecast-world/`.
- Put reusable cross-feature UI in `src/components/shared/`.
- Put business/domain helpers in `src/modules/`.
- Put client API wrappers in `src/services/`.

## Existing Feature Files

```text
src/features/stakewise/
├── StakewiseTerminal.tsx
├── constants.ts
├── types.ts
└── components/
    ├── AuthScreen.tsx
    ├── LoadingScreen.tsx
    ├── TerminalHeader.tsx
    ├── AdminWorkspace.tsx
    ├── UserWorkspace.tsx
    ├── TerminalFooter.tsx
    └── modals/
        ├── CreateMarketModal.tsx
        ├── EditMarketModal.tsx
        └── JoinMarketModal.tsx
```

```text
src/features/forecast-world/
├── ForecastWorld.tsx
├── constants.ts
├── types.ts
├── hooks/
│   └── useAvatarMovement.ts
└── components/
    ├── WorldMap.tsx
    ├── PlayerAvatar.tsx
    ├── MarketHut.tsx
    ├── HutDetailsPanel.tsx
    ├── InventoryPanel.tsx
    └── ItemShopPanel.tsx
```

## Data And Server Boundaries

- Do not import `fs`, `path`, or server-only logic into client components.
- All file log read/write behavior must go through a server boundary such as `src/app/api/logs/route.ts`.
- Client code should call `src/services/logService.ts` instead of touching log files directly.
- Current persisted log layout:
  - `logs/{username}.txt`
  - `logs/markets/market_{id}_{title}.txt`

## Quality Rules

- Run `npm.cmd run lint` after code changes on this Windows workspace.
- Run `npm.cmd run build` after structural or type-heavy changes.
- Avoid `any`; use feature/domain types from `types.ts`, `mockUsers.ts`, or module exports.
- Avoid hydration mismatches. Do not read `localStorage`, call `Date.now()`, call `Math.random()`, or format locale-dependent dates during render unless the initial server/client output is intentionally identical.
- For Forecast World, keep rendering lightweight with React/CSS grid. Do not add Phaser, Canvas, or 3D until the domain logic is stable.
- Existing known lint warning: `ProfileSettings.tsx` uses external DiceBear avatar with `<img>`.

## UI Direction

- Preserve the Emerald Noir visual direction.
- Use `BaseModal` for modal shells.
- Use `Notification` for user feedback.
- Prefer Lucide icons for buttons and controls.
