# STAKEWISE - AI Guidelines & Project Context

เอกสารนี้เป็น context สำหรับ AI assistant หรือ developer ที่เข้ามาช่วยพัฒนาโปรเจ็ค **STAKEWISE** ให้เข้าใจโครงสร้างจริงและมาตรฐานปัจจุบันของ repo

## 1. Architecture

- **Framework:** Next.js 16.2.4 App Router
- **React:** 19.2.4
- **Styling:** Tailwind CSS v4
- **Routing rule:** `src/app/page.tsx` ต้องเป็น thin route entry เท่านั้น
- **Main feature:** client terminal อยู่ที่ `src/features/stakewise/StakewiseTerminal.tsx`
- **Game-like feature:** Forecast World อยู่ที่ `src/features/forecast-world/`
- **Feature support files:** tab constants และ UI/domain types อยู่ใน `src/features/stakewise/constants.ts` และ `src/features/stakewise/types.ts`

ก่อนแก้ Next.js API, App Router, route handlers, caching, server/client components หรือ metadata ต้องอ่านเอกสารที่เกี่ยวข้องใน:

```text
node_modules/next/dist/docs/
```

ตามคำสั่งใน `AGENTS.md` เพราะโปรเจ็คใช้ Next 16 ไม่ใช่ convention เก่าจาก Next 14

## 2. Data And Logging

ระบบปัจจุบันเป็น file-based logging ผ่าน `src/app/api/logs/route.ts`

- `logs/{username}.txt`: profile, login และ transaction/action log
- `logs/markets/market_{id}_{title}.txt`: market creation log
- client wrapper อยู่ที่ `src/services/logService.ts`

ข้อควรระวัง:

- ห้าม import `fs` หรือ server-only logic เข้า client component
- การอ่าน/เขียน logs ต้องผ่าน Route Handler หรือ server-only layer
- ตอนนี้ยังไม่มี transaction database จริง balance หลายส่วนยังเป็น client state/mock

## 3. Source Organization Rules

- เก็บ `src/app/*` ให้เป็น routing, layout, API boundary
- UI ที่ reusable ให้ไว้ใน `src/components/{admin,user,shared}`
- Business/domain helper ให้ไว้ใน `src/modules/*`
- Feature orchestration ที่รวม state หลายส่วนให้ไว้ใน `src/features/*`
- หลีกเลี่ยงการเพิ่ม logic ใหม่ลงใน `StakewiseTerminal.tsx` ถ้าแยกเป็น component, hook, constant หรือ module ได้อย่างชัดเจน
- game/world UI ต้องอยู่ใน `src/features/forecast-world/*` ไม่ปนกับ shared dashboard components

## 4. Design DNA

- Theme: Emerald Noir High-End
- Primary colors: black/zinc base, emerald accent, red for NO/risk, orange for warning
- Shared modal ควรใช้ `BaseModal`
- Toast/feedback ควรใช้ `Notification`
- ใช้ Lucide React สำหรับ icon
- UI admin ควรดูเป็น command center/terminal ที่ dense และ scan ได้เร็ว

## 5. Financial And Market Logic

- Platform fee target: 2.5%
- Wallet safety warning: แสดงเมื่อใช้เงินเกิน 80% ของ balance
- Prediction market ใช้ YES/NO side, price, volume, creator และ endDate
- Forecast World ใช้ item เป็นตัวแทนเงินพยากรณ์ โดย item จะเพิ่ม volume ให้ YES/NO pool ตาม power ของ item
- ถ้าแก้ rate/price ฝั่ง admin ควรคิดผลกระทบ P&L ของ user ในอนาคต
- `getSystemStats` รองรับทั้ง `yesVolume/noVolume` และ legacy `makerVolume/takerVolume`

## 6. Security And Access

- Admin view เปิดให้เฉพาะ `role: "SUPER_ADMIN"`
- Mock account หลัก: `admin001 / 12345`
- Auth ปัจจุบันเป็น localStorage mock ผ่าน `authService`
- อย่าเพิ่มความลับ, private key หรือเงินจริงใน client bundle

## 7. Quality Bar

- รัน `npm run lint` หลังแก้ code
- ใช้ strict TypeScript เท่าที่ทำได้ หลีกเลี่ยง `any`
- อย่าเรียก impure function เช่น `Date.now()` ระหว่าง render โดยตรงใน React component
- ถ้าเพิ่ม Next.js behavior ใหม่ ให้เช็ค docs ใน `node_modules/next/dist/docs/` ก่อนเสมอ

## 8. Roadmap

1. ย้าย persistence จาก `.txt` เป็น PostgreSQL/Redis
2. เพิ่ม auth จริง เช่น NextAuth/Clerk และ wallet connection
3. เพิ่ม market API จริงแทน mock service
4. เพิ่ม real-time sync ด้วย WebSocket/SSE
5. แยก `StakewiseTerminal.tsx` ต่อเป็น hooks และ modal components ย่อย
6. persist inventory/item ownership ลง database จริงแทน client state
