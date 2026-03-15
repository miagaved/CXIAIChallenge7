const analyseBtn = document.getElementById("analyseBtn");
const urlInput = document.getElementById("urlInput");
const statusDiv = document.getElementById("status");
const resultsSection = document.getElementById("results");
const screenshotImg = document.getElementById("siteScreenshot");
const brandReportPre = document.getElementById("brandReport");

analyseBtn.addEventListener("click", async () => {
  const url = urlInput.value.trim();

  if (!url) {
    statusDiv.textContent = "Please enter a URL.";
    return;
  }

  statusDiv.textContent = "Running analysis...";
  resultsSection.classList.add("hidden");

  try {
    const response = await fetch("/analyse", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ url })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.details || data.error || "Unknown error");
    }

    brandReportPre.textContent = data.brandReport;
    screenshotImg.src = `/${data.screenshot}?t=${Date.now()}`;

    statusDiv.textContent = "Analysis complete.";
    resultsSection.classList.remove("hidden");
  } catch (err) {
    statusDiv.textContent = `Error: ${err.message}`;
  }
});
