
import React, { useState, useMemo } from 'react';
import { ProjectBid, BidStatus, ShotType, ApprovalStep, ShotBidLineItem, AssetBidLineItem } from '../types';
import { TrackedOpportunity } from './PipelineManager';
import { BidDetailView } from './BidDetailView';

interface BidManagerProps {
  opportunity: TrackedOpportunity;
}

export const BID_STATUS_CONFIG: Record<BidStatus, { label: string; color: string; bg: string; border: string }> = {
  AWARDED: { label: 'Approved', color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-500/30' },
  CONTRACT_BID: { label: 'Bid Sent', color: 'text-purple-400', bg: 'bg-purple-400/10', border: 'border-purple-500/30' },
  BIDDING: { label: 'In Progress', color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-500/30' },
  DRAFT: { label: 'Draft', color: 'text-gray-400', bg: 'bg-gray-400/10', border: 'border-gray-500/30' },
  ON_HOLD: { label: 'On Hold', color: 'text-yellow-500', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30' },
};

const DEFAULT_RATES = [
  { dept: 'Layout', rate: 450, headcountAvailable: 12, departmentHead: 'Dave Chen' },
  { dept: 'Matchmove', rate: 400, headcountAvailable: 8, departmentHead: 'Sarah J.' },
  { dept: 'FX', rate: 750, headcountAvailable: 4, departmentHead: 'Marcus Knight' },
  { dept: 'Animation', rate: 600, headcountAvailable: 15, departmentHead: 'Rick Park' },
  { dept: 'Lighting', rate: 650, headcountAvailable: 6, departmentHead: 'Anna Lee' },
  { dept: 'Comp', rate: 700, headcountAvailable: 20, departmentHead: 'Sarah Connor' },
  { dept: 'Paint/Roto', rate: 350, headcountAvailable: 10, departmentHead: 'Emily Zhang' },
];

const MOCK_APPROVALS: ApprovalStep[] = [
  { 
    role: 'VFX PRODUCER', 
    user: 'Sarah Connor', 
    status: 'APPROVED', 
    date: 'OCT 12', 
    comment: 'Vertex internal daycounts verified for UK/Ireland split. Labor qualifying spend meets 80% threshold for AVEC uplift.' 
  },
  { 
    role: 'HEAD OF STUDIO', 
    user: 'Eric Kohler', 
    status: 'APPROVED', 
    date: 'OCT 14', 
    comment: 'Capacity confirmed in Soho for Q4. Approved for bid submission to Sony based on 32.4% projected margin.'
  },
  { 
    role: 'CFO', 
    user: 'Mark Finance', 
    status: 'PENDING',
    comment: 'Awaiting final FX simulation cloud rendering quote from AWS before final sign-off.'
  },
];

const generateShots = (prefix: string, count: number, location: string, unitCost: number): ShotBidLineItem[] => {
  return Array.from({ length: count }).map((_, i) => {
    const pad = ((i + 1) * 10).toString().padStart(3, '0');
    return {
      id: `${prefix}_${pad}`,
      shotName: `${prefix}_${pad}`,
      shotType: i % 5 === 0 ? 'AA' : (i % 2 === 0 ? 'A' : 'B'),
      location,
      description: `Vertex VFX high-end shot ${pad} - Complex integration.`,
      scope: 'Full CGI & Plate',
      status: 'Active',
      departments: { layout: 1, matchmove: 1, fx: 5, anim: 5, lighting: 2, comp: 5, paintPrep: 1, roto: 1, other: 0 },
      complexityMultiplier: 1.0,
      totalDays: 21,
      cost: unitCost,
      aiConfidence: 94
    };
  });
};

const generateAssets = (prefix: string, count: number, location: string, unitCost: number): AssetBidLineItem[] => {
  return Array.from({ length: count }).map((_, i) => ({
    id: `${prefix}_asset_${i}`,
    assetName: `HeroAsset_${prefix}_${i}`,
    type: 'Creature / Vehicle',
    location,
    status: 'Active',
    tasks: { model: 12, groom: 8, texture: 10, rig: 15, lookdev: 10, fx: 5 },
    totalDays: 60,
    cost: unitCost
  }));
};

const INITIAL_BIDS_BY_OPP: Record<string, ProjectBid[]> = {
  'op1': [
    { 
      id: 'vertex-alpha-awarded', 
      title: 'Primary Awarded Package', 
      scope: 'Main Sequence 010-020 (Hero Creatures)', 
      status: 'AWARDED', 
      amount: 4200000, // GROSS
      rebate: 1120000, 
      territory: 'United Kingdom (Soho)', 
      shots: 400, 
      assets: 10, 
      margin: 32.4, 
      lastUpdated: '2024-10-12', 
      // Math: (400 shots * $9,000) + (10 assets * $60,000) = $4,200,000
      shotItems: generateShots('SQ010', 400, 'UK', 9000), 
      assetItems: generateAssets('ALPHA', 10, 'UK', 60000), 
      deptRates: DEFAULT_RATES, 
      adjustments: { productionFee: 10, contingency: 5, insurance: 1.5 }, 
      approvals: MOCK_APPROVALS, 
      scheduleWeeks: 14, 
      productionStart: '2024-11-15', 
      deliveryDate: '2025-03-01',
      internalVFXProducer: 'Sarah Connor',
      internalVFXSupervisor: 'David Chen',
      carbonFootprintEst: 1840,
      aiBreakdownStatus: 'COMPLETED'
    },
    { 
      id: 'vertex-alpha-contract', 
      title: 'Contract Bid: Secondary Scope', 
      scope: 'Env Extension & Lighting Pass', 
      status: 'CONTRACT_BID', 
      amount: 1500000, 
      rebate: 382500, 
      territory: 'Ireland (Dublin)', 
      shots: 85, 
      assets: 5, 
      margin: 28, 
      lastUpdated: '2024-10-14', 
      shotItems: generateShots('SQ030', 85, 'IRE', 15000), 
      assetItems: generateAssets('ASSET_B', 5, 'IRE', 45000), 
      deptRates: DEFAULT_RATES, 
      adjustments: { productionFee: 10, contingency: 5, insurance: 1.5 }, 
      approvals: MOCK_APPROVALS, 
      scheduleWeeks: 12, 
      productionStart: '2024-11-15', 
      deliveryDate: '2025-03-01',
      internalVFXProducer: 'Emily Zhang',
      internalVFXSupervisor: 'Sarah Connor'
    }
  ],
  'op2': [
    { 
      id: 'titan-la-split', 
      title: 'Global Master: LA/London Hybrid', 
      scope: 'Hero Character Builds & Post-Vis', 
      status: 'CONTRACT_BID', 
      amount: 8500000, 
      rebate: 2125000, 
      territory: 'LA / London Split', 
      shots: 15, 
      assets: 25, 
      margin: 28, 
      lastUpdated: '2024-10-05', 
      shotItems: generateShots('T_SH', 15, 'LA', 200000), 
      assetItems: generateAssets('T_AS', 25, 'UK', 220000), 
      deptRates: DEFAULT_RATES, 
      adjustments: { productionFee: 10, contingency: 5, insurance: 1.5 }, 
      approvals: MOCK_APPROVALS, 
      scheduleWeeks: 38, 
      productionStart: '2025-01-10', 
      deliveryDate: '2025-10-30',
      internalVFXProducer: 'Sarah Connor',
      internalVFXSupervisor: 'James Miller'
    },
  ],
  'op3': [
    { 
      id: 'neon-in-prog', 
      title: 'Cyber City: Phase 1 Bidding', 
      scope: 'Initial Sequence Breakdown', 
      status: 'BIDDING', 
      amount: 2800000, 
      rebate: 714000, 
      territory: 'United Kingdom (London)', 
      shots: 110, 
      assets: 8, 
      margin: 26, 
      lastUpdated: '2024-10-15', 
      shotItems: generateShots('NEON', 110, 'UK', 20000), 
      assetItems: generateAssets('NEON_A', 8, 'UK', 75000), 
      deptRates: DEFAULT_RATES, 
      adjustments: { productionFee: 10, contingency: 5, insurance: 1.5 }, 
      approvals: [], 
      scheduleWeeks: 24, 
      productionStart: '2025-02-01', 
      deliveryDate: '2025-08-01',
      internalVFXProducer: 'Emily Zhang',
      internalVFXSupervisor: 'Mike Ross'
    }
  ]
};

export const BidManager: React.FC<BidManagerProps> = ({ opportunity }) => {
  const [bids, setBids] = useState<ProjectBid[]>(INITIAL_BIDS_BY_OPP[opportunity.id] || []);
  const [selectedBidId, setSelectedBidId] = useState<string | null>(null);
  const [isComparing, setIsComparing] = useState(false);
  const [isIngesting, setIsIngesting] = useState(false);
  const [isProcessingAI, setIsProcessingAI] = useState(false);

  const activeBid = useMemo(() => bids.find(b => b.id === selectedBidId), [selectedBidId, bids]);

  const runAIAnalysis = () => {
    setIsProcessingAI(true);
    setTimeout(() => {
      const newShots = generateShots('AI_SHOT', 20, 'UK', 15000);
      const newAssets = generateAssets('AI_ASSET', 5, 'UK', 50000);
      const cost = newShots.reduce((a, b) => a + b.cost, 0) + newAssets.reduce((a, b) => a + b.cost, 0);
      
      const aiBid: ProjectBid = {
        id: `ai-bid-${Math.random().toString(36).substr(2, 5)}`,
        title: 'AI Assisted: London Optimized',
        scope: 'Full Script Breakdown Result',
        status: 'DRAFT',
        amount: cost,
        rebate: cost * 0.25,
        territory: 'United Kingdom (London)',
        shots: newShots.length,
        assets: newAssets.length,
        margin: 30,
        lastUpdated: new Date().toLocaleDateString(),
        deptRates: DEFAULT_RATES,
        shotItems: newShots,
        assetItems: newAssets,
        adjustments: { productionFee: 10, contingency: 5, insurance: 1.5 },
        approvals: [],
        scheduleWeeks: 12,
        productionStart: '2025-01-01',
        deliveryDate: '2025-06-01',
        internalVFXProducer: 'Sarah Connor',
        internalVFXSupervisor: 'David Chen',
        aiBreakdownStatus: 'COMPLETED'
      };

      setBids([aiBid, ...bids]);
      setIsProcessingAI(false);
      setIsIngesting(false);
    }, 3000);
  };

  const handleCreateNew = () => {
    const newBid: ProjectBid = {
      id: `bid-${Math.random().toString(36).substr(2, 5)}`,
      title: 'New Bid Draft',
      scope: 'Pending Scope Definition',
      status: 'DRAFT',
      amount: 0,
      rebate: 0,
      territory: 'TBD (Vertex Hub)',
      shots: 0,
      assets: 0,
      margin: 25,
      lastUpdated: new Date().toLocaleDateString(),
      deptRates: DEFAULT_RATES,
      shotItems: [],
      assetItems: [],
      adjustments: { productionFee: 10, contingency: 5, insurance: 1.5 },
      approvals: [],
      scheduleWeeks: 8,
      productionStart: '',
      deliveryDate: '',
      internalVFXProducer: 'Sarah Connor',
      internalVFXSupervisor: 'David Chen'
    };
    setBids([newBid, ...bids]);
    setSelectedBidId(newBid.id);
  };

  if (activeBid) {
    return <BidDetailView bid={activeBid} onBack={() => setSelectedBidId(null)} />;
  }

  return (
    <div className="flex flex-col h-full bg-dark-base animate-in fade-in duration-500 overflow-hidden text-left">
      {/* TOOLBAR */}
      <header className="bg-dark-surface/30 p-8 border-b border-dark-border">
        <div className="flex justify-between items-center mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 bg-mota-pink rounded-full"></div>
              <h2 className="text-xl font-oswald font-bold uppercase tracking-tight">Vertex VFX: Bid Registry</h2>
            </div>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em]">
              {opportunity.entityName} • UK / Ireland / LA Hub Comparison
            </p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setIsIngesting(true)}
              className="bg-dark-base border border-dark-border px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center gap-3 hover:border-mota-pink transition-all shadow-lg"
            >
              <svg className="w-4 h-4 text-mota-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
              AI Script Ingest
            </button>
            <button 
              onClick={() => setIsComparing(!isComparing)}
              className={`px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest border transition-all shadow-lg ${isComparing ? 'bg-mota-pink text-dark-base border-mota-pink' : 'bg-dark-base border border-dark-border text-white hover:border-white'}`}
            >
              Compare Scenarios
            </button>
            <button 
              onClick={handleCreateNew}
              className="bg-mota-pink text-dark-base px-8 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-xl shadow-mota-pink/20 hover:scale-[1.02] active:scale-95 transition-all"
            >
              + Draft New Bid
            </button>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-8">
          <StatBox label="Weighted Gross" value={`$${(bids.reduce((a,b)=>a+b.amount,0)/1000000).toFixed(2)}M`} subValue="Pipeline Exposure" color="text-mota-pink" />
          <StatBox label="Optimal Vertex Hub" value="Ireland (S481)" subValue="Max Rebate Scenario" color="text-emerald-400" />
          <StatBox label="Blended Net Margin" value="32.4%" subValue="Target: 25.0%" color="text-blue-400" />
          <StatBox label="Total Shots Bidded" value={`${bids.reduce((a,b)=>a+b.shots,0)}`} subValue="Across Bids" />
          <StatBox label="AI Accuracy Rate" value="98.2%" subValue="Historical Data Match" />
        </div>
      </header>

      {/* BIDS LIST */}
      <div className={`flex-1 overflow-y-auto p-8 custom-scrollbar space-y-4 ${isComparing ? 'grid grid-cols-2 gap-8 items-start' : ''}`}>
        {bids.map(bid => (
          <div 
            key={bid.id} 
            onClick={() => setSelectedBidId(bid.id)} 
            className={`bg-dark-surface rounded-2xl border transition-all group cursor-pointer shadow-xl ${isComparing ? 'p-10 flex flex-col border-dark-border hover:border-mota-pink' : 'p-6 flex justify-between items-center border-dark-border hover:border-mota-pink'}`}
          >
            <div className="flex items-center gap-6">
              <div className="w-14 h-14 rounded-xl bg-dark-base border border-dark-border flex flex-col items-center justify-center font-oswald font-bold text-gray-400 group-hover:text-mota-pink transition-colors">
                <span className="text-[8px] opacity-40 uppercase font-sans tracking-widest mb-1">{bid.territory.split(' ')[0][0]}</span>
                {bid.territory.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h4 className="text-xl font-bold group-hover:text-white transition-colors">{bid.title}</h4>
                  <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase border ${BID_STATUS_CONFIG[bid.status].bg} ${BID_STATUS_CONFIG[bid.status].color} ${BID_STATUS_CONFIG[bid.status].border}`}>
                    {BID_STATUS_CONFIG[bid.status].label}
                  </span>
                </div>
                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-[0.2em]">
                   {bid.scope} • {bid.shots} SHOTS / {bid.assets} ASSETS
                </p>
              </div>
            </div>

            <div className={`flex gap-12 text-right ${isComparing ? 'mt-10 border-t border-dark-border pt-8 grid grid-cols-2 text-left gap-y-8' : ''}`}>
              <div>
                <div className="text-[9px] text-gray-500 uppercase font-bold mb-1 tracking-widest">Gross Bid</div>
                <div className="text-lg font-oswald font-bold text-white">${bid.amount.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-[9px] text-gray-500 uppercase font-bold mb-1 tracking-widest">Est. Rebate</div>
                <div className="text-lg font-oswald font-bold text-emerald-400">-${bid.rebate.toLocaleString()}</div>
              </div>
              {isComparing && (
                <>
                  <div>
                    <div className="text-[9px] text-gray-500 uppercase font-bold mb-1 tracking-widest">Projected Margin</div>
                    <div className="text-lg font-oswald font-bold text-mota-pink">{bid.margin}%</div>
                  </div>
                  <div>
                    <div className="text-[9px] text-gray-500 uppercase font-bold mb-1 tracking-widest">Producer Lead</div>
                    <div className="text-sm font-bold text-gray-400 uppercase tracking-tighter">{bid.internalVFXProducer}</div>
                  </div>
                </>
              )}
              {!isComparing && (
                <div className="flex items-center">
                  <button className="px-6 py-2.5 bg-dark-base border border-dark-border rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-mota-pink hover:text-dark-base transition-all">Review Deep Dive</button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* MODAL: AI INGEST */}
      {isIngesting && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-12">
          <div className="absolute inset-0 bg-dark-base/95 backdrop-blur-2xl" onClick={() => !isProcessingAI && setIsIngesting(false)}></div>
          <div className="relative w-full max-w-2xl bg-dark-surface border border-dark-border rounded-3xl overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)] animate-in zoom-in-95 duration-300">
             <div className="p-10 border-b border-dark-border bg-dark-base/50 text-center">
               <div className="w-16 h-16 bg-mota-pink/10 rounded-2xl border border-mota-pink/20 flex items-center justify-center mx-auto mb-6">
                 <svg className="w-8 h-8 text-mota-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
               </div>
               <h3 className="text-3xl font-oswald font-bold uppercase tracking-tighter text-white">AI Script Breakdown</h3>
               <p className="text-sm text-gray-500 font-medium mt-2">Upload script (.pdf, .fdx) to auto-populate shots, assets, and complexity for Vertex VFX hubs.</p>
             </div>
             
             <div className="p-12 flex flex-col items-center justify-center border-b border-dark-border space-y-8 min-h-[350px]">
                {isProcessingAI ? (
                  <div className="flex flex-col items-center text-center space-y-6">
                    <div className="w-24 h-24 relative">
                      <div className="absolute inset-0 border-4 border-dark-base rounded-full"></div>
                      <div className="absolute inset-0 border-4 border-mota-pink border-t-transparent rounded-full animate-spin"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <svg className="w-10 h-10 text-mota-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-lg font-bold uppercase tracking-tight text-white">Analyzing Narrative Nodes...</h4>
                      <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mt-1">Cross-referencing with Vertex Historical Data</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="w-24 h-24 bg-dark-base border-2 border-dashed border-dark-border rounded-3xl flex items-center justify-center group cursor-pointer hover:border-mota-pink transition-all">
                       <svg className="w-10 h-10 text-gray-600 group-hover:text-mota-pink transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                    </div>
                    <div className="text-center">
                      <p className="text-white font-bold uppercase text-sm tracking-[0.2em]">Drop Script for Extraction</p>
                      <p className="text-[10px] text-gray-500 mt-3 font-bold uppercase tracking-widest">PDF, FDX, DOCX ONLY (MAX 50MB)</p>
                    </div>
                  </>
                )}
             </div>

             {!isProcessingAI && (
               <div className="p-8 bg-dark-base/80 flex justify-end gap-6">
                  <button onClick={() => setIsIngesting(false)} className="text-[10px] font-bold uppercase text-gray-500 hover:text-white transition-colors">Abort</button>
                  <button 
                    onClick={runAIAnalysis}
                    className="bg-mota-pink text-dark-base px-10 py-3 rounded-xl font-bold uppercase text-xs tracking-widest shadow-xl shadow-mota-pink/20 hover:scale-105 transition-all"
                  >
                    Start AI Breakdown
                  </button>
               </div>
             )}
          </div>
        </div>
      )}
    </div>
  );
};

const StatBox: React.FC<{ label: string; value: string; subValue: string; color?: string }> = ({ label, value, subValue, color = 'text-white' }) => (
  <div className="p-4 rounded-xl hover:bg-white/5 transition-all">
    <div className="text-[9px] text-gray-500 uppercase tracking-[0.2em] font-bold mb-2 leading-none">{label}</div>
    <div className={`text-3xl font-oswald font-bold tracking-tight ${color}`}>{value}</div>
    <div className="text-[10px] text-gray-600 font-bold uppercase mt-1 tracking-tight">{subValue}</div>
  </div>
);
