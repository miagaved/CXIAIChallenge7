const axios = require("axios");
const cheerio = require("cheerio");

async function analyseSite(url) {
  try {
    const response = await axios.get(url);
    const html = response.data;

    const $ = cheerio.load(html);

    const headings = [];
    $("h1, h2, h3").each((i, el) => {
      headings.push($(el).text().trim());
    });

    const buttons = [];
    $("a, button").each((i, el) => {
      const text = $(el).text().trim();
      if (text.length > 0 && text.length < 40) {
        buttons.push(text);
      }
    });

    const paragraphs = [];
    $("p").each((i, el) => {
      paragraphs.push($(el).text().trim());
    });

    const bodyText = paragraphs.join(" ");

    const result = {
      headings,
      buttons,
      bodyText: bodyText.slice(0, 1000)
    };

    console.log(JSON.stringify(result, null, 2));

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