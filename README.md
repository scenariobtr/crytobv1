# STAKEWISE - Premium Prediction Market Platform

**STAKEWISE** คือ prototype แพลตฟอร์ม prediction market / crypto betting ที่มีทั้งฝั่งผู้ใช้งานและผู้ดูแลระบบในแอปเดียว ดีไซน์หลักเป็น Emerald Noir และใช้ file-based logging เพื่อเก็บกิจกรรมสำคัญระหว่างพัฒนา

## Tech Stack

- **Framework:** Next.js 16.2.4 App Router
- **Runtime UI:** React 19.2.4
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4 ผ่าน `@import "tailwindcss"`
- **Icons:** Lucide React
- **Current persistence:** file-based logs ผ่าน Route Handler และ Node.js `fs`

> หมายเหตุ: โปรเจ็คนี้ใช้ Next.js 16 ซึ่งมี rules ของ React/Next lint ที่เข้มขึ้น ก่อนแก้ routing, data fetching, route handlers หรือ server/client boundary ให้อ่าน docs ใน `node_modules/next/dist/docs/` ตาม `AGENTS.md`

## Main Features

- Login/register mock flow พร้อม OTP demo `1234`
- Prediction markets แบบ YES/NO พร้อมราคา, volume, countdown และ market expiry
- Forecast World: map 2D แบบเบา ๆ มี avatar เดินได้, market เป็นกระท่อม, shop และ inventory item สำหรับนำไปพยากรณ์
- Wallet dashboard พร้อม quick deposit mock และ wallet safety warning ที่ 80%
- Profile settings พร้อม avatar, phone, password และ membership duration
- Admin dashboard สำหรับ `SUPER_ADMIN`
- Member management พร้อมอ่าน activity log จากไฟล์ `.txt`
- Financial audit mock view
- TH/EN language switch ผ่าน `LangContext`
- Forecast World UI ใช้ locale namespace `world.*` รองรับทั้ง TH/EN

## Project Structure

```text
src/
├── app/
│   ├── api/logs/route.ts        # Route Handler สำหรับอ่าน/เขียน logs
│   ├── layout.tsx               # Root layout + LangProvider
│   └── page.tsx                 # Thin route entry, render feature component
├── features/
│   ├── forecast-world/
│   │   ├── ForecastWorld.tsx           # Lightweight game world entry
│   │   ├── constants.ts                # Map size, hut positions, item catalog
│   │   ├── types.ts                    # Avatar, item, inventory, hut types
│   │   ├── hooks/
│   │   │   └── useAvatarMovement.ts    # WASD/arrow movement logic
│   │   └── components/
│   │       ├── WorldMap.tsx
│   │       ├── PlayerAvatar.tsx
│   │       ├── MarketHut.tsx
│   │       ├── HutDetailsPanel.tsx
│   │       ├── InventoryPanel.tsx
│   │       └── ItemShopPanel.tsx
│   └── stakewise/
│       ├── StakewiseTerminal.tsx       # Main orchestrator: state + flow wiring
│       ├── constants.ts                # Tab lists and market draft factory
│       ├── types.ts                    # Feature-level UI/domain types
│       └── components/
│           ├── AuthScreen.tsx          # Login/register/OTP screen
│           ├── LoadingScreen.tsx       # Boot/loading screen
│           ├── TerminalHeader.tsx      # Authenticated top nav
│           ├── AdminWorkspace.tsx      # Admin tab workspace
│           ├── UserWorkspace.tsx       # User tab workspace
│           ├── TerminalFooter.tsx      # Version/deploy footer
│           └── modals/
│               ├── CreateMarketModal.tsx
│               ├── EditMarketModal.tsx
│               └── JoinMarketModal.tsx
├── components/
│   ├── admin/                   # Admin dashboard components
│   ├── shared/                  # BaseModal, Notification
│   └── user/                    # Market, wallet, portfolio, profile UI
├── context/                     # LangContext
├── data/                        # mockUsers, version metadata
├── locales/                     # en/th dictionaries
├── modules/                     # auth, market, bet, wallet, matching, security
└── services/                    # client-side service wrappers
```

## Data Strategy

ระบบปัจจุบันยังไม่ใช้ database จริง ข้อมูลที่ persist จะถูกเก็บใน `logs/`

- `logs/{username}.txt`: profile update, login, transaction/action log ของ user หรือ admin
- `logs/markets/market_{id}_{title}.txt`: บันทึกการสร้าง market

Client เรียก `logService` ที่ [src/services/logService.ts](src/services/logService.ts) และ service จะส่ง request ไปที่ [src/app/api/logs/route.ts](src/app/api/logs/route.ts)

## Getting Started

```bash
npm install
npm run dev
```

เปิดแอปที่:

```text
http://localhost:3000
```

บัญชี demo:

```text
admin001 / 12345  -> SUPER_ADMIN
admin002 / 12345  -> USER
```

## Quality Commands

```bash
npm run lint
npm run build
```

สถานะล่าสุด:

- `npm run lint` ผ่าน ไม่มี error
- `npm run build` ผ่าน
- เหลือ warning เดียวเรื่อง avatar `<img>` ใน `ProfileSettings` ซึ่งตั้งใจคงไว้ก่อนเพราะใช้ external DiceBear SVG

## Feature Architecture

`src/features/stakewise/StakewiseTerminal.tsx` เคยเป็นไฟล์ใหญ่มากที่รวม JSX เกือบทุกส่วนไว้ในที่เดียว ตอนนี้ถูกลดบทบาทให้เป็นตัวประกอบ flow หลัก:

- sync users/session
- เก็บ state ระดับหน้า เช่น current user, tabs, markets, balance, modal state
- wire handlers ไปยัง components ลูก
- render authenticated/unauthenticated experience ผ่าน component ที่แยกแล้ว

แนวคิดการดูแลต่อ:

- UI screen ใหม่ควรอยู่ใน `src/features/stakewise/components/`
- modal ใหม่ควรอยู่ใน `src/features/stakewise/components/modals/`
- shared UI ที่ใช้ข้าม feature ให้ย้ายไป `src/components/shared/`
- business logic หรือ calculation ที่ใช้ซ้ำให้ย้ายไป `src/modules/`
- อย่าเพิ่ม JSX ก้อนใหญ่กลับเข้า `StakewiseTerminal.tsx`

## Forecast World

Forecast World เป็น game-like layer ที่วางทับ business เดิมโดยไม่ใช้ graphics engine:

- ใช้ React + CSS grid เป็น map 2D
- avatar เดินได้ด้วย WASD/arrow keys หรือคลิก tile
- market `Thread` เดิมถูก map เป็น hut
- shop ใช้ balance เดิมในการซื้อ item
- inventory เก็บ item mock ฝั่ง client
- ใช้ item กับ hut เพื่อ forecast YES/NO และเพิ่ม volume ให้ market
- transaction สำคัญถูก log ผ่าน `logService` เป็น `BUY_ITEM` และ `USE_ITEM`
- UI text ของ world, item shop, inventory และ hut details แปลผ่าน `src/locales/en.ts` และ `src/locales/th.ts`

หลักการพัฒนาต่อ:

- อย่าใส่ game logic ใน `StakewiseTerminal.tsx`
- เพิ่ม world UI ที่ `src/features/forecast-world/components/`
- เพิ่ม movement/interaction logic ที่ `src/features/forecast-world/hooks/`
- ถ้า item/inventory ต้องใช้ร่วมหลาย feature ให้ย้าย logic ไป `src/modules/items` หรือ `src/modules/inventory`

## Development Notes

- Keep `src/app/page.tsx` thin. Business/UI state ของ terminal ควรอยู่ใน `src/features/stakewise/`
- ถ้าเพิ่ม tab หรือ view ใหม่ ให้เพิ่ม type/constant ที่ `features/stakewise/types.ts` และ `features/stakewise/constants.ts`
- ถ้าเพิ่ม auth/dashboard/modal UI ใหม่ ให้สร้าง component แยกแทนการขยาย `StakewiseTerminal.tsx`
- ถ้าเพิ่ม game/world UI ใหม่ ให้เก็บใน `src/features/forecast-world/`
- Route Handler ที่แตะ `fs` ต้องอยู่ฝั่ง server เท่านั้น อย่านำ `fs`, path absolute หรือ secret เข้า client component
- ถ้าขยายระบบจริง ควรย้ายจาก file logs ไป PostgreSQL/Redis และเพิ่ม auth provider จริง
