const express = require('express');
const fetch = require('node-fetch');
const app = express();
const cors = require('cors');
const dotenv = require("dotenv");

dotenv.config();
app.use(cors());

app.get('/api/proxy', async (req, res) => {

  try {
    const externalUrl = req.query.url;

    if (!externalUrl) {
      return res.status(400).json({ error: 'Missing URL parameter' });
    }

    const response = await fetch(externalUrl);

    if (!response.ok) {
      return res.status(response.status).json({ error: `Failed to fetch data from ${externalUrl}` });
    }

    const data = await response.json();

    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Failed to fetch data', details: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});