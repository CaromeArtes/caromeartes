
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://uompmspsrpswwofrrfwv.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVvbXBtc3BzcnBzd3dvZnJyZnd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY0ODYwMDcsImV4cCI6MjA3MjA2MjAwN30.XNAePDBBPZWgSb_QxspvpDKfktXqLuOgT4Nk6aKgDNI'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function run() {
    console.log('--- Checking theme.json ---');
    const { data: themeData, error: themeError } = await supabase.storage
        .from('product-images')
        .download('theme.json');

    if (themeError) {
        console.error('Error downloading theme.json:', themeError);
    } else {
        console.log('theme.json exists. Size:', themeData.size);
        const text = await themeData.text();
        console.log('Content:', text.substring(0, 100) + '...');
    }

    console.log('\n--- Checking Products ---');
    const { data: products, error: prodError } = await supabase
        .from('products')
        .select('*')
        .limit(3);

    if (prodError) {
        console.error('Error fetching products:', prodError);
    } else {
        console.log(`Found ${products.length} products.`);
        products.forEach(p => {
            console.log(`Product [${p.id}]:`);
            console.log('  image:', p.image);
            console.log('  images:', p.images);
            console.log('  Type of images:', typeof p.images);
            if (Array.isArray(p.images)) {
                console.log('  Is Array. Length:', p.images.length);
            }
        });
    }
}

run();
