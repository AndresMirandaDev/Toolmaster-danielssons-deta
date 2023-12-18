const config = require('config');
const winston = require('winston');
require('winston-mongodb');
require('express-async-errors');

module.exports = function () {
  //uncaught exceptions logger
  winston.exceptions.handle(
    new winston.transports.File({ filename: 'uncaughtExceptions.log' })
  );

  process.on('unhandledRejection', (ex) => {
    throw ex;
  });
  //error logger
  winston.add(new winston.transports.File({ filename: 'logfile.log' }));

  // // mongoDB logger
  const db = config.get('db');
  winston.add(
    new winston.transports.MongoDB({
      db: db,
      level: 'error',
    })
  );

  //console logger
  winston.add(
    new winston.transports.Console({
      handleExceptions: true,
      format: winston.format.combine(
        winston.format.printf((log) => {
          log.message;
        }),
        winston.format.colorize(),
        winston.format.prettyPrint(),
        winston.format.simple()
      ),
    })
  );
};
