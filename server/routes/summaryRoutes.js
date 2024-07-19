const express = require('express');
const { generateSummary } = require('../services/summaryService');

const router = express.Router();

router.post('/', async (req, res) => {
  const { actualUrl } = req.body;
  try {
    const summary = await generateSummary(actualUrl);
    res.send(summary);
  } catch (error) {
    console.error('Error generating summary:', error);
    res.status(500).json({ error: 'Error generating summary.' });
  }
});

module.exports = router;