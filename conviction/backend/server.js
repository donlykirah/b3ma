import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { runDebate } from './debate-orchestrator.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Store active debates
const activeDebates = new Map();
let debateHistory = [];
let treasuryBalance = 10.00;

// ============================================
// HEALTH CHECK
// ============================================
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ============================================
// TREASURY BALANCE
// ============================================
app.get('/api/treasury/balance', (req, res) => {
  res.json({ balance: treasuryBalance, currency: 'USDC' });
});

// ============================================
// DEBATE HISTORY
// ============================================
app.get('/api/debate/history', (req, res) => {
  res.json(debateHistory);
});

// ============================================
// START FREE DEBATE (BTC/ETH/SOL buttons)
// ============================================
app.post('/api/debate/start', async (req, res) => {
  const { asset = 'BTC', amount = 2000, customQuestion = null } = req.body;
  
  console.log(`🎭 [FREE DEBATE] Starting for ${asset}`);
  if (customQuestion) console.log(`   Question: ${customQuestion}`);
  
  try {
    const debate = await runDebate(asset, amount, treasuryBalance, customQuestion);
    activeDebates.set(debate.debateId, debate);
    debateHistory.unshift(debate);
    if (debateHistory.length > 5) debateHistory.pop();
    
    if (debate.decision === 'BUY' && debate.allocationPercent > 0) {
      const allocation = (treasuryBalance * debate.allocationPercent) / 100;
      treasuryBalance -= allocation;
      console.log(`✅ EXECUTED: BUY $${allocation.toFixed(2)} of ${debate.asset}`);
    }
    
    res.json({ debateId: debate.debateId, debate });
  } catch (error) {
    console.error('Debate error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// CREATE PAYMENT INTENT (for custom motions)
// ============================================
app.post('/api/payment/create', async (req, res) => {
  const { question } = req.body;
  
  console.log(`💰 [PAYMENT] Creating payment intent for: "${question?.substring(0, 50)}..."`);
  
  try {
    // For demo: mock payment intent
    // In production with Circle: await circle.paymentIntents.create({...})
    
    const mockPaymentIntentId = `pi_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
    
    res.json({
      success: true,
      paymentIntentId: mockPaymentIntentId,
      clientSecret: `secret_${mockPaymentIntentId}`
    });
    
  } catch (error) {
    console.error('Payment creation failed:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ============================================
// START PAID CUSTOM DEBATE
// ============================================
app.post('/api/debate/custom', async (req, res) => {
  const { question, paymentIntentId, amount = 2000 } = req.body;
  
  console.log(`🎭 [PAID DEBATE] Custom question: "${question}"`);
  console.log(`   Payment ID: ${paymentIntentId}`);
  
  // Extract asset from question
  const assetMatch = question.match(/BTC|ETH|SOL/i);
  const asset = assetMatch ? assetMatch[0] : 'BTC';
  
  try {
    const debate = await runDebate(asset, amount, treasuryBalance, question);
    activeDebates.set(debate.debateId, debate);
    debateHistory.unshift(debate);
    if (debateHistory.length > 5) debateHistory.pop();
    
    if (debate.decision === 'BUY' && debate.allocationPercent > 0) {
      const allocation = (treasuryBalance * debate.allocationPercent) / 100;
      treasuryBalance -= allocation;
      console.log(`✅ PAID DEBATE EXECUTED: BUY $${allocation.toFixed(2)} of ${debate.asset}`);
    }
    
    console.log(`✅ [PAID DEBATE] Complete! Decision: ${debate.decision}`);
    
    res.json({ debateId: debate.debateId, debate, paid: true });
  } catch (error) {
    console.error('Custom debate error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// SSE STREAM ENDPOINT
// ============================================
app.get('/api/debate/stream/:id', (req, res) => {
  const debateId = req.params.id;
  const debate = activeDebates.get(debateId);
  
  if (!debate) {
    res.status(404).json({ error: 'Debate not found' });
    return;
  }
  
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  
  let stepIndex = 0;
  
  const sendNextStep = () => {
    if (stepIndex >= debate.steps.length) {
      res.write(`data: ${JSON.stringify({ type: 'complete', debate })}\n\n`);
      res.end();
      activeDebates.delete(debateId);
      return;
    }
    
    const step = debate.steps[stepIndex];
    res.write(`data: ${JSON.stringify({ type: 'step', step, stepIndex, total: debate.steps.length })}\n\n`);
    stepIndex++;
    
    setTimeout(sendNextStep, 2000);
  };
  
  sendNextStep();
  
  req.on('close', () => {
    console.log(`Stream ${debateId} closed`);
  });
});

app.listen(port, () => {
  console.log(`🚀 Conviction backend running on port ${port}`);
  console.log(`   Health: http://localhost:${port}/api/health`);
  console.log(`   Treasury: http://localhost:${port}/api/treasury/balance`);
  console.log(`   Payment endpoint: POST /api/payment/create`);
  console.log(`   Custom debate: POST /api/debate/custom`);
});