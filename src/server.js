const express = require("express");
const fetch = require("node-fetch");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();
app.use(cors());

app.get("/api/proxy", async (req, res) => {
  try {
    const externalUrl = req.query.url;

    if (!externalUrl) {
      return res.status(400).json({ error: "Missing URL parameter" });
    }

    const response = await fetch(externalUrl);

    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: `Failed to fetch data from ${externalUrl}` });
    }

    const contentType = response.headers.get("content-type");

    if (contentType.includes("application/json")) {
      const data = await response.json();
      res.status(200).json(data);
    } else if (
      contentType.includes('image/') || 
      contentType.includes('video/') || 
      contentType.includes('audio/')
    ) {
      res.setHeader("Content-Type", contentType);
      response.body.pipe(res);
    } else {
      res.status(400).json({ error: "Unsupported content type" });
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch data", details: error.message });
  }
});

if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
