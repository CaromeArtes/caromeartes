-- SCRIPT DE CONFIGURAÇÃO DO SUPABASE - CAROME ARTES (VERSÃO RESILIENTE)
-- Cole este script no SQL Editor do Supabase para criar as tabelas e buckets necessários.

-- 1. CRIAR TABELA DE BANNERS
CREATE TABLE IF NOT EXISTS banners (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT,
  subtitle TEXT,
  image_url TEXT NOT NULL,
  active BOOLEAN DEFAULT true,
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Habilitar RLS (Row Level Security) para banners
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;

-- Criar política de leitura pública para banners
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'banners' AND policyname = 'Public banners are viewable by everyone') THEN
        CREATE POLICY "Public banners are viewable by everyone" ON banners FOR SELECT USING (true);
    END IF;
END $$;

-- Criar política de acesso total para banners
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'banners' AND policyname = 'Enable all access for anon') THEN
        CREATE POLICY "Enable all access for anon" ON banners FOR ALL USING (true) WITH CHECK (true);
    END IF;
END $$;


-- 2. CRIAR BUCKETS DE STORAGE (Imagens)
-- Garante que os buckets existam
INSERT INTO storage.buckets (id, name, public) 
VALUES ('products', 'products', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('banners', 'banners', true)
ON CONFLICT (id) DO NOTHING;

-- Funções Auxiliares para criar políticas de storage com segurança
DO $$
BEGIN
    -- Políticas para 'products'
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage' AND policyname = 'Public Access Products') THEN
        CREATE POLICY "Public Access Products" ON storage.objects FOR SELECT USING (bucket_id = 'products');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage' AND policyname = 'Anon Upload Products') THEN
        CREATE POLICY "Anon Upload Products" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'products');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage' AND policyname = 'Anon Update Products') THEN
        CREATE POLICY "Anon Update Products" ON storage.objects FOR UPDATE WITH CHECK (bucket_id = 'products');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage' AND policyname = 'Anon Delete Products') THEN
        CREATE POLICY "Anon Delete Products" ON storage.objects FOR DELETE USING (bucket_id = 'products');
    END IF;

    -- Políticas para 'banners'
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage' AND policyname = 'Public Access Banners') THEN
        CREATE POLICY "Public Access Banners" ON storage.objects FOR SELECT USING (bucket_id = 'banners');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage' AND policyname = 'Anon Upload Banners') THEN
        CREATE POLICY "Anon Upload Banners" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'banners');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage' AND policyname = 'Anon Update Banners') THEN
        CREATE POLICY "Anon Update Banners" ON storage.objects FOR UPDATE WITH CHECK (bucket_id = 'banners');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage' AND policyname = 'Anon Delete Banners') THEN
        CREATE POLICY "Anon Delete Banners" ON storage.objects FOR DELETE USING (bucket_id = 'banners');
    END IF;
END $$;


-- 3. GARANTIR COLUNAS EM PRODUCTS
-- Adicionar colunas se não existirem
ALTER TABLE products ADD COLUMN IF NOT EXISTS category TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS colors TEXT; 
ALTER TABLE products ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT now();

-- Políticas de segurança para products
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'products' AND policyname = 'Enable all access for anon') THEN
        CREATE POLICY "Enable all access for anon" ON products FOR ALL USING (true) WITH CHECK (true);
    END IF;
END $$;


-- 4. POPOULAR DADOS INICIAIS (SEED)
-- Inserir banner padrão se a tabela estiver vazia
INSERT INTO banners (title, subtitle, image_url, active, "order")
SELECT 'Arte em Macramê', 'Peças exclusivas feitas à mão para transformar seu ambiente.', '/caromeartes/images/hero-bg.jpeg', true, 1
WHERE NOT EXISTS (SELECT 1 FROM banners);
