import express from "express"; 
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import fetch from "node-fetch";
import rateLimit from 'express-rate-limit';

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

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

app.post("/chat", async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    const formattedPrompt = `Provide a structured response following these exact rules:

    FORMAT RULES:
    1. Start with a one-line summary
    2. Use sequential numbers for main points (1., 2., 3.)
    3. Use decimal numbers for sub-points (>, >, >, >)
    4. Put key terms in UPPERCASE
    5. Indent examples with "Example:" prefix
    6. Keep each point concise (max 2 lines)
    7. Add line breaks between main points
    8. Maximum 5 main points
    9. Maximum 3 sub-points per main point
    10. End with a one-line conclusion

    RESPONSE STRUCTURE:
    [One-line summary]

    1. [First main point]
       1.1. [Sub-point]
       1.2. [Sub-point]
       Example: [Specific example]

    2. [Second main point]
       2.1. [Sub-point]
       2.2. [Sub-point]

    [One-line conclusion]

    Question: ${message}`;

    const response = await fetch(GEMINI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: formattedPrompt
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

app.get('/api/hackathons/devpost', async (req, res) => {
  try {
    const response = await fetch('https://devpost.com/api/hackathons');
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/hackathons/mlh', async (req, res) => {
  try {
    const response = await fetch('https://mlh.io/events/api');
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/hackathons/hackerearth', async (req, res) => {
  try {
    const response = await fetch('https://www.hackerearth.com/challenges/api/');
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

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