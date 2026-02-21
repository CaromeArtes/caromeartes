const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://uompmspsrpswwofrrfwv.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVvbXBtc3BzcnBzd3dvZnJyZnd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY0ODYwMDcsImV4cCI6MjA3MjA2MjAwN30.XNAePDBBPZWgSb_QxspvpDKfktXqLuOgT4Nk6aKgDNI';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function inspect() {
    console.log('Fetching one product...');
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .limit(1);

    if (error) {
        console.error('Error:', error);
        return;
    }

    if (data && data.length > 0) {
        console.log('Product Keys:', Object.keys(data[0]));
        console.log('Sample Product:', JSON.stringify(data[0], null, 2));
    } else {
        console.log('No products found.');
    }
}

inspect();
