# CXIAIChallenge7

This application analyses a website's branding by extracting website content, taking a screenshot, and using Gemini API to generate a brand analysis report

------------------------------------------------------------------------

Before running the project make sure the following are installed:
- Node.js
- npm
- a Gemini API key

--------------------------------------------------------------------------

Usage instructions:
- Download and install Node.js from https://nodejs.org
- Then run: npm install
- Replace the Xs in .env with your own personal API key
- Start a server by running: node server.js
- If successful, the terminal should display something like: Server running at http://localhost:3000
- Leave this running, open your browser and go to http://localhost:3000
- Then use the application by pasting the target URL where indicated.

------------------------------------------------------------------------------

Main backend files:
- server.js - runs the local web server
- runPipeline.js - ties the workflow together
- extract.js - extract website content
- screenshot.js - captures a screenshot of the brand
- analyseBrand.js - sends site data to the Gemini API and generates a brand report

Main frontend files:
- public/index.html - webpage layout
- public/style.css - webpage styling
- public/app.js - frontend logic

-------------------------------------------------------------------------------
