/**
 * Product Seed Script
 * Seeds realistic clothing/fashion products with variants into the database.
 * Run: node scripts/seedProducts.js
 */

require('dotenv').config();
const { v4: uuidv4 } = require('uuid');

// Load models AFTER dotenv
const { Product, ProductVariant, sequelize } = require('../src/models');

const PRODUCTS = [
  // ── Men's Wear ────────────────────────────────────────────────────
  {
    productName: 'Men\'s Slim Fit Jeans',
    sku: 'MNW-JNS-001',
    category: "Men's Wear",
    brand: 'X-Town',
    description: 'Premium slim fit denim jeans with stretch fabric for all-day comfort.',
    retailPrice: 1299,
    wholesalePrice: 850,
    costPrice: 520,
    gstPercentage: 12,
    minOrderQuantity: 20,
    status: 'ACTIVE',
    variants: [
      { size: '30', color: 'Dark Blue', warehouseStock: 50, storeStock: 20 },
      { size: '32', color: 'Dark Blue', warehouseStock: 80, storeStock: 30 },
      { size: '34', color: 'Dark Blue', warehouseStock: 60, storeStock: 25 },
      { size: '32', color: 'Black',     warehouseStock: 70, storeStock: 20 },
      { size: '34', color: 'Black',     warehouseStock: 50, storeStock: 15 },
    ],
  },
  {
    productName: 'Men\'s Formal Shirt',
    sku: 'MNW-SHT-002',
    category: "Men's Wear",
    brand: 'X-Town',
    description: 'Crisp cotton formal shirt suitable for office and events.',
    retailPrice: 899,
    wholesalePrice: 590,
    costPrice: 350,
    gstPercentage: 12,
    minOrderQuantity: 15,
    status: 'ACTIVE',
    variants: [
      { size: 'S',  color: 'White',  warehouseStock: 40, storeStock: 15 },
      { size: 'M',  color: 'White',  warehouseStock: 60, storeStock: 25 },
      { size: 'L',  color: 'White',  warehouseStock: 50, storeStock: 20 },
      { size: 'XL', color: 'White',  warehouseStock: 30, storeStock: 10 },
      { size: 'M',  color: 'Blue',   warehouseStock: 45, storeStock: 18 },
      { size: 'L',  color: 'Blue',   warehouseStock: 40, storeStock: 15 },
    ],
  },
  {
    productName: 'Men\'s Cotton Polo T-Shirt',
    sku: 'MNW-PLO-003',
    category: "Men's Wear",
    brand: 'X-Town',
    description: 'Breathable pique cotton polo shirt — casual and semi-formal.',
    retailPrice: 699,
    wholesalePrice: 450,
    costPrice: 260,
    gstPercentage: 5,
    minOrderQuantity: 25,
    status: 'ACTIVE',
    variants: [
      { size: 'S',  color: 'Navy',    warehouseStock: 60, storeStock: 20 },
      { size: 'M',  color: 'Navy',    warehouseStock: 80, storeStock: 30 },
      { size: 'L',  color: 'Navy',    warehouseStock: 70, storeStock: 25 },
      { size: 'M',  color: 'Maroon',  warehouseStock: 50, storeStock: 15 },
      { size: 'L',  color: 'Maroon',  warehouseStock: 40, storeStock: 12 },
      { size: 'XL', color: 'Black',   warehouseStock: 35, storeStock: 10 },
    ],
  },

  // ── Women's Wear ──────────────────────────────────────────────────
  {
    productName: 'Women\'s Kurti',
    sku: 'WMN-KRT-001',
    category: "Women's Wear",
    brand: 'X-Town',
    description: 'Elegant printed cotton kurti with mandarin collar. Perfect for daily wear.',
    retailPrice: 899,
    wholesalePrice: 580,
    costPrice: 340,
    gstPercentage: 5,
    minOrderQuantity: 20,
    status: 'ACTIVE',
    variants: [
      { size: 'S',  color: 'Rose',    warehouseStock: 45, storeStock: 18 },
      { size: 'M',  color: 'Rose',    warehouseStock: 55, storeStock: 22 },
      { size: 'L',  color: 'Rose',    warehouseStock: 40, storeStock: 15 },
      { size: 'M',  color: 'Yellow',  warehouseStock: 50, storeStock: 20 },
      { size: 'L',  color: 'Yellow',  warehouseStock: 35, storeStock: 12 },
      { size: 'XL', color: 'Blue',    warehouseStock: 25, storeStock: 8  },
    ],
  },
  {
    productName: 'Women\'s Saree — Silk',
    sku: 'WMN-SRE-002',
    category: "Women's Wear",
    brand: 'X-Town',
    description: 'Handloom silk saree with intricate border work. Festival & bridal collection.',
    retailPrice: 3499,
    wholesalePrice: 2400,
    costPrice: 1800,
    gstPercentage: 12,
    minOrderQuantity: 5,
    status: 'ACTIVE',
    variants: [
      { size: 'Free', color: 'Red',        warehouseStock: 20, storeStock: 8 },
      { size: 'Free', color: 'Green',      warehouseStock: 15, storeStock: 6 },
      { size: 'Free', color: 'Royal Blue', warehouseStock: 18, storeStock: 7 },
      { size: 'Free', color: 'Golden',     warehouseStock: 12, storeStock: 5 },
    ],
  },
  {
    productName: 'Women\'s Casual Top',
    sku: 'WMN-TOP-003',
    category: "Women's Wear",
    brand: 'X-Town',
    description: 'Trendy off-shoulder casual top, lightweight viscose fabric.',
    retailPrice: 599,
    wholesalePrice: 380,
    costPrice: 200,
    gstPercentage: 5,
    minOrderQuantity: 20,
    status: 'ACTIVE',
    variants: [
      { size: 'XS', color: 'White',  warehouseStock: 30, storeStock: 12 },
      { size: 'S',  color: 'White',  warehouseStock: 50, storeStock: 20 },
      { size: 'M',  color: 'White',  warehouseStock: 40, storeStock: 16 },
      { size: 'S',  color: 'Black',  warehouseStock: 45, storeStock: 18 },
      { size: 'M',  color: 'Black',  warehouseStock: 35, storeStock: 14 },
      { size: 'L',  color: 'Pink',   warehouseStock: 25, storeStock: 10 },
    ],
  },

  // ── Footwear ──────────────────────────────────────────────────────
  {
    productName: 'Men\'s Leather Formal Shoes',
    sku: 'FTW-SHO-001',
    category: 'Footwear',
    brand: 'X-Town',
    description: 'Genuine leather oxford shoes, lace-up, with cushioned insole.',
    retailPrice: 2499,
    wholesalePrice: 1650,
    costPrice: 1100,
    gstPercentage: 18,
    minOrderQuantity: 10,
    status: 'ACTIVE',
    variants: [
      { size: '7',  color: 'Black',  warehouseStock: 20, storeStock: 8  },
      { size: '8',  color: 'Black',  warehouseStock: 30, storeStock: 12 },
      { size: '9',  color: 'Black',  warehouseStock: 25, storeStock: 10 },
      { size: '10', color: 'Black',  warehouseStock: 15, storeStock: 6  },
      { size: '8',  color: 'Brown',  warehouseStock: 20, storeStock: 8  },
      { size: '9',  color: 'Brown',  warehouseStock: 15, storeStock: 6  },
    ],
  },
  {
    productName: 'Women\'s Block Heel Sandals',
    sku: 'FTW-SND-002',
    category: 'Footwear',
    brand: 'X-Town',
    description: 'Stylish block heel sandals with ankle strap, faux leather upper.',
    retailPrice: 1299,
    wholesalePrice: 850,
    costPrice: 520,
    gstPercentage: 18,
    minOrderQuantity: 12,
    status: 'ACTIVE',
    variants: [
      { size: '5',  color: 'Beige', warehouseStock: 25, storeStock: 10 },
      { size: '6',  color: 'Beige', warehouseStock: 30, storeStock: 12 },
      { size: '7',  color: 'Beige', warehouseStock: 20, storeStock: 8  },
      { size: '6',  color: 'Black', warehouseStock: 28, storeStock: 10 },
      { size: '7',  color: 'Black', warehouseStock: 22, storeStock: 8  },
    ],
  },
  {
    productName: 'Unisex Sports Sneakers',
    sku: 'FTW-SNK-003',
    category: 'Footwear',
    brand: 'X-Town',
    description: 'Lightweight mesh running sneakers with EVA foam sole for superior comfort.',
    retailPrice: 1799,
    wholesalePrice: 1150,
    costPrice: 700,
    gstPercentage: 18,
    minOrderQuantity: 15,
    status: 'ACTIVE',
    variants: [
      { size: '6',  color: 'White/Blue', warehouseStock: 30, storeStock: 12 },
      { size: '7',  color: 'White/Blue', warehouseStock: 40, storeStock: 15 },
      { size: '8',  color: 'White/Blue', warehouseStock: 35, storeStock: 14 },
      { size: '9',  color: 'White/Blue', warehouseStock: 25, storeStock: 10 },
      { size: '8',  color: 'Black/Red',  warehouseStock: 20, storeStock: 8  },
      { size: '9',  color: 'Black/Red',  warehouseStock: 18, storeStock: 7  },
      { size: '10', color: 'Black/Red',  warehouseStock: 12, storeStock: 5  },
    ],
  },

  // ── Kids Wear ─────────────────────────────────────────────────────
  {
    productName: 'Kids Printed T-Shirt',
    sku: 'KID-TSH-001',
    category: 'Kids Wear',
    brand: 'X-Town',
    description: 'Soft cotton kids t-shirt with fun graphic prints. Available in 3-12 years.',
    retailPrice: 399,
    wholesalePrice: 250,
    costPrice: 140,
    gstPercentage: 5,
    minOrderQuantity: 30,
    status: 'ACTIVE',
    variants: [
      { size: '3-4Y',  color: 'Red',    warehouseStock: 60, storeStock: 20 },
      { size: '5-6Y',  color: 'Red',    warehouseStock: 55, storeStock: 18 },
      { size: '7-8Y',  color: 'Blue',   warehouseStock: 50, storeStock: 16 },
      { size: '9-10Y', color: 'Blue',   warehouseStock: 45, storeStock: 14 },
      { size: '11-12Y',color: 'Green',  warehouseStock: 35, storeStock: 10 },
    ],
  },
];

const seed = async () => {
  await sequelize.authenticate();
  console.log('✅ DB connected\n');

  let createdProducts = 0;
  let createdVariants = 0;
  let skipped = 0;

  for (const productData of PRODUCTS) {
    const { variants, ...baseProduct } = productData;

    // Check if already exists
    const exists = await Product.findOne({ where: { sku: baseProduct.sku } });
    if (exists) {
      console.log(`⚠️  Skipping (exists): ${baseProduct.productName} [${baseProduct.sku}]`);
      skipped++;
      continue;
    }

    const product = await Product.create({ ...baseProduct, id: uuidv4() });
    createdProducts++;
    console.log(`✅ Created: ${product.productName} (${product.category}) — ID: ${product.id}`);

    for (const v of variants) {
      const variantSku = `${baseProduct.sku}-${v.size}-${v.color}`.replace(/\s+/g, '-').toUpperCase();
      await ProductVariant.create({
        id: uuidv4(),
        productId: product.id,
        size: v.size,
        color: v.color,
        sku: variantSku,
        warehouseStock: v.warehouseStock,
        storeStock: v.storeStock,
      });
      createdVariants++;
      console.log(`   ↳ Variant: ${v.size} / ${v.color} — Warehouse: ${v.warehouseStock}, Store: ${v.storeStock}`);
    }
    console.log('');
  }

  console.log('─────────────────────────────────────────────');
  console.log(`🎉 Seed complete!`);
  console.log(`   Products created : ${createdProducts}`);
  console.log(`   Variants created : ${createdVariants}`);
  console.log(`   Skipped (existed): ${skipped}`);
  console.log('─────────────────────────────────────────────');
  process.exit(0);
};

seed().catch(err => {
  console.error('❌ Seed failed:', err.message);
  process.exit(1);
});
