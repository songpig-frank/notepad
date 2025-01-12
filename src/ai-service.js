
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
  const result = data.choices[0]?.message?.content || '';
  
  // Extract title and summary with fallbacks
  const lines = result.split('\n').filter(p => p.trim());
  const title = lines.find(l => l.toLowerCase().includes('title:'))?.replace('Title:', '').trim() 
    || text.split('.')[0].trim() 
    || 'Untitled';
  const summary = lines.find(l => l.toLowerCase().includes('summary:'))?.replace('Summary:', '').trim() 
    || text.substring(0, 100).trim() 
    || 'No summary available';

  return {
    title,
    summary,
    model: 'GPT-3.5-turbo',
    success: true
  };
}

export async function generateTitleAndSummary(text) {
  if (!config.openai.apiKey) {
    throw new Error('OpenAI API key not configured');
  }
  return await getOpenAITitle(text);
}
