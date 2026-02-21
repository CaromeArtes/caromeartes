const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const https = require('https');
const path = require('path');

const supabaseUrl = 'https://uompmspsrpswwofrrfwv.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVvbXBtc3BzcnBzd3dvZnJyZnd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY0ODYwMDcsImV4cCI6MjA3MjA2MjAwN30.XNAePDBBPZWgSb_QxspvpDKfktXqLuOgT4Nk6aKgDNI';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const imagesDir = path.join('public', 'images', 'products');

if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
}

const getFullUrl = (urlOrPath) => {
    if (!urlOrPath) return null;
    let url = urlOrPath.replace(/['"]/g, '');
    if (url.startsWith('http')) return url;
    return `${supabaseUrl}/storage/v1/object/public/product-images/${url}`;
};

const downloadImage = (url, filename) => {
    return new Promise((resolve, reject) => {
        const fullUrl = getFullUrl(url);
        if (!fullUrl) {
            resolve(null);
            return;
        }

        const dest = path.join(imagesDir, filename);
        const file = fs.createWriteStream(dest);

        https.get(fullUrl, (response) => {
            if (response.statusCode !== 200) {
                console.error(`Failed to download ${fullUrl}: ${response.statusCode}`);
                fs.unlink(dest, () => { });
                resolve(null); // Resolve null on error to continue
                return;
            }
            response.pipe(file);
            file.on('finish', () => {
                file.close();
                console.log(`Downloaded: ${filename}`);
                resolve(`/caromeartes/images/products/${filename}`);
            });
        }).on('error', (err) => {
            fs.unlink(dest, () => { });
            console.error(`Error downloading ${fullUrl}:`, err.message);
            resolve(null);
        });
    });
};

async function extractProducts() {
    console.log('Fetching products from Supabase...');
    const { data: products, error } = await supabase
        .from('products')
        .select('*')
        .order('position', { ascending: true });

    if (error) {
        console.error('Error fetching products:', error);
        return;
    }

    console.log(`Found ${products.length} products with correct schema.`);

    const processedProducts = [];

    for (const product of products) {
        // Use 'title' because we found it in inspection, fall back to 'name' just in case
        const productName = product.title || product.name || 'Produto Sem Nome';
        console.log(`Processing: ${productName}`);

        // 1. Download Main Image
        let localMainImage = null;
        if (product.image) {
            const ext = path.extname(product.image) || '.jpg';
            const filename = `prod_${product.id}_main${ext}`;
            localMainImage = await downloadImage(product.image, filename);
        }

        // 2. Download Gallery Images
        let localGallery = [];
        // Check if product.images is an array and has items
        if (Array.isArray(product.images) && product.images.length > 0) {
            // Create a Set of normalized URLs to track uniqueness (including main image)
            const seenUrls = new Set();
            if (product.image) seenUrls.add(product.image);

            for (let i = 0; i < product.images.length; i++) {
                const imgPath = product.images[i];

                // Skip if this image URL is same as Main Image
                if (seenUrls.has(imgPath)) continue;
                seenUrls.add(imgPath);

                const ext = path.extname(imgPath) || '.jpg';
                const filename = `prod_${product.id}_gallery_${i}${ext}`;
                const localPath = await downloadImage(imgPath, filename);
                if (localPath) {
                    localGallery.push(localPath);
                }
            }
        }

        // Ensure main image is included in gallery and is FIRST
        if (localMainImage) {
            localGallery.unshift(localMainImage);
        }

        // Add to list
        processedProducts.push({
            id: product.id,
            name: productName, // Correctly mapped from title
            category: product.category || 'Geral',
            price: parseFloat(product.price) || 0,
            image: localMainImage || 'https://placehold.co/600x400?text=Sem+Imagem',
            images: localGallery, // New field for carousel
            description: product.description || '',
            highlight: product.highlight || false,
            bestSeller: product.best_seller || false,
        });
    }

    const fileContent = `export const products = ${JSON.stringify(processedProducts, null, 4)};`;

    fs.writeFileSync(path.join('src', 'data', 'products.js'), fileContent);
    console.log('Successfully wrote src/data/products.js');
}

extractProducts();
