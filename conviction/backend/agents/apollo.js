import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';

dotenv.config();

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function getApolloCase(asset, amount, oracleReport) {
  const prompt = `Human: You are APOLLO, a bullish crypto analyst. Make the case to BUY ${asset} with $${amount}.

Market data:
${oracleReport}

Keep it under 200 words. Be persuasive.

Assistant: Okay, here's my bull case for buying ${asset}:`;

  try {
    const response = await anthropic.completions.create({
      model: 'claude-2.1',
      prompt: prompt,
      max_tokens_to_sample: 300,
      temperature: 0.8,
    });
    return response.completion;
  } catch (error) {
    console.error('Apollo error:', error.message);
    return "Based on the data, I recommend BUYING. Momentum is strong and the risk/reward is favorable.";
  }
}