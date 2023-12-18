const mongoose = require('mongoose');
const Joi = require('joi');

const toolGroupSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 5,
    maxlength: 100,
    required: true,
  },
  description: {
    type: String,
    minlength: 5,
    maxlength: 150,
    required: true,
  },
});

const ToolGroup = mongoose.model('ToolGroup', toolGroupSchema);

function validateToolGroup(toolGroup) {
  const schema = {
    name: Joi.string().min(5).max(100).required(),
    description: Joi.string().min(5).max(150).required(),
  };
  return Joi.validate(toolGroup, schema);
}

module.exports.ToolGroup = ToolGroup;
module.exports.validate = validateToolGroup;
