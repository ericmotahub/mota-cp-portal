
import React, { useState, useMemo } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, ResponsiveContainer, 
  CartesianGrid, Tooltip, BarChart, Bar, Cell, 
  ComposedChart, Line
} from 'recharts';
import { TrackedOpportunity, STATUS_CONFIG } from './PipelineManager';
import { MASTER_DATA } from './BizDevCenter';

// Mock data for the Capacity Gantt
const CAPACITY_TIMELINE = [
  { month: 'Oct', London: 92, Dublin: 64, LA: 78, Market: 85 },
  { month: 'Nov', London: 88, Dublin: 70, LA: 82, Market: 80 },
  { month: 'Dec', London: 95, Dublin: 85, LA: 90, Market: 75 },
  { month: 'Jan', London: 60, Dublin: 45, LA: 55, Market: 90 },
  { month: 'Feb', London: 40, Dublin: 30, LA: 25, Market: 95 },
  { month: 'Mar', London: 20, Dublin: 15, LA: 10, Market: 98 },
];

const REVENUE_BURN = [
  { month: 'Oct', awarded: 2.1, speculative: 0.5 },
  { month: 'Nov', awarded: 2.8, speculative: 1.2 },
  { month: 'Dec', awarded: 1.9, speculative: 2.4 },
  { month: 'Jan', awarded: 0.8, speculative: 4.2 },
  { month: 'Feb', awarded: 0.3, speculative: 5.8 },
];

const STUDIO_PENETRATION = [
  { studio: 'Disney', total: 18, vertex: 4 },
  { studio: 'Netflix', total: 42, vertex: 6 },
  { studio: 'Sony', total: 12, vertex: 5 },
  { studio: 'Warner', total: 24, vertex: 2 },
  { studio: 'Apple', total: 15, vertex: 1 },
];

interface PartnerDashboardProps {
  pipeline: TrackedOpportunity[];
  onOpenWorkroom: (id: string) => void;
  setView: (view: string) => void;
}

export const PartnerDashboard: React.FC<PartnerDashboardProps> = ({ pipeline, onOpenWorkroom, setView }) => {
  const currentProjects = pipeline.filter(o => o.status === 'CURRENT_PROJ');
  const activeBids = pipeline.filter(o => o.status === 'ACTIVE_OPP');
  const leadProspects = pipeline.filter(o => o.status === 'LEAD');
  
  // Intelligence derived from Master Data
  const neglectedLeads = MASTER_DATA.people.filter(p => p.relationship === 'Hot' && !pipeline.find(o => o.entityName === p.name));
  const hotMarketSpecs = MASTER_DATA.projects.filter(p => p.fit > 90 && !pipeline.find(o => o.entityName === p.title));

  return (
    <div className="p-8 max-w-[1750px] mx-auto space-y-8 animate-in fade-in duration-500 pb-24 text-white">
      {/* HEADER: STUDIO PULSE */}
      <header className="flex justify-between items-end">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <span className="text-[10px] font-bold text-mota-pink uppercase tracking-[0.4em]">Vertex Global Control</span>
            <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Global Executive Mission Control</span>
          </div>
          <h1 className="text-5xl font-oswald font-bold uppercase tracking-tighter">Executive Dashboard</h1>
        </div>
        <div className="flex gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_#10b981]"></div>
            <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest leading-none">Status: Stable Operational Hubs</span>
          </div>
          <button 
            onClick={() => setView('pipeline')}
            className="bg-mota-pink text-dark-base px-6 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-mota-pink/20 hover:scale-[1.02] transition-all"
          >
            Strategic Pipeline Review
          </button>
        </div>
      </header>

      {/* BLOCK 1: EXECUTIVE VITALS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard label="Weighted Pipeline" value="$14.2M" subValue="Across all Vertex hubs" trend="+12%" trendDir="up" />
        <KPICard label="Project Margin (Avg)" value="31.2%" subValue="Target: 25.0%" trend="+6.2%" trendDir="up" status="good" />
        <KPICard label="Unbilled Revenue" value="$4.8M" subValue="WIP pending invoice" trend="Critical" trendDir="neutral" status="warning" />
        <KPICard label="Market Liquidity" value="84 Artists" subValue="Ready for hire (30d)" trend="High" trendDir="up" color="text-emerald-400" />
      </div>

      <div className="grid grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: CORE OPERATIONS & PIPELINE (8/12) */}
        <div className="col-span-8 space-y-8">
          
          {/* REVENUE & CAPACITY OVERLAY */}
          <div className="bg-dark-surface p-8 rounded-3xl border border-dark-border shadow-2xl relative overflow-hidden group">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-xl font-oswald font-bold uppercase tracking-tight text-white">Financial Burn vs Global Capacity</h3>
                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mt-1">Cross-hub utilization overlaying project burn</p>
              </div>
              <div className="flex gap-6">
                <LegendItem color="bg-mota-pink" label="Awarded Rev" />
                <LegendItem color="bg-blue-500" label="Speculative Rev" />
                <LegendItem color="bg-white" label="Avg Capacity %" isLine />
              </div>
            </div>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={REVENUE_BURN}>
                  <defs>
                    <linearGradient id="colorAwarded" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#FF8585" stopOpacity={0.3}/><stop offset="95%" stopColor="#FF8585" stopOpacity={0}/></linearGradient>
                    <linearGradient id="colorSpec" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/><stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/></linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                  <XAxis dataKey="month" stroke="#666" fontSize={10} axisLine={false} tickLine={false} />
                  <YAxis yAxisId="left" stroke="#666" fontSize={10} axisLine={false} tickLine={false} />
                  <YAxis yAxisId="right" orientation="right" stroke="#666" fontSize={10} axisLine={false} tickLine={false} domain={[0, 100]} />
                  <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #3d3d3d', borderRadius: '12px' }} />
                  <Area yAxisId="left" type="monotone" dataKey="awarded" stroke="#FF8585" fill="url(#colorAwarded)" strokeWidth={3} stackId="1" />
                  <Area yAxisId="left" type="monotone" dataKey="speculative" stroke="#3b82f6" fill="url(#colorSpec)" strokeWidth={3} stackId="1" />
                  <Line yAxisId="right" type="monotone" dataKey={(v) => CAPACITY_TIMELINE.find(c => c.month === v.month)?.London} stroke="#fff" strokeWidth={2} strokeDasharray="5 5" name="Capacity" dot={false} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* PIPELINE SNAPSHOT: QUALIFIED & ENGAGED */}
          <div className="bg-dark-surface p-8 rounded-3xl border border-dark-border shadow-2xl">
             <div className="flex justify-between items-center mb-8">
               <div>
                 <h3 className="text-xl font-oswald font-bold uppercase tracking-tight text-white">Pipeline Snapshot</h3>
                 <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mt-1">Status of Qualified Leads and Engaged Bids</p>
               </div>
               <button onClick={() => setView('pipeline')} className="text-mota-pink text-[10px] font-bold uppercase tracking-widest hover:underline">Full Pipeline Detail &rarr;</button>
             </div>
             
             <div className="grid grid-cols-3 gap-6">
                <PipelineSnapshotCol 
                  title="Qualified Leads" 
                  items={leadProspects.slice(0, 3)} 
                  onOpen={onOpenWorkroom} 
                  color="border-gray-700"
                />
                <PipelineSnapshotCol 
                  title="Engaged Bids" 
                  items={activeBids.slice(0, 3)} 
                  onOpen={onOpenWorkroom} 
                  color="border-blue-500/30"
                />
                <PipelineSnapshotCol 
                  title="Awarded projects" 
                  items={currentProjects.slice(0, 3)} 
                  onOpen={onOpenWorkroom} 
                  color="border-mota-pink/30"
                  isAwarded
                />
             </div>
          </div>

          {/* RESOURCE GAPS & TALENT MATCHING */}
          <div className="grid grid-cols-2 gap-8">
            <div className="bg-dark-surface p-8 rounded-3xl border border-dark-border shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500">Resource Gaps (Upcoming)</h3>
                <button onClick={() => setView('talent-search')} className="text-[9px] text-mota-pink font-bold uppercase hover:underline">Fill Positions &rarr;</button>
              </div>
              <div className="space-y-4">
                <ResourceGapItem 
                  role="Senior Nuke Comp" 
                  gap={12} 
                  date="Nov 1st" 
                  matches={5} 
                  project="Project Alpha"
                  onFill={() => setView('talent-search')}
                />
                <ResourceGapItem 
                  role="FX Technical Director" 
                  gap={4} 
                  date="Dec 15th" 
                  matches={2} 
                  project="Neon Horizon"
                  onFill={() => setView('talent-search')}
                />
                <ResourceGapItem 
                  role="Lighting Lead" 
                  gap={2} 
                  date="Immediate" 
                  matches={1} 
                  project="Project Titan"
                  urgent
                  onFill={() => setView('talent-search')}
                />
              </div>
            </div>

            <div className="bg-dark-surface p-8 rounded-3xl border border-dark-border shadow-2xl text-white">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500">Industry Heat (Biz Dev)</h3>
                <button onClick={() => setView('biz-dev')} className="text-[9px] text-blue-400 font-bold uppercase hover:underline">View Market &rarr;</button>
              </div>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={STUDIO_PENETRATION} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} horizontal={false} />
                    <XAxis type="number" hide />
                    <YAxis dataKey="studio" type="category" stroke="#999" fontSize={9} width={60} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #3d3d3d' }} />
                    <Bar dataKey="total" fill="#333" radius={[0, 4, 4, 0]} barSize={8} />
                    <Bar dataKey="vertex" fill="#FF8585" radius={[0, 4, 4, 0]} barSize={8} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 pt-4 border-t border-dark-border">
                <p className="text-[10px] text-gray-500 font-medium italic">"Vertex captures 14% of Netflix's high-fit active production slate."</p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: GROWTH & GLOBAL HEALTH (4/12) */}
        <div className="col-span-4 space-y-8">
          
          {/* RELATIONSHIP PULSE */}
          <div className="bg-dark-surface p-8 rounded-3xl border border-dark-border shadow-2xl h-fit text-left">
            <div className="flex justify-between items-center mb-6 pb-2 border-b border-dark-border">
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500">Relationship Vitality</h3>
              <button onClick={() => setView('biz-dev-people')} className="text-[9px] text-mota-pink font-bold uppercase tracking-widest hover:underline">Exec Directory &rarr;</button>
            </div>
            <div className="space-y-4">
              {neglectedLeads.slice(0, 3).map(lead => (
                <div key={lead.id} onClick={() => setView('biz-dev-people')} className="group p-4 bg-dark-base rounded-2xl border border-dark-border hover:border-mota-pink transition-all cursor-pointer">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-sm font-bold text-white group-hover:text-mota-pink transition-colors">{lead.name}</span>
                    <span className="text-[8px] bg-orange-500/10 text-orange-500 border border-orange-500/20 px-1.5 py-0.5 rounded font-bold uppercase">Neglected</span>
                  </div>
                  <div className="text-[10px] text-gray-500 uppercase font-bold tracking-tighter">{lead.title} @ {lead.company}</div>
                  <div className="mt-3 flex justify-between items-center">
                    <span className="text-[9px] text-gray-600 font-mono">Last Contact: 32 Days Ago</span>
                    <button className="text-[9px] font-bold text-mota-pink uppercase tracking-widest hover:underline">Poke Lead &rarr;</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* HUB CAPACITY FORECAST */}
          <div className="bg-dark-surface p-8 rounded-3xl border border-dark-border shadow-2xl">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500 mb-6 pb-2 border-b border-dark-border">Vertex Hub Capacity</h3>
            <div className="space-y-6">
              <CapacityMiniRow label="London (Soho)" utilization={92} artists={185} trend="Critical" />
              <CapacityMiniRow label="Dublin (IE)" utilization={64} artists={120} trend="Nominal" />
              <CapacityMiniRow label="Los Angeles (CA)" utilization={78} artists={65} trend="Tight" />
            </div>
            <div className="mt-8 pt-6 border-t border-dark-border">
              <button 
                onClick={() => setView('talent-search')}
                className="w-full bg-dark-base border border-dark-border text-white py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:border-mota-pink transition-all"
              >
                Global Resource Suite
              </button>
            </div>
          </div>

          {/* STRATEGIC GROWTH TARGETS */}
          <div className="bg-blue-500/5 border border-blue-500/20 p-8 rounded-3xl shadow-xl space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-blue-400">Biz Dev Targets</h3>
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse"></div>
            </div>
            <div className="space-y-4">
              {hotMarketSpecs.slice(0, 2).map(proj => (
                <div 
                  key={proj.id} 
                  onClick={() => setView('biz-dev')}
                  className="p-4 bg-dark-base/50 rounded-xl border border-dark-border group hover:border-blue-400 transition-all cursor-pointer"
                >
                  <div className="text-[9px] text-blue-400 font-bold uppercase mb-1">{proj.studio}</div>
                  <div className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors uppercase font-oswald">{proj.title}</div>
                  <div className="mt-2 flex justify-between items-center">
                    <span className="text-[9px] text-gray-600 uppercase font-bold tracking-widest">Fit: {proj.fit}%</span>
                    <span className="text-[9px] text-gray-600 uppercase font-bold tracking-widest">{proj.budget}</span>
                  </div>
                </div>
              ))}
            </div>
            <button 
              onClick={() => setView('biz-dev')}
              className="w-full text-center text-[9px] font-bold uppercase tracking-[0.2em] text-blue-400 hover:text-white transition-colors"
            >
              View Full Growth Slate &rarr;
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

// --- SUB-COMPONENTS ---

const KPICard: React.FC<{ label: string; value: string; subValue: string; trend: string; trendDir?: 'up' | 'down' | 'neutral', color?: string; status?: 'good' | 'warning' }> = ({ label, value, subValue, trend, trendDir, color = 'text-white', status }) => (
  <div className="bg-dark-surface p-7 rounded-3xl border border-dark-border shadow-xl hover:border-mota-pink/30 transition-all group text-left">
    <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-3">{label}</div>
    <div className={`text-4xl font-oswald font-bold tracking-tight mb-2 group-hover:text-white transition-colors ${color}`}>{value}</div>
    <div className="flex justify-between items-center">
      <div className="text-[11px] text-gray-500 font-medium">{subValue}</div>
      <div className={`text-[10px] font-bold uppercase ${trendDir === 'up' ? 'text-emerald-400' : trendDir === 'down' ? 'text-red-400' : 'text-yellow-500'}`}>
        {trend}
      </div>
    </div>
  </div>
);

const PipelineSnapshotCol: React.FC<{ title: string; items: TrackedOpportunity[]; onOpen: (id: string) => void; color: string; isAwarded?: boolean }> = ({ title, items, onOpen, color, isAwarded }) => (
  <div className={`flex flex-col gap-3 p-4 rounded-2xl border ${color} bg-dark-base/30 text-white text-left`}>
    <h4 className="text-[9px] font-bold uppercase tracking-widest text-gray-500 px-1">{title}</h4>
    <div className="space-y-3">
      {items.length > 0 ? items.map(item => (
        <div 
          key={item.id} 
          onClick={() => onOpen(item.id)}
          className="p-3 bg-dark-surface border border-dark-border rounded-xl hover:border-mota-pink transition-all cursor-pointer group"
        >
          <div className="flex justify-between items-start mb-2">
            <span className="text-sm font-bold text-white group-hover:text-mota-pink transition-colors">{item.entityName}</span>
            {isAwarded && <span className="text-[7px] bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-1 rounded font-bold uppercase">LIVE</span>}
          </div>
          <div className="flex justify-between items-center text-[9px] font-bold uppercase tracking-tighter">
            <span className="text-gray-500">{STATUS_CONFIG[item.internalStatus].label}</span>
            <span className="text-gray-400">{item.value || '--'}</span>
          </div>
        </div>
      )) : (
        <div className="py-8 text-center text-[9px] text-gray-600 font-bold uppercase tracking-widest italic">No active items</div>
      )}
    </div>
  </div>
);

const LegendItem: React.FC<{ color: string; label: string; isLine?: boolean }> = ({ color, label, isLine }) => (
  <div className="flex items-center gap-2">
    {isLine ? (
      <div className={`w-4 h-0.5 ${color}`}></div>
    ) : (
      <div className={`w-2 h-2 rounded-full ${color}`}></div>
    )}
    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{label}</span>
  </div>
);

const ResourceGapItem: React.FC<{ role: string; gap: number; date: string; matches: number; project: string; urgent?: boolean; onFill: () => void }> = ({ role, gap, date, matches, project, urgent, onFill }) => (
  <div onClick={onFill} className={`p-4 rounded-2xl border transition-all hover:border-mota-pink cursor-pointer flex justify-between items-center ${urgent ? 'border-red-500/30 bg-red-500/5 shadow-[0_0_15px_rgba(239,68,68,0.05)]' : 'border-dark-border bg-dark-base'}`}>
    <div className="text-left">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xs font-bold text-white uppercase">{role}</span>
        {urgent && <span className="text-[8px] bg-red-500 text-dark-base px-1 rounded font-black uppercase">Urgent</span>}
      </div>
      <div className="text-[9px] text-gray-500 uppercase font-bold tracking-widest">
        Need: {gap} for <span className="text-mota-pink">{project}</span>
      </div>
    </div>
    <div className="text-right">
      <div className="text-[10px] font-bold text-emerald-400 uppercase leading-none mb-1">{matches} Matches Found</div>
      <div className="text-[9px] text-gray-600 font-mono">{date}</div>
    </div>
  </div>
);

const CapacityMiniRow: React.FC<{ label: string; utilization: number; artists: number; trend: string }> = ({ label, utilization, artists, trend }) => (
  <div className="space-y-2 text-left">
    <div className="flex justify-between text-[10px] font-bold uppercase tracking-tight">
      <span className="text-gray-300">{label}</span>
      <span className={utilization > 90 ? 'text-mota-pink' : 'text-emerald-400'}>{utilization}% Utilized</span>
    </div>
    <div className="h-1.5 w-full bg-dark-base rounded-full overflow-hidden flex shadow-inner">
      <div className={`h-full transition-all duration-1000 ${utilization > 90 ? 'bg-mota-pink' : utilization > 75 ? 'bg-yellow-500' : 'bg-emerald-400'}`} style={{ width: `${utilization}%` }}></div>
    </div>
    <div className="flex justify-between text-[9px] text-gray-600 font-mono uppercase">
       <span>{artists} Active Artists</span>
       <span className={trend === 'Critical' ? 'text-mota-pink' : 'text-gray-600'}>{trend}</span>
    </div>
  </div>
);
