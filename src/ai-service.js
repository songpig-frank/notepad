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
          content: "Analyze the text and create a title and summary with appropriate detail level based on task complexity. For simple tasks, provide a brief title and 1-2 sentence summary. For complex projects, create a detailed title and comprehensive summary including key points and objectives. Format response as JSON with 'title' and 'summary' keys. The title should be 2-6 words, and the summary should be appropriately scaled to the task's complexity."
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
          content: "Analyze the text and create a title and summary with appropriate detail level based on task complexity. For simple tasks, provide a brief title and 1-2 sentence summary. For complex projects, create a detailed title and comprehensive summary including key points and objectives. Format response as JSON with 'title' and 'summary' keys. The title should be 2-6 words, and the summary should be appropriately scaled to the task's complexity."
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
  if (!text?.trim()) {
    throw new Error('No text provided');
  }

  try {
    if (!config.deepseek.apiKey && !config.openai.apiKey) {
      throw new Error('Please configure API keys in Replit Secrets (REACT_APP_OPENAI_API_KEY or REACT_APP_DEEPSEEK_API_KEY)');
    }

    let error = null;
    
    if (config.deepseek.apiKey) {
      try {
        const result = await getDeepSeekTitle(text);
        if (result?.title) return result;
      } catch (e) {
        error = e;
      }
    }
    
    if (config.openai.apiKey) {
      try {
        const result = await getOpenAITitle(text);
        if (result?.title) return result;
      } catch (e) {
        error = e;
      }
    }

    // Create meaningful title and summary from the text
    const sentences = text.split(/[.!?]+/).filter(s => s.trim());
    const firstSentence = sentences[0]?.trim() || text.trim();
    const title = firstSentence.length > 50 ? 
      firstSentence.substring(0, 47) + '...' : 
      firstSentence;
    
    const remainingSentences = sentences.slice(1, 3).join('. ');
    const summary = remainingSentences || firstSentence;

    return { title, summary };
  } catch (error) {
    console.error('Error in AI service:', error);
    throw error;
  }
};