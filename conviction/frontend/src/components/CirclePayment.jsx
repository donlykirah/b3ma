import React, { useState } from 'react';
import { motion } from 'framer-motion';

// Load Circle SDK
const loadCircleSDK = () => {
  return new Promise((resolve) => {
    if (window.Circle) {
      resolve(window.Circle);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://js.circle.com/v1/payments.js';
    script.onload = () => resolve(window.Circle);
    document.head.appendChild(script);
  });
};

function CirclePayment({ amount = 0.50, question, onSuccess, onCancel }) {
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);

  const handlePayment = async () => {
    setProcessing(true);
    setError(null);
    
    try {
      // Get client secret from backend
      const response = await fetch('/api/payment/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question })
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error);
      }
      
      // Load Circle SDK and show payment modal
      const CircleSDK = await loadCircleSDK();
      
      CircleSDK.payments({
        clientKey: import.meta.env.VITE_CIRCLE_CLIENT_KEY,
        paymentIntentId: data.paymentIntentId,
        onSuccess: (result) => {
          console.log('Payment successful:', result);
          onSuccess(data.paymentIntentId);
        },
        onError: (err) => {
          console.error('Payment error:', err);
          setError('Payment failed. Please try again.');
          setProcessing(false);
        }
      });
      
    } catch (err) {
      console.error('Payment setup failed:', err);
      setError('Unable to process payment. Please try again.');
      setProcessing(false);
    }
  };

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 100,
        backgroundColor: 'rgba(0,0,0,0.95)',
        backdropFilter: 'blur(20px)',
        borderRadius: '24px',
        padding: '32px',
        border: '1px solid rgba(255,193,7,0.3)',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
        width: '400px',
        textAlign: 'center'
      }}
    >
      <div style={{ fontSize: '48px', marginBottom: '16px' }}>💰</div>
      <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>Custom Motion Fee</h3>
      <p style={{ fontSize: '36px', fontWeight: 'bold', color: '#fbbf24', marginBottom: '16px' }}>
        ${amount} USDC
      </p>
      <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '24px' }}>
        "{question.substring(0, 80)}"
      </p>
      
      {error && (
        <div style={{ color: '#ff3366', fontSize: '12px', marginBottom: '16px' }}>
          {error}
        </div>
      )}
      
      <div style={{ display: 'flex', gap: '12px' }}>
        <button
          onClick={onCancel}
          style={{
            flex: 1,
            padding: '12px',
            backgroundColor: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '12px',
            color: 'white',
            cursor: 'pointer'
          }}
        >
          Cancel
        </button>
        <button
          onClick={handlePayment}
          disabled={processing}
          style={{
            flex: 1,
            padding: '12px',
            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
            border: 'none',
            borderRadius: '12px',
            color: 'black',
            fontWeight: 'bold',
            cursor: processing ? 'not-allowed' : 'pointer',
            opacity: processing ? 0.7 : 1
          }}
        >
          {processing ? 'Processing...' : 'Pay with Card'}
        </button>
      </div>
      
      <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', marginTop: '16px' }}>
        Powered by Circle • Secure payment processing
      </p>
    </motion.div>
  );
}

export default CirclePayment;