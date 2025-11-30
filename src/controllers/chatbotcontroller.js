// src/controllers/chatbotController.js  ← Full file with fix
const User = require("../models/user");

const GROQ_API_KEY = process.env.GROQ_API_KEY;

if (!GROQ_API_KEY) {
  console.error("GROQ_API_KEY missing in .env");
}

const systemPrompt = `You are Convi Buddy — a warm, empathetic, non-judgmental mental health companion.
You help people feel heard and supported. You never diagnose, never prescribe medication, and always encourage professional help when needed.
Use simple, kind language. Add gentle emojis. If someone is in crisis, say: "I'm really worried about you. Please talk to a human right now — call your local crisis line or a trusted person."
You can be playful and friendly when appropriate.`;

let conversationHistory = new Map();

exports.sendMessage = async (req, res) => {
  const { message } = req.body;
  const userId = req.userId;

  if (!message?.trim()) return res.status(400).json({ error: "Message required" });

  try {
    let history = conversationHistory.get(userId) || [
      { role: "system", content: systemPrompt },
    ];

    history.push({ role: "user", content: message.trim() });

    if (history.length > 21) history = [history[0], ...history.slice(-20)];

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile", 
        messages: history,
        temperature: 0.7,
        max_tokens: 512,
      }),
    });

    const data = await response.json();

    if (data.error) throw new Error(data.error.message);

    const botReply = data.choices[0].message.content;

    history.push({ role: "assistant", content: botReply });
    conversationHistory.set(userId, history);

    res.json({ reply: botReply });
  } catch (err) {
    console.error("Chat error:", err.message);
    res.status(500).json({
      reply: "I'm having trouble connecting right now... But I'm still here for you. Try again in a moment? ❤️",
    });
  }
};

exports.getHistory = async (req, res) => {
  const history = conversationHistory.get(req.userId) || [];
  const messages = history
    .filter(m => m.role !== "system")
    .map(m => ({ role: m.role, content: m.content }));
  res.json({ messages });
};