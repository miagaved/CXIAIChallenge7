const { chromium } = require("playwright");
const fs = require("fs");

async function analyseSite(url) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: 1440, height: 2200 },
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
  });

  try {
    await page.goto(url, {
      waitUntil: "domcontentloaded",
      timeout: 30000
    });

    await page.waitForTimeout(3000);

    const result = await page.evaluate(() => {
      const getText = (selector) =>
        Array.from(document.querySelectorAll(selector))
          .map((el) => el.textContent.trim())
          .filter((text) => text.length > 0);

      const headings = getText("h1, h2, h3").slice(0, 10);

      const buttons = Array.from(document.querySelectorAll("a, button"))
        .map((el) => el.textContent.trim())
        .filter((text) => text.length > 0 && text.length < 40);

      const paragraphs = getText("p");
      const bodyText = paragraphs.join(" ").slice(0, 1000);

      const metaDescription =
        document.querySelector('meta[name="description"]')?.content || "";

      const html = document.documentElement.outerHTML;

      const colorMatches = html.match(/#[0-9a-fA-F]{3,6}/g) || [];
      const colors = [...new Set(colorMatches)].slice(0, 10);

      const fontMatches = html.match(/font-family:[^;]+/g) || [];
      const fonts = [...new Set(fontMatches)].slice(0, 5);

      return {
        url: window.location.href,
        metaDescription,
        headings,
        buttons: [...new Set(buttons)].slice(0, 10),
        colors,
        fonts,
        bodyText
      };
    });

    console.log(JSON.stringify(result, null, 2));
    fs.writeFileSync("siteData.json", JSON.stringify(result, null, 2));
  } catch (err) {
    console.error("Error analysing site:", err.message);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

const url = process.argv[2];

if (!url) {
  console.log("Usage: node extract.js https://example.com");
  process.exit(1);
}

analyseSite(url);