const mongoose = require('mongoose');
const Joi = require('joi');

const ReturnSchema = new mongoose.Schema({
  tool: new mongoose.Schema({
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
  }),
  rentStartDate: {
    type: Date,
    required: true,
  },
  returnDate: {
    type: Date,
    required: true,
  },
  rentCompany: {
    type: String,
    required: true,
  },
});

const Return = mongoose.model('Return', ReturnSchema);

module.exports.Return = Return;
