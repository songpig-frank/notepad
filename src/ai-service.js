
import { config } from './config';

const getOpenAITitle = async (text) => {
  if (!config.openai.apiKey) return null;
  
  try {
    const response = await fetch(config.openai.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.openai.apiKey}`
      },
      body: JSON.stringify({
        model: config.openai.model,
        messages: [{
          role: "system",
          content: "Create a concise title and brief summary for this text. Format as JSON with 'title' and 'summary' keys."
        }, {
          role: "user",
          content: text
        }],
        temperature: 0.7
      })
    });
    
    const data = await response.json();
    return JSON.parse(data.choices[0].message.content);
  } catch (error) {
    console.error('OpenAI API error:', error);
    return null;
  }
};

const getDeepSeekTitle = async (text) => {
  if (!config.deepseek.apiKey) return null;

  try {
    const response = await fetch(config.deepseek.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.deepseek.apiKey}`
      },
      body: JSON.stringify({
        model: config.deepseek.model,
        messages: [{
          role: "system",
          content: "Create a concise title and brief summary for this text. Format as JSON with 'title' and 'summary' keys."
        }, {
          role: "user",
          content: text
        }]
      })
    });
    
    const data = await response.json();
    return JSON.parse(data.choices[0].message.content);
  } catch (error) {
    console.error('DeepSeek API error:', error);
    return null;
  }
};

export const generateTitleAndSummary = async (text) => {
  const result = await getDeepSeekTitle(text);
  if (result) return result;
  return await getOpenAITitle(text);
};
