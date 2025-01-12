
const getOpenAITitle = async (text) => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;
  
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
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
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) return null;

  try {
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "deepseek-chat",
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
