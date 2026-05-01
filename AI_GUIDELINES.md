# 🤖 STAKEWISE - AI Guidelines & Project Context

คู่มือฉบับนี้ถูกสร้างขึ้นเพื่อให้ AI Assistant เข้าใจบริบทและมาตรฐานการพัฒนาของโปรเจกต์ **STAKEWISE** เพื่อความต่อเนื่องและแม่นยำในการช่วยเหลือ

---

## 🏗️ 1. สถาปัตยกรรม (Architecture)
*   **Framework:** Next.js 14 (App Router)
*   **Database Philosophy:** ปัจจุบันใช้ **File-based System** ผ่าน Node.js `fs` API ในการจัดเก็บข้อมูลแบบ Log ในโฟลเดอร์ `/logs`
    *   `/logs/users/`: ข้อมูล Profile & Metadata
    *   `/logs/transactions/`: ประวัติการเงินและการพยากรณ์
    *   `/logs/markets/`: ข้อมูล Market และการกระทำของ Admin
*   **Service Layer:** แยก Logic สำคัญไว้ที่ `src/services/` (เช่น `logService.ts`) เพื่อให้เรียกใช้ได้ทั้ง Client และ Server

---

## 🎨 2. มาตรฐานงานดีไซน์ (Design DNA)
*   **Theme:** Emerald Noir High-End (ดำด้านตัดเขียวมรกต)
*   **Styling:** Tailwind CSS (เน้น Vanilla Utility)
*   **Key Patterns:**
    *   **Glassmorphism:** ใช้ `bg-zinc-950/80 backdrop-blur-xl` พร้อมขอบ `border-zinc-900`
    *   **Premium Modals:** ใช้ `BaseModal` ที่รองรับขนาด `4xl` หรือ `5xl` สำหรับหน้า Admin
    *   **Micro-animations:** ใช้ `framer-motion` หรือ Tailwind Animate (เช่น `animate-pulse`, `fade-in`)
    *   **Zero-Scroll:** พยายามให้ UI สำคัญจบในหน้าเดียวหรือใช้ Grid ระบบปิด

---

## 💰 3. กฎเหล็กด้านการเงิน (Financial & Market Logic)
*   **Platform Fee:** ระบบหักค่าธรรมเนียมคงที่ **2.5%** จากทุกยอดพยากรณ์
*   **Wallet Safety:** ต้องมีระบบแจ้งเตือน **(80% Warning)** เมื่อ User ใช้เงินเกิน 80% ของ Balance
*   **Liquidity:** Market เริ่มต้นต้องมีการระบุเงินทุนเริ่มต้น (Initial Liquidity) และฝั่งที่ Creator เลือก
*   **Impact Analysis:** ทุกครั้งที่ Admin แก้ไขเรทราคา ต้องมีการคำนวณผลกระทบต่อกำไร/ขาดทุน (P&L Change) ของ User เสมอ

---

## 🔐 4. ระบบความปลอดภัย (Security & Access)
*   **Role-based Access:** เฉพาะผู้ใช้ที่มี `role: "SUPER_ADMIN"` เท่านั้นที่เห็นและเข้าถึงหน้า Terminal/Admin
*   **Hardened Redirection:** ต้องมีเงื่อนไขตรวจสอบ Role ในระดับ Component และ Layout เพื่อดีด User ที่ไม่มีสิทธิ์ออกทันที
*   **Log Integrity:** ทุกกิจกรรมสำคัญ (Login, Create Market, Deposit) ต้องถูกบันทึกลงในไฟล์ `.txt` แยกราย User

---

## 📂 5. โครงสร้างโฟลเดอร์ (Directory Structure)
```
src/
├── app/             # หน้าหลักและ API Routes
├── components/      # UI Components (Admin/User/Shared)
├── context/         # ระบบภาษา (LangContext)
├── data/            # Mock Data และ Types
├── modules/         # Business Logic แยกตามโมดูล
└── services/        # ศูนย์กลางการจัดการ Data & Logs
```

---

## 🚀 6. แผนงานในอนาคต (Future Roadmap)
1.  **DB Migration:** ย้ายจากไฟล์ `.txt` ไปยังฐานข้อมูลจริง (PostgreSQL/Redis) เมื่อระบบขยายตัว
2.  **Real-time Synchronization:** ติดตั้ง WebSockets (Socket.io) เพื่อให้ราคาและสถิติขยับแบบ Real-time จริงๆ
3.  **Authentication:** เปลี่ยนจาก Mock Login เป็นระบบ Auth จริง (NextAuth/Clerk) พร้อมการเชื่อมต่อ Crypto Wallet (Web3.js)
4.  **Automated Oracle:** เชื่อมต่อ API ราคาสกุลเงินจริงผ่าน Oracle แบบอัตโนมัติ

---

**คำแนะนำสำหรับ AI:** โปรดรักษาโทนสี Emerald Noir และเน้นการเขียนโค้ดที่รองรับการทำ Transaction แบบ Atomic ผ่านระบบ Log เสมอ
