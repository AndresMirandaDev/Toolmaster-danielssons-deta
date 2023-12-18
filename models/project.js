const mongoose = require('mongoose');
const Joi = require('joi');

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 5,
    maxlength: 50,
    required: true,
  },
  address: {
    type: String,
    minlength: 5,
    maxlength: 50,
    required: true,
  },
  projectNumber: {
    type: Number,
    required: true,
  },
  active: {
    type: Boolean,
    default: false,
  },
  supervisor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
});

const Project = mongoose.model('Project', projectSchema);

function validateProject(project) {
  const schema = {
    name: Joi.string().min(5).max(50).required(),
    address: Joi.string().min(5).max(50).required(),
    projectNumber: Joi.number().required(),
    active: Joi.boolean(),
    supervisor: Joi.objectId().required(),
    startDate: Joi.date().required(),
    endDate: Joi.date().required(),
  };

  return Joi.validate(project, schema);
}

module.exports.validate = validateProject;
module.exports.Project = Project;
