import { Worker, QueueEvents } from 'bullmq';
import { analyzeEmailContent, generateResponse } from './openai';
import { sendGmailResponse } from './gmail';

const connection = {
  host: '172.17.0.3',
  port: 6379,
};

const emailQueueEvents = new QueueEvents('emails', { connection });

new Worker('emails', async job => {
  const { emailContent, emailService, recipient } = job.data;

  const category = await analyzeEmailContent(emailContent);

  const response = await generateResponse(category, emailContent);

  await sendGmailResponse(recipient, 'Automated Response', response);
}, { connection });

emailQueueEvents.on('completed', (jobId) => {
  console.log(`Job ${jobId} has been completed`);
});

emailQueueEvents.on('failed', (jobId, err) => {
  console.error(`Job ${jobId} has failed with error ${err}`);
});
