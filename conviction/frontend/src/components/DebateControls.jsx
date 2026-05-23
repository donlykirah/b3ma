import React, { useState } from 'react';

function DebateControls({ onStartDebate, onSubmitQuestion, isDebating }) {
  const [customQuestion, setCustomQuestion] = useState('');
  const [selectedAsset, setSelectedAsset] = useState('BTC');

  const quickAssets = ['BTC', 'ETH', 'SOL'];

  const handleStartDebate = () => {
    onStartDebate(selectedAsset, 2000);
  };

  const handleSubmitQuestion = () => {
    if (customQuestion.trim()) {
      onSubmitQuestion(customQuestion);
      setCustomQuestion('');
    }
  };

  return (
    <div className="mt-5 space-y-4">
      {/* Quick Asset Selection */}
      <div className="flex gap-2 flex-wrap">
        {quickAssets.map(asset => (
          <button
            key={asset}
            onClick={() => setSelectedAsset(asset)}
            className={`px-4 py-2 rounded-full text-sm font-mono transition-all ${
              selectedAsset === asset
                ? 'bg-bull text-black font-bold shadow-[0_0_10px_rgba(0,255,136,0.5)]'
                : 'bg-dark-200 text-gray-400 border border-gray-700 hover:border-bull/50'
            }`}
          >
            {asset}
          </button>
        ))}
      </div>

      {/* Start Debate Button */}
      <button
        onClick={handleStartDebate}
        disabled={isDebating}
        className={`w-full py-4 rounded-xl font-bold font-mono text-lg transition-all ${
          isDebating
            ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
            : 'bg-gradient-to-r from-bull to-green-600 text-black hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(0,255,136,0.4)] active:scale-[0.98]'
        }`}
      >
        {isDebating ? '⚡ DEBATING...' : '🎭 START DEBATE'}
      </button>

      {/* Custom Question Input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={customQuestion}
          onChange={(e) => setCustomQuestion(e.target.value)}
          placeholder="Custom question (0.50 USDC)..."
          className="flex-1 bg-dark-200 border border-gray-700 rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:border-bull/50 transition-all"
          disabled={isDebating}
        />
        <button
          onClick={handleSubmitQuestion}
          disabled={isDebating || !customQuestion.trim()}
          className="px-5 py-3 bg-dark-200 border border-gray-700 rounded-xl text-sm font-mono hover:border-bull/50 transition-all disabled:opacity-50"
        >
          💰 SUBMIT
        </button>
      </div>
    </div>
  );
}

export default DebateControls;