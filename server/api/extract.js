// api/extract.js
const cors = require('cors');
const express = require('express');
const app = express();

app.use(cors());
app.use(express.json());

app.post('/extract', (req, res) => {
  let { text } = req.body;

  text = text.replace(/\b[a-zA-Z]{1,2}\b/g, '').replace(/\|/g, '').trim();
  console.log(text);

  const namePattern = /Name\s*([A-Z\s]+)/i;
  const idPattern = /\b([A-Z]{2}\d{2}\s*\d{6,12})\b/;
  const validityPattern = /\b(\d{2}-\d{2}-\d{4})\b/g;

  const nameMatch = text.match(namePattern);
  const idMatch = text.match(idPattern);
  const validityMatches = text.match(validityPattern);
  console.log(nameMatch, idMatch, validityMatches);

  let validity = null;
  if (validityMatches) {
    validity = validityMatches.reduce((maxDate, currentDate) => {
      const currentYear = parseInt(currentDate.split('-')[2], 10);
      const maxYear = maxDate ? parseInt(maxDate.split('-')[2], 10) : 0;
      return currentYear > maxYear ? currentDate : maxDate;
    }, null);
  }

  const extractedData = {
    name: nameMatch ? nameMatch[1].trim() : null,
    id: idMatch ? idMatch[0].replace(/\s+/g, '') : null,
    validity: validity,
  };

  res.json(extractedData);
});

module.exports = app;
