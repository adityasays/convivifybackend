const Questionnaire = require('../models/Questionnaire');

exports.createQuestionnaire = async (req, res) => {
  const { questions } = req.body; // Array of questions
  try {
    const questionnaire = new Questionnaire({ userId: req.user.id, questions });
    await questionnaire.save();
    res.json(questionnaire);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.getQuestionnaire = async (req, res) => {
  try {
    const questionnaire = await Questionnaire.findOne({ userId: req.user.id });
    if (!questionnaire) return res.status(404).json({ msg: 'Not found' });
    res.json(questionnaire);
  } catch (err) {
    res.status(500).send('Server error');
  }
};