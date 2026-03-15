require("dotenv").config();
const fs = require("fs");
const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

async function analyseAndCompare(templateKey) {
  try {
    
    const siteData = JSON.parse(fs.readFileSync("siteData.json", "utf8"));
    
   
    const templates = JSON.parse(fs.readFileSync("templates.json", "utf8"));
    const targetTemplate = templates[templateKey];

    if (!targetTemplate) {
      throw new Error(`Template "${templateKey}" not found in templates.json`);
    }

    
    const prompt = `
You are a Senior Design Critic. 

COMPARE the following Website Data to the Target Template DNA.

Target Template: ${targetTemplate.name}
Design DNA: ${JSON.stringify(targetTemplate.dna)}

User Website Data: ${JSON.stringify(siteData, null, 2)}

TASK:
1. Identify specific visual gaps (Color, Font, Spacing) between the site and the template.
2. Provide a "Similarity Score" (0-100%).
3. List 5 specific changes to make the website look more like the ${targetTemplate.name}.
4. Provide CSS code snippets to implement these changes immediately.
`;


    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt
    });
    
    const report = response.text;

    console.log(report);
    
    fs.writeFileSync("brandReport.txt", report);
    console.log("Comparison report saved to brandReport.txt");
    
    return report;
  } catch (err) {
    console.error("Error during comparison:", err.message);
    throw err;
  }
}


module.exports = { analyseAndCompare };