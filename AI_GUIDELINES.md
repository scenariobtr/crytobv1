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
- Forecast Radar ใช้เครื่องบิน 2D บินไป lock radar signal แล้วเดิมพัน YES/NO ด้วย balance โดยตรง
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

### 8.1 Forecast Radar: 2D Flight Betting Layer

เป้าหมายใหม่คือปรับ Forecast World ให้เป็นเกม 2D แนว radar flight betting: ผู้เล่นเป็นเครื่องบิน 2 มิติ บินอยู่บนจอ radar ตรวจจับสัญญาณตลาดเดิมพัน แล้วบินเข้าไป lock เป้าหมายเพื่อวางเดิมพัน YES/NO ด้วยเงินในเกมจาก balance/deposit เดิม โดยยังใช้ทรัพยากรน้อยที่สุด ภาพรวมควรเป็นสีสันแบบ Minecraft-inspired/blocky pixel ไม่ใช่ noir ล้วน

หลักการสำคัญ:

- ใช้ React + CSS/SVG สำหรับ radar, เครื่องบิน, signal และ HUD เพื่อให้ bundle เบา ไม่ใช้ Phaser/Canvas/3D ในช่วงแรก
- ใช้ blocky pixel shapes, สีเขียว grass, ฟ้า sky/cyan, เหลือง beacon, แดง lava/risk และขอบดำหนาให้ดูเป็นเกม
- Market เดิมถูก map เป็น radar signal/blip บนแผนที่
- ผู้เล่นเคลื่อนเครื่องบินด้วย WASD/arrow หรือคลิกตำแหน่งบน radar
- เมื่อเครื่องบินเข้าใกล้ signal จะเกิด radar lock และเปิด panel วางเดิมพัน
- ร้านค้า/เลือกของเหลือแค่ action YES และ NO พร้อม amount input ไม่ใช้ item/inventory เป็นแกนหลัก
- ทุกการเดิมพันต้องหัก balance ผ่าน business logic เดิม, เพิ่ม yesVolume/noVolume และ log ผ่าน `logService`

Phase 1: Radar Flight Core

1. เปลี่ยน `WorldMap.tsx` เป็นแนว `RadarMap.tsx` หรือปรับ component เดิมให้เป็น radar screen
2. เปลี่ยน `PlayerAvatar.tsx` เป็น `PlayerPlane.tsx` ที่ render เครื่องบิน 2D ด้วย SVG/CSS จริง
3. เปลี่ยน market hut เป็น `MarketSignal.tsx` แสดง blip, pulse, hot signal และ expired signal
4. เพิ่ม radar sweep, grid coordinates, distance indicator และ lock-on ring แบบ CSS animation
5. คง movement hook ให้เบา แต่ปรับ naming/UX ให้เป็น flight control

Phase 2: Direct YES/NO Betting

1. แทน `ItemShopPanel`, `InventoryPanel`, `AvatarCustomizer`, `ItemActionBar` ด้วย `BetDockPanel`
2. `BetDockPanel` มีแค่ YES, NO, amount input, balance display และ confirm action
3. ใช้เงินในเกมจาก balance/deposit เดิม ไม่ใช้ item power
4. เมื่อเดิมพัน ให้ validate amount, market lock, market expiry และ balance
5. log action เป็น `RADAR_BET` หรือ `BET` พร้อม market title, side และ amount

Phase 3: Radar Game Feel

1. signal intensity ขึ้นกับ market volume และ `isHot`
2. lock-on state เปลี่ยนสี/เสียงภาพ เช่น ring, coordinate, distance, status
3. เพิ่ม route line จากเครื่องบินไป signal ที่เลือก
4. เพิ่ม HUD เช่น speed, altitude mock, wallet fuel/balance และ scan status
5. expired market เป็น signal จางหรือแดงและกดเดิมพันไม่ได้

Phase 4: Economy And Persistence

1. Persist radar bets, balance movement และ market volume ลง database จริงเมื่อย้ายออกจาก `.txt`
2. แยก economy config เช่น min bet, max bet, platform fee, cooldown และ risk limit ให้ admin ปรับได้
3. เพิ่ม audit trail สำหรับ radar betting เพื่อคำนวณ P&L และตรวจสอบความถูกต้องของ balance
4. เพิ่ม rate limit/cooldown สำหรับตลาดที่มี volume สูงหรือมีการกดเดิมพันถี่
5. ออกแบบ migration จาก client/mock balance ไป schema จริงโดยไม่เปลี่ยน UI contract มาก

ไฟล์ที่ควรเพิ่มหรือขยาย:

- `src/features/forecast-world/components/RadarMap.tsx`
- `src/features/forecast-world/components/PlayerPlane.tsx`
- `src/features/forecast-world/components/MarketSignal.tsx`
- `src/features/forecast-world/components/RadarPanel.tsx`
- `src/features/forecast-world/components/BetDockPanel.tsx`
- `src/features/forecast-world/hooks/useRadarLock.ts`
- `src/features/forecast-world/hooks/useFlightMovement.ts`

สิ่งที่ยังไม่ควรทำในช่วงแรก:

- ยังไม่เพิ่ม Phaser, Canvas, Three.js หรือ animation engine หนัก
- ยังไม่ทำ multiplayer จริงแบบ sync position ทุก frame
- ยังไม่เอาเงินจริงหรือ wallet จริงมา bind กับ gameplay โดยตรง
- ยังไม่ใส่ sprite sheet/image asset ขนาดใหญ่จนกว่า art direction จะชัดเจน

### 8.2 Platform Roadmap

1. ย้าย persistence จาก `.txt` เป็น PostgreSQL/Redis
2. เพิ่ม auth จริง เช่น NextAuth/Clerk และ wallet connection
3. เพิ่ม market API จริงแทน mock service
4. เพิ่ม real-time sync ด้วย WebSocket/SSE
5. แยก `StakewiseTerminal.tsx` ต่อเป็น hooks และ modal components ย่อย
6. persist radar bets, market volume และ balance movement ลง database จริงแทน client state
