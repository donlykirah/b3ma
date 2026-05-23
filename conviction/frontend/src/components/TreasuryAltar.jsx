import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

function TreasuryAltar({ balance }) {
  const [displayBalance, setDisplayBalance] = useState(balance);
  const [flash, setFlash] = useState(false);
  
  useEffect(() => {
    if (balance !== displayBalance) {
      setFlash(true);
      const timer = setTimeout(() => setFlash(false), 300);
      
      // Rolling number animation
      let start = displayBalance;
      let end = balance;
      let duration = 500;
      let startTime = performance.now();
      
      const animate = (now) => {
        let elapsed = now - startTime;
        let progress = Math.min(1, elapsed / duration);
        let current = start + (end - start) * progress;
        setDisplayBalance(Math.floor(current));
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setDisplayBalance(end);
        }
      };
      
      requestAnimationFrame(animate);
    }
  }, [balance]);
  
  return (
    <motion.div
      animate={{ scale: flash ? [1, 1.1, 1] : 1 }}
      transition={{ duration: 0.2 }}
      className="relative"
    >
      <div className={`text-3xl font-mono font-bold ${flash ? 'text-bull' : 'text-amber-400'} transition-colors duration-200`}>
        ${displayBalance.toLocaleString()}
      </div>
      <div className="absolute -top-2 -right-2 w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
    </motion.div>
  );
}

export default TreasuryAltar;