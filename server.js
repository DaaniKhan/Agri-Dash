// server.js
import express from 'express';
import path from 'path';
import { getLatestReadingByUserID } from './db_controller.js';
import dotenv from 'dotenv';
import pool from './db.js';
import session from 'express-session';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Set EJS as the view engine and serve static files
app.set('view engine', 'ejs');
app.use(express.json()); // This parses incoming JSON requests
app.use(express.static(path.join(path.resolve(), 'public')));

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'your_secret_key', // Replace with a secure secret
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Set to true if using HTTPS
  })
);

app.use((req, res, next) => {
  if (req.path === '/') {
    const sessionId = req.sessionID || "anonymous";
    const ipAddress = req.ip;
    const userAgent = req.headers['user-agent'];

    const query = `
      INSERT INTO app_usage (session_id, ip_address, user_agent, access_time)
      VALUES ($1, $2, $3, NOW())
    `;

    pool.query(query, [sessionId, ipAddress, userAgent])
      .then(() => console.log(`Access logged with session ID: ${sessionId}`))
      .catch((error) => console.error('Error logging access:', error));
  }
  next();
});

// Render the dashboard
app.get('/', async (req, res) => {
  try {
    const latestReading = await getLatestReadingByUserID(2); // Use any sample user_id for testing
    res.render('index', { reading: latestReading });
  } catch (error) {
    res.status(500).send('Error loading dashboard');
  }
});

// API endpoint to get the latest reading
app.get('/api/latest-reading/:user_id', async (req, res) => {
  const { user_id } = req.params;
  try {
    const latestReading = await getLatestReadingByUserID(user_id);
    if (latestReading) {
      res.json(latestReading);
    } else {
      res.status(404).json({ message: 'Reading not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

app.post('/api/log-time', (req, res) => {
  const { timeSpent } = req.body;

  if (typeof timeSpent === 'undefined') {
    console.error('Invalid request: Missing timeSpent');
    return res.status(400).json({ error: 'timeSpent is required' });
  }

  const sessionId = req.sessionID || 'anonymous';

  const query = `
    WITH latest_usage AS (
      SELECT id
      FROM app_usage
      WHERE session_id = $2
      ORDER BY access_time DESC
      LIMIT 1
    )
    UPDATE app_usage
    SET time_spent = $1
    WHERE id IN (SELECT id FROM latest_usage);
  `;

  pool.query(query, [timeSpent, sessionId])
    .then(() => {
      console.log(`Time spent (${timeSpent} seconds) logged for session ${sessionId}`);
      res.sendStatus(200);
    })
    .catch((error) => {
      console.error('Error updating time spent:', error);
      res.sendStatus(500);
    });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});