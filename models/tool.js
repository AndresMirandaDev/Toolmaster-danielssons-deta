const mongoose = require('mongoose');
const Joi = require('joi');

const toolSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
    required: true,
  },
  serieNumber: {
    type: Number,
    required: true,
  },
  toolGroup: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ToolGroup',
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
  },
  available: {
    type: Boolean,
    default: true,
  },
  reparation: {
    type: Boolean,
    default: false,
  },
});

const Tool = mongoose.model('Tool', toolSchema);

//input validator function

function validateTool(tool) {
  const schema = {
    name: Joi.string().min(5).max(50).required(),
    serieNumber: Joi.number().required(),
    toolGroup: Joi.objectId().required(),
    project: Joi.objectId().allow(null),
    available: Joi.boolean(),
    reparation: Joi.boolean(),
  };
  return Joi.validate(tool, schema);
}

module.exports.validate = validateTool;
module.exports.Tool = Tool;
