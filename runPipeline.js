const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

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

async function runPipeline(url) {
  if (!url) {
    throw new Error("URL is required");
  }

  await runCommand(`node extract.js "${url}"`);
  await runCommand(`node screenshot.js "${url}"`);
  await runCommand(`node analyseBrand.js`);

  const siteData = JSON.parse(
    fs.readFileSync(path.join(__dirname, "siteData.json"), "utf8")
  );

  const brandReport = fs.readFileSync(
    path.join(__dirname, "brandReport.txt"),
    "utf8"
  );

  const screenshot = `${makeSafeFilename(url)}.png`;

  return {
    siteData,
    brandReport,
    screenshot
  };
}

module.exports = { runPipeline };