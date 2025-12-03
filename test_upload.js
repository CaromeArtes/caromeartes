
import { supabase } from './src/supabaseClient.js'

async function testUpload() {
    const blob = new Blob([JSON.stringify({ test: true })], { type: 'application/json' });
    const { data, error } = await supabase.storage
        .from('product-images')
        .upload('test_config.json', blob, { upsert: true });

    if (error) {
        console.error('Upload Error:', error);
    } else {
        console.log('Upload Success:', data);
    }
}
testUpload();
