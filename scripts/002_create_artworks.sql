-- Create artworks table
CREATE TABLE IF NOT EXISTS artworks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  artist TEXT NOT NULL,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  year INTEGER,
  origin TEXT NOT NULL,
  image_url TEXT NOT NULL,
  qr_code TEXT UNIQUE NOT NULL,
  description_fr TEXT NOT NULL,
  description_en TEXT NOT NULL,
  description_wo TEXT NOT NULL,
  audio_url_fr TEXT,
  audio_url_en TEXT,
  audio_url_wo TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE artworks ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read artworks
CREATE POLICY "Allow public read access to artworks"
  ON artworks FOR SELECT
  USING (true);

-- Only authenticated users can insert artworks
CREATE POLICY "Allow authenticated users to insert artworks"
  ON artworks FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Only authenticated users can update artworks
CREATE POLICY "Allow authenticated users to update artworks"
  ON artworks FOR UPDATE
  USING (auth.uid() IS NOT NULL);

-- Only authenticated users can delete artworks
CREATE POLICY "Allow authenticated users to delete artworks"
  ON artworks FOR DELETE
  USING (auth.uid() IS NOT NULL);

-- Create index for faster QR code lookups
CREATE INDEX IF NOT EXISTS idx_artworks_qr_code ON artworks(qr_code);

-- Create index for category filtering
CREATE INDEX IF NOT EXISTS idx_artworks_category_id ON artworks(category_id);
