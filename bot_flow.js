import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// โฟลเดอร์เก็บโปรไฟล์ล็อกอิน Google ของบอท
const userDataDir = path.join(__dirname, '.bot_profile');
const TARGET_URL = 'https://flow.google.com/';

// ค้นหาตำแหน่งไฟล์ Google Chrome บนเครื่อง Windows
function getChromePath() {
  const possiblePaths = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    path.join(process.env.LOCALAPPDATA || '', 'Google\\Chrome\\Application\\chrome.exe')
  ];

  for (const p of possiblePaths) {
    if (fs.existsSync(p)) return p;
  }
  return null;
}

// ล้างไฟล์ Lock เก่าป้องกันปัญหา Process ค้าง
function cleanLocks(dir) {
  if (!fs.existsSync(dir)) return;
  const lockFiles = ['SingletonLock', 'SingletonCookie', 'SingletonSocket'];
  for (const file of lockFiles) {
    try {
      const fullPath = path.join(dir, file);
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
    } catch (e) {
      // ignore
    }
  }
}

async function launchBot() {
  console.log('='.repeat(60));
  console.log('🤖 กำลังเริ่มการทำงานของบอท Google Flow...');
  console.log('📁 โฟลเดอร์โปรไฟล์:', userDataDir);
  console.log('🌐 เว็บไซต์:', TARGET_URL);

  cleanLocks(userDataDir);

  const chromePath = getChromePath();
  const launchOptions = {
    headless: false,
    viewport: null,
    args: [
      '--start-maximized',
      '--disable-blink-features=AutomationControlled',
      '--no-default-browser-check',
      '--no-first-run'
    ],
    ignoreDefaultArgs: ['--enable-automation']
  };

  if (chromePath) {
    console.log('🌐 ตรวจพบ Google Chrome ในเครื่อง:', chromePath);
    launchOptions.executablePath = chromePath;
  } else {
    console.log('🌐 กำลังเปิดด้วย Chromium...');
  }
  console.log('='.repeat(60));

  let context;
  try {
    context = await chromium.launchPersistentContext(userDataDir, launchOptions);
  } catch (err) {
    console.error('⚠️ เกิดข้อผิดพลาดในการเปิด Chrome ครั้งแรก:', err.message);
    console.log('🔄 กำลังลองเปิดโหมดสำรอง...');
    cleanLocks(userDataDir);
    delete launchOptions.executablePath;
    context = await chromium.launchPersistentContext(userDataDir, launchOptions);
  }

  const page = context.pages().length > 0 ? context.pages()[0] : await context.newPage();

  // ซ่อนการตรวจจับบอทของ Google
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'webdriver', {
      get: () => undefined
    });
  });

  console.log('\n🚀 กำลังเปิดหน้าเว็บ https://flow.google.com/ ...');
  try {
    await page.goto(TARGET_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
    console.log('✅ เปิดหน้าเว็บ Google Flow สำเร็จเรียบร้อย!');
    console.log('📌 คำแนะนำ: ล็อกอินบัญชี Google ในหน้าต่างนี้ได้เลย ระบบจะจำการล็อกอินไว้เสมอ');
    console.log('⏳ หน้าต่างจะเปิดค้างไว้จนกว่าคุณจะกดปิดหน้าต่างเอง\n');
  } catch (e) {
    console.log('⚠️ โหลดหน้าเว็บแล้ว (สามารถใช้งานต่อได้):', e.message);
  }

  // รอจนกว่าผู้ใช้จะปิดหน้าต่างจริง
  await new Promise((resolve) => {
    context.on('close', () => {
      console.log('🛑 หน้าต่างเบราว์เซอร์ถูกปิดแล้ว');
      resolve();
    });
  });
}

launchBot();
