const mongoose = require('mongoose');

const EvaluationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  answers: [{ type: String }],
  score: { type: Number },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Evaluation', EvaluationSchema);