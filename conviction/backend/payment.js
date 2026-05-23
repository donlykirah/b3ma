import { Circle } from '@circle-fin/circle-sdk';
import dotenv from 'dotenv';

dotenv.config();

const circle = new Circle({
  apiKey: process.env.CIRCLE_API_KEY,
  baseUrl: process.env.CIRCLE_API_BASE || 'https://api.circle.com/v1'
});

// Create payment intent for custom motion (0.50 USDC)
export async function createCustomMotionPayment(question, userId) {
  try {
    const response = await circle.paymentIntents.create({
      amount: {
        amount: '0.50',
        currency: 'USD'
      },
      paymentMethods: ['card'],
      description: `CONVICTION Custom Motion: ${question.substring(0, 80)}`,
      metadata: {
        question: question,
        userId: userId,
        product: 'conviction_custom_motion'
      },
      settlementCurrency: 'USD'
    });
    
    return {
      success: true,
      paymentIntentId: response.data.id,
      clientSecret: response.data.clientSecret
    };
  } catch (error) {
    console.error('Payment creation failed:', error);
    return { success: false, error: error.message };
  }
}

// Verify payment
export async function verifyPayment(paymentIntentId) {
  try {
    const response = await circle.paymentIntents.get(paymentIntentId);
    return {
      success: response.data.status === 'succeeded',
      status: response.data.status,
      paymentIntent: response.data
    };
  } catch (error) {
    console.error('Payment verification failed:', error);
    return { success: false, error: error.message };
  }
}