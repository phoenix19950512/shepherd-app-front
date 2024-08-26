import OpenAI from 'openai';

export const fetchResponseFromOpenAI = async (
  prompt: string,
  history: object[],
  signal: any,
  setAIResult
) => {
  try {
    const openai = new OpenAI({
      dangerouslyAllowBrowser: true
    });
    const newMessages = [...history, { role: 'user', content: prompt }];
    const response = await openai.chat.completions.create(
      {
        messages: newMessages.map((msg) => ({
          role: msg['role'] === 'user' ? 'user' : 'assistant',
          content: msg['content']
        })),
        model: process.env.OPENAI_MODEL,
        stream: true
      },
      { signal }
    );
    let fullResponnse = '';
    for await (const chunk of response) {
      if (chunk.choices[0].delta.content) {
        fullResponnse += chunk.choices[0].delta.content;
        setAIResult(fullResponnse);
        document.body.scrollTop = document.body.scrollHeight;
      }
    }
  } catch (error) {
    console.error('Error fetching data from OpenAI:', error);
    throw error;
  }
};
