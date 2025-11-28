    const Evaluation = require('../models/Evaluation');

exports.submitEvaluation = async (req, res) => {
  const { answers, score } = req.body; // Answers to questionnaire, computed score
  try {
    const evaluation = new Evaluation({ userId: req.user.id, answers, score });
    await evaluation.save();
    res.json(evaluation);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.getEvaluation = async (req, res) => {
  try {
    const evaluation = await Evaluation.findOne({ userId: req.user.id });
    if (!evaluation) return res.status(404).json({ msg: 'Not found' });
    res.json(evaluation);
  } catch (err) {
    res.status(500).send('Server error');
  }
};