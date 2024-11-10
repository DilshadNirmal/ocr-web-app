// App.jsx
import { useState } from 'react';
import Tesseract from 'tesseract.js';
import './App.css';

function App() {
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);
  const [extractedData, setExtractedData] = useState(null);

  const handleImageChange = (e) => {
    setImage(URL.createObjectURL(e.target.files[0]));
  };

  const convertImageToText = async () => {
    console.log('conversion function engaged....');

    Tesseract.recognize(image, 'eng', { logger: (m) => console.log(m) })
      .then(({ data: { text } }) => {
        setText(text);
        sendTextToBackend(text);
      })
      .catch((error) => {
        console.error('Error recognizing text:', error);
      });
  };

  const sendTextToBackend = async (text) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/extract`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      const data = await response.json();
      console.log('Extracted Data:', data);
      setExtractedData(data);
    } catch (error) {
      console.error('Error sending text to backend:', error);
    }
  };

  return (
    <div className="App">
      <div className="input-section">
          <input type="file" onChange={handleImageChange} />
          <button onClick={convertImageToText}>Convert</button>
      </div>

      <div className="content">
        <div className="image-column">
            {
                image && (
                    <img src={image} alt="uploaded image" />
                )
            }
        </div>
        <div className="text-column">
        <h2>Extracted Data:</h2>
          {extractedData ? (
            <div>
              <p><strong>Name:</strong> {extractedData.name || 'N/A'}</p>
              <p><strong>ID:</strong> {extractedData.id || 'N/A'}</p>
              <p><strong>Validity:</strong> {extractedData.validity || 'N/A'}</p>
            </div>
          ) : (
            <p>No data extracted</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
