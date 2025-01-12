
export const config = {
  openai: {
    apiKey: process.env.REACT_APP_OPENAI_API_KEY || '',
    endpoint: 'https://api.openai.com/v1/chat/completions',
    model: 'gpt-3.5-turbo'
  }
};
