import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const LOGS_DIR = 'D:/Bet/crypto-betting/logs';
const MARKETS_DIR = path.join(LOGS_DIR, 'markets');

export async function POST(request: Request) {
  try {
    const { username, action, data } = await request.json();
    
    // Ensure directories exist
    if (!fs.existsSync(LOGS_DIR)) fs.mkdirSync(LOGS_DIR, { recursive: true });
    if (!fs.existsSync(MARKETS_DIR)) fs.mkdirSync(MARKETS_DIR, { recursive: true });

    const timestamp = new Date().toISOString();

    // 1. Handling USER/ADMIN specific logs
    if (username && action !== 'MARKET_CREATE') {
        const filePath = path.join(LOGS_DIR, `${username}.txt`);
        if (!fs.existsSync(filePath)) {
            const initialHeader = `--- USER PROFILE: ${username} ---\nCreated: ${timestamp}\n---------------------------\n\n--- TRANSACTIONS ---\n`;
            fs.writeFileSync(filePath, initialHeader);
        }

        if (action === 'INIT') {
            const profileInfo = `[PROFILE_UPDATE] ${timestamp}\nData: ${JSON.stringify(data, null, 2)}\n---------------------------\n`;
            fs.appendFileSync(filePath, profileInfo);
        } else if (action === 'TRANSACTION') {
            const logEntry = `[${timestamp}] [${data.type.toUpperCase()}] Amount: ${data.amount} | Detail: ${data.detail}\n`;
            fs.appendFileSync(filePath, logEntry);
        } else if (action === 'LOGIN') {
            const logEntry = `[${timestamp}] [LOGIN] IP: ${data.ip}\n`;
            fs.appendFileSync(filePath, logEntry);
        }
    }

    // 2. Handling MARKET creation logs
    if (action === 'MARKET_CREATE') {
        const cleanTitle = data.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        const marketFileName = `market_${data.id}_${cleanTitle}.txt`;
        const marketPath = path.join(MARKETS_DIR, marketFileName);
        
        const marketContent = `
--- MARKET CREATED ---
ID: ${data.id}
Title: ${data.title}
Creator: ${username}
Created At: ${timestamp}
Starting Price (YES/NO): ${data.yesPrice} / ${data.noPrice}
Description: ${data.description}
----------------------
        `.trim();
        
        fs.writeFileSync(marketPath, marketContent);
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error('Logging Error:', error);
    const message = error instanceof Error ? error.message : 'Unknown logging error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');
    const verify = searchParams.get('verify');
    const allUsers = searchParams.get('all_users'); // เพิ่ม flag สำหรับดึงสมาชิกทั้งหมด

    // 1. ดึงข้อมูลสมาชิกทั้งหมดจาก Logs
    if (allUsers === 'true') {
        try {
            const files = fs.readdirSync(LOGS_DIR);
            const userFiles = files.filter(f => f.endsWith('.txt') && !f.startsWith('market_'));
            const allUserData = userFiles.map(file => {
                const content = fs.readFileSync(path.join(LOGS_DIR, file), 'utf8');
                const profileMatch = content.match(/\[PROFILE_UPDATE\].*?\nData: (\{[\s\S]*?\})\n---/);
                return profileMatch ? JSON.parse(profileMatch[1]) : null;
            }).filter(u => u !== null);
            
            return NextResponse.json({ users: allUserData });
        } catch {
            return NextResponse.json({ error: 'Failed to list users' }, { status: 500 });
        }
    }
    
    if (!username) return NextResponse.json({ error: 'Username is required' }, { status: 400 });
    
    const filePath = path.join(LOGS_DIR, `${username}.txt`);
    if (!fs.existsSync(filePath)) return NextResponse.json({ error: 'User log not found' }, { status: 404 });
    
    const content = fs.readFileSync(filePath, 'utf8');

    // ถ้ามีการขอตรวจสอบ login ให้พยายามแกะข้อมูล Profile ล่าสุดออกมา
    if (verify === 'true') {
        const profileMatch = content.match(/\[PROFILE_UPDATE\].*?\nData: (\{[\s\S]*?\})\n---/);
        if (profileMatch) {
            try {
                const userData = JSON.parse(profileMatch[1]);
                return NextResponse.json({ userData });
            } catch {
                return NextResponse.json({ error: 'Failed to parse user data' }, { status: 500 });
            }
        }
    }
    
    return NextResponse.json({ content });
}
