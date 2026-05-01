# 💎 STAKEWISE - Premium Prediction Market Platform

**STAKEWISE** คือแพลตฟอร์มบริหารจัดการตลาดพยากรณ์ (Prediction Market) ระดับพรีเมียม ที่ถูกออกแบบมาเพื่อการพยากรณ์ผลเหตุการณ์ต่างๆ ทั่วโลกด้วยความโปร่งใส ปลอดภัย และมีความเป็นมืออาชีพสูงสุด ด้วยดีไซน์แบบ **Emerald Noir High-End Aesthetic**

![Preview](https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=2832&auto=format&fit=crop)

---

## 🚀 ฟีเจอร์หลัก (Key Features)

### 👤 สำหรับผู้ใช้งาน (User Experience)
*   **Dynamic Prediction Markets:** ตลาดพยากรณ์ผลแบบ Real-time พร้อมระบบ Liquidity Pool แยกฝั่ง YES/NO
*   **Wallet Safety System:** ระบบแจ้งเตือนความเสี่ยง (80% Threshold Warning) เมื่อผู้ใช้ใช้เงินเกิน 80% ของกระเป๋า
*   **Advanced Profile Management:** จัดการข้อมูลส่วนตัว เลือกอวตาร และระบบนับจำนวนวันสมาชิก (Membership Duration)
*   **Portfolio Tracking:** ระบบติดตามสินทรัพย์และประวัติการพยากรณ์พร้อมสรุปกำไร/ขาดทุน
*   **Multi-language Support:** รองรับทั้งภาษาไทยและภาษาอังกฤษ (TH/EN) อย่างสมบูรณ์

### 🛡️ สำหรับผู้ดูแลระบบ (Admin Supreme Controls)
*   **Real-time Dashboard:** มอนิเตอร์สถิติระบบ (CPU, DB, Latency) แบบสดๆ ในรูปแบบศูนย์บัญชาการ
*   **Market Command Center:** ควบคุมตลาดพยากรณ์ได้อย่างเบ็ดเสร็จ (Edit/Delete/Rate Adjustment)
*   **Impact Analysis Logic:** ระบบคำนวณผลกระทบต่อพอร์ตของ User ทันทีเมื่อ Admin เปลี่ยนเรทราคา
*   **Revenue Tracking:** ระบบคำนวณรายได้ของแพลตฟอร์ม (Fixed Platform Fee 2.5%) อัตโนมัติในทุกตลาด
*   **Member Management:** จัดการสมาชิก ดูรายละเอียดการ Login, IP Address และประวัติกิจกรรมเชิงลึก

---

## ⚙️ สถาปัตยกรรมทางเทคนิค (Technical Architecture)

*   **Frontend:** Next.js 14 (App Router) + Tailwind CSS (Vanilla CSS focused)
*   **Icons:** Lucide React (Cyberpunk Theme)
*   **Database Engine:** **File-based DB (Logging System)** ใช้ Node.js `fs` API ในการจัดเก็บข้อมูลแยกราย User และรายกิจกรรมในโฟลเดอร์ `/logs`
*   **State Management:** React Hooks (UseState, UseEffect) พร้อมการจำลองระบบ Real-time Simulation สำหรับหน้า Dashboard

---

## 📂 โครงสร้างข้อมูล (Data Strategy)

ระบบใช้ไฟล์ `.txt` ในการเก็บข้อมูลเพื่อความรวดเร็วและตรวจสอบได้ง่าย:
*   `logs/users/{username}.txt`: เก็บข้อมูลโปรไฟล์, กระเป๋าเงิน, และสถานะการสมัคร
*   `logs/transactions/{username}.txt`: เก็บประวัติการทำรายการทางการเงินทั้งหมด
*   `logs/markets/{market_id}.txt`: เก็บข้อมูลกิจกรรมที่เกิดขึ้นในตลาดแต่ละแห่ง

---

## 🛠️ การติดตั้งและการใช้งาน (Getting Started)

1. **Clone the repository:**
   ```bash
   git clone [repository-url]
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Access the platform:**
   เปิด [http://localhost:3000](http://localhost:3000) บนบราวเซอร์ของคุณ

---

## 🛡️ มาตรฐานความปลอดภัย (Security Standards)
*   **Admin Strict Access:** ล็อคสิทธิ์หน้า Terminal สำหรับ `SUPER_ADMIN` เท่านั้น
*   **Safety Fallback:** ระบบดีดกลับอัตโนมัติหากผู้ที่ไม่มีสิทธิ์พยายามเข้าถึงหน้าควบคุม
*   **Transaction Integrity:** การดำเนินการทางการเงินถูกบันทึกแบบ Atomic ลงในระบบ Log ทันที

**Predict the Future. Trade the Outcome.**  
Developed with ❤️ by the STAKEWISE Team.
