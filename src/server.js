const express = require("express");
const fetch = require("node-fetch");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.all("/api/proxy", async (req, res) => {
  try {
    const originalUrl = req.query.url;
    if (!originalUrl) {
      return res.status(400).json({ error: "Missing URL parameter" });
    }

    // Build the full URL, merging any query params from req.query (excluding "url")
    const targetUrl = new URL(originalUrl);
    Object.entries(req.query).forEach(([key, value]) => {
      if (key !== "url" && !targetUrl.searchParams.has(key)) {
        targetUrl.searchParams.append(key, value);
      }
    });

    // Prepare headers and fetch options
    const headers = { ...req.headers };
    delete headers["host"];
    delete headers["content-length"];

    const fetchOptions = {
      method: req.method,
      headers,
    };

    // Include body if applicable
    if (!["GET", "HEAD"].includes(req.method.toUpperCase())) {
      fetchOptions.body = JSON.stringify(req.body);
      if (!fetchOptions.headers["Content-Type"]) {
        fetchOptions.headers["Content-Type"] = "application/json";
      }
    }

    const response = await fetch(targetUrl.toString(), fetchOptions);

    const contentType = response.headers.get("content-type");
    res.status(response.status);
    res.setHeader("Content-Type", contentType || "application/octet-stream");

    if (contentType?.includes("application/json")) {
      const data = await response.json();
      res.json(data);
    } else if (
      contentType?.includes("image/") ||
      contentType?.includes("video/") ||
      contentType?.includes("audio/")
    ) {
      response.body.pipe(res);
    } else {
      const buffer = await response.buffer();
      res.send(buffer);
    }
  } catch (error) {
    console.error("Error proxying request:", error);
    res.status(500).json({
      error: "Failed to proxy request",
      details: error.message,
    });
  }
});

if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app
    .listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    })
    .on("error", (err) => {
      console.error("Server error:", err);
    });
}

module.exports = app;
