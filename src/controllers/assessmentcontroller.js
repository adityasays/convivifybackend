// src/controllers/assessmentController.js 
const User = require("../models/user");

const baseQuestions = [
  "Little interest or pleasure in doing things?",
  "Feeling down, depressed, or hopeless?",
  "Trouble sleeping or sleeping too much?",
  "Feeling tired or having little energy?",
  "Poor appetite or overeating?",
  "Feeling bad about yourself?",
  "Trouble concentrating?",
  "Thoughts that you would be better off dead?",
  "Feeling nervous, anxious, or on edge?",
  "Not being able to stop worrying?",
];


const deepQuestions = [
  "Having panic attacks or sudden fear?",
  "Avoiding places or people due to fear?",
  "Feeling detached from reality or your body?",
  "Repeated unwanted thoughts that bother you?",
  "Needing to repeat actions (like checking, washing)?",
  "Feeling life is not worth living?",
];

const calculateConviScore = (answers) => {
  const total = answers.reduce((a, b) => a + b, 0);
  const max = answers.length === 10 ? 30 : 48;
  const score = Math.round((total / max) * 100);

  let level, message, tips;

  if (score <= 20) {
    level = "Minimal";
    message = "You're doing really well right now.";
    tips = [
      "Keep up your healthy routines",
      "Stay connected with people you trust",
      "Practice gratitude daily",
    ];
  } else if (score <= 40) {
    level = "Mild";
    message = "Some early signs — but you're catching it early.";
    tips = [
      "Try 10-minute daily walks",
      "Practice deep breathing 3x a day",
      "Write down 3 things you're grateful for",
      "Limit social media before bed",
    ];
  } else if (score <= 65) {
    level = "Moderate";
    message = "You're going through a tough time — but help works.";
    tips = [
      "Talk to someone you trust this week",
      "Try free guided meditation apps",
      "Consider professional counseling (it's brave, not weak)",
      "Reduce caffeine & alcohol",
    ];
  } else {
    level = "High";
    message = "Please reach out today — you're not alone.";
    tips = [
      "Call a crisis helpline (free & anonymous)",
      "Talk to a counselor immediately",
      "You're stronger than this moment",
      "Help is available 24/7",
    ];
  }

  return { score, level, message, tips };
};

exports.startAssessment = async (req, res) => {
  const user = await User.findOne({ anonymousId: req.userId });

  
  if (user.nextAssessmentDate && new Date() < user.nextAssessmentDate) {
    const daysLeft = Math.ceil((user.nextAssessmentDate - new Date()) / (1000 * 60 * 60 * 24));
    return res.json({
      canRetake: false,
      daysLeft,
      nextDate: user.nextAssessmentDate,
      history: user.conviHistory,
      currentScore: user.conviScore,
    });
  }

  res.json({
    canRetake: true,
    baseQuestions,
    history: user.conviHistory,
  });
};

exports.submitAssessment = async (req, res) => {
  const { answers } = req.body; // [0,1,2,3,...]

  if (!Array.isArray(answers) || answers.length !== 10) {
    return res.status(400).json({ msg: "Exactly 10 answers required" });
  }

  const user = await User.findOne({ anonymousId: req.userId });

  // Determine if deep questions needed
  const earlyRisk = answers.slice(0, 6).reduce((a, b) => a + b, 0);
  let finalAnswers = [...answers];

  if (earlyRisk >= 12) {
    finalAnswers = [...answers, ...answers.slice(0, 6).map(a => Math.min(a + 1, 3))]; // simulate worse
  }

  const result = calculateConviScore(finalAnswers);

  // Save history
  user.conviHistory.push({
    score: result.score,
    level: result.level,
  });

  user.conviScore = result.score;
  user.assessmentCount += 1;
  user.nextAssessmentDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000); // 14 days

  await user.save();

  res.json({
    success: true,
    result,
    history: user.conviHistory,
    nextAssessmentDate: user.nextAssessmentDate,
    improved: user.conviHistory.length > 1
      ? user.conviHistory[user.conviHistory.length - 2].score - result.score
      : null,
  });
};