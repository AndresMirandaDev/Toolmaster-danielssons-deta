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

router.post('/', authorize, async (req, res) => {
  const result = validate(req.body);
  if (result.error)
    return res.status(400).send(result.error.details[0].message);

  const { worker, date, places } = req.body;

  //check if given worker id is an existing user
  const user = await User.findById(worker);
  if (!user)
    return res.status(404).send('User with the given id was not found.');

  await places.forEach(async (place) => {
    const project = await Project.findById(place.project);
    if (!project)
      return res
        .status(400)
        .send('One of the project id`s does not match an existing project.');
  });

  //check if given project id is an existing project

  let report = await new DailyReport({
    worker,
    date,
    places: [...places],
  });

  report = await report.save();

  report = await report.populate('worker', 'name _id ');
  report = await report.populate(
    'places.project',
    'name projectNumber _id address'
  );

  res.send(report);
});

router.put('/:id', [authorize, admin, validateObjectId], async (req, res) => {
  const result = validate(req.body);
  if (result.error)
    return res.status(400).send(result.error.details[0].message);

  const { worker, date, places } = req.body;

  //check if given worker id is an existing user
  const user = await User.findById(worker);
  if (!user)
    return res.status(404).send('User with the given id was not found.');

  for (const place of places) {
    const project = await Project.findById(place.project);
    if (!project) {
      return res
        .status(400)
        .send('One of the project id`s does not match an existing project.');
    }
  }

  const report = await DailyReport.findByIdAndUpdate(
    req.params.id,
    {
      worker,
      date,
      places: [...places],
    },
    { new: true }
  )
    .populate('worker', 'name _id')
    .populate('places.project', 'name projectNumber _id address');

  if (!report)
    return res.status(404).send('Report with the given id was not found.');

  res.send(report);
});

router.delete(
  '/:id',
  [authorize, admin, validateObjectId],
  async (req, res) => {
    const report = await DailyReport.findByIdAndRemove(req.params.id);

    if (!report)
      return res.status(404).send('Report with the given id was not found.');

    res.send(report);
  }
);

module.exports = router;
