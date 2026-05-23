import React from 'react';

function MobileMenu({ isOpen, onClose, balance, currentDebate, history }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-80 bg-dark-200 shadow-xl animate-slide-in overflow-y-auto">
        <div className="sticky top-0 bg-dark-200 p-4 border-b border-gray-800 flex justify-between items-center">
          <h2 className="font-bold">Treasury</h2>
          <button onClick={onClose} className="text-2xl">✕</button>
        </div>
        
        {/* Simplified treasury panel for mobile */}
        <div className="p-4">
          <div className="bg-gradient-to-br from-bull/5 to-quant/5 rounded-xl p-4 text-center border border-bull/20 mb-4">
            <div className="text-3xl font-bold font-mono text-bull">
              ${balance.toFixed(2)}
            </div>
            <div className="text-xs text-gray-500 mt-1">USDC on Arc</div>
          </div>
          
          {/* Add more mobile-specific treasury info as needed */}
        </div>
      </div>
    </div>
  );
}

export default MobileMenu;