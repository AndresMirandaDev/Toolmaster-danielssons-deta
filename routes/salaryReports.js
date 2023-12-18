const express = require('express');
const router = express.Router();
const { SalaryReport, validate } = require('../models/salaryReport');
const { User } = require('../models/user');
const { Project } = require('../models/project');
const admin = require('../middleware/admin');
const authorize = require('../middleware/authorize');
const validateObjectId = require('../middleware/validateObjectId');

router.get('/', [authorize, admin], async (req, res) => {
  const reports = await SalaryReport.find()
    .sort('date')
    .populate('worker', 'name _id')
    .populate('workDays.places.project', 'name projectNumber _id address');

  res.send(reports);
});

router.get('/:id', [authorize, admin, validateObjectId], async (req, res) => {
  const report = await SalaryReport.findById(req.params.id)
    .populate('worker', 'name _id')
    .populate('workDays.places.project', 'name projectNumber _id address');
  if (!report)
    return res
      .status(404)
      .send('Salary report with the given id was not found');

  res.send(report);
});

router.post('/', authorize, async (req, res) => {
  const result = validate(req.body);
  if (result.error)
    return res.status(400).send(result.error.details[0].message);

  const { worker, date, workDays } = req.body;

  //check if given worker id is an existing user
  const user = await User.findById(worker);
  if (!user)
    return res.status(404).send('User with the given id was not found.');

  //check if given project id is an existing project
  await workDays.forEach(async (workDay) => {
    workDay.places.forEach(async (place) => {
      const project = await Project.findById(place.project);
      if (!project)
        return res
          .status(404)
          .send('One of the project id`s does not match an existing project.');
    });
  });

  let report = await new SalaryReport({
    worker,
    date,
    workDays: [...workDays],
  });

  report = await report.save();

  report = await report.populate('worker', 'name _id ');
  report = await report.populate(
    'workDays.places.project',
    'name projectNumber _id address'
  );

  res.send(report);
});

router.put('/:id', [authorize, admin, validateObjectId], async (req, res) => {
  const result = validate(req.body);
  if (result.error)
    return res.status(400).send(result.error.details[0].message);

  const { worker, date, workDays } = req.body;

  //check if given worker id is an existing user
  const user = await User.findById(worker);
  if (!user)
    return res.status(404).send('User with the given id was not found.');

  //check if given project id is an existing project
  await workDays.forEach(async (workDay) => {
    workDay.places.forEach(async (place) => {
      const project = await Project.findById(place.project);
      if (!project)
        return res
          .status(404)
          .send('One of the project id`s does not match an existing project.');
    });
  });

  const report = await SalaryReport.findByIdAndUpdate(
    req.params.id,
    {
      worker,
      date,
      workDays: [...workDays],
    },
    { new: true }
  )
    .populate('worker', 'name _id')
    .populate('workDays.places.project', 'name projectNumber _id address');

  if (!report)
    return res.status(404).send('Report with the given id was not found.');

  res.send(report);
});

router.delete(
  '/:id',
  [authorize, admin, validateObjectId],
  async (req, res) => {
    const report = await SalaryReport.findByIdAndRemove(req.params.id);

    if (!report)
      return res.status(404).send('Report with the given id was not found.');

    res.send(report);
  }
);

module.exports = router;
