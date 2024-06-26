import { Queue } from 'bullmq';

const connection = {
  host: '172.17.0.3',
  port: 6379,
};

const emailQueue = new Queue('emails', { connection });

export async function addEmailJob(emailContent: string, emailService: 'gmail', recipient: string) {
  await emailQueue.add('processEmail', {
    emailContent,
    emailService,
    recipient,
  });
}

// Example usage to test the producer
(async () => {
  await addEmailJob('This is a test email content', 'gmail', 'recipient@example.com');
})();
