// server.js
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('OCR Web App Server');
})

app.post('/extract', (req, res) => {
  let { text } = req.body;

  // Remove any extra single/double letters and pipe symbols
  text = text.replace(/\b[a-zA-Z]{1,2}\b/g, '').replace(/\|/g, '').trim();
  console.log(text);

  // Updated regex patterns
  const namePattern = /Name\s*([A-Z\s]+)/i;                            // Capture name after 'Name'
  const idPattern = /\b([A-Z]{2}\d{2}\s*\d{6,12})\b/;                   // Capture ID starting with two letters followed by digits
  const validityPattern = /\b(\d{2}-\d{2}-\d{4})\b/g;                   // Capture any date in dd-mm-yyyy format

  // Extracting matches
  const nameMatch = text.match(namePattern);
  const idMatch = text.match(idPattern);
  const validityMatches = text.match(validityPattern);  // Find all dates
  console.log(nameMatch, idMatch, validityMatches);

  // Find the date with the highest year
  let validity = null;
  if (validityMatches) {
    validity = validityMatches.reduce((maxDate, currentDate) => {
      const currentYear = parseInt(currentDate.split('-')[2], 10);
      const maxYear = maxDate ? parseInt(maxDate.split('-')[2], 10) : 0;
      return currentYear > maxYear ? currentDate : maxDate;
    }, null);
  }

  // Create extracted data object
  const extractedData = {
    name: nameMatch ? nameMatch[1].trim() : null,
    id: idMatch ? idMatch[0].replace(/\s+/g, '') : null,
    validity: validity,
  };

  res.json(extractedData);
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
