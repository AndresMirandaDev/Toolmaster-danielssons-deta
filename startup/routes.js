const express = require('express');


const home = require('../routes/home');
const tools = require('../routes/tools');
const users = require('../routes/users');
const auth = require('../routes/auth');
const projects = require('../routes/projects');
const toolGroups = require('../routes/toolGroups');
const salaryReports = require('../routes/salaryReports');
const error = require('../middleware/error');
const rentedTools = require('../routes/rentedTools');
const returns = require('../routes/returns');

module.exports = function (app) {
  app.use(express.json());
  app.use('/', home);
  app.use('/api/tools', tools);
  app.use('/api/users', users);
  app.use('/api/auth', auth);
  app.use('/api/projects', projects);
  app.use('/api/toolgroups', toolGroups);
  app.use('/api/salaryreports', salaryReports);
  app.use('/api/rentedtools', rentedTools);
  app.use('/api/returns', returns);

  


};
