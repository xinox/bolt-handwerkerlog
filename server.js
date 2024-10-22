require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const port = process.env.PORT || 3000;

// Supabase client
let supabase;
try {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
    throw new Error('Supabase URL or Key is missing in .env file');
  }
  supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
} catch (error) {
  console.error('Error initializing Supabase client:', error.message);
  process.exit(1);
}

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

// Route to get all entries
app.get('/api/entries', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('worker_times')
      .select('*')
      .order('start_time', { ascending: false });

    if (error) {
      throw error;
    }
    res.json(data || []); // Ensure we always return an array
  } catch (error) {
    console.error('Error fetching entries:', error.message);
    res.status(500).json({ error: 'An error occurred while fetching entries' });
  }
});

// Route to add a new entry
app.post('/api/entries', async (req, res) => {
  try {
    const { description, start_time, end_time } = req.body;
    const { data, error } = await supabase
      .from('worker_times')
      .insert([{ description, start_time, end_time }]);

    if (error) {
      throw error;
    }
    res.json(data || []); // Ensure we always return an array
  } catch (error) {
    console.error('Error adding entry:', error.message);
    res.status(500).json({ error: 'An error occurred while adding the entry' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});