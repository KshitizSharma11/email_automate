import express from 'express';
import dotenv from 'dotenv';
import { getGmailAuthUrl, setGmailCredentials } from './gmail';
import './worker';  // Import the worker to start processing jobs

dotenv.config();

const app = express();
const port = 3000;

app.get('/auth/gmail', (req, res) => {
  const url = getGmailAuthUrl();
  res.redirect(url);
});

app.get('/auth/callback', async (req, res) => {
  const code = req.query.code as string;
  await setGmailCredentials(code);
  res.send('Gmail authentication successful!');
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
