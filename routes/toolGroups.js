const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const { ToolGroup, validate } = require('../models/toolGroup');
const authorize = require('../middleware/authorize');
const admin = require('../middleware/admin');
const validateObjectId = require('../middleware/validateObjectId');

router.get('/', async (req, res) => {
  const toolGroups = await ToolGroup.find().sort('name');

  res.send(toolGroups);
});

router.get('/:id', [authorize, validateObjectId], async (req, res) => {
  const toolGroup = await ToolGroup.findById(req.params.id);

  if (!toolGroup)
    return res.status(404).send('Group with the given id was not found.');

  res.send(toolGroup);
});

router.post('/', [authorize, admin], async (req, res) => {
  const result = validate(req.body);
  if (result.error)
    return res.status(400).send(result.error.details[0].message);

  const { name, description } = req.body;
  let toolGroup = await new ToolGroup({
    name,
    description,
  });

  toolGroup = await toolGroup.save();

  res.send(toolGroup);
});

router.put('/:id', [authorize, admin, validateObjectId], async (req, res) => {
  const result = validate(req.body);
  if (result.error)
    return res.status(400).send(result.error.details[0].message);

  const { name, description } = req.body;
  const toolGroup = await ToolGroup.findByIdAndUpdate(
    req.params.id,
    {
      name,
      description,
    },
    { new: true }
  );

  if (!toolGroup)
    return res.status(404).send('Group with the given id was not found.');

  res.send(toolGroup);
});

router.delete(
  '/:id',
  [authorize, admin, validateObjectId],
  async (req, res) => {
    const toolGroup = await ToolGroup.findByIdAndRemove(req.params.id);

    if (!toolGroup)
      return res.status(404).send('Group with the given id was not found.');

    res.send(toolGroup);
  }
);

module.exports = router;
