const axios = require("axios");
const cheerio = require("cheerio");

async function analyseSite(url) {
  try {
    const response = await axios.get(url);
    const html = response.data;

    const $ = cheerio.load(html);

    // HEADINGS
    const headings = [];
    $("h1, h2, h3").each((i, el) => {
      headings.push($(el).text().trim());
    });

    // BUTTONS / CTAs
    const buttons = [];
    $("a, button").each((i, el) => {
      const text = $(el).text().trim();
      if (text.length > 0 && text.length < 40) {
        buttons.push(text);
      }
    });

    const uniqueButtons = [...new Set(buttons)];

    // PARAGRAPH TEXT
    const paragraphs = [];
    $("p").each((i, el) => {
      paragraphs.push($(el).text().trim());
    });

    const bodyText = paragraphs.join(" ");

    // META DESCRIPTION
    const metaDescription = $('meta[name="description"]').attr("content");

    // FIND COLOURS IN HTML
    const colorMatches = html.match(/#[0-9a-fA-F]{3,6}/g) || [];
    const colors = [...new Set(colorMatches)].slice(0, 10);

    // FIND FONT FAMILIES
    const fontMatches = html.match(/font-family:[^;]+/g) || [];
    const fonts = [...new Set(fontMatches)].slice(0, 5);

    const result = {
      url,
      metaDescription,
      headings: headings.slice(0, 10),
      buttons: uniqueButtons.slice(0, 10),
      colors,
      fonts,
      bodyText: bodyText.slice(0, 1000)
    };

    console.log(JSON.stringify(result, null, 2));
    
    const fs = require("fs");
    fs.writeFileSync("siteData.json", JSON.stringify(result, null, 2));

  } catch (err) {
    console.error("Error analysing site:", err.message);
  }
}

const url = process.argv[2];

if (!url) {
  console.log("Usage: node extract.js https://example.com");
  process.exit();
}


analyseSite(url);