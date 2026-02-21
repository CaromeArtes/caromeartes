const fs = require('fs');
const https = require('https');
const path = require('path');

const downloads = [
    {
        url: 'https://uompmspsrpswwofrrfwv.supabase.co/storage/v1/object/public/product-images/Logo2.png',
        dest: 'public/images/logo.png'
    },
    {
        url: 'https://uompmspsrpswwofrrfwv.supabase.co/storage/v1/object/public/product-images/PainelConchas.jpeg',
        dest: 'public/images/hero-bg.jpeg'
    }
];

const downloadFile = (url, dest) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
        response.pipe(file);
        file.on('finish', () => {
            file.close();
            console.log(`Downloaded ${dest}`);
        });
    }).on('error', (err) => {
        fs.unlink(dest, () => { }); // Delete the file async. (But we don't check the result)
        console.error(`Error downloading ${dest}: ${err.message}`);
    });
};

const dir = 'public/images';
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
}

downloads.forEach(d => downloadFile(d.url, d.dest));
