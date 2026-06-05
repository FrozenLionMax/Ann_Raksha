const { GoogleGenerativeAI } = require("@google/generative-ai");
const Groq = require("groq-sdk");
const User = require("../models/User");

const getAiResponse = async (prompt) => {
  let geminiFailed = false;
  
  if (process.env.GEMINI_API_KEY) {
    try {
      const geminiAi = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = geminiAi.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (error) {
      console.error("Gemini failed, falling back to Groq:", error);
      geminiFailed = true;
    }
  } else {
    geminiFailed = true;
  }

  if (geminiFailed && process.env.GROQ_API_KEY) {
    try {
      const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
      const chatCompletion = await groq.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "llama3-8b-8192",
      });
      return chatCompletion.choices[0]?.message?.content || "";
    } catch (groqError) {
      console.error("Both AI services failed:", groqError);
      throw new Error("Failed to generate AI response.");
    }
  }

  throw new Error("No API keys provided for AI services.");
};

exports.generateRecipe = async (req, res) => {
  try {
    const { ingredients } = req.body;
    if (!ingredients) {
      return res.status(400).json({ message: "Ingredients are required" });
    }
    const prompt = `I have the following leftover ingredients: ${ingredients}. Can you suggest 1 or 2 quick and creative recipes I can make with them to prevent food waste? Keep it concise and format nicely in Markdown.`;
    const response = await getAiResponse(prompt);
    res.json({ recipe: response });
  } catch (error) {
    res.status(500).json({ message: "Server error generating recipe." });
  }
};

exports.categorizeFood = async (req, res) => {
  try {
    const { title, type } = req.body;
    const prompt = `I want to donate food. The title is "${title}" and the type is "${type}". Predict a reasonable expiry time (e.g., '2 days', '1 week', '4 hours') and a good storage instruction. Return ONLY a valid JSON object with keys "predictedExpiry" and "storageInstruction". Do not include markdown blocks or any other text.`;
    let response = await getAiResponse(prompt);
    response = response.replace(/```json/gi, "").replace(/```/g, "").trim();
    const data = JSON.parse(response);
    res.json(data);
  } catch (error) {
    console.error("Error in categorizeFood:", error);
    res.status(500).json({ message: "Server error categorizing food." });
  }
};

exports.findBestMatch = async (req, res) => {
  try {
    const { donationDetails } = req.body;
    // Fetch verified NGOs
    const ngos = await User.find({ role: 'ngo', verificationStatus: 'approved' }).select('name email organizationName');
    
    if (ngos.length === 0) {
      return res.status(404).json({ message: "No verified NGOs available for matching." });
    }

    const ngoListStr = ngos.map(n => `ID: ${n._id}, Name: ${n.organizationName || n.name}`).join("\\n");
    
    const prompt = `I have a food donation with the following details:
${JSON.stringify(donationDetails)}

Here is a list of available NGOs:
${ngoListStr}

Please analyze the donation details (quantity, type, urgency) and recommend the best NGO matches from the list. 
Return ONLY a valid JSON array of objects. Each object should have keys "ngoId", "score" (1-100), and "reason" (short string explaining why). Do not include markdown blocks or any other text.`;

    let response = await getAiResponse(prompt);
    response = response.replace(/```json/gi, "").replace(/```/g, "").trim();
    const matches = JSON.parse(response);

    // Sort by score descending
    matches.sort((a, b) => b.score - a.score);

    res.json(matches);
  } catch (error) {
    console.error("Error in findBestMatch:", error);
    res.status(500).json({ message: "Server error during matching." });
  }
};
