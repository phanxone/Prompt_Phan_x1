-- ==============================================================================
-- 1. ตาราง commands (เก็บคำสั่งและรูปภาพที่ส่งมาจากหน้าเว็บ)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.commands (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    prompt TEXT NOT NULL,
    image_url TEXT,
    image_urls JSONB DEFAULT '[]'::jsonb,
    image_names JSONB DEFAULT '[]'::jsonb,
    image_count INTEGER DEFAULT 0,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.commands ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public insert to commands" ON public.commands FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Allow public read commands" ON public.commands FOR SELECT TO public USING (true);
CREATE POLICY "Allow public update commands" ON public.commands FOR UPDATE TO public USING (true);

-- ==============================================================================
-- 2. ตารางใหม่: generation_results (เก็บผลลัพธ์ที่ AI เจนเสร็จแล้วโดยเฉพาะ)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.generation_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    command_id UUID REFERENCES public.commands(id) ON DELETE CASCADE,
    title TEXT,                            -- ชื่อสินค้า
    caption TEXT,                          -- คำอธิบาย TikTok (ปักตะกร้า)
    hashtags TEXT,                         -- แฮชแท็ก
    google_flow_prompt TEXT,               -- พรอมป์ต์ภาษาอังกฤษ Google Flow
    storyboard_url TEXT,                   -- URL ภาพสตอรีบอร์ด 6 ซีน
    cover_url TEXT,                        -- URL ภาพปกคลิป TikTok 9:16
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.generation_results ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public insert to generation_results" ON public.generation_results FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Allow public read generation_results" ON public.generation_results FOR SELECT TO public USING (true);

-- ==============================================================================
-- 3. Storage Bucket
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('command-images', 'command-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Allow public upload image" ON storage.objects FOR INSERT TO public WITH CHECK (bucket_id = 'command-images');
CREATE POLICY "Allow public read image" ON storage.objects FOR SELECT TO public USING (bucket_id = 'command-images');
