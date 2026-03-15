const express = require("express");
const path = require("path");
const { runPipeline } = require("./runPipeline");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.post("/analyse", async (req, res) => {
  const { url, templateKey } = req.body;

  try {
    const result = await runPipeline(url, templateKey);
    res.json(result);
  } catch (err) {
    console.error("Pipeline failed:", err);
    res.status(500).json({
      error: "Analysis pipeline failed",
      details: String(err)
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});