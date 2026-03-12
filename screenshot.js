const { chromium } = require("playwright");

function makeSafeFilename(url) {
  return url
    .replace(/^https?:\/\//, "")
    .replace(/[^a-z0-9]/gi, "_")
    .toLowerCase()
    .slice(0, 80);
}

async function takeScreenshot(url) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: 1440, height: 2200 }
  });

  const filename = `${makeSafeFilename(url)}.png`;

  try {
    await page.goto(url, {
      waitUntil: "networkidle",
      timeout: 30000
    });

    await page.screenshot({
      path: filename,
      fullPage: true
    });

    console.log(`Screenshot saved as ${filename}`);
  } catch (err) {
    console.error("Error taking screenshot:", err.message);
  } finally {
    await browser.close();
  }
}

const url = process.argv[2];

if (!url) {
  console.log("Usage: node screenshot.js https://example.com");
  process.exit();
}

takeScreenshot(url);