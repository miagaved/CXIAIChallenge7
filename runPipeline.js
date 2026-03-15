const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const { analyseAndCompare } = require("./analyseBrand"); 

function runCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, { cwd: __dirname }, (error, stdout, stderr) => {
      if (error) {
        reject(stderr || stdout || error.message);
        return;
      }
      resolve(stdout.trim());
    });
  });
}

function makeSafeFilename(url) {
  return url
    .replace(/^https?:\/\//, "")
    .replace(/[^a-z0-9]/gi, "_")
    .toLowerCase()
    .slice(0, 80);
}

async function runPipeline(url, templateKey) {
  if (!url) {
    throw new Error("URL is required");
  }

  console.log(`Extracting site data for ${url}...`);
  await runCommand(`node extract.js "${url}"`);
  
  console.log("Capturing screenshot...");
  await runCommand(`node screenshot.js "${url}"`);

  console.log(`Comparing site to template: ${templateKey}...`);
  const brandReport = await analyseAndCompare(templateKey);

  const siteData = JSON.parse(
    fs.readFileSync(path.join(__dirname, "siteData.json"), "utf8")
  );

  const screenshot = `${makeSafeFilename(url)}.png`;

  console.log("Pipeline complete!");
  return {
    siteData,
    brandReport,
    screenshot
  };
}

module.exports = { runPipeline };
