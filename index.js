require('dotenv').config();
const express = require('express');
const winston = require('winston');
const Joi = require('joi');
const cors = require('cors');
const morgan = require('morgan');

const app = express();
app.use(cors());
app.use(morgan('dev'));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

require('./startup/logging')();
require('./startup/routes')(app);
require('./startup/db');
require('./startup/config')();
require('./startup/validation')();

const port = process.env.PORT || 3006;

app.listen(port, () => {
  winston.info(`Listening on port ${port}...`);
});

module.exports = app;
