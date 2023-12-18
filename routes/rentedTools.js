const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const authorize = require('../middleware/authorize');
const { rentedTool, validate, RentedTool } = require('../models/rentedTool');
const validateObjectId = require('../middleware/validateObjectId');

router.get('/', async (req, res) => {
  const rentedTools = await RentedTool.find()
    .sort('name')
    .populate('project', 'name address projectNumber _id');

  res.send(rentedTools);
});

router.post('/', async (req, res) => {
  const result = validate(req.body);
  if (result.error)
    return res.status(400).send(result.error.details[0].message);

  const { name, rentedTo, rentStart, project } = req.body;

  let rentedTool = await new RentedTool({
    name,
    rentedTo,
    rentStart,
    project,
  });

  rentedTool = await rentedTool.save();
  res.send(rentedTool);
});

router.put('/:id', validateObjectId, async (req, res) => {
  const result = validate(req.body);

  if (result.error)
    return res.status(400).send(result.error.details[0].message);

  const { name, rentedTo, rentStart, project } = req.body;

  const rentedTool = await RentedTool.findByIdAndUpdate(
    req.params.id,
    {
      name,
      rentedTo,
      rentStart,
      project,
    },
    { new: true }
  ).populate('project', 'name address projectNumber _id');

  res.send(rentedTool);
});

router.delete('/:id', [authorize, validateObjectId], async (req, res) => {
  const rentedTool = await RentedTool.findByIdAndRemove(req.params.id);

  if (!rentedTool)
    return res.status(404).send('Rented tool with the given id was not found.');
  res.send(rentedTool);
});

module.exports = router;
