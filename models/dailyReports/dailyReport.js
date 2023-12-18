const mongoose = require('mongoose');
const Joi = require('joi');

const dailyReportSchema = new mongoose.Schema({
  worker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  places: [
    {
      project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true,
      },
      hours: {
        type: Number,
        required: true,
        min: 1,
        max: 20,
      },
    },
  ],
});

const DailyReport = mongoose.model('SalaryReport', salaryReportSchema);

function validateDailyReport(report) {
  const schema = {
    worker: Joi.objectId().required(),
    date: Joi.date().required(),

    places: Joi.array().items(
      Joi.object({
        project: Joi.objectId().required(),
        hours: Joi.number().min(1).max(20).required(),
      })
    ),
  };
  return Joi.validate(report, schema);
}

module.exports.validate = validateSalaryReport;
module.exports.SalaryReport = DailyReport;
