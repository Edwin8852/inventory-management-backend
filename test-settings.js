require('dotenv').config();
const { sequelize } = require('./src/models');
const settingService = require('./src/modules/Setting/setting.service');

async function run() {
  try {
    await sequelize.authenticate();
    const result = await settingService.getSystemSettings('defaults');
    console.log('Success:', result);
  } catch (e) {
    console.error('Failure:', e);
  } finally {
    process.exit(0);
  }
}
run();
