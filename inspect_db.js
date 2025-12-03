
import { supabase } from './src/supabaseClient.js'

async function inspect() {
    const { data, error } = await supabase
        .from('site_config')
        .select('*')
        .limit(1);

    if (error) {
        console.error('Error:', error);
    } else {
        console.log('Data:', data);
    }
}
inspect();
