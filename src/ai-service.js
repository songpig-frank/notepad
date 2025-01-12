import { config } from './config';

export const generateTitleAndSummary = async (text) => {
  if (!text?.trim()) {
    throw new Error('No text provided');
  }

  if (!config.openai.apiKey) {
    throw new Error('Please configure OpenAI API key in Replit Secrets (REACT_APP_OPENAI_API_KEY)');
  }

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
          content: "Analyze the text and create a title and summary with appropriate detail level based on task complexity. For simple tasks, provide a brief title and 1-2 sentence summary. For complex projects, create a detailed title and comprehensive summary including key points and objectives. Format response as JSON with 'title' and 'summary' keys. The title should be 2-6 words, and the summary should be appropriately scaled to the task's complexity."
        }, {
          role: "user",
          content: text
        }],
        temperature: 0.7
      })
    });

    const data = await response.json();
    const result = JSON.parse(data.choices[0].message.content);
    return {
      ...result,
      model: config.openai.model,
      success: true
    };
  } catch (error) {
    console.error('OpenAI API error:', error);
    return {
      title: text.split('.')[0].substring(0, 50),
      summary: text.substring(0, 200),
      model: config.openai.model,
      success: false,
      error: error.message
    };
  }
};