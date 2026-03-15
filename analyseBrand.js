require("dotenv").config();
const fs = require("fs");
const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

async function analyseBrand() {
  try {
    const siteData = JSON.parse(fs.readFileSync("siteData.json", "utf8"));

    const prompt = `
You are a brand strategist.

Analyse this website information and return:

1. Brand personality
2. Tone of voice
3. Target audience
4. Cohesion issues
5. Suggestions to improve cohesion
6. Code snippets (CSS, HTML, or copy changes) to implement improvements

Website data:
${JSON.stringify(siteData, null, 2)}
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt
    });

    const report = response.text;

    console.log(report);
    fs.writeFileSync("brandReport.txt", report);
    console.log("Brand report saved to brandReport.txt");
  } catch (err) {
    console.error("Error analysing brand:", err.message);
  }
}

analyseBrand();