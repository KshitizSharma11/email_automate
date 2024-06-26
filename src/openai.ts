import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: 'your_key',
});

export async function analyzeEmailContent(content: string): Promise<string> {
  const response = await openai.completions.create({
    model: "text-davinci-003",
    prompt: `Categorize this email content into one of the following categories: Interested, Not Interested, More information.\n\nEmail content:\n${content}`,
    max_tokens: 50,
  });

  return response.choices[0].text.trim();
}

export async function generateResponse(category: string, content: string): Promise<string> {
  let prompt = "";

  switch (category) {
    case "Interested":
      prompt = `Generate a response suggesting a demo call for the following email content:\n\n${content}`;
      break;
    case "Not Interested":
      prompt = `Generate a polite response declining further contact for the following email content:\n\n${content}`;
      break;
    case "More information":
      prompt = `Generate a response asking for more information for the following email content:\n\n${content}`;
      break;
  }

  const response = await openai.completions.create({
    model: "text-davinci-003",
    prompt: prompt,
    max_tokens: 100,
  });

  return response.choices[0].text.trim();
}
