import React, { useEffect, useRef } from 'react';

const agentConfig = {
  ORACLE: { name: 'ORACLE · Quant', icon: '🔵', color: 'quant', bg: 'bg-quant/10', border: 'border-quant/30' },
  APOLLO: { name: 'APOLLO · Bull', icon: '🟢', color: 'bull', bg: 'bg-bull/10', border: 'border-bull/30' },
  CASSANDRA: { name: 'CASSANDRA · Bear', icon: '🔴', color: 'bear', bg: 'bg-bear/10', border: 'border-bear/30' },
  SENTINEL: { name: 'SENTINEL · Risk', icon: '🟡', color: 'risk', bg: 'bg-risk/10', border: 'border-risk/30' },
};

function DebateTranscript({ steps, isActive }) {
  const transcriptRef = useRef(null);

  useEffect(() => {
    if (transcriptRef.current) {
      transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
    }
  }, [steps]);

  const formatContent = (content) => {
    return content.split('\n').map((line, i) => (
      <React.Fragment key={i}>
        {line}
        {i < content.split('\n').length - 1 && <br />}
      </React.Fragment>
    ));
  };

  return (
    <div className="bg-dark-300 rounded-xl glow-border overflow-hidden">
      <div className="bg-dark-200 px-4 py-2 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-gray-500"># DEBATE_HALL</span>
          {isActive && (
            <div className="flex items-center gap-1 ml-auto">
              <span className="w-2 h-2 bg-bull rounded-full animate-pulse"></span>
              <span className="text-xs text-bull">debating...</span>
            </div>
          )}
        </div>
      </div>
      
      <div
        ref={transcriptRef}
        className="h-[500px] lg:h-[550px] overflow-y-auto p-4 space-y-4 font-mono text-sm"
      >
        {steps.length === 0 && !isActive && (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
            <div className="text-6xl mb-4">⚖️</div>
            <p className="text-sm">No active debate</p>
            <p className="text-xs mt-2">Click "Start Debate" to begin</p>
          </div>
        )}
        
        {steps.map((step, idx) => {
          const config = agentConfig[step.agent];
          return (
            <div
              key={idx}
              className={`flex gap-3 p-3 rounded-lg ${config.bg} border-l-4 ${config.border} animate-slide-in`}
            >
              <div className={`w-10 h-10 rounded-full ${config.bg} flex items-center justify-center text-xl flex-shrink-0 shadow-[0_0_10px_rgba(var(--${config.color}-rgb),0.3)]`}>
                {config.icon}
              </div>
              <div className="flex-1">
                <div className={`text-xs font-bold tracking-wider text-${config.color} mb-1`}>
                  {config.name}
                </div>
                <div className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {formatContent(step.content)}
                </div>
                <div className="text-xs text-gray-600 mt-2 font-mono">
                  {new Date().toLocaleTimeString()}
                </div>
              </div>
            </div>
          );
        })}
        
        {isActive && steps.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-12 h-12 border-3 border-bull/30 border-t-bull rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-500">Initializing debate...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DebateTranscript;