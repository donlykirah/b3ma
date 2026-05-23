// COMPLETE MOCK VERSION - With custom question support

export async function runDebate(asset = 'BTC', amount = 2000, treasuryBalance = 10, customQuestion = null) {
  const debateId = Date.now().toString();
  
  console.log(`🎭 [DEBATE] Starting for ${asset}`);
  if (customQuestion) {
    console.log(`📝 Custom question: "${customQuestion}"`);
  }
  
  // Generate market data
  const marketData = {
    BTC: { price: 72450, change: 2.4, volume: 28.5, rsi: 67, fear: 'Neutral', support: 68000, resistance: 73800 },
    ETH: { price: 3820, change: 1.8, volume: 12.3, rsi: 52, fear: 'Neutral', support: 3500, resistance: 4000 },
    SOL: { price: 95, change: 5.2, volume: 1.2, rsi: 71, fear: 'Greed', support: 85, resistance: 105 }
  };
  
  const data = marketData[asset];
  
  // Oracle report
  const oracleContent = `📊 MARKET DATA REPORT (${new Date().toLocaleTimeString()}):

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💰 ${asset} PRICE: $${data.price.toLocaleString()} USD
📈 24h CHANGE: ${data.change > 0 ? '+' : ''}${data.change}% ${data.change > 0 ? '🟢' : '🔴'}
📊 24h VOLUME: $${data.volume}B

📉 TECHNICAL:
• RSI: ${data.rsi} (${data.rsi > 70 ? 'overbought' : data.rsi < 30 ? 'oversold' : 'neutral'})
• Support: $${data.support.toLocaleString()}
• Resistance: $${data.resistance.toLocaleString()}

🧠 SENTIMENT:
• Fear & Greed: ${data.fear}
• Funding Rate: 0.01%

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Ready for debate.`;

  // Customize responses based on question
  let apolloContent, cassandraContent, sentinelContent;
  
  if (customQuestion) {
    const q = customQuestion.toLowerCase();
    
    if (q.includes('buy') || q.includes('invest') || q.includes('allocate')) {
      apolloContent = `🟢 APOLLO (BULL) - YES, we should buy!

Regarding your question: "${customQuestion.substring(0, 100)}..."

Based on the data, ${asset} is showing strong momentum. ${data.change > 0 ? `The +${data.change}% gain confirms buying pressure.` : `The dip is a buying opportunity.`}

RSI at ${data.rsi} shows room to run. Market sentiment is ${data.fear.toLowerCase()} - perfect for entry.

VOTE: BUY - Deploy ${asset === 'SOL' ? '10%' : '15%'} of treasury. 🚀`;
      
      cassandraContent = `🔴 CASSANDRA (BEAR) - NO, too risky!

Your question asks about buying. I strongly disagree.

${asset === 'BTC' ? `We're at RESISTANCE - $${data.resistance.toLocaleString()} has rejected us 3 times.` : asset === 'ETH' ? `ETH is LAGGING. Smart money is rotating out.` : `SOL is OVERBOUGHT with RSI at ${data.rsi}.`}

Buying now is chasing. Wait for a better entry.

VOTE: HOLD - Be patient. 🛡️`;
      
      sentinelContent = `🟡 SENTINEL (RISK) - APPROVED with limits

Risk assessment for your question:

• Max Position: 8% of treasury ($${(treasuryBalance * 0.08).toFixed(2)})
• Max Drawdown: 12%
• Stop Loss: -7%

VOTE: BUY with strict position sizing. ✅`;
    } 
    else if (q.includes('sell') || q.includes('exit')) {
      apolloContent = `🟢 APOLLO (BULL) - HOLD, not sell!

Your question: "${customQuestion.substring(0, 100)}..."

Selling ${asset} now is premature. The technicals show strength.

VOTE: HOLD - Wait for better levels. 💎`;
      
      cassandraContent = `🔴 CASSANDRA (BEAR) - AGREE, take profits!

Selling is wise. ${asset} has had a strong run. Take profits.

VOTE: REDUCE - Take 30-50% profits. 💰`;
      
      sentinelContent = `🟡 SENTINEL (RISK) - REDUCE recommended

Take profit at current levels. Reduce exposure to 40%.

VOTE: REDUCE - Lock in gains. ⚠️`;
    }
    else {
      apolloContent = `🟢 APOLLO (BULL) - BUY ${asset}

Your question: "${customQuestion.substring(0, 100)}..."

Analysis shows bullish momentum. RSI at ${data.rsi} indicates room to run.

VOTE: BUY - This is a prime opportunity. 🎯`;
      
      cassandraContent = `🔴 CASSANDRA (BEAR) - HOLD

The market is uncertain. No need to rush.

VOTE: HOLD - Preserve capital. ⏸️`;
      
      sentinelContent = `🟡 SENTINEL (RISK) - HOLD for now

Risk is MODERATE. No urgent action needed.

VOTE: HOLD - Stay patient. 📊`;
    }
  } else {
    // Default responses
    apolloContent = `🟢 APOLLO (BULL) - BUY ${asset} now! ${data.change > 0 ? `${data.change}% gain confirms buying pressure.` : `The dip is our opportunity.`} RSI at ${data.rsi} shows room to run. VOTE: BUY. 🚀`;
    
    cassandraContent = `🔴 CASSANDRA (BEAR) - HOLD ${asset}. ${asset === 'BTC' ? `Resistance at $${data.resistance.toLocaleString()} is strong.` : asset === 'ETH' ? `ETH is lagging BTC.` : `SOL RSI at ${data.rsi} is overbought.`} VOTE: HOLD. 🛡️`;
    
    sentinelContent = `🟡 SENTINEL (RISK) - ${asset === 'SOL' ? 'HOLD' : 'BUY'}. Risk: ${asset === 'SOL' ? 'HIGH' : 'MODERATE'}. Max position: ${asset === 'SOL' ? '5%' : '8%'}. VOTE: ${asset === 'SOL' ? 'HOLD' : 'BUY'}.`;
  }
  
  const steps = [
    { agent: 'ORACLE', content: oracleContent, vote: null },
    { agent: 'APOLLO', content: apolloContent, vote: apolloContent.includes('BUY') ? 'BUY' : (apolloContent.includes('HOLD') ? 'HOLD' : 'REDUCE') },
    { agent: 'CASSANDRA', content: cassandraContent, vote: cassandraContent.includes('BUY') ? 'BUY' : (cassandraContent.includes('HOLD') ? 'HOLD' : 'REDUCE') },
    { agent: 'SENTINEL', content: sentinelContent, vote: sentinelContent.includes('BUY') ? 'BUY' : (sentinelContent.includes('HOLD') ? 'HOLD' : 'REDUCE') }
  ];
  
  const votes = { BUY: 0, HOLD: 0, REDUCE: 0 };
  steps.forEach(step => {
    if (step.vote === 'BUY') votes.BUY++;
    if (step.vote === 'HOLD') votes.HOLD++;
    if (step.vote === 'REDUCE') votes.REDUCE++;
  });
  
  let decision = 'HOLD';
  if (votes.BUY >= 2) decision = 'BUY';
  if (votes.REDUCE >= 2) decision = 'REDUCE';
  
  const allocationPercent = decision === 'BUY' ? 8 : 0;
  const txHash = decision === 'BUY' ? `0x${Math.random().toString(36).substring(2, 15)}${Date.now().toString(16)}` : null;
  
  console.log(`🎭 [DEBATE] Complete! Decision: ${decision} | Votes: BUY:${votes.BUY} HOLD:${votes.HOLD}`);
  
  return {
    debateId,
    asset,
    amount,
    decision,
    allocationPercent,
    votes,
    steps,
    txHash,
    timestamp: new Date().toISOString()
  };
}