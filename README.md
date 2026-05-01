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
- Wallet dashboard พร้อม quick deposit mock และ wallet safety warning ที่ 80%
- Profile settings พร้อม avatar, phone, password และ membership duration
- Admin dashboard สำหรับ `SUPER_ADMIN`
- Member management พร้อมอ่าน activity log จากไฟล์ `.txt`
- Financial audit mock view
- TH/EN language switch ผ่าน `LangContext`

## Project Structure

```text
src/
├── app/
│   ├── api/logs/route.ts        # Route Handler สำหรับอ่าน/เขียน logs
│   ├── layout.tsx               # Root layout + LangProvider
│   └── page.tsx                 # Thin route entry, render feature component
├── features/
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

## Development Notes

- Keep `src/app/page.tsx` thin. Business/UI state ของ terminal ควรอยู่ใน `src/features/stakewise/`
- ถ้าเพิ่ม tab หรือ view ใหม่ ให้เพิ่ม type/constant ที่ `features/stakewise/types.ts` และ `features/stakewise/constants.ts`
- ถ้าเพิ่ม auth/dashboard/modal UI ใหม่ ให้สร้าง component แยกแทนการขยาย `StakewiseTerminal.tsx`
- Route Handler ที่แตะ `fs` ต้องอยู่ฝั่ง server เท่านั้น อย่านำ `fs`, path absolute หรือ secret เข้า client component
- ถ้าขยายระบบจริง ควรย้ายจาก file logs ไป PostgreSQL/Redis และเพิ่ม auth provider จริง
