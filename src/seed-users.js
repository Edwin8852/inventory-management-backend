const { User, Supplier, Customer } = require('./models');
const bcrypt = require('bcryptjs');

async function seed() {
  try {
    const salt = await bcrypt.genSalt(10);
    
    // Seed Supplier
    const supplierEmail = 'supplier@gmail.com';
    const supplierPass = 'supplier@321';
    let supplierUser = await User.findOne({ where: { email: supplierEmail } });
    if (!supplierUser) {
      supplierUser = await User.create({
        name: 'Supplier User',
        email: supplierEmail,
        password: await bcrypt.hash(supplierPass, salt),
        role: 'SUPPLIER'
      });
      await Supplier.create({
        userId: supplierUser.id,
        companyName: 'Default Supplier Company',
        phone: '1234567890'
      });
      console.log('Supplier created successfully. Email:', supplierEmail, 'Password:', supplierPass);
    } else {
      console.log('Supplier already exists. Email:', supplierEmail);
    }

    // Seed Customer
    const customerEmail = 'edwinraj2458i@gmail.com';
    const customerPass = 'customer@321';
    let customerUser = await User.findOne({ where: { email: customerEmail } });
    if (!customerUser) {
      customerUser = await User.create({
        name: 'Edwin Raj',
        email: customerEmail,
        password: await bcrypt.hash(customerPass, salt),
        role: 'CUSTOMER'
      });
      await Customer.create({
        userId: customerUser.id,
        phone: '0987654321'
      });
      console.log('Customer created successfully. Email:', customerEmail, 'Password:', customerPass);
    } else {
      console.log('Customer already exists. Email:', customerEmail);
    }
  } catch (error) {
    console.error('Error seeding users:', error);
  } finally {
    process.exit();
  }
}

seed();
