
import React, { useState, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { TrackedOpportunity } from './PipelineManager';

interface ProjectHealthDashboardProps {
  opportunity: TrackedOpportunity;
}

const progressData = [
  { day: 'Day 1', actual: 0, target: 5 },
  { day: 'Day 10', actual: 45, target: 50 },
  { day: 'Day 20', actual: 110, target: 120 },
  { day: 'Day 30', actual: 190, target: 200 },
  { day: 'Day 40', actual: 285, target: 300 },
  { day: 'Day 50', actual: 390, target: 400 },
  { day: 'Day 60', actual: 442, target: 450 },
];

const financialData = [
  { category: 'Labor', actual: 2100000, budget: 2500000 },
  { category: 'Rendering', actual: 450000, budget: 300000 },
  { category: 'Overhead', actual: 800000, budget: 900000 },
  { category: 'Outsource', actual: 150000, budget: 500000 },
];

const MARGIN_HISTORY = [
  { month: 'Jan', margin: 24, target: 25 },
  { month: 'Feb', margin: 26, target: 25 },
  { month: 'Mar', margin: 25, target: 25 },
  { month: 'Apr', margin: 29, target: 25 },
  { month: 'May', margin: 31, target: 25 },
  { month: 'Jun', margin: 32.4, target: 25 },
];

const TALENT_REGISTRY = [
  { id: 'SJ', name: 'Sarah Jenkins', title: 'Senior Nuke Compositor', exp: '8y', loc: 'London', rate: '$650', tags: ['Nuke', 'Deep Comp'], dept: 'Compositing' },
  { id: 'DC', name: 'David Chen', title: 'Lead Compositor', exp: '12y', loc: 'Remote', rate: '$750', tags: ['Nuke X', 'Python'], dept: 'Compositing' },
  { id: 'MK', name: 'Marcus Knight', title: 'Senior FX Artist', exp: '10y', loc: 'Vancouver', rate: '$700', tags: ['Houdini', 'Water'], dept: 'Environment FX' },
  { id: 'AL', name: 'Anna Lee', title: 'FX TD', exp: '6y', loc: 'London', rate: '$600', tags: ['Houdini', 'Py'], dept: 'Environment FX' },
  { id: 'RP', name: 'Rick Park', title: 'Senior Animator', exp: '9y', loc: 'Remote', rate: '$680', tags: ['Maya', 'Creature'], dept: 'Creature Anim' },
];

export const ProjectHealthDashboard: React.FC<ProjectHealthDashboardProps> = ({ opportunity }) => {
  const [activeDeptSearch, setActiveDeptSearch] = useState<string | null>(null);
  const [showMarginDeepDive, setShowMarginDeepDive] = useState(false);

  const filteredTalent = useMemo(() => {
    if (!activeDeptSearch) return [];
    return TALENT_REGISTRY.filter(t => t.dept === activeDeptSearch);
  }, [activeDeptSearch]);

  const handleApplyToProject = (talentName: string) => {
     alert(`Engagement sequence initiated for ${talentName}. Connection available in Resource Suite > Engagements.`);
     setActiveDeptSearch(null);
  };

  return (
    <div className="p-10 space-y-10 max-w-[1400px] mx-auto animate-in fade-in zoom-in-95 duration-500 relative pb-24">
      <section className="bg-dark-surface/40 p-10 rounded-3xl border border-dark-border shadow-2xl backdrop-blur-md">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-oswald font-bold uppercase tracking-tight">Executive Financial Health</h2>
            <p className="text-xs text-gray-500 uppercase font-bold tracking-widest mt-1">Consolidated P&L Overview for {opportunity.entityName}</p>
          </div>
          <button className="bg-dark-base border border-dark-border px-6 py-3 rounded-xl text-xs font-bold uppercase hover:border-mota-pink transition-all">Audit Full Project Costs</button>
        </div>
        
        <div className="grid grid-cols-4 gap-10">
          <HealthStat label="Award Total" value="$4.2M" subValue="Contractual Gross" status="neutral" />
          <HealthStat label="Cost to Date" value="$2.85M" subValue="Verified Actuals" status="neutral" />
          <HealthStat label="Est. Global Rebate" value="$1.12M" subValue="Pending Collection" status="good" />
          <HealthStat label="Projected Margin" value="32.4%" subValue="Target: 25.0%" status="good" interactive onClick={() => setShowMarginDeepDive(true)} />
        </div>
      </section>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-8 bg-dark-surface p-8 rounded-2xl border border-dark-border shadow-2xl">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-oswald font-bold uppercase tracking-tight">Shot Delivery Velocity</h3>
          </div>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={progressData}>
                <defs>
                  <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF8585" stopOpacity={0.3}/><stop offset="95%" stopColor="#FF8585" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                <XAxis dataKey="day" stroke="#666" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#666" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #3d3d3d', borderRadius: '8px' }} />
                <Area type="monotone" dataKey="target" stroke="#444" fill="transparent" strokeWidth={2} strokeDasharray="5 5" />
                <Area type="monotone" dataKey="actual" stroke="#FF8585" fillOpacity={1} fill="url(#colorActual)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="col-span-4 space-y-6">
          <div className="bg-dark-surface p-6 rounded-2xl border border-dark-border h-full flex flex-col">
            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-6">Internal Leadership</h3>
            <div className="space-y-4 flex-1">
               <LeaderRow name="Sarah J." role="Bidding Producer" status="Active" />
               <LeaderRow name="Dave Chen" role="VFX Supervisor" status="On Set" />
               <LeaderRow name="Alex Parker" role="Production Manager" status="Active" />
            </div>
            <div className="mt-8 pt-8 border-t border-dark-border">
               <div className="p-4 bg-mota-pink/5 rounded-xl border border-mota-pink/20">
                  <p className="text-xs text-gray-400 leading-relaxed italic">"Success on {opportunity.entityName} is the gateway to the 3-picture deal discussed with Sony."</p>
               </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-8">
        <div className="bg-dark-surface p-8 rounded-2xl border border-dark-border">
          <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-6">Internal Cost Allocation</h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={financialData} layout="vertical">
                <XAxis type="number" hide /><YAxis dataKey="category" type="category" stroke="#999" fontSize={10} width={70} />
                <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #3d3d3d' }} />
                <Bar dataKey="budget" fill="#333" radius={[0, 4, 4, 0]} barSize={10} />
                <Bar dataKey="actual" fill="#FF8585" radius={[0, 4, 4, 0]} barSize={10} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-dark-surface p-8 rounded-2xl border border-dark-border">
           <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-6">Strategic Crew Needs</h3>
           <div className="space-y-6">
              <ResourceProgress label="Compositing" current={42} target={48} color="bg-mota-pink" onFill={() => setActiveDeptSearch('Compositing')} />
              <ResourceProgress label="Environment FX" current={24} target={20} color="bg-emerald-400" onFill={() => setActiveDeptSearch('Environment FX')} />
              <ResourceProgress label="Creature Anim" current={18} target={18} color="bg-blue-400" onFill={() => setActiveDeptSearch('Creature Anim')} />
           </div>
        </div>

        <div className="bg-dark-surface p-8 rounded-2xl border border-dark-border">
           <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-6">Executive Observations</h3>
           <div className="space-y-4">
              <ObservationItem type="RISK" title="Rendering Overages" desc="Creature fur sims are costing 20% more than bid." />
              <ObservationItem type="OPPORTUNITY" title="Sequel Scouting" desc="Client asking about Q3 2026 capacity." />
           </div>
        </div>
      </div>

      {activeDeptSearch && (
        <div className="fixed inset-y-0 right-0 w-[500px] bg-dark-surface border-l border-dark-border shadow-[0_0_100px_rgba(0,0,0,0.8)] z-[200] transform transition-transform animate-in slide-in-from-right duration-500 flex flex-col">
          <div className="p-6 border-b border-dark-border flex justify-between items-center bg-dark-base/80 backdrop-blur-md">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-mota-pink">Resource Fulfillment</div>
              <h2 className="text-xl font-oswald font-bold uppercase">Available for {activeDeptSearch}</h2>
            </div>
            <button onClick={() => setActiveDeptSearch(null)} className="p-2 hover:bg-white/5 rounded-full text-gray-400 hover:text-white transition-all"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" /></svg></button>
          </div>
          <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
            {filteredTalent.map(talent => (
              <div key={talent.id} className="p-5 bg-dark-base border border-dark-border rounded-xl hover:border-mota-pink transition-all group">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-dark-surface border border-dark-border flex items-center justify-center font-bold text-gray-500">{talent.id}</div>
                    <div><div className="text-sm font-bold">{talent.name}</div><div className="text-[10px] text-gray-500 uppercase">{talent.title}</div></div>
                  </div>
                  <div className="text-right"><div className="text-xs font-bold text-white">{talent.rate}/day</div></div>
                </div>
                <button 
                  onClick={() => handleApplyToProject(talent.name)}
                  className="w-full bg-mota-pink text-dark-base font-bold py-2 rounded text-[10px] uppercase shadow-lg shadow-mota-pink/10"
                >
                  Initiate Engagement for {opportunity.entityName}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// --- SUB-COMPONENTS ---
const HealthStat: React.FC<{ label: string; value: string; subValue: string; status: 'good' | 'warning' | 'neutral'; interactive?: boolean; onClick?: () => void }> = ({ label, value, subValue, status, interactive, onClick }) => {
  const statusColors = { good: 'text-emerald-400', warning: 'text-yellow-500', neutral: 'text-white' };
  return (
    <div className={`p-6 bg-dark-base/40 rounded-2xl border border-dark-border group transition-all ${interactive ? 'cursor-pointer hover:border-mota-pink hover:bg-mota-pink/5' : ''}`} onClick={onClick}>
      <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-2">{label}</div>
      <div className={`text-4xl font-oswald font-bold tracking-tight mb-1 ${statusColors[status]}`}>{value}</div>
      <div className="text-[11px] text-gray-500 font-medium uppercase">{subValue}</div>
    </div>
  );
};

const LeaderRow: React.FC<{ name: string; role: string; status: string }> = ({ name, role, status }) => (
  <div className="flex justify-between items-center py-2 border-b border-dark-border/50 last:border-0">
    <div><div className="text-sm font-bold text-white">{name}</div><div className="text-[10px] text-gray-500 uppercase">{role}</div></div>
    <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-dark-base border border-dark-border text-gray-400 uppercase">{status}</span>
  </div>
);

const ResourceProgress: React.FC<{ label: string; current: number; target: number; color: string; onFill?: () => void }> = ({ label, current, target, color, onFill }) => (
  <div className="space-y-2 group/res">
    <div className="flex justify-between text-[10px] font-bold uppercase tracking-tight">
      <div className="flex items-center gap-2"><span>{label}</span>{current < target && <button onClick={onFill} className="text-[8px] text-mota-pink opacity-0 group-hover/res:opacity-100 uppercase font-bold px-1.5 py-0.5 border border-mota-pink/20 rounded">Fill &rarr;</button>}</div>
      <span className="text-gray-500">{current} / {target} Crew</span>
    </div>
    <div className="h-1.5 w-full bg-dark-base rounded-full overflow-hidden flex">
      <div className={`h-full ${color} opacity-80`} style={{ width: `${Math.min(100, (current/target)*100)}%` }}></div>
    </div>
  </div>
);

const ObservationItem: React.FC<{ type: 'RISK' | 'OPPORTUNITY' | 'TECH'; title: string; desc: string }> = ({ type, title, desc }) => {
  const colors = { RISK: 'text-red-400 border-red-400/20 bg-red-400/5', OPPORTUNITY: 'text-emerald-400 border-emerald-400/20 bg-emerald-400/5', TECH: 'text-blue-400 border-blue-400/20 bg-blue-400/5' };
  return (
    <div className={`p-4 rounded-xl border ${colors[type]}`}>
      <div className="flex items-center gap-2 mb-1"><span className="text-[8px] font-bold uppercase tracking-widest">{type}</span><span className="text-white text-xs font-bold">— {title}</span></div>
      <p className="text-[11px] text-gray-400 leading-snug">{desc}</p>
    </div>
  );
};
