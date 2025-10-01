-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_fr TEXT NOT NULL,
  name_en TEXT NOT NULL,
  name_wo TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read categories
CREATE POLICY "Allow public read access to categories"
  ON categories FOR SELECT
  USING (true);

-- Only authenticated users can insert categories
CREATE POLICY "Allow authenticated users to insert categories"
  ON categories FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Only authenticated users can update categories
CREATE POLICY "Allow authenticated users to update categories"
  ON categories FOR UPDATE
  USING (auth.uid() IS NOT NULL);

-- Only authenticated users can delete categories
CREATE POLICY "Allow authenticated users to delete categories"
  ON categories FOR DELETE
  USING (auth.uid() IS NOT NULL);

-- Insert default categories
INSERT INTO categories (name_fr, name_en, name_wo, slug) VALUES
  ('Sculptures', 'Sculptures', 'Jàll', 'sculptures'),
  ('Peintures', 'Paintings', 'Nataal', 'peintures'),
  ('Textiles', 'Textiles', 'Dëkk', 'textiles'),
  ('Céramiques', 'Ceramics', 'Mbotaay', 'ceramiques'),
  ('Masques', 'Masks', 'Njulli', 'masques'),
  ('Bijoux', 'Jewelry', 'Xalis', 'bijoux')
ON CONFLICT (slug) DO NOTHING;
