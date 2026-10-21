import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// เก็บ Profile เซสชันการล็อกอิน Google ไว้ในโฟลเดอร์ .bot_profile
const userDataDir = path.join(__dirname, '.bot_profile');
const TARGET_URL = 'https://flow.google.com/';

// ล้างไฟล์ Lock เก่าที่อาจค้างจากรอบที่แล้ว ป้องกัน Chrome เปิดไม่ขึ้น
try {
  const lockFile = path.join(userDataDir, 'SingletonLock');
  if (fs.existsSync(lockFile)) {
    fs.unlinkSync(lockFile);
    console.log('🧹 เคลียร์ SingletonLock เก่าเรียบร้อย');
  }
} catch (e) {
  // ไม่เป็นไรถ้าลบไม่ได้
}

async function launchBot() {
  console.log('='.repeat(55));
  console.log('🤖 กำลังเปิด Google Chrome สำหรับบอท Google Flow...');
  console.log('📁 Profile เซสชัน:', userDataDir);
  console.log('🌐 เว็บเป้าหมาย:', TARGET_URL);
  console.log('='.repeat(55));

  let context;
  try {
    context = await chromium.launchPersistentContext(userDataDir, {
      channel: 'chrome', // ใช้ Google Chrome จริงที่ติดตั้งบน Windows
      headless: false,
      viewport: null,
      args: [
        '--start-maximized',
        '--disable-blink-features=AutomationControlled',
        '--no-default-browser-check',
        '--no-first-run'
      ],
      ignoreDefaultArgs: ['--enable-automation']
    });
  } catch (err) {
    console.log('⚠️ ไม่สามารถเปิดด้วย Google Chrome ปกติได้ กำลังลองใช้โหมด Chromium สำรอง...');
    context = await chromium.launchPersistentContext(userDataDir, {
      headless: false,
      viewport: null,
      args: ['--start-maximized']
    });
  }

  const page = context.pages().length > 0 ? context.pages()[0] : await context.newPage();

  // ซ่อนสถานะ navigator.webdriver เพื่อป้องกัน Google บล็อกการล็อกอิน
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'webdriver', {
      get: () => undefined
    });
  });

  console.log('🚀 กำลังเปิดหน้าเว็บ https://flow.google.com/ ...');
  try {
    await page.goto(TARGET_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
    console.log('✅ เปิดหน้าเว็บ Google Flow เรียบร้อยแล้ว!');
    console.log('📌 คำแนะนำ: ล็อกอินบัญชี Google ในหน้าต่างนี้ได้เลย ระบบจะจำการล็อกอินไว้เสมอ');
    console.log('⏳ หน้าต่างจะเปิดค้างไว้ตลอดจนกว่าคุณจะกดปิดกากบาท (✕) บนเบราว์เซอร์เอง');
  } catch (e) {
    console.log('⚠️ กำลังโหลดหน้าเว็บ (สามารถใช้งานต่อได้เลย):', e.message);
  }

  // ป้องกันไม่ให้ Node.js จบการทำงาน รอจนกว่าผู้ใช้จะปิดหน้าต่างเบราว์เซอร์จริงๆ
  await new Promise((resolve) => {
    context.on('close', () => {
      console.log('\n🛑 หน้าต่างเบราว์เซอร์ถูกปิดแล้ว');
      resolve();
    });
  });
}

launchBot();
