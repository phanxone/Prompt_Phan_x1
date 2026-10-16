/**
 * VisionPrompt Studio - Background Watcher (วิธีที่ 1)
 * รันในเทอร์มินัลเพื่อตรวจจับคำสั่งใหม่ที่ส่งมาจากหน้าเว็บแบบอัตโนมัติ
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ดึงค่าคอนฟิกจาก process.env (สำหรับ Cloud/Railway) หรือจาก .env (สำหรับรันบนคอม)
let SUPABASE_URL = process.env.SUPABASE_URL || "https://rxowuthcdgqharqncrsd.supabase.co";
let SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ4b3d1dGhjZGdxaGFycW5jcnNkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIxMTEzMTAsImV4cCI6MjEwNzY4NzMxMH0.YqkRcUOymTd4QG_Xlrbh-EVtNwTgedZUmsD6HQSTGkk";

let GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
let OPENAI_API_KEY = process.env.OPENAI_API_KEY || "";

try {
  const envPath = path.join(__dirname, '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const urlMatch = envContent.match(/SUPABASE_URL\s*=\s*(.*)/);
    const keyMatch = envContent.match(/SUPABASE_ANON_KEY\s*=\s*(.*)/);
    const geminiMatch = envContent.match(/GEMINI_API_KEY\s*=\s*(.*)/);
    const openaiMatch = envContent.match(/OPENAI_API_KEY\s*=\s*(.*)/);
    if (urlMatch && urlMatch[1] && !process.env.SUPABASE_URL) SUPABASE_URL = urlMatch[1].trim();
    if (keyMatch && keyMatch[1] && !process.env.SUPABASE_ANON_KEY) SUPABASE_ANON_KEY = keyMatch[1].trim();
    if (geminiMatch && geminiMatch[1] && !process.env.GEMINI_API_KEY) GEMINI_API_KEY = geminiMatch[1].trim();
    if (openaiMatch && openaiMatch[1] && !process.env.OPENAI_API_KEY) OPENAI_API_KEY = openaiMatch[1].trim();
  }
} catch (e) {
  // ใช้งานค่าเริ่มต้น
}

const HEADERS = {
  'apikey': SUPABASE_ANON_KEY,
  'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
  'Content-Type': 'application/json',
  'Prefer': 'return=representation'
};

console.log('='.repeat(65));
console.log('🚀 VisionPrompt Studio - AI Background Watcher (วิธีที่ 1)');
console.log('🔗 Supabase:', SUPABASE_URL);
if (OPENAI_API_KEY) {
  console.log('🤖 AI Engine: ✓ เชื่อมต่อ OpenAI (GPT-4o & DALL-E 3) สำเร็จ');
} else if (GEMINI_API_KEY) {
  console.log('🤖 AI Engine: ✓ เชื่อมต่อ Gemini สำเร็จ');
} else {
  console.log('🤖 AI Engine: ✕ ยังไม่ได้ใส่ API Key ใน .env (รอคีย์)');
}
console.log('📡 สถานะ: กำลังเฝ้าตรวจจับคำสั่ง (pending) จากหน้าเว็บทุก 4 วินาที...');
console.log('='.repeat(65));

// จำรายการที่ตรวจพบแล้ว เพื่อไม่ให้แจ้งเตือนซ้ำ
const processedIds = new Set();

// ตรวจสอบคำสั่ง pending
async function checkPendingCommands() {
  try {
    const url = `${SUPABASE_URL}/rest/v1/commands?status=eq.pending&order=created_at.asc&limit=10`;
    const res = await fetch(url, { headers: HEADERS });
    if (!res.ok) return;
    const commands = await res.json();
    
    if (commands && commands.length > 0) {
      for (const cmd of commands) {
        if (!processedIds.has(cmd.id)) {
          processedIds.add(cmd.id);
          await processCommand(cmd);
        }
      }
    }
  } catch (err) {
    // เงียบไว้
  }
}

// ฟังก์ชันเรียก OpenAI เจนภาพ และอัปโหลดเข้า Supabase Storage
async function generateAiImage(promptText, filenamePrefix = 'ai_image') {
  if (!OPENAI_API_KEY) return null;
  try {
    const res = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-image-1-mini',
        prompt: promptText,
        n: 1,
        size: '1024x1024'
      })
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error(`  ⚠️ OpenAI Image Gen Error (${res.status}):`, errText);
      return null;
    }

    const data = await res.json();
    const b64 = data.data && data.data[0] ? (data.data[0].b64_json || null) : null;
    const directUrl = data.data && data.data[0] ? (data.data[0].url || null) : null;

    if (b64) {
      const buffer = Buffer.from(b64, 'base64');
      const storagePath = `${filenamePrefix}_${Date.now()}_${Math.floor(Math.random() * 10000)}.png`;
      const up = await fetch(`${SUPABASE_URL}/storage/v1/object/command-images/${storagePath}`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'image/png'
        },
        body: buffer
      });

      if (up.ok) {
        const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/command-images/${storagePath}`;
        console.log(`  ✓ อัปโหลดภาพ AI เข้า Supabase Storage สำเร็จ: ${publicUrl}`);
        return publicUrl;
      } else {
        console.error(`  ⚠️ Supabase upload error:`, await up.text());
      }
    }
    return directUrl;
  } catch (err) {
    console.error(`  ⚠️ Image gen helper error:`, err.message);
    return null;
  }
}

// จัดการคำสั่งที่พบ
async function processCommand(cmd) {
  const shortId = cmd.id.substring(0, 8);
  const images = cmd.image_urls || (cmd.image_url ? [cmd.image_url] : []);
  const promptSummary = (cmd.prompt || '').split('\n')[0].substring(0, 50);

  console.log(`\n[${new Date().toLocaleTimeString('th-TH')}] 🔔 ตรวจพบคำสั่งใหม่!`);
  console.log(`  🆔 ID: ${cmd.id} (${shortId})`);
  console.log(`  📝 พรอมป์ต์: ${promptSummary}...`);
  console.log(`  🖼️ รูปภาพอ้างอิง: ${images.length} รูป`);

  try {
    // ตรวจสอบว่ามีข้อมูลใน generation_results แล้วหรือยัง
    const checkRes = await fetch(`${SUPABASE_URL}/rest/v1/generation_results?command_id=eq.${cmd.id}`, {
      headers: HEADERS
    });
    const existing = await checkRes.json();
    
    if (existing && existing.length > 0) {
      console.log(`  ✓ คำสั่งนี้มีผลลัพธ์ใน generation_results อยู่แล้ว ข้าม`);
      return;
    }

    console.log(`  🎨 AI กำลังสร้างชุดคอนเทนต์รีวิวสินค้า...`);

    // กำหนดชื่อสินค้าและเนื้อหาเริ่มต้น
    let title = 'ชุดคอนเทนต์รีวิวสินค้า TikTok (ปักตะกร้า)';
    let caption = 'รีวิวไอเทมตัวดังที่ต้องมีติดบ้าน! ใช้งานง่าย คุณภาพแน่น คุ้มค่าเกินราคา สนใจสั่งซื้อจิ้มที่ตะกร้าส้มมุมล่างซ้ายได้เลยครับ 🛒✨';
    let hashtags = '#รีวิวสินค้า #TikTokป้ายยา #ของดีบอกต่อ #พิกัดในตะกร้า #ใช้ดีบอกต่อ';
    let storyboard_url = images[0] || 'https://rxowuthcdgqharqncrsd.supabase.co/storage/v1/object/public/command-images/ai_storyboard_nawanna_85341102.jpg';
    let cover_url = images[1] || images[0] || 'https://rxowuthcdgqharqncrsd.supabase.co/storage/v1/object/public/command-images/ai_cover_nawanna_85341102.jpg';

    let google_flow_prompt = `[Scene 1 - Macro Unboxing]: Extreme close-up vertical shot (9:16). Clean white marble vanity table with warm soft studio lighting. A female hand gently lifts the product packaging. Subtle zoom in. SFX: Gentle paper rustle.
[Scene 2 - Product Hero Focus]: Close-up rotating shot. Highlighting the product details and label. Camera does a smooth orbit around the product. SFX: Clean surface placement chime.
[Scene 3 - Demonstration]: Eye-level macro shot showing product features and demonstration. SFX: Satisfying crisp click.
[Scene 4 - Usage]: Ultra macro capture demonstrating functionality. SFX: Smooth velvet sound effect.
[Scene 5 - In-Action]: Close-up shot showing real-life application and quality.
[Scene 6 - Final Hero Display]: Medium close-up hero shot softly lit with morning light. Camera slow pull-back. SFX: Subtle warm synth swell, clean fade out.`;

    // ถ้ามี OPENAI_API_KEY ให้เรียก GPT-4o และ AI Image Generator
    if (OPENAI_API_KEY) {
      // 1. วิเคราะห์สินค้าและเขียนแคปชันด้วย GPT-4o
      console.log(`  🤖 กำลังเรียก GPT-4o วิเคราะห์สินค้าและเขียนชุดคอนเทนต์ภาษาไทย...`);
      try {
        const userContent = [
          { type: 'text', text: `คุณเป็นผู้เชี่ยวชาญด้าน TikTok Affiliate ปักตะกร้า ให้วิเคราะห์รูปสินค้าและคำสั่งนี้ แล้วสร้าง JSON ผลลัพธ์ภาษาไทย:\nคำสั่ง: ${cmd.prompt}\n\nตอบกลับเป็น JSON รูปแบบนี้เท่านั้น:\n{\n  "title": "ชื่อสินค้าภาษาไทยสั้นกระชับ ตรงกับสินค้าจริง",\n  "caption": "คำอธิบายคลิป TikTok ชวนปักตะกร้าส้มมุมล่างซ้าย",\n  "hashtags": "แฮชแท็ก 5-7 อัน เช่น #รีวิวสินค้า #TikTokป้ายยา #พิกัดในตะกร้า",\n  "google_flow_prompt": "พรอมป์ต์ภาษาอังกฤษ 6 ซีน [Scene 1] ถึง [Scene 6] ระบุมุมกล้อง แสง และ SFX ไม่มีเสียงพูด ห้ามเห็นใบหน้าบุคคล"\n}` }
        ];

        images.slice(0, 2).forEach(url => {
          userContent.push({
            type: 'image_url',
            image_url: { url: url }
          });
        });

        const gptRes = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: 'gpt-4o',
            messages: [{ role: 'user', content: userContent }],
            response_format: { type: 'json_object' }
          })
        });

        if (gptRes.ok) {
          const gptJson = await gptRes.json();
          const parsed = JSON.parse(gptJson.choices[0].message.content);
          if (parsed.title) title = parsed.title;
          if (parsed.caption) caption = parsed.caption;
          if (parsed.hashtags) hashtags = parsed.hashtags;
          if (parsed.google_flow_prompt) google_flow_prompt = parsed.google_flow_prompt;
          console.log(`  ✓ GPT-4o สร้างคอนเทนต์สำเร็จ: "${title}"`);
        } else {
          console.error(`  ⚠️ GPT-4o error:`, await gptRes.text());
        }
      } catch (e) {
        console.error(`  ⚠️ GPT-4o notice:`, e.message);
      }

      // 2. เจนภาพสตอรีบอร์ด 6 ซีน ด้วย AI
      console.log(`  🎨 กำลังเรียก AI เจนภาพสตอรีบอร์ดรวม 6 ซีน...`);
      const storyboardPrompt = `A 6-panel photo storyboard collage for e-commerce product review. Product: ${title}. High quality realistic commercial photos showing 6 clear progressive steps of unboxing, reviewing, and demonstrating the product. Studio lighting, no faces visible. Clean aesthetic style.`;
      const aiStoryboard = await generateAiImage(storyboardPrompt, 'ai_storyboard');
      if (aiStoryboard) {
        storyboard_url = aiStoryboard;
        console.log(`  ✓ สร้างภาพสตอรีบอร์ด 6 ซีนสำเร็จ!`);
      }

      // 3. เจนภาพปกคลิป TikTok 9:16 ด้วย AI
      console.log(`  🎨 กำลังเรียก AI เจนภาพปกคลิป TikTok 9:16...`);
      const coverPrompt = `Vertical product hero photo for TikTok cover (9:16 aspect ratio). Clean modern commercial studio lighting. Product: ${title}. High detail, hands presenting the product, aesthetic luxury review style.`;
      const aiCover = await generateAiImage(coverPrompt, 'ai_cover');
      if (aiCover) {
        cover_url = aiCover;
        console.log(`  ✓ สร้างภาพปก TikTok สำเร็จ!`);
      }
    }

    // ตรวจสอบความปลอดภัยครั้งสุดท้าย ไม่ให้แทรกซ้ำ
    const checkFinal = await fetch(`${SUPABASE_URL}/rest/v1/generation_results?command_id=eq.${cmd.id}`, { headers: HEADERS });
    const existingFinal = await checkFinal.json();
    if (existingFinal && existingFinal.length > 0) {
      console.log(`  ✓ คำสั่งนี้ถูกบันทึกผลลัพธ์ไปแล้ว ข้าม`);
      return;
    }

    // บันทึกลง generation_results
    const resGen = await fetch(`${SUPABASE_URL}/rest/v1/generation_results`, {
      method: 'POST',
      headers: HEADERS,
      body: JSON.stringify({
        command_id: cmd.id,
        title,
        caption,
        hashtags,
        google_flow_prompt,
        storyboard_url,
        cover_url
      })
    });

    if (resGen.ok) {
      console.log(`  ✓ บันทึกผลลัพธ์ลงตาราง generation_results สำเร็จ!`);
      // อัปเดต commands เป็น completed
      await fetch(`${SUPABASE_URL}/rest/v1/commands?id=eq.${cmd.id}`, {
        method: 'PATCH',
        headers: HEADERS,
        body: JSON.stringify({ status: 'completed' })
      });
      console.log(`  🎉 อัปเดตสถานะคำสั่งเป็น 'completed' (หน้าเว็บจะแสดงผลแบบเรียลไทม์ทันที)`);
    } else {
      console.error(`  ❌ บันทึก generation_results ไม่สำเร็จ:`, await resGen.text());
    }

  } catch (e) {
    console.error('  ❌ ผิดพลาดระหว่างประมวลผล:', e.message);
  }
}

// รันลูปตรวจจับทุก 4 วินาที
setInterval(checkPendingCommands, 4000);
checkPendingCommands();
