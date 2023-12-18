const express = require('express');
const router = express.Router();
const { DailyReport, validate } = require('../models/dailyReports/dailyReport');
const { User } = require('../models/user');
const { Project } = require('../models/project');
const admin = require('../middleware/admin');
const authorize = require('../middleware/authorize');
const validateObjectId = require('../middleware/validateObjectId');

router.get('/', [authorize, admin], async (req, res) => {
  const reports = await DailyReport.find()
    .sort('date')
    .populate('worker', 'name _id')
    .populate('places.project', 'name projectNumber _id address');

  res.send(reports);
});

router.get('/:id', [authorize, admin, validateObjectId], async (req, res) => {
  const report = await DailyReport.findById(req.params.id)
    .populate('worker', 'name _id')
    .populate('places.project', 'name projectNumber _id address');
  if (!report)
    return res.status(404).send('Daily report with the given id was not found');

  res.send(report);
});
