
import React, { useState, useMemo } from 'react';
import { ProjectBid, ShotBidLineItem, AssetBidLineItem, ShotType, DeptRate, ApprovalStep } from '../types';
import { BID_STATUS_CONFIG } from './BidManager';

interface BidDetailViewProps {
  bid: ProjectBid;
  onBack: () => void;
}

type BidTab = 'INTERNAL_BREAKDOWN' | 'INTERNAL_REVIEW' | 'CLIENT_EXPORT' | 'SETTINGS';

export const BidDetailView: React.FC<BidDetailViewProps> = ({ bid, onBack }) => {
  const [activeTab, setActiveTab] = useState<BidTab>('INTERNAL_BREAKDOWN');

  // Unified calculation engine for mathematical consistency
  const totals = useMemo(() => {
    // We sum line items to verify against the stored 'bid.amount'
    const shotCost = bid.shotItems?.reduce((acc, item) => acc + item.cost, 0) || 0;
    const assetCost = bid.assetItems?.reduce((acc, item) => acc + item.cost, 0) || 0;
    
    // In awarded scenarios, use the stored bid.amount as the source of truth if items aren't perfectly synced
    // But for Alpha, we ensure items sum correctly.
    const gross = (shotCost + assetCost) || bid.amount;
    const rebate = bid.rebate;
    const net = gross - rebate;

    const shotDays = bid.shotItems?.reduce((acc, item) => acc + item.totalDays, 0) || 0;
    const assetDays = bid.assetItems?.reduce((acc, item) => acc + item.totalDays, 0) || 0;

    const deptAggs: Record<string, number> = {};
    bid.shotItems?.forEach(item => {
      Object.entries(item.departments).forEach(([dept, days]) => {
        deptAggs[dept] = (deptAggs[dept] || 0) + (days as number);
      });
    });
    bid.assetItems?.forEach(item => {
       Object.entries(item.tasks).forEach(([task, days]) => {
         deptAggs[task] = (deptAggs[task] || 0) + (days as number);
       });
    });

    return { shotDays, assetDays, gross, rebate, net, deptAggs };
  }, [bid]);

  return (
    <div className="flex flex-col h-full bg-dark-base animate-in fade-in duration-300 text-left">
      <header className="px-8 py-5 border-b border-dark-border bg-dark-surface/50 flex justify-between items-center z-20">
        <div className="flex items-center gap-6">
          <button onClick={onBack} className="w-10 h-10 flex items-center justify-center hover:bg-white/5 rounded-full text-gray-400 hover:text-white transition-all">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          </button>
          <div className="text-left">
            <div className="flex items-center gap-2 mb-0.5">
               <span className="text-[10px] font-bold text-mota-pink uppercase tracking-[0.2em]">{bid.territory}</span>
               <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
               <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest text-left">Vertex Hub Lead: {bid.internalVFXProducer}</span>
            </div>
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-oswald font-bold uppercase tracking-tight">{bid.title}</h2>
              <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase border ${BID_STATUS_CONFIG[bid.status].bg} ${BID_STATUS_CONFIG[bid.status].color} ${BID_STATUS_CONFIG[bid.status].border} shadow-lg`}>
                {BID_STATUS_CONFIG[bid.status].label}
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-1 bg-dark-base p-1 rounded-xl border border-dark-border">
          <TabBtn active={activeTab === 'SETTINGS'} onClick={() => setActiveTab('SETTINGS')}>Configuration</TabBtn>
          <TabBtn active={activeTab === 'INTERNAL_BREAKDOWN'} onClick={() => setActiveTab('INTERNAL_BREAKDOWN')}>Breakdown</TabBtn>
          <TabBtn active={activeTab === 'INTERNAL_REVIEW'} onClick={() => setActiveTab('INTERNAL_REVIEW')}>Executive Review</TabBtn>
          <TabBtn active={activeTab === 'CLIENT_EXPORT'} onClick={() => setActiveTab('CLIENT_EXPORT')}>Client View</TabBtn>
        </div>

        <div className="flex gap-3">
          <button className="bg-dark-surface border border-dark-border px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:border-white transition-all">Audit Trail</button>
          <button className="bg-mota-pink text-dark-base px-6 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-mota-pink/20 hover:scale-[1.02] active:scale-95 transition-all">Final Sign-Off</button>
        </div>
      </header>

      <div className="flex-1 overflow-auto custom-scrollbar">
        {activeTab === 'SETTINGS' && <SettingsTab bid={bid} />}
        {activeTab === 'INTERNAL_BREAKDOWN' && <BreakdownTab bid={bid} />}
        {activeTab === 'INTERNAL_REVIEW' && <ReviewTab bid={bid} totals={totals} />}
        {activeTab === 'CLIENT_EXPORT' && <ClientViewTab bid={bid} totals={totals} />}
      </div>
    </div>
  );
};

const TabBtn: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode }> = ({ active, onClick, children }) => (
  <button 
    onClick={onClick}
    className={`px-5 py-2 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all ${active ? 'bg-mota-pink text-dark-base shadow-lg font-bold' : 'text-gray-500 hover:text-white'}`}
  >
    {children}
  </button>
);

const SettingsTab: React.FC<{ bid: ProjectBid }> = ({ bid }) => (
  <div className="p-10 max-w-5xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4">
    <section className="bg-dark-surface p-10 rounded-3xl border border-dark-border space-y-10 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 left-0 w-2 h-full bg-mota-pink"></div>
      <div className="flex justify-between items-center border-b border-dark-border pb-4">
        <h3 className="text-sm font-bold uppercase tracking-[0.3em] text-mota-pink">Vertex Global Hub Configuration</h3>
        <span className="text-[10px] font-bold text-gray-600 uppercase">Hub locations: UK, Ireland, Los Angeles</span>
      </div>
      <div className="grid grid-cols-2 gap-x-12 gap-y-10 text-left">
        <ConfigItem label="Proposal Name" defaultValue={bid.title} />
        <ConfigItem label="Vertex Primary Hub" defaultValue={bid.territory} />
        <ConfigItem label="VFX Producer (Internal Lead)" defaultValue={bid.internalVFXProducer} />
        <ConfigItem label="VFX Supervisor (Creative Lead)" defaultValue={bid.internalVFXSupervisor} />
        <ConfigItem label="Principal Photography Start" defaultValue={bid.productionStart} type="date" />
        <ConfigItem label="Final Master Delivery" defaultValue={bid.deliveryDate} type="date" />
        <ConfigItem label="Total Schedule (Weeks)" defaultValue={bid.scheduleWeeks} type="number" />
        <ConfigItem label="Incentive Target Rate (%)" defaultValue={(bid.rebate / bid.amount * 100).toFixed(1)} type="number" />
      </div>
    </section>
  </div>
);

const ConfigItem: React.FC<{ label: string; defaultValue: any; type?: string }> = ({ label, defaultValue, type = 'text' }) => (
  <div className="space-y-3 text-left">
    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">{label}</label>
    <input 
      type={type} 
      defaultValue={defaultValue} 
      className="w-full bg-dark-base border border-dark-border rounded-xl px-5 py-3 text-sm text-white focus:outline-none focus:border-mota-pink transition-all font-medium"
    />
  </div>
);

const BreakdownTab: React.FC<{ bid: ProjectBid }> = ({ bid }) => {
  return (
    <div className="p-8 flex gap-10">
      <div className="flex-1 space-y-12 min-w-0">
        <section className="text-left">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-bold uppercase tracking-[0.3em] text-gray-500">Vertex Master Shot List ({bid.shotItems?.length})</h3>
            <div className="flex gap-3">
               <button className="bg-mota-pink/10 border border-mota-pink/30 text-mota-pink text-[9px] font-bold px-4 py-2 rounded-xl hover:bg-mota-pink hover:text-dark-base transition-all uppercase tracking-widest shadow-lg">Run AI Shot Density Check</button>
            </div>
          </div>
          <div className="overflow-x-auto bg-dark-surface rounded-2xl border border-dark-border shadow-2xl">
            <table className="w-full text-left text-[11px] border-collapse">
              <thead className="bg-dark-base/50 text-gray-500 uppercase font-bold sticky top-0 z-10">
                <tr>
                  <th className="px-5 py-4 border-b border-dark-border">Shot ID</th>
                  <th className="px-5 py-4 border-b border-dark-border">Type</th>
                  <th className="px-5 py-4 text-center border-b border-dark-border">L/O</th>
                  <th className="px-5 py-4 text-center border-b border-dark-border">MM</th>
                  <th className="px-5 py-4 text-center border-b border-dark-border">FX</th>
                  <th className="px-5 py-4 text-center border-b border-dark-border">Anim</th>
                  <th className="px-5 py-4 text-center border-b border-dark-border">Lgt</th>
                  <th className="px-5 py-4 text-center border-b border-dark-border">Comp</th>
                  <th className="px-5 py-4 font-bold text-white text-right border-b border-dark-border">Unit Cost</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-border/40">
                {(bid.shotItems || []).slice(0, 20).map(shot => (
                  <tr key={shot.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-5 py-3 font-mono font-bold text-gray-400 group-hover:text-mota-pink transition-colors">{shot.shotName}</td>
                    <td className="px-5 py-3">
                      <span className="bg-dark-base px-2 py-0.5 rounded-lg text-[10px] font-bold text-white border border-dark-border group-hover:border-mota-pink/40 transition-colors uppercase">{shot.shotType}</span>
                    </td>
                    <DeptDisplay value={shot.departments.layout} />
                    <DeptDisplay value={shot.departments.matchmove} />
                    <DeptDisplay value={shot.departments.fx} />
                    <DeptDisplay value={shot.departments.anim} />
                    <DeptDisplay value={shot.departments.lighting} />
                    <DeptDisplay value={shot.departments.comp} />
                    <td className="px-5 py-3 font-bold text-right text-white">${shot.cost.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {(bid.shotItems?.length || 0) > 20 && (
              <div className="p-4 text-center text-[10px] text-gray-600 uppercase font-black tracking-widest border-t border-dark-border">
                Showing 20 of {bid.shotItems?.length} shots. Download full ledger for detailed breakdown.
              </div>
            )}
          </div>
        </section>

        <section className="text-left">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-bold uppercase tracking-[0.3em] text-gray-500">Asset builds ({bid.assetItems?.length})</h3>
          </div>
          <div className="overflow-x-auto bg-dark-surface rounded-xl border border-dark-border shadow-2xl">
            <table className="w-full text-left text-[11px] border-collapse">
              <thead className="bg-dark-base/50 text-gray-500 uppercase font-bold sticky top-0 z-10">
                <tr>
                  <th className="px-3 py-3 border-b border-dark-border">Asset ID</th>
                  <th className="px-3 py-3 border-b border-dark-border">Type</th>
                  <th className="px-3 py-3 text-center border-b border-dark-border">Mod</th>
                  <th className="px-3 py-3 text-center border-b border-dark-border">Tex</th>
                  <th className="px-3 py-3 text-center border-b border-dark-border">Rig</th>
                  <th className="px-3 py-3 text-center border-b border-dark-border">L/D</th>
                  <th className="px-3 py-3 text-center border-b border-dark-border font-bold text-white text-right">Total Days</th>
                  <th className="px-3 py-3 text-center border-b border-dark-border font-bold text-white text-right">Cost</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-border">
                {bid.assetItems?.map(asset => (
                  <tr key={asset.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-3 py-2 font-bold text-white">{asset.assetName}</td>
                    <td className="px-3 py-2 text-gray-500">{asset.type}</td>
                    <DeptDisplay value={asset.tasks.model} />
                    <DeptDisplay value={asset.tasks.texture} />
                    <DeptDisplay value={asset.tasks.rig} />
                    <DeptDisplay value={asset.tasks.lookdev} />
                    <td className="px-3 py-2 font-bold text-right text-mota-pink">{asset.totalDays}</td>
                    <td className="px-3 py-2 font-bold text-right text-white">${asset.cost.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* AI INTELLIGENCE SIDEBAR */}
      <div className="w-96 shrink-0 space-y-8">
         <div className="bg-dark-surface p-8 rounded-3xl border border-dark-border space-y-8 shadow-2xl relative overflow-hidden text-left">
            <div className="absolute top-0 right-0 w-32 h-32 bg-mota-pink opacity-[0.04] rounded-full -mr-16 -mt-16"></div>
            <div className="flex items-center gap-3 border-b border-dark-border pb-4">
               <svg className="w-5 h-5 text-mota-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
               <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-mota-pink">AI Bid Intelligence</h3>
            </div>

            <div className="space-y-6">
               <AIInsightItem label="Complexity Variance" value="+4.2%" desc="Above Vertex studio average for genre." status="warning" />
               <AIInsightItem label="Daycount Efficiency" value="94.2%" desc="Optimized for Vertex London Pipeline." status="good" />
               <AIInsightItem label="Render Risk Score" value="Low" desc="Matched against Ireland Hub nodes." status="good" />
            </div>

            <div className="pt-6">
               <button className="w-full bg-dark-base border border-dark-border py-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-white hover:border-mota-pink transition-all shadow-xl">
                  Recalculate via AI
               </button>
            </div>
         </div>
      </div>
    </div>
  );
};

const ReviewTab: React.FC<{ bid: ProjectBid; totals: any }> = ({ bid, totals }) => (
  <div className="p-10 grid grid-cols-12 gap-10 animate-in fade-in duration-700 text-left">
    <div className="col-span-9 space-y-10">
      <section className="bg-dark-surface p-12 rounded-[2.5rem] border border-dark-border shadow-2xl relative overflow-hidden">
        <div className="flex justify-between items-start mb-12">
          <div>
            <div className="flex items-center gap-3 mb-3">
               <div className="w-1.5 h-1.5 bg-mota-pink rounded-full"></div>
               <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-mota-pink">Vertex Financial Summary</h3>
            </div>
            <h2 className="text-5xl font-oswald font-bold uppercase tracking-tight">Executive Audit</h2>
          </div>
          <div className="text-right">
             <span className="bg-mota-pink/10 text-mota-pink border border-mota-pink/20 px-5 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest">Awaiting Sign-Off</span>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-12">
          <HealthStat label="Gross Contract Value" value={`$${(totals.gross / 1000000).toFixed(2)}M`} subValue="Internal Audit Total" status="neutral" />
          <HealthStat label="Est. Regional Rebate" value={`$${(totals.rebate / 1000000).toFixed(2)}M`} subValue={`${bid.territory} Hub`} status="good" />
          <HealthStat label="Final Client Net" value={`$${(totals.net / 1000000).toFixed(2)}M`} subValue="After Rebate Realization" status="neutral" />
          <HealthStat label="Target Gross Margin" value={`${bid.margin}%`} subValue={`Proj. Profit: $${((totals.gross * (bid.margin/100)) / 1000).toFixed(0)}k`} status="good" />
        </div>
      </section>

      <div className="grid grid-cols-2 gap-10">
        <section className="bg-dark-surface p-10 rounded-3xl border border-dark-border shadow-2xl">
          <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-gray-500 mb-8">Resource Load by Dept</h3>
          <div className="space-y-6">
            {bid.deptRates.map(dept => {
              const actualDays = totals.deptAggs[dept.dept.toLowerCase()] || 0;
              return (
                <div key={dept.dept} className="flex items-center gap-8 group">
                  <div className="w-28 text-[11px] font-bold text-gray-400 uppercase tracking-tighter">{dept.dept}</div>
                  <div className="flex-1 h-2 bg-dark-base rounded-full overflow-hidden flex shadow-inner">
                     <div className="h-full bg-mota-pink opacity-80" style={{ width: `${Math.min(100, (actualDays/500)*100)}%` }}></div>
                  </div>
                  <div className="w-44 text-right">
                    <span className="text-xs font-mono font-bold text-white">{actualDays.toFixed(0)} Days</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
        <section className="bg-dark-surface p-10 rounded-3xl border border-dark-border shadow-2xl flex flex-col justify-center items-center text-center space-y-6">
           <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-gray-500">Internal Narrative</h3>
           <p className="text-[13px] text-gray-400 leading-relaxed italic max-w-sm">"Success on {bid.title} is critical for Q4 capacity utilization. Strategic focus on UK labor qualifying spend for max AVEC realization."</p>
        </section>
      </div>
    </div>

    <div className="col-span-3 space-y-8">
      <div className="bg-dark-surface p-8 rounded-3xl border border-dark-border shadow-2xl">
        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-mota-pink mb-8 border-b border-dark-border pb-4">Sign-Off Matrix</h3>
        <div className="space-y-10 relative pl-4">
          <div className="absolute left-[20px] top-2 bottom-2 w-px bg-dark-border"></div>
          {bid.approvals.map((app, idx) => (
            <div key={app.role} className="relative pl-10">
              <div className={`absolute left-0 top-1 w-6 h-6 rounded-full border-2 border-dark-surface z-10 flex items-center justify-center text-[8px] font-bold ${app.status === 'APPROVED' ? 'bg-emerald-500 text-dark-base' : 'bg-dark-base text-gray-600 border-dark-border'}`}>
                {app.status === 'APPROVED' ? '✓' : idx + 1}
              </div>
              <div className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">{app.role}</div>
              <div className="text-xs font-bold text-white">{app.user}</div>
              <div className="text-[9px] text-gray-500 italic mt-1 leading-relaxed">"{app.comment}"</div>
            </div>
          ))}
        </div>
        <button className="w-full bg-emerald-500 text-dark-base font-bold py-4 rounded-2xl text-[10px] uppercase tracking-[0.2em] mt-10 shadow-xl shadow-emerald-500/10">Approve Bid Package</button>
      </div>
    </div>
  </div>
);

const ClientViewTab: React.FC<{ bid: ProjectBid; totals: any }> = ({ bid, totals }) => (
  <div className="max-w-5xl mx-auto p-16 space-y-20 animate-in fade-in duration-1000 pb-32 text-left">
    <div className="flex justify-between items-start">
      <div className="space-y-6">
        <h1 className="text-7xl font-oswald font-bold uppercase tracking-tighter leading-none text-white">{bid.title}</h1>
        <div className="text-2xl text-gray-400 font-light tracking-tight italic">Production Proposal — Official Release</div>
      </div>
      <div className="text-right">
        <div className="text-sm font-bold text-white uppercase tracking-widest">{bid.territory} Hub</div>
        <div className="text-[10px] text-gray-600 uppercase tracking-widest mt-1 font-mono">REF: {bid.id}</div>
      </div>
    </div>

    <div className="grid grid-cols-12 gap-16 border-y border-dark-border/40 py-20 bg-dark-surface/10 px-10 rounded-3xl">
      <div className="col-span-7 space-y-12">
        <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-mota-pink mb-4">Financial Engagement Summary</h3>
        <div className="space-y-8">
          <div className="flex justify-between items-baseline border-b border-dark-border/20 pb-4">
            <span className="text-xl text-gray-500 font-light">Contractual Gross (USD)</span>
            <span className="text-3xl font-oswald font-bold text-white">${totals.gross.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-baseline border-b border-dark-border/20 pb-4">
            <span className="text-xl text-emerald-400 font-light italic">Est. Regional Rebate</span>
            <span className="text-3xl font-oswald font-bold text-emerald-400">-${totals.rebate.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-end pt-10">
            <div className="space-y-1">
              <span className="font-oswald uppercase text-gray-500 text-xl tracking-tighter">Net Project Cost</span>
            </div>
            <span className="text-7xl font-oswald font-bold text-white tracking-tighter leading-none">${totals.net.toLocaleString()}</span>
          </div>
        </div>
      </div>
      <div className="col-span-5 border-l border-dark-border/40 pl-12 flex flex-col justify-center space-y-12">
          <div className="bg-dark-base/50 p-8 rounded-3xl border border-dark-border flex items-center justify-between">
            <div className="text-[10px] text-gray-600 uppercase font-bold tracking-[0.2em]">High-End Shots</div>
            <div className="text-5xl font-oswald font-bold text-white">{bid.shots}</div>
          </div>
          <div className="bg-dark-base/50 p-8 rounded-3xl border border-dark-border flex items-center justify-between">
            <div className="text-[10px] text-gray-600 uppercase font-bold tracking-[0.2em]">Hero CGI Assets</div>
            <div className="text-5xl font-oswald font-bold text-white">{bid.assets}</div>
          </div>
      </div>
    </div>
    <div className="pt-20 text-center">
       <button className="bg-white text-dark-base px-10 py-4 rounded-2xl font-bold uppercase text-xs tracking-widest shadow-2xl hover:scale-105 transition-all">Download Signed PDF</button>
    </div>
  </div>
);

const AIInsightItem: React.FC<{ label: string; value: string; desc: string; status: 'good' | 'warning' | 'neutral' }> = ({ label, value, desc, status }) => (
  <div className="bg-dark-base/40 p-5 rounded-2xl border border-dark-border/50 group hover:border-mota-pink/30 transition-all text-left">
     <div className="flex justify-between items-center mb-2">
        <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">{label}</span>
        <div className={`w-2 h-2 rounded-full ${status === 'good' ? 'bg-emerald-400' : status === 'warning' ? 'bg-yellow-500' : 'bg-blue-400'}`}></div>
     </div>
     <div className="text-xl font-oswald font-bold text-white mb-2">{value}</div>
     <p className="text-[11px] text-gray-500 font-medium leading-snug italic">{desc}</p>
  </div>
);

const DeptDisplay: React.FC<{ value: number }> = ({ value }) => (
  <td className="px-5 py-3 text-center text-gray-500 font-mono text-[10px]">{value === 0 ? '--' : value}</td>
);

const HealthStat: React.FC<{ label: string; value: string; subValue: string; status: 'good' | 'warning' | 'neutral'; interactive?: boolean; onClick?: () => void }> = ({ label, value, subValue, status, interactive, onClick }) => {
  const statusColors = { good: 'text-emerald-400', warning: 'text-yellow-500', neutral: 'text-white' };
  return (
    <div className={`p-6 bg-dark-base/40 rounded-2xl border border-dark-border group transition-all text-left ${interactive ? 'cursor-pointer hover:border-mota-pink hover:bg-mota-pink/5' : ''}`} onClick={onClick}>
      <div className="text-[10px] text-gray-600 uppercase tracking-widest font-bold mb-2">{label}</div>
      <div className={`text-3xl font-oswald font-bold tracking-tight mb-1 ${statusColors[status]}`}>{value}</div>
      <div className="text-[10px] text-gray-500 font-medium uppercase tracking-tight">{subValue}</div>
    </div>
  );
};
