const genAI = require("../config/gemini-start");

const generateSummary = async (actualUrl) => {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  const prompt = `Summarize this blog ${actualUrl} in a concise and informative
   way. In your summary start with the blog's title as a heading.
   At the end of your summary always include a key takeaways section
   for the blog.`;
  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
};

module.exports = { generateSummary };