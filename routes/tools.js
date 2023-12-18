const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const authorize = require('../middleware/authorize');
const admin = require('../middleware/admin');
const { Tool, validate } = require('../models/tool');
const validateObjectId = require('../middleware/validateObjectId');

router.get('/all', async (req, res) => {
  const tools = await Tool.find()
    .sort('name')
    .populate('project', 'name address projectNumber _id')
    .populate('toolGroup', 'name description _id');
  res.send(tools);
});

router.get('/forid/:id', [authorize, validateObjectId], async (req, res) => {
  const tool = await Tool.findById(req.params.id)
    .populate('project', 'name address projectNumber _id')
    .populate('toolGroup', 'name description');

  if (!tool)
    return res.status(404).send('Tool with the given id was not found.');

  res.send(tool);
});

router.post('/create', authorize, async (req, res) => {
  const result = validate(req.body);
  if (result.error)
    return res.status(400).send(result.error.details[0].message);

  const { name, serieNumber, toolGroup, project } = req.body;
  let tool = await new Tool({
    name: name,
    serieNumber,
    toolGroup,
    project,
  });

  tool = await tool.save();

  res.send(tool);
});

router.put('/update/:id', [authorize, validateObjectId], async (req, res) => {
  const result = validate(req.body);

  if (result.error)
    return res.status(400).send(result.error.details[0].message);

  const { name, serieNumber, toolGroup, project, available, reparation } =
    req.body;

  const tool = await Tool.findByIdAndUpdate(
    req.params.id,
    {
      name,
      serieNumber,
      toolGroup,
      project,
      available,
      reparation,
    },
    { new: true }
  )
    .populate('toolGroup', 'name description')
    .populate('project', 'name address projectNumber');

  res.send(tool);
});

router.delete(
  '/delite/:id',
  [authorize, admin, validateObjectId],
  async (req, res) => {
    const tool = await Tool.findByIdAndRemove(req.params.id);

    if (!tool)
      return res.status(404).send('Tool with the given id was not found.');
    res.send(tool);
  }
);

module.exports = router;
