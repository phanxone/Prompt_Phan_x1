import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// เก็บ Profile เซสชันการล็อกอิน Google ไว้ในโฟลเดอร์ .bot_profile (ล็อกอินครั้งเดียว จำตลอดไป)
const userDataDir = path.join(__dirname, '.bot_profile');
const TARGET_URL = 'https://flow.google.com/';

async function launchBot() {
  console.log('🤖 กำลังเปิด Google Chrome สำหรับควบคุมบอท...');
  console.log('📁 User Data Profile:', userDataDir);
  console.log('🌐 กำลังเปิดเว็บ:', TARGET_URL);

  try {
    const context = await chromium.launchPersistentContext(userDataDir, {
      channel: 'chrome', // ใช้ Google Chrome จริงที่ติดตั้งในเครื่อง
      headless: false,
      viewport: null,
      args: [
        '--start-maximized',
        '--disable-blink-features=AutomationControlled',
        '--no-sandbox'
      ],
      ignoreDefaultArgs: ['--enable-automation']
    });

    const page = context.pages().length > 0 ? context.pages()[0] : await context.newPage();

    // บายพาสการตรวจจับบอทของ Google
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'webdriver', {
        get: () => undefined
      });
    });

    console.log('🚀 กำลังเข้าสู่ https://flow.google.com/...');
    await page.goto(TARGET_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
    console.log('✓ เข้าสู่เว็บ Google Flow สำเร็จ!');
    console.log('💡 คุณสามารถล็อกอินบัญชี Google ในหน้าต่างนี้ได้เลย ระบบจะบันทึกสถานะไว้สำหรับบอทครั้งถัดไป');

    // เก็บหน้าต่างไว้ไม่ให้ปิด
    page.on('close', () => {
      console.log('⚠️ หน้าต่างเบราว์เซอร์ถูกปิดแล้ว');
      process.exit(0);
    });

  } catch (err) {
    console.error('❌ เกิดข้อผิดพลาดในการเปิดเบราว์เซอร์:', err.message);
    if (err.message.includes("Executable doesn't exist")) {
      console.log('🔄 กำลังลองเปิดด้วยเบราว์เซอร์ Chromium สำรอง...');
      // กรณีเครื่องไม่มี Chrome ให้ลองเปิดด้วย chromium ทั่วไป
      const context = await chromium.launchPersistentContext(userDataDir, {
        headless: false,
        viewport: null,
        args: ['--start-maximized']
      });
      const page = context.pages().length > 0 ? context.pages()[0] : await context.newPage();
      await page.goto(TARGET_URL);
    }
  }
}

launchBot();
