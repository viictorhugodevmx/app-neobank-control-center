const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const apiRoutes = require('./routes');

const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'NeoBank Control Center API is running',
    data: {
      service: 'neobank-control-center-back',
      status: 'ok',
      timestamp: new Date().toISOString(),
    },
  });
});

app.use('/api', apiRoutes);

module.exports = app;