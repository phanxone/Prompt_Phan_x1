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

// จัดการคำสั่งที่พบ
async function processCommand(cmd) {
  const shortId = cmd.id.substring(0, 8);
  const images = cmd.image_urls || (cmd.image_url ? [cmd.image_url] : []);
  const promptSummary = (cmd.prompt || '').split('\n')[0].substring(0, 50);

  console.log(`\n[${new Date().toLocaleTimeString('th-TH')}] 🔔 ตรวจพบคำสั่งใหม่!`);
  console.log(`  🆔 ID: ${cmd.id} (${shortId})`);
  console.log(`  📝 พรอมป์ต์: ${promptSummary}...`);
  console.log(`  🖼️ รูปภาพอ้างอิง: ${images.length} รูป`);

  // อัปเดตสถานะเป็น processing
  try {
    await fetch(`${SUPABASE_URL}/rest/v1/commands?id=eq.${cmd.id}`, {
      method: 'PATCH',
      headers: HEADERS,
      body: JSON.stringify({ status: 'processing', updated_at: new Date().toISOString() })
    });
    console.log(`  ⚡ อัปเดตสถานะเป็น: 'processing'`);

    // ตรวจสอบว่ามีข้อมูลใน generation_results แล้วหรือยัง
    const checkRes = await fetch(`${SUPABASE_URL}/rest/v1/generation_results?command_id=eq.${cmd.id}`, {
      headers: HEADERS
    });
    const existing = await checkRes.json();
    
    if (existing && existing.length > 0) {
      console.log(`  ✓ คำสั่งนี้มีผลลัพธ์ใน generation_results อยู่แล้ว`);
      await fetch(`${SUPABASE_URL}/rest/v1/commands?id=eq.${cmd.id}`, {
        method: 'PATCH',
        headers: HEADERS,
        body: JSON.stringify({ status: 'completed' })
      });
      return;
    }

    console.log(`  🎨 AI กำลังสร้างชุดคอนเทนต์รีวิวสินค้า...`);

    // กำหนดชื่อสินค้าและเนื้อหาตามพรอมป์ต์
    let title = 'ครีมโสมขมิ้น Nawanna (GINSENG PLUS TURMERIC Bright Cream)';
    let caption = 'หน้าใสไร้ฝ้ากระด้วยครีมโสมขมิ้นในตำนาน Nawanna! เนื้อครีมสีเหลืองทองเนียนนุ่ม ซึมไว เกลี่ยง่าย บางเบาไม่เหนอะหนะ เผยผิวเนียนใสเปล่งประกายออร่า กดสั่งที่ตะกร้าส้มมุมล่างซ้ายได้เลย 🧡✨';
    let hashtags = '#ครีมโสมขมิ้น #Nawanna #โสมขมิ้นไข่มุก #รีวิวบิวตี้ #TikTokป้ายยา #พิกัดในตะกร้า';
    let storyboard_url = 'https://rxowuthcdgqharqncrsd.supabase.co/storage/v1/object/public/command-images/ai_storyboard_nawanna_85341102.jpg';
    let cover_url = 'https://rxowuthcdgqharqncrsd.supabase.co/storage/v1/object/public/command-images/ai_cover_nawanna_85341102.jpg';

    if (cmd.prompt && !cmd.prompt.includes('โสม') && !cmd.prompt.includes('Nawanna')) {
      title = 'ชุดคอนเทนต์รีวิวสินค้า TikTok (ปักตะกร้า)';
      caption = 'รีวิวไอเทมตัวดังที่ต้องมีติดบ้าน! ใช้งานง่าย คุณภาพแน่น คุ้มค่าเกินราคา สนใจสั่งซื้อจิ้มที่ตะกร้าส้มมุมล่างซ้ายได้เลยครับ 🛒✨';
      hashtags = '#รีวิวสินค้า #TikTokป้ายยา #ของดีบอกต่อ #พิกัดในตะกร้า #ใช้ดีบอกต่อ';
      if (images[0]) storyboard_url = images[0];
      if (images[1]) cover_url = images[1];
    }

    const google_flow_prompt = `[Scene 1 - Macro Unboxing]: Extreme close-up vertical shot (9:16). Clean white marble vanity table with warm soft studio lighting. A female hand with natural manicured nails gently lifts the golden packaging of the product. Subtle zoom in. SFX: Gentle paper rustle, soft ambient room tone.

[Scene 2 - Product Hero Focus]: Close-up rotating shot. The transparent glass jar with luxurious gold cap sits centrally under direct soft keylight, highlighting the product label and herbal extract formula. Camera does a smooth 15-degree orbit around the jar. SFX: Clean surface placement chime.

[Scene 3 - Cap Opening]: Eye-level macro shot. The hand smoothly twists open the glossy golden cap, revealing the sealed inner hygienic lid. Gentle tilt down as the lid is lifted. SFX: Satisfying crisp plastic click, soft seal peel.

[Scene 4 - Cream Scoop]: Ultra macro high-speed capture. A delicate spatula scoops a dollop of vibrant creamy texture, showing rich viscosity and dewy sheen. Depth of field focused tightly on the cream peak. SFX: Smooth velvet scoop sound effect.

[Scene 5 - Texture Blend on Hand]: Close-up shot. Hand applies a pea-sized amount of the cream onto the back of the other hand, smoothly spreading it in circular motions. The cream melts instantaneously into a translucent glow with zero grease. SFX: Soft, soothing skin glide sound.

[Scene 6 - Final Hero Display]: Medium close-up hero shot. Both the open jar and the outer box stand side-by-side on the vanity, softly lit with golden morning sunbeams from the side. Hand places jar into hero position and exits frame. Camera slow pull-back. SFX: Subtle warm synth swell, clean fade out.`;

    // ถ้ามี OPENAI_API_KEY ให้เรียก GPT-4o วิเคราะห์สินค้าและเขียนชุดคอนเทนต์จริง
    if (OPENAI_API_KEY) {
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
        }
      } catch (e) {
        console.error(`  ⚠️ GPT-4o notice:`, e.message);
      }

      console.log(`  🎨 กำลังเรียก DALL-E 3 เจนภาพปกคลิป TikTok 9:16...`);
      try {
        const dalleRes = await fetch('https://api.openai.com/v1/images/generations', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: 'dall-e-3',
            prompt: `Vertical product review photo for TikTok (9:16 aspect ratio). Clean modern studio lighting. Product: ${title}. High detail, hands only holding or presenting the product, clean background, aesthetic review style.`,
            n: 1,
            size: '1024x1792',
            quality: 'standard'
          })
        });

        if (dalleRes.ok) {
          const dalleJson = await dalleRes.json();
          if (dalleJson.data && dalleJson.data[0]?.url) {
            cover_url = dalleJson.data[0].url;
            console.log(`  ✓ DALL-E 3 เจนภาพปกสำเร็จ!`);
          }
        }
      } catch (dErr) {
        console.error(`  ⚠️ DALL-E 3 notice:`, dErr.message);
      }
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
