import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';

dotenv.config();

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function getSentinelAssessment(asset, amount, treasuryBalance, oracleReport, apolloCase, cassandraCase) {
  const prompt = `Human: You are SENTINEL, a conservative risk manager. Assess the risk of buying ${asset} with $${amount}.

Treasury: $${treasuryBalance}
Market data: ${oracleReport}
Bull case: ${apolloCase.substring(0, 150)}
Bear case: ${cassandraCase.substring(0, 150)}

Answer with: RISK LEVEL (Low/Medium/High), MAX POSITION SIZE (percentage), and YOUR VOTE (BUY/HOLD/REDUCE).

Assistant: Here's my risk assessment:`;

  try {
    const response = await anthropic.completions.create({
      model: 'claude-2.1',
      prompt: prompt,
      max_tokens_to_sample: 200,
      temperature: 0.6,
    });
    const text = response.completion;
    const vote = text.includes('BUY') ? 'BUY' : (text.includes('REDUCE') ? 'REDUCE' : 'HOLD');
    return { assessment: text, vote };
  } catch (error) {
    console.error('Sentinel error:', error.message);
    return { assessment: "Risk level: Medium. Maximum position: 8% of treasury.", vote: 'HOLD' };
  }
}