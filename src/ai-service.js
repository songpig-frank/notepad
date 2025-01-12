
import { config } from './config';

async function getOpenAITitle(text) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.openai.apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [{
        role: 'system',
        content: 'Generate a concise title and brief summary for the following text.'
      }, {
        role: 'user',
        content: text
      }]
    })
  });

  if (!response.ok) {
    throw new Error('OpenAI API request failed');
  }

  const data = await response.json();
  const result = data.choices[0]?.message?.content;
  
  // Split into title and summary
  const parts = result.split('\n').filter(p => p.trim());
  return {
    title: parts[0]?.replace('Title:', '').trim() || 'Untitled',
    summary: parts[1]?.replace('Summary:', '').trim() || text.substring(0, 100),
    model: 'GPT-3.5',
    success: true
  };
}

export async function generateTitleAndSummary(text) {
  if (!config.openai.apiKey) {
    throw new Error('OpenAI API key not configured');
  }
  return await getOpenAITitle(text);
}
