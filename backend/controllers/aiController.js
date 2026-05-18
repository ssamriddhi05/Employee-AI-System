// AI Recommendation using OpenRouter
const getAIRecommendation = async (req, res) => {
  const { employees } = req.body; // array of employee objects

  if (!employees || employees.length === 0) {
    return res.status(400).json({ message: "No employee data provided" });
  }

  const prompt = `
You are an expert HR analyst. Analyze the following employee data and provide:
1. Promotion recommendations
2. Training suggestions
3. Skill enhancement advice
4. Overall ranking (best to least performing)
5. Individual feedback for each employee

Employee Data:
${JSON.stringify(employees, null, 2)}

Respond in a structured, clear format for each employee.
  `;

  try {
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "openrouter/free",
          messages: [{ role: "user", content: prompt }],
        }),
      },
    );

    const data = await response.json();
    const recommendation = data.choices?.[0]?.message?.content;

    if (!recommendation) {
      return res
        .status(500)
        .json({ message: "No response from AI", raw: data });
    }

    res.json({ recommendation });
  } catch (err) {
    res.status(500).json({ message: "AI API error: " + err.message });
  }
};

module.exports = { getAIRecommendation };
