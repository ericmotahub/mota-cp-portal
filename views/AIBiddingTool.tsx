
import React from 'react';

export const AIBiddingTool: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-20 text-center space-y-6">
      <div className="w-20 h-20 bg-mota-pink/10 rounded-full flex items-center justify-center border border-mota-pink/20">
        <svg className="w-10 h-10 text-mota-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
      </div>
      <h1 className="text-4xl font-oswald font-bold uppercase tracking-tight">System Migration</h1>
      <p className="max-w-md text-gray-400 leading-relaxed">
        The standalone AI Bidding Tool has been deprecated. Bidding intelligence is now integrated directly into each project's <strong>Bid Manager</strong> within the Workroom.
      </p>
      <button className="px-8 py-3 bg-mota-pink text-dark-base font-bold uppercase text-xs tracking-widest rounded shadow-xl shadow-mota-pink/20">
        Return to Dashboard
      </button>
    </div>
  );
};
