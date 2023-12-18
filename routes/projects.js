const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const { Project, validate } = require('../models/project');
const authorize = require('../middleware/authorize');
const admin = require('../middleware/admin');
const validateObjectId = require('../middleware/validateObjectId');

router.get('/', authorize, async (req, res) => {
  const projects = await Project.find()
    .sort('name')
    .populate('supervisor', 'name _id');

  res.send(projects);
});

router.get('/:id', [authorize, validateObjectId], async (req, res) => {
  const project = await Project.findById(req.params.id).populate(
    'supervisor',
    'name _id'
  );

  if (!project)
    return res.status(404).send('Project with the given id was not found.');
  res.send(project);
});

router.post('/', [authorize, admin], async (req, res) => {
  const result = validate(req.body);
  if (result.error)
    return res.status(400).send(result.error.details[0].message);

  const { name, address, projectNumber, supervisor, startDate, endDate } =
    req.body;

  let project = await new Project({
    name,
    address,
    projectNumber,
    supervisor,
    startDate,
    endDate,
  });

  project = await project.save();

  res.send(project);
});

router.put('/:id', [authorize, admin, validateObjectId], async (req, res) => {
  const result = validate(req.body);

  if (result.error)
    return res.status(400).send(result.error.details[0].message);

  const { name, address, projectNumber, supervisor, startDate, endDate } =
    req.body;

  const project = await Project.findByIdAndUpdate(
    req.params.id,
    {
      name,
      address,
      projectNumber,
      supervisor,
      startDate,
      endDate,
    },
    { new: true }
  );

  if (!project)
    return res.status(404).send('Project with the given id was not found.');

  res.send(project);
});

router.delete(
  '/:id',
  [authorize, admin, validateObjectId],
  async (req, res) => {
    const project = await Project.findByIdAndRemove(req.params.id);

    if (!project)
      return res.status(404).send('Project with the given id was not found.');

    res.send(project);
  }
);

module.exports = router;
