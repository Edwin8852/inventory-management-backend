const app = require('./app');
const { syncDatabase } = require('./models');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Sync the database models
    await syncDatabase();

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
};

startServer();
// Trigger nodemon restart
