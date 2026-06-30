const fs = require('fs');
const path = require('path');
const { Product } = require('./src/models');

const sourceDir = "C:\\Users\\Edwin\\.gemini\\antigravity-ide\\brain\\895084b0-2550-49ca-8254-41788bba636b";
const targetDir = path.join(__dirname, 'uploads');

if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
}

const imagesMap = {
    'MNW-JNS-001': 'mens_slim_jeans',
    'MNW-SHT-002': 'mens_formal_shirt',
    'MNW-PLO-003': 'mens_polo_tshirt',
    'WMN-KRT-001': 'womens_kurti',
    'WMN-SRE-002': 'womens_silk_saree',
    'WMN-TOP-003': 'womens_casual_top',
    'FTW-SHO-001': 'mens_leather_shoes',
    'FTW-SND-002': 'womens_block_sandals'
};

async function processImages() {
    try {
        const files = fs.readdirSync(sourceDir);
        
        for (const [sku, prefix] of Object.entries(imagesMap)) {
            const matchingFile = files.find(f => f.startsWith(prefix) && f.endsWith('.png'));
            
            if (matchingFile) {
                const sourcePath = path.join(sourceDir, matchingFile);
                const targetFilename = `${prefix}.png`;
                const targetPath = path.join(targetDir, targetFilename);
                
                fs.copyFileSync(sourcePath, targetPath);
                console.log(`Copied ${matchingFile} to uploads/${targetFilename}`);
                
                await Product.update(
                    { image: `/uploads/${targetFilename}` },
                    { where: { sku } }
                );
                console.log(`Updated product ${sku} with image /uploads/${targetFilename}`);
            }
        }
        
        // Add placeholders for the ones that didn't generate
        await Product.update(
            { image: 'https://via.placeholder.com/400x400.png?text=Sneakers' },
            { where: { sku: 'FTW-SNK-003' } }
        );
        
        await Product.update(
            { image: 'https://via.placeholder.com/400x400.png?text=Kids+TShirt' },
            { where: { sku: 'KID-TSH-001' } }
        );
        
        console.log('Finished processing images.');
        process.exit(0);
    } catch (error) {
        console.error('Error processing images:', error);
        process.exit(1);
    }
}

processImages();
