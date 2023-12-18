const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Joi = require('joi');
const { Return } = require('../models/return');
const validateObjectId = require('../middleware/validateObjectId');
const { RentedTool } = require('../models/rentedTool');

router.get('/', async (req, res) => {
  const returns = await Return.find()
    .sort('-returnDate')
    .populate({
      path: 'tool',
      populate: { path: 'project' },
    });

  res.send(returns);
});

router.post('/', async (req, res) => {
  const result = validateReturn(req.body);

  if (result.error)
    return res.status(400).send(result.error.details[0].message);

  const rentedTool = await RentedTool.findById(req.body.tool);

  const returnedTool = {
    name: rentedTool.name,
    project: rentedTool.project,
    rentStart: rentedTool.rentStart,
    rentedTo: rentedTool.rentedTo,
  };

  if (!rentedTool)
    return res.status(404).send('Tool with the given id was not found');

  let newReturn = new Return({
    tool: returnedTool,
    rentStartDate: rentedTool.rentStart,
    returnDate: Date.now(),
    rentCompany: rentedTool.rentedTo,
  });

  await newReturn.save();

  res.send(newReturn);
});

function validateReturn(req) {
  const schema = {
    tool: Joi.objectId().required(),
    rentStartDate: Joi.date().required(),
    rentCompany: Joi.string().required(),
  };
  return Joi.validate(req, schema);
}
module.exports = router;
