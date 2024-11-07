// server.js
import express from 'express';
import path from 'path';
import { getLatestReadingByUserID } from './db_controller.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Set EJS as the view engine and serve static files
app.set('view engine', 'ejs');
app.use(express.static(path.join(path.resolve(), 'public')));

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

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});