const { sequelize, User, Supplier, Customer, Warehouse, Product, Stock, Order, OrderItem, PurchaseOrder, PurchaseOrderItem } = require('./models');

async function seed() {
  const transaction = await sequelize.transaction();
  try {
    console.log('Seeding fake data...');

    // Get the users we already created
    const supplierUser = await User.findOne({ where: { email: 'supplier@gmail.com' } });
    const customerUser = await User.findOne({ where: { email: 'edwinraj2458i@gmail.com' } });
    const adminUser = await User.findOne({ where: { role: 'ADMIN' } });

    if (!supplierUser || !customerUser) {
      console.log('Please run node src/seed-users.js first to create users.');
      process.exit();
    }

    const supplier = await Supplier.findOne({ where: { userId: supplierUser.id } });
    const customer = await Customer.findOne({ where: { userId: customerUser.id } });

    // Seed Warehouses
    const w1 = await Warehouse.create({ warehouseName: 'Central Hub', location: 'New York, NY', capacity: 5000 }, { transaction });
    const w2 = await Warehouse.create({ warehouseName: 'West Coast Distribution', location: 'Los Angeles, CA', capacity: 3000 }, { transaction });

    // Seed Products
    const p1 = await Product.create({
      productName: 'Premium Cotton T-Shirt',
      sku: 'TSHIRT-001',
      description: 'High quality 100% cotton t-shirt.',
      category: 'Clothing',
      brand: 'Basics+',
      wholesalePrice: 8.50,
      retailPrice: 24.99,
      size: 'L',
      color: 'Black'
    }, { transaction });

    const p2 = await Product.create({
      productName: 'Slim Fit Denim Jeans',
      sku: 'JEANS-001',
      description: 'Stylish slim fit blue jeans.',
      category: 'Clothing',
      brand: 'DenimCo',
      wholesalePrice: 22.00,
      retailPrice: 59.99,
      size: '32',
      color: 'Blue'
    }, { transaction });

    const p3 = await Product.create({
      productName: 'Running Sneakers v2',
      sku: 'SHOES-002',
      description: 'Lightweight running shoes.',
      category: 'Footwear',
      brand: 'RunFast',
      wholesalePrice: 45.00,
      retailPrice: 110.00,
      size: '10',
      color: 'White'
    }, { transaction });

    // Seed Stocks
    await Stock.create({ productId: p1.id, warehouseId: w1.id, quantity: 500 }, { transaction });
    await Stock.create({ productId: p2.id, warehouseId: w1.id, quantity: 15 }, { transaction }); // Low stock
    await Stock.create({ productId: p3.id, warehouseId: w2.id, quantity: 120 }, { transaction });

    // Seed Purchase Order (Supplier)
    const po1 = await PurchaseOrder.create({
      poNumber: 'PO-2026-0001',
      supplierId: supplier.id,
      warehouseId: w1.id,
      totalAmount: (p2.wholesalePrice * 100),
      status: 'Delivered'
    }, { transaction });

    await PurchaseOrderItem.create({
      poId: po1.id,
      productId: p2.id,
      quantity: 100,
      wholesalePrice: p2.wholesalePrice,
      total: (p2.wholesalePrice * 100)
    }, { transaction });

    const po2 = await PurchaseOrder.create({
      poNumber: 'PO-2026-0002',
      supplierId: supplier.id,
      warehouseId: w2.id,
      totalAmount: (p3.wholesalePrice * 50),
      status: 'Approved'
    }, { transaction });

    await PurchaseOrderItem.create({
      poId: po2.id,
      productId: p3.id,
      quantity: 50,
      wholesalePrice: p3.wholesalePrice,
      total: (p3.wholesalePrice * 50)
    }, { transaction });

    // Seed Order (Customer)
    const ord1 = await Order.create({
      orderNumber: 'ORD-2026-0001',
      customerId: customer.id,
      totalAmount: (Number(p1.retailPrice) * 2) + Number(p3.retailPrice),
      status: 'Delivered',
      deliveryDate: new Date()
    }, { transaction });

    await OrderItem.create({ orderId: ord1.id, productId: p1.id, quantity: 2, retailPrice: p1.retailPrice, total: (p1.retailPrice * 2) }, { transaction });
    await OrderItem.create({ orderId: ord1.id, productId: p3.id, quantity: 1, retailPrice: p3.retailPrice, total: p3.retailPrice }, { transaction });

    const ord2 = await Order.create({
      orderNumber: 'ORD-2026-0002',
      customerId: customer.id,
      totalAmount: p2.retailPrice,
      status: 'Order Placed',
      deliveryDate: new Date(new Date().setDate(new Date().getDate() + 5))
    }, { transaction });

    await OrderItem.create({ orderId: ord2.id, productId: p2.id, quantity: 1, retailPrice: p2.retailPrice, total: p2.retailPrice }, { transaction });

    await transaction.commit();
    console.log('Seeding successful! Dashboard now has rich data.');
  } catch (error) {
    await transaction.rollback();
    console.error('Seeding failed:', error);
  } finally {
    process.exit();
  }
}

seed();
