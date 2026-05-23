import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';

dotenv.config();

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function getCassandraCase(asset, amount, oracleReport, apolloCase) {
  const prompt = `Human: You are CASSANDRA, a skeptical bearish crypto analyst. Make the case to NOT buy ${asset} right now.

Market data:
${oracleReport}

Apollo said: "${apolloCase.substring(0, 300)}"

Keep it under 200 words. Be critical.

Assistant: Here's my bear case against buying ${asset}:`;

  try {
    const response = await anthropic.completions.create({
      model: 'claude-2.1',
      prompt: prompt,
      max_tokens_to_sample: 300,
      temperature: 0.85,
    });
    return response.completion;
  } catch (error) {
    console.error('Cassandra error:', error.message);
    return "I recommend HOLDING. The risks outweigh the potential rewards at current levels.";
  }
}