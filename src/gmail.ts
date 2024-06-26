import { google } from 'googleapis';

const oAuth2Client = new google.auth.OAuth2(
    'client_key',
  'secret',
  'environment'
);

export function getGmailAuthUrl(): string {
  return oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/gmail.readonly', 'https://www.googleapis.com/auth/gmail.send'],
  });
}

export async function setGmailCredentials(code: string): Promise<void> {
  const { tokens } = await oAuth2Client.getToken(code);
  oAuth2Client.setCredentials(tokens);
}

export async function sendGmailResponse(to: string, subject: string, body: string): Promise<void> {
  const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });
  const message = [
    `To: ${to}`,
    'Subject: ' + subject,
    '',
    body,
  ].join('\n');

  await gmail.users.messages.send({
    userId: 'me',
    requestBody: {
      raw: Buffer.from(message).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''),
    },
  });
}
