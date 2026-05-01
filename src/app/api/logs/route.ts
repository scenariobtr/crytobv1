import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(request: Request) {
  try {
    const { type, filename, content } = await request.json();
    
    // กำหนด Path ตามประเภท (users หรือ admin)
    const folder = type === "admin" ? "logs/admin" : "logs/users";
    const filePath = path.join(process.cwd(), folder, `${filename}.txt`);
    
    // ข้อความที่ต้องการบันทึกพร้อมเวลา
    const timestamp = new Date().toLocaleString("th-TH");
    const logEntry = `[${timestamp}] ${content}\n`;
    
    // บันทึกไฟล์ (ต่อท้ายไฟล์เดิม)
    fs.appendFileSync(filePath, logEntry, "utf8");
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to write log:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
