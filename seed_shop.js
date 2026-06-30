const { sequelize, Product, Warehouse, Stock, Category, Brand } = require('./src/models');

const seed = async () => {
  try {
    await sequelize.sync();
    
    // Ensure Category
    const [catShirts] = await Category.findOrCreate({ where: { categoryName: 'Shirts' } });
    const [catPants] = await Category.findOrCreate({ where: { categoryName: 'Pants' } });
    const [catJackets] = await Category.findOrCreate({ where: { categoryName: 'Outerwear' } });
    const [catDresses] = await Category.findOrCreate({ where: { categoryName: 'Dresses' } });

    // Ensure Brands
    const [brandLevis] = await Brand.findOrCreate({ where: { brandName: "Levi's" } });
    const [brandZara] = await Brand.findOrCreate({ where: { brandName: 'Zara' } });
    const [brandHnM] = await Brand.findOrCreate({ where: { brandName: 'H&M' } });

    // Ensure Warehouse
    const [warehouse] = await Warehouse.findOrCreate({ 
      where: { warehouseName: 'Main Distribution Center' },
      defaults: { location: 'New York, NY', capacity: 10000, status: 'ACTIVE' }
    });

    // Create Products
    const productsData = [
      {
        productName: 'Classic White Cotton T-Shirt',
        sku: 'TSHIRT-WHT-M',
        category: catShirts.categoryName,
        brand: brandHnM.brandName,
        description: 'A premium quality, 100% cotton classic white t-shirt. Perfect for everyday wear.',
        retailPrice: 15.99,
        wholesalePrice: 8.50,
        stock: 50,
        color: 'White',
        size: 'M',
        image: '/uploads/white_tshirt.png',
        status: 'ACTIVE'
      },
      {
        productName: 'Vintage Blue Denim Jeans',
        sku: 'JEANS-BLU-32',
        category: catPants.categoryName,
        brand: brandLevis.brandName,
        description: 'Classic straight fit blue denim jeans with a vintage wash.',
        retailPrice: 59.99,
        wholesalePrice: 35.00,
        stock: 30,
        color: 'Blue',
        size: '32',
        image: '/uploads/blue_jeans.png',
        status: 'ACTIVE'
      },
      {
        productName: 'Black Leather Biker Jacket',
        sku: 'JCKT-LTH-L',
        category: catJackets.categoryName,
        brand: brandZara.brandName,
        description: 'Genuine black leather biker jacket with silver hardware.',
        retailPrice: 199.99,
        wholesalePrice: 120.00,
        stock: 15,
        color: 'Black',
        size: 'L',
        image: '/uploads/leather_jacket.png',
        status: 'ACTIVE'
      },
      {
        productName: 'Flowy Red Summer Dress',
        sku: 'DRESS-RED-S',
        category: catDresses.categoryName,
        brand: brandZara.brandName,
        description: 'A beautiful and elegant red summer dress, perfect for warm evenings.',
        retailPrice: 45.00,
        wholesalePrice: 22.50,
        stock: 25,
        color: 'Red',
        size: 'S',
        image: '/uploads/summer_dress.png',
        status: 'ACTIVE'
      }
    ];

    for (const p of productsData) {
      const [product, created] = await Product.findOrCreate({
        where: { sku: p.sku },
        defaults: p
      });

      if (created) {
        // Add to stock
        await Stock.create({
          productId: product.id,
          warehouseId: warehouse.id,
          quantity: product.stock
        });
      } else {
        // Update stock
        await product.update(p);
        const stock = await Stock.findOne({ where: { productId: product.id, warehouseId: warehouse.id } });
        if (stock) {
          await stock.update({ quantity: p.stock });
        } else {
          await Stock.create({ productId: product.id, warehouseId: warehouse.id, quantity: p.stock });
        }
      }
    }

    console.log('Seed completed successfully!');
  } catch (error) {
    console.error('Seed error:', error);
  } finally {
    process.exit();
  }
};

seed();
