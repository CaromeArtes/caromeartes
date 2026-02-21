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


-- 3. GARANTIR A TABELA E COLUNAS EM PRODUCTS
-- Cria a tabela base se ela ainda não existir
CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY
);

-- Adicionar colunas se não existirem
ALTER TABLE products ADD COLUMN IF NOT EXISTS title TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS price NUMERIC;
ALTER TABLE products ADD COLUMN IF NOT EXISTS image TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS images TEXT[];
ALTER TABLE products ADD COLUMN IF NOT EXISTS category TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS highlight BOOLEAN DEFAULT false;
ALTER TABLE products ADD COLUMN IF NOT EXISTS bestSeller BOOLEAN DEFAULT false;

-- Para a coluna colors, vamos criá-la como TEXT[] (array). 
-- Se ela já existir como TEXT, ela é convertida silenciosamente
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='colors') THEN
        ALTER TABLE products ADD COLUMN colors TEXT[];
    ELSE
        ALTER TABLE products ALTER COLUMN colors TYPE TEXT[] USING ARRAY[colors];
    END IF;
EXCEPTION
    WHEN others THEN
        -- Ignora erros se já for TEXT[]
END $$;

ALTER TABLE products ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT now();

-- Políticas de segurança para products
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'products' AND policyname = 'Enable all access for anon') THEN
        CREATE POLICY "Enable all access for anon" ON products FOR ALL USING (true) WITH CHECK (true);
    END IF;
END $$;


-- 4. POPOULAR DADOS INICIAIS E CORRIGIR VEREDAS DE ARQUIVOS ESTATICOS
-- Atualizar se existirem banners quebrados com /images/ 
-- Isso evita erro 404 quando o deploy for num subdiretório (como Github Pages)
UPDATE banners SET image_url = 'images/hero-bg.jpeg' WHERE image_url = '/images/hero-bg.jpeg';

-- Inserir banner padrão se a tabela estiver vazia
INSERT INTO banners (title, subtitle, image_url, active, "order")
SELECT 'Arte em Macramê', 'Peças exclusivas feitas à mão para transformar seu ambiente.', 'images/hero-bg.jpeg', true, 1
WHERE NOT EXISTS (SELECT 1 FROM banners);
