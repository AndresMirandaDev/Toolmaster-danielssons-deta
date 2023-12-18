const mongoose = require('mongoose');
const Joi = require('joi');

const RentedToolSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
    required: true,
  },

  rentedTo: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
    required: true,
  },
  rentStart: {
    type: Date,
    required: true,
    default: Date.now(),
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
  },
});

const RentedTool = mongoose.model('RentedTool', RentedToolSchema);

function validateRentedTool(tool) {
  const schema = {
    name: Joi.string().min(5).max(50).required(),
    rentedTo: Joi.string().min(5).max(50).required(),
    rentStart: Joi.date().required(),
    rentEnd: Joi.date(),
    project: Joi.objectId().required(),
  };
  return Joi.validate(tool, schema);
}

module.exports.validate = validateRentedTool;
module.exports.RentedTool = RentedTool;
