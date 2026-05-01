/**
 * Security & Admin Management Core (V2 - Thai)
 */

export type SystemLog = {
  id: string;
  action: string;
  target: string;
  actor: string;
  timestamp: number;
  type: "INFO" | "WARNING" | "DANGER";
};

// ข้อมูล Log ระบบย้อนหลัง
export const mockSystemLogs: SystemLog[] = [
  { id: "1", action: "ปรับยอดเงิน", target: "admin002", actor: "admin001", timestamp: Date.now() - 3600000, type: "INFO" },
  { id: "2", action: "พยายามเข้าระบบผิดพลาด", target: "unknown", actor: "45.12.33.1", timestamp: Date.now() - 7200000, type: "WARNING" },
  { id: "3", action: "ถอนเงินจำนวนมาก", target: "0xAb58...", actor: "admin002", timestamp: Date.now() - 86400000, type: "DANGER" },
];

export const securityManager = {
  // ตรวจสอบระดับการเข้าถึง
  isAdmin: (user: { role?: string } | null | undefined) => user?.role === "SUPER_ADMIN",
  
  // จำลองการเปลี่ยนสถานะผู้ใช้
  toggleUserStatus: (userId: string, currentStatus: string) => {
    console.log(`🔒 Security: Changing status for ${userId} to ${currentStatus === "ACTIVE" ? "BANNED" : "ACTIVE"}`);
    return true;
  }
};
