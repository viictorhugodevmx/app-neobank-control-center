require('dotenv').config();

const mongoose = require('mongoose');
const app = require('./app');
const seedInitialData = require('./modules/seeds/seedInitialData');

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || '';

const startServer = async () => {
  try {
    await mongoose.connect(MONGO_URI);

    console.log('✅ MongoDB connected successfully');

    await seedInitialData();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Error starting server:', error.message);
    process.exit(1);
  }
};

startServer();