import express from "express"; 
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import fetch from "node-fetch";

dotenv.config();
const app = express();
let port = 5000;


app.use(cors({
  origin: ['http://localhost:5173'],
  methods: ['GET', 'POST'],
  credentials: true
}));
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

// Chatbot Route
app.post("/chat", async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    const response = await fetch(GEMINI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: message
          }]
        }]
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API responded with status ${response.status}`);
    }

    const data = await response.json();
    
    if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
      res.json({ response: data.candidates[0].content.parts[0].text });
    } else {
      console.error("Invalid API Response:", data);
      res.status(500).json({ error: "Invalid response from Gemini API" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message || "Failed to fetch response from Gemini API" });
  }
});

// Start Server with port retry logic
const startServer = (retryCount = 0) => {
  const server = app.listen(port, '0.0.0.0')
    .on('listening', () => {
      console.log(`Server running on http://localhost:${port}`);
    })
    .on('error', (err) => {
      if (err.code === 'EADDRINUSE' && retryCount < 3) {
        console.log(`Port ${port} is in use, trying port ${port + 1}`);
        port++;
        startServer(retryCount + 1);
      } else {
        console.error('Failed to start server:', err.message);
        process.exit(1);
      }
    });
};

startServer();