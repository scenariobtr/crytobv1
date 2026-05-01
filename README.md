# 🟢 CryptoBet - แพลตฟอร์มทายผล Crypto แบบไร้คนกลาง (P2P)

แพลตฟอร์มตัวกลาง (Intermediate Platform) ที่ถูกออกแบบมาเพื่อการทายผลทุกสรรพสิ่งบนโลกใบนี้ด้วยสกุลเงินคริปโต (USDT) โดยเน้นความเรียบง่าย โปร่งใส และความปลอดภัยสูงสุด ด้วยดีไซน์แบบ **Minimal Emerald Noir**

![Preview](https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=2832&auto=format&fit=crop)

---


git config --global user.name "Deoginies"

git config --global user.email "scenario.tnr@gmail.com"
## ✨ ฟีเจอร์หลัก (Core Features)

*   **P2P Matching System:** ระบบจับคู่ระหว่างผู้ตั้งเรท (Maker) และผู้เข้าร่วมทายผล (Taker) โดยอัตโนมัติ
*   **Minimal Emerald Noir UI:** ดีไซน์ที่ทันสมัย เรียบหรู ใช้โทนสีเขียวมรกตตัดกับสีดำด้าน (Matte Black)
*   **Modular Architecture:** โครงสร้างโค้ดแยกส่วนชัดเจนเพื่อความปลอดภัยและการขยายในอนาคต
*   **Membership System:** ระบบสมาชิกพร้อมหน้าประวัติการทายผล และการวิเคราะห์กำไร/Win Rate
*   **LAN Accessible:** รองรับการแชร์หน้าจอและใช้งานร่วมกันผ่านวงแลน (Local Network) สำหรับการทดสอบ

---

## 🛠 เทคโนโลยีที่ใช้ (Tech Stack)

*   **Frontend:** [Next.js 16 (App Router)](https://nextjs.org/)
*   **Styling:** [Tailwind CSS 4.0](https://tailwindcss.com/)
*   **Icons:** [Lucide React](https://lucide.dev/)
*   **Fonts:** [TH Sarabun New](https://fonts.google.com/specimen/Sarabun) (Google Fonts)
*   **Deployment:** Ready for [Vercel](https://vercel.com)

---

## 📂 โครงสร้างระบบ (System Architecture)

โปรเจกต์นี้ถูกออกแบบมาแบบ Modular เพื่อแยกตรรกะทางการเงินออกจากหน้าจอ:

*   📂 `src/modules/wallet`: จัดการยอดเงินและการถือครอง (Balance & Hold)
*   📂 `src/modules/matching`: ตรรกะการจับคู่คำสั่งซื้อขาย (Matching Engine)
*   📂 `src/modules/payment`: ระบบรับฝากเงิน Crypto
*   📂 `src/modules/withdrawal`: ระบบถอนเงินคืนเข้ากระเป๋าหลัก
*   📂 `src/modules/security`: ระบบตรวจสอบความถูกต้องของ Transaction (Anti-Fraud)

---

## 🚀 การเริ่มต้นใช้งาน (Getting Started)

### 1. ติดตั้ง Dependencies
```bash
npm install
```

### 2. รันในโหมดพัฒนา (Development)
```bash
npm run dev
```
เว็บจะทำงานที่: `http://localhost:3000`

### 3. รันเพื่อแชร์ในวงแลน (LAN Mode)
```bash
npm run dev -- -H 0.0.0.0
```
ตรวจสอบไอพีเครื่องของคุณแล้วเข้าใช้งานผ่านมือถือได้ทันที

---

## 🌍 การ Deploy ขึ้นออนไลน์

โปรเจกต์นี้ได้รับการปรับแต่งให้พร้อมสำหรับการ Deploy บน **Vercel** ทันที:
1. เชื่อมต่อ Repository นี้กับ Vercel
2. ตัวระบบจะทำการ Build และ Online ให้โดยอัตโนมัติ

---

## 🛡 ระบบความปลอดภัย

*   **Atomic Transactions:** ระบบ Matching ถูกออกแบบมาให้เป็นธุรกรรมแบบอะตอมิก ป้องกันยอดเงินคลาดเคลื่อน
*   **Balance Holding:** มีการล็อคยอดเงินทันทีเมื่อมีการเข้าร่วมทายผล เพื่อรับประกันว่าผู้ชนะจะได้รับเงินรางวัลแน่นอน

---

**พัฒนาโดย ทีมงาน CryptoBet - แพลตฟอร์มเพื่อสังคมการทายผลที่โปร่งใส**
