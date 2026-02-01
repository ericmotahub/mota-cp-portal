
import React, { useState, useMemo } from 'react';
import { Talent, Engagement, Message } from '../types';

// --- RICH MOCK DATA (8 HIGH-FIDELITY ARTISTS) ---
const TALENTS: Talent[] = [
  { 
    id: 'SJ', name: 'Sarah Jenkins', title: 'Senior Nuke Compositor', experience: '8 Yrs Exp', yearsActive: 10, location: 'London', rate: '$650/day', skills: ['Nuke', 'Python', 'BlinkScript'], 
    deepTags: ['Deep Comp', '3D Tracking', 'Gizmo Dev', 'Pipeline API', 'OCIO Expert', 'BlinkScript'],
    availability: 'Available Now', memberStatus: 'ELITE', vettedBy: 'David Chen (VFX Supervisor)',
    bio: "Specializing in photoreal integration and complex lighting reconstruction. I build custom BlinkScript nodes to optimize high-volume sequence workflows.",
    motaIndex: { composite: 96, creative: 92, technical: 98, pipeline: 94 },
    links: { imdb: 'imdb.com/nm1234', linkedin: 'linkedin.com/in/sjenkins', portfolio: 'sjenkins.art', showreel: 'vimeo.com/8472910' }
  },
  { 
    id: 'DC', name: 'David Chen', title: 'Lead Compositor', experience: '12 Yrs Exp', yearsActive: 15, location: 'Remote', rate: '$750/day', skills: ['Nuke X', 'Deep Comp', 'CG Integ'], 
    deepTags: ['AOV Comp', 'Houdini Bridges', 'Lead Management', 'Project Packaging'],
    availability: 'In Production', memberStatus: 'VERIFIED', vettedBy: 'Sarah Connor (VFX Producer)',
    bio: "Lead with a focus on seamless CG-to-Plate integration. I manage teams of 10+ artists across global pipelines while maintaining high-end creative standards.",
    motaIndex: { composite: 94, creative: 89, technical: 96, pipeline: 98 },
    links: { linkedin: 'linkedin.com/in/dchen', showreel: 'vimeo.com/992281' }
  },
  { 
    id: 'MK', name: 'Marcus Knight', title: 'Senior FX Artist', experience: '10 Yrs Exp', yearsActive: 12, location: 'Vancouver', rate: '$700/day', skills: ['Houdini', 'Water', 'VEX'], 
    deepTags: ['Flip Sims', 'Crowd Sims', 'Vex Coding', 'DOPs Expert', 'USD Pipeline'],
    availability: 'Nov 15th', memberStatus: 'ELITE', vettedBy: 'Rick Park (VFX Producer)',
    bio: "Passionate about large-scale fluid simulations and custom procedural tools. Expert in VEX and building flexible asset-based FX setups.",
    motaIndex: { composite: 98, creative: 97, technical: 99, pipeline: 95 },
    links: { portfolio: 'mknightfx.com' }
  },
  {
    id: 'AL', name: 'Anna Lee', title: 'FX TD', experience: '6 Yrs Exp', yearsActive: 7, location: 'London', rate: '$600/day', skills: ['Houdini', 'Python', 'USD'],
    deepTags: ['KineFX', 'Solaris', 'Custom Solvers', 'Pipeline Integration'],
    availability: 'Available Now', memberStatus: 'VERIFIED', vettedBy: 'Marcus Knight (FX Lead)',
    bio: "Bridge between art and tech. I develop tools that empower artists to create complex sims without getting bogged down in the technical weeds.",
    motaIndex: { composite: 91, creative: 85, technical: 97, pipeline: 92 }
  },
  {
    id: 'EV', name: 'Elena Voronova', title: 'Matte Painter', experience: '9 Yrs Exp', yearsActive: 11, location: 'Dublin', rate: '$580/day', skills: ['Photoshop', 'Nuke', 'Maya'],
    deepTags: ['2.5D Projection', 'Env Design', 'Concept Art'],
    availability: 'Available Now', memberStatus: 'ELITE', vettedBy: 'Emily Zhang (Prod Manager)',
    bio: "Creating vast, believable worlds through a mix of traditional painting and modern 3D projection techniques.",
    motaIndex: { composite: 93, creative: 98, technical: 88, pipeline: 90 }
  },
  {
    id: 'SC', name: 'Sofia Cheng', title: 'Pipeline TD', experience: '12 Yrs Exp', yearsActive: 15, location: 'Dublin', rate: '$850/day', skills: ['Python', 'C++', 'Maya API'],
    deepTags: ['USD Expert', 'Cloud Rendering', 'Database Architecture'],
    availability: 'In Production', memberStatus: 'ELITE', vettedBy: 'David Chen (CTO)',
    bio: "Architecting the future of global production pipelines.",
    motaIndex: { composite: 99, creative: 82, technical: 100, pipeline: 100 }
  },
  {
    id: 'RP', name: 'Rick Park', title: 'Senior Animator', experience: '9 Yrs Exp', yearsActive: 11, location: 'Remote', rate: '$680/day', skills: ['Maya', 'ShotGrid', 'Ziva'],
    deepTags: ['Creature Performance', 'Facial Rigging', 'Physics-based Anim'],
    availability: 'Dec 1st', memberStatus: 'VERIFIED', vettedBy: 'James Miller (VFX Sup)',
    bio: "Character performance specialist with a background in traditional stop-motion and modern CG physics.",
    motaIndex: { composite: 88, creative: 95, technical: 84, pipeline: 82 }
  },
  {
    id: 'JM', name: 'Julian Moretti', title: 'Lighting Lead', experience: '14 Yrs Exp', yearsActive: 16, location: 'London', rate: '$800/day', skills: ['Katana', 'Arnold', 'RenderMan'],
    deepTags: ['LookDev', 'Sequence Lighting', 'Cloud Rendering'],
    availability: 'Available Now', memberStatus: 'ELITE', vettedBy: 'Sarah Connor (VFX Producer)',
    bio: "Master of light and mood. I bridge the gap between technical render optimization and high-level creative vision.",
    motaIndex: { composite: 97, creative: 99, technical: 94, pipeline: 91 }
  }
];

const OPEN_POSITIONS = [
  { id: 'p1', show: 'Project Alpha', role: 'Senior Nuke Comp', count: 4, urgency: 'High', hub: 'London' },
  { id: 'p1b', show: 'Project Alpha', role: 'Lighting Lead', count: 1, urgency: 'Critical', hub: 'London' },
  { id: 'pt', show: 'Project Titan', role: 'Lead Compositor', count: 2, urgency: 'Medium', hub: 'Remote' },
  { id: 'nh', show: 'Neon Horizon', role: 'FX TD', count: 3, urgency: 'High', hub: 'Dublin' },
];

const SHOWS = ["Project Alpha", "Project Titan", "Neon Horizon"];

type ResourceTab = 'DISCOVERY' | 'LEDGER' | 'RESOURCE_MAP' | 'ENGAGEMENTS' | 'SCENARIO_LAB';
type GroupBy = 'None' | 'Discipline' | 'Hub' | 'Status';
type ViewMode = 'grid' | 'table';

interface SimulatedHire {
  talentId: string;
  roleId: string;
  startWeek: number;
  duration: number;
}

export const TalentSearch: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ResourceTab>('DISCOVERY');
  const [searchQuery, setSearchQuery] = useState('');
  const [groupBy, setGroupBy] = useState<GroupBy>('None');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [selectedTalentId, setSelectedTalentId] = useState<string | null>(null);
  
  // Simulation State
  const [activeShow, setActiveShow] = useState(SHOWS[0]);
  const [simulatedHires, setSimulatedHires] = useState<SimulatedHire[]>([]);

  // Engagement State
  const [engagements, setEngagements] = useState<Record<string, Engagement>>({
    'DC': {
      talentId: 'DC', status: 'CONTRACTED', lastActivity: new Date().toISOString(),
      messages: [
        { id: 'm1', sender: 'STUDIO', text: 'Hey David, the lighting dailies for Titan looked incredible. The Solaris bridge seems to be holding up well.', timestamp: '2024-10-14T09:00:00Z', type: 'TEXT' },
        { id: 'm2', sender: 'ARTIST', text: 'Thanks! Yeah, the USD overrides are working much better now. Ideas for volumetric passes tomorrow.', timestamp: '2024-10-14T10:15:00Z', type: 'TEXT' }
      ]
    },
    'SJ': {
      talentId: 'SJ', status: 'OFFER_SENT', lastActivity: new Date().toISOString(),
      messages: [
        { id: 'm1', sender: 'STUDIO', text: 'Sarah, the team loved your BlinkScript nodes. We are officially issuing an offer for the Lead role on Alpha.', timestamp: '2024-10-15T14:00:00Z', type: 'TEXT' },
        { id: 'offer-1', sender: 'STUDIO', text: 'Vertex VFX: Formal Offer Issued', timestamp: '2024-10-15T16:20:00Z', type: 'OFFER', offerData: { show: 'Project Alpha', role: 'Lead Compositor', rate: '$700/day', dates: 'Nov 1st - Feb 28th', status: 'PENDING' } }
      ]
    },
    'MK': {
      talentId: 'MK', status: 'CHATTING', lastActivity: new Date().toISOString(),
      messages: [
        { id: 'm1', sender: 'STUDIO', text: 'Marcus, any experience with the adaptive FLIP solvers we have in our USD pipeline?', timestamp: '2024-10-16T11:00:00Z', type: 'TEXT' },
        { id: 'm2', sender: 'ARTIST', text: 'Absolutely. Refined a similar solver for a feature last year. Porting to Vertex pipeline is easy.', timestamp: '2024-10-16T11:12:00Z', type: 'TEXT' }
      ]
    }
  });

  const filteredTalents = useMemo(() => {
    return TALENTS.filter(t => 
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
      t.deepTags?.some(d => d.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [searchQuery]);

  const groupedTalents = useMemo(() => {
    if (groupBy === 'None') return { 'All Artists': filteredTalents };
    const groups: Record<string, Talent[]> = {};
    filteredTalents.forEach(t => {
      let key = groupBy === 'Discipline' ? t.title.split(' ').pop() || 'Other' :
                groupBy === 'Hub' ? t.location :
                groupBy === 'Status' ? t.memberStatus : 'Other';
      if (!groups[key]) groups[key] = [];
      groups[key].push(t);
    });
    return groups;
  }, [filteredTalents, groupBy]);

  const handleConnect = (talentId: string) => {
    if (!engagements[talentId]) {
      setEngagements(prev => ({
        ...prev,
        [talentId]: {
          talentId, status: 'CHATTING', lastActivity: new Date().toISOString(),
          messages: [{ id: `msg-${Date.now()}`, sender: 'STUDIO', text: "Hi, we're building a new team and your technical background in custom solvers is a great fit. Availability for Nov?", timestamp: new Date().toISOString(), type: 'TEXT' }]
        }
      }));
    }
    setActiveTab('ENGAGEMENTS');
    setSelectedTalentId(null);
  };

  const addSimulatedHire = (talentId: string, roleId: string) => {
    if (simulatedHires.find(h => h.talentId === talentId && h.roleId === roleId)) return;
    setSimulatedHires([...simulatedHires, { talentId, roleId, startWeek: 2, duration: 8 }]);
  };

  return (
    <div className="flex flex-col h-full bg-dark-base overflow-hidden">
      <header className="px-8 pt-8 pb-4 border-b border-dark-border bg-dark-surface/20">
        <div className="flex justify-between items-end mb-6 max-w-[1600px] mx-auto">
          <div className="text-left">
            <h1 className="text-4xl font-oswald font-bold uppercase tracking-tight text-white leading-none">Resource Suite</h1>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.4em] mt-2">Global Operational Intel</p>
          </div>
          <div className="flex bg-dark-base p-1 rounded-xl border border-dark-border">
            <SubNavTab active={activeTab === 'DISCOVERY'} onClick={() => setActiveTab('DISCOVERY')} label="Discovery" icon="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            <SubNavTab active={activeTab === 'LEDGER'} onClick={() => setActiveTab('LEDGER')} label="Ledger" icon="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7" />
            <SubNavTab active={activeTab === 'RESOURCE_MAP'} onClick={() => setActiveTab('RESOURCE_MAP')} label="Heat Map" icon="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            <SubNavTab active={activeTab === 'SCENARIO_LAB'} onClick={() => setActiveTab('SCENARIO_LAB')} label="Scenario Lab" icon="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" highlight />
            <SubNavTab active={activeTab === 'ENGAGEMENTS'} onClick={() => setActiveTab('ENGAGEMENTS')} label="HQ / Inbox" icon="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-hidden">
        {activeTab === 'DISCOVERY' && (
          <DiscoveryView searchQuery={searchQuery} setSearchQuery={setSearchQuery} groupedTalents={groupedTalents} groupBy={groupBy} setGroupBy={setGroupBy} viewMode={viewMode} setViewMode={setViewMode} onSelectTalent={setSelectedTalentId} />
        )}
        {activeTab === 'LEDGER' && (
          <CrewLedgerView talents={TALENTS} engagements={engagements} onChat={handleConnect} onSelect={setSelectedTalentId} />
        )}
        {activeTab === 'RESOURCE_MAP' && (
          <ResourceMapView />
        )}
        {activeTab === 'ENGAGEMENTS' && (
          <EngagementsView engagements={engagements} setEngagements={setEngagements} talents={TALENTS} />
        )}
        {activeTab === 'SCENARIO_LAB' && (
          <ScenarioLabView activeShow={activeShow} setActiveShow={setActiveShow} simulatedHires={simulatedHires} setSimulatedHires={setSimulatedHires} talents={TALENTS} onAddTalent={() => setActiveTab('DISCOVERY')} />
        )}
      </div>

      {selectedTalentId && (
        <TalentProfileOverlay 
          talent={TALENTS.find(t => t.id === selectedTalentId)!} 
          onClose={() => setSelectedTalentId(null)} 
          onConnect={() => handleConnect(selectedTalentId)}
          onOffer={(s, r, rt, d) => {
            setEngagements(prev => ({
              ...prev,
              [selectedTalentId]: {
                ...(prev[selectedTalentId] || { talentId: selectedTalentId, status: 'CHATTING', lastActivity: '', messages: [] }),
                status: 'OFFER_SENT',
                lastActivity: new Date().toISOString(),
                messages: [...(prev[selectedTalentId]?.messages || []), {
                  id: `offer-${Date.now()}`, sender: 'STUDIO', text: `Formal Offer issued for ${s}`, timestamp: new Date().toISOString(), type: 'OFFER',
                  offerData: { show: s, role: r, rate: rt, dates: d, status: 'PENDING' }
                }]
              }
            }));
            setActiveTab('ENGAGEMENTS');
            setSelectedTalentId(null);
          }}
          onSimulate={() => {
            addSimulatedHire(selectedTalentId, 'pos-1');
            setActiveTab('SCENARIO_LAB');
            setSelectedTalentId(null);
          }}
        />
      )}
    </div>
  );
};

// --- DISCOVERY VIEW ---
const DiscoveryView: React.FC<{ searchQuery: string; setSearchQuery: (v: string) => void; groupedTalents: Record<string, Talent[]>; groupBy: GroupBy; setGroupBy: (g: GroupBy) => void; viewMode: ViewMode; setViewMode: (v: ViewMode) => void; onSelectTalent: (id: string) => void }> = ({ searchQuery, setSearchQuery, groupedTalents, groupBy, setGroupBy, viewMode, setViewMode, onSelectTalent }) => (
  <div className="flex h-full animate-in fade-in duration-500">
    <div className="w-80 border-r border-dark-border p-6 bg-dark-base/50 space-y-8 overflow-y-auto shrink-0 custom-scrollbar text-left">
      <div className="space-y-6">
        <h3 className="text-[10px] font-black text-mota-pink uppercase tracking-widest border-b border-dark-border pb-3">Open Strategic Gaps</h3>
        <div className="space-y-3">
          {OPEN_POSITIONS.map(pos => (
            <div key={pos.id} className="p-3 bg-dark-surface/50 border border-dark-border rounded-xl group hover:border-mota-pink transition-all cursor-pointer">
              <div className="text-[9px] font-bold text-gray-500 uppercase mb-1">{pos.show}</div>
              <div className="text-xs font-bold text-white uppercase">{pos.role}</div>
              <div className="flex justify-between items-center mt-2">
                 <span className="text-[8px] font-black text-mota-pink uppercase tracking-widest">{pos.urgency}</span>
                 <span className="text-[8px] font-bold text-gray-600 uppercase">{pos.hub}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <FilterGroup title="Hub Mobility" options={['London', 'Dublin', 'Remote', 'Vancouver', 'LA']} />
      <FilterGroup title="Discipline" options={['Compositing', 'FX', 'Animation', 'Lighting', 'Pipeline']} />
      <FilterGroup title="Status" options={['ELITE', 'VERIFIED', 'STANDARD']} />
    </div>

    <div className="flex-1 flex flex-col">
      <div className="px-8 py-6 border-b border-dark-border bg-dark-base flex items-center justify-between sticky top-0 z-10 backdrop-blur-md">
        <div className="flex-1 max-w-2xl relative">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input type="text" placeholder="Search by Artist, tech tag (e.g. 'Katana')..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-dark-surface border border-dark-border rounded-2xl pl-12 pr-6 py-3 text-sm text-white focus:outline-none focus:border-mota-pink transition-all" />
        </div>
        <div className="flex items-center gap-6">
           <div className="flex items-center gap-2">
             <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Group:</span>
             <select value={groupBy} onChange={(e) => setGroupBy(e.target.value as GroupBy)} className="bg-dark-surface border border-dark-border rounded-lg px-3 py-1 text-[10px] font-bold uppercase text-gray-300 outline-none">
               <option value="None">None</option>
               <option value="Discipline">Discipline</option>
               <option value="Hub">Hub</option>
               <option value="Status">Status</option>
             </select>
           </div>
           <div className="flex bg-dark-surface p-1 rounded-xl border border-dark-border shadow-inner">
             <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-mota-pink text-dark-base' : 'text-gray-500'}`}><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg></button>
             <button onClick={() => setViewMode('table')} className={`p-1.5 rounded-lg transition-all ${viewMode === 'table' ? 'bg-mota-pink text-dark-base' : 'text-gray-500'}`}><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg></button>
           </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
        <div className="max-w-[1400px] mx-auto space-y-12">
          {Object.entries(groupedTalents).map(([groupName, talents]) => (
            <section key={groupName} className="space-y-4 text-left">
              {groupBy !== 'None' && <h2 className="text-xs font-black text-gray-400 uppercase tracking-[0.3em] mb-4 border-b border-dark-border pb-2">{groupName}</h2>}
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 gap-4">
                  {talents.map(talent => <EnhancedTalentCard key={talent.id} talent={talent} onSelect={() => onSelectTalent(talent.id)} />)}
                </div>
              ) : (
                <div className="bg-dark-surface/30 border border-dark-border rounded-2xl overflow-hidden shadow-xl">
                  <table className="w-full text-left">
                    <thead className="bg-dark-base/50 text-[10px] uppercase font-bold text-gray-500 border-b border-dark-border">
                      <tr><th className="px-6 py-4">Artist</th><th className="px-6 py-4">Title</th><th className="px-6 py-4">Status</th><th className="px-6 py-4 text-center">Mota Index</th><th className="px-6 py-4 text-right">Action</th></tr>
                    </thead>
                    <tbody className="divide-y divide-dark-border/40 text-sm">
                      {talents.map(talent => (
                        <tr key={talent.id} className="hover:bg-white/5 group cursor-pointer" onClick={() => onSelectTalent(talent.id)}>
                          <td className="px-6 py-4 flex items-center gap-3"><div className="w-8 h-8 rounded-lg bg-dark-base border border-dark-border flex items-center justify-center font-oswald text-xs group-hover:text-mota-pink">{talent.id}</div><span className="font-bold group-hover:text-mota-pink transition-colors">{talent.name}</span></td>
                          <td className="px-6 py-4 text-xs text-gray-400 font-medium">{talent.title}</td>
                          <td className="px-6 py-4"><span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${talent.memberStatus === 'ELITE' ? 'bg-mota-pink text-dark-base' : 'bg-gray-700 text-gray-400'}`}>{talent.memberStatus}</span></td>
                          <td className="px-6 py-4 text-center font-oswald text-white">{talent.motaIndex.composite}%</td>
                          <td className="px-6 py-4 text-right"><button className="text-[10px] font-bold text-mota-pink uppercase tracking-widest hover:underline">View Profile &rarr;</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// --- CREW LEDGER VIEW ---
const CrewLedgerView: React.FC<{ talents: Talent[]; engagements: Record<string, Engagement>; onChat: (id: string) => void; onSelect: (id: string) => void }> = ({ talents, engagements, onChat, onSelect }) => {
  const statusColors: Record<string, string> = {
    'NEW_SCOUT': 'bg-gray-800 text-gray-500',
    'CHATTING': 'bg-blue-500 text-dark-base',
    'OFFER_SENT': 'bg-yellow-500 text-dark-base',
    'CONTRACTED': 'bg-emerald-500 text-dark-base'
  };
  const getStatus = (id: string) => engagements[id]?.status || 'NEW_SCOUT';
  const getProjectTag = (id: string) => {
    if (id === 'DC') return 'PROJECT TITAN';
    if (id === 'SJ') return 'PROJECT ALPHA';
    if (id === 'SC') return 'NEON HORIZON';
    return '--';
  };
  const getDuration = (id: string) => {
    if (id === 'DC') return '12 Wks Remaining';
    if (id === 'SJ') return 'Pending Start';
    if (id === 'SC') return '24 Wks (Prep)';
    return '--';
  };
  return (
    <div className="h-full flex flex-col p-8 overflow-hidden animate-in fade-in duration-500">
      <div className="bg-dark-surface/30 rounded-[2rem] border border-dark-border flex-1 overflow-hidden flex flex-col shadow-2xl">
        <header className="px-8 py-6 border-b border-dark-border bg-dark-base/50 flex justify-between items-center text-left">
          <div className="flex gap-4 items-center">
            <h3 className="text-xl font-oswald font-bold uppercase tracking-tight">Studio Resource Ledger</h3>
            <span className="text-[10px] text-gray-600 font-bold uppercase tracking-widest leading-none">Global Active Pool</span>
          </div>
          <button className="bg-mota-pink text-dark-base px-6 py-2 rounded-lg text-[10px] font-bold uppercase shadow-lg shadow-mota-pink/20">Audit Payroll Sync</button>
        </header>
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead className="bg-dark-base/30 text-[9px] uppercase font-black text-gray-600 tracking-widest sticky top-0 z-10 backdrop-blur-md">
              <tr>
                <th className="px-8 py-5 border-b border-dark-border">Artist</th>
                <th className="px-8 py-5 border-b border-dark-border">Primary Discipline</th>
                <th className="px-8 py-5 border-b border-dark-border">Project Tag</th>
                <th className="px-8 py-5 border-b border-dark-border">Contract Duration</th>
                <th className="px-8 py-5 border-b border-dark-border">Operational Status</th>
                <th className="px-8 py-5 border-b border-dark-border text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-border/40">
              {talents.map(t => (
                <tr key={t.id} className="hover:bg-white/5 group transition-colors">
                  <td className="px-8 py-6 cursor-pointer" onClick={() => onSelect(t.id)}>
                    <div className="flex items-center gap-4 text-left">
                      <div className="w-10 h-10 rounded-xl bg-dark-base border border-dark-border flex items-center justify-center font-oswald font-bold text-gray-600 group-hover:text-mota-pink">{t.id}</div>
                      <div>
                        <div className="text-sm font-bold text-white group-hover:text-mota-pink">{t.name}</div>
                        <div className="text-[9px] text-gray-500 uppercase font-bold tracking-widest">{t.location}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-xs text-gray-400 font-medium uppercase text-left">{t.title}</td>
                  <td className="px-8 py-6 text-left">
                    <span className="px-2 py-1 bg-mota-pink/10 border border-mota-pink/20 rounded text-[9px] font-black text-mota-pink uppercase tracking-widest">{getProjectTag(t.id)}</span>
                  </td>
                  <td className="px-8 py-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-left">{getDuration(t.id)}</td>
                  <td className="px-8 py-6 text-left">
                    <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest shadow-inner ${statusColors[getStatus(t.id)]}`}>
                      {getStatus(t.id).replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button onClick={() => onChat(t.id)} className="p-2 bg-dark-base border border-dark-border rounded-lg text-gray-400 hover:text-mota-pink hover:border-mota-pink transition-all opacity-0 group-hover:opacity-100">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// --- HEAT MAP VIEW ---
const ResourceMapView: React.FC = () => {
  const departments = ['COMPOSITING', 'FX', 'ANIMATION', 'LIGHTING', 'ENVIRONMENTS'];
  const locations = ['London', 'Dublin', 'Remote', 'Vancouver', 'LA'];
  return (
    <div className="h-full p-8 overflow-y-auto custom-scrollbar animate-in slide-in-from-bottom-4 duration-500">
      <div className="max-w-[1600px] mx-auto space-y-12">
        <section className="text-left">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h3 className="text-2xl font-oswald font-bold uppercase text-white">Global Discipline Load Heat Map</h3>
              <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">Cross-Hub Capacity Visualization</p>
            </div>
            <div className="flex gap-4">
              <Legend color="bg-emerald-500" label="Surplus" />
              <Legend color="bg-yellow-500" label="Nominal" />
              <Legend color="bg-mota-pink" label="Shortfall" />
            </div>
          </div>
          <div className="bg-dark-surface/30 rounded-[2rem] border border-dark-border p-10 shadow-2xl overflow-x-auto">
            <div className="grid grid-cols-6 gap-6 min-w-[1000px]">
              <div className="h-10"></div>
              {locations.map(loc => (<div key={loc} className="text-[10px] font-black text-gray-500 uppercase tracking-widest text-center">{loc}</div>))}
              {departments.map(dept => (
                <React.Fragment key={dept}>
                  <div className="flex items-center text-[10px] font-black text-gray-400 uppercase tracking-tight h-16 border-r border-dark-border/20">{dept}</div>
                  {locations.map(loc => {
                    const heatValue = Math.random();
                    const color = heatValue > 0.7 ? 'bg-mota-pink' : heatValue > 0.4 ? 'bg-yellow-500' : 'bg-emerald-500';
                    return (
                      <div key={`${dept}-${loc}`} className={`h-16 rounded-2xl ${color} opacity-40 hover:opacity-100 transition-all cursor-pointer flex items-center justify-center border border-white/5 group`}>
                         <span className="text-[9px] font-mono font-black text-dark-base opacity-0 group-hover:opacity-100">{(heatValue * 100).toFixed(0)}% LOAD</span>
                      </div>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
          </div>
        </section>
        <section className="grid grid-cols-3 gap-8">
           <HeatDetailCard title="London Hub" status="Critical" stat="92% Utilized" sub="Requires +12 Comp Leads by Nov" />
           <HeatDetailCard title="Dublin Hub" status="Healthy" stat="65% Utilized" sub="Capacity for +18 episodic artists" />
           <HeatDetailCard title="Remote Pool" status="Scaling" stat="840 Verified" sub="Active recruiting in BC / ON zones" />
        </section>
      </div>
    </div>
  );
};

// --- ENGAGEMENTS VIEW ---
const EngagementsView: React.FC<{ engagements: Record<string, Engagement>; setEngagements: any; talents: Talent[] }> = ({ engagements, setEngagements, talents }) => {
  const [selectedThread, setSelectedThread] = useState<string | null>(Object.keys(engagements)[0] || null);
  const [inboxFilter, setInboxFilter] = useState<'ALL' | 'NEGOTIATING' | 'OFFERS' | 'CONTRACTS'>('ALL');
  const [msgInput, setMsgInput] = useState('');
  const activeThread = selectedThread ? engagements[selectedThread] : null;
  const activeTalent = selectedThread ? talents.find(t => t.id === selectedThread) : null;
  const filteredThreads = useMemo(() => {
    const list = Object.values(engagements);
    if (inboxFilter === 'ALL') return list;
    if (inboxFilter === 'NEGOTIATING') return list.filter(e => e.status === 'CHATTING');
    if (inboxFilter === 'OFFERS') return list.filter(e => e.status === 'OFFER_SENT');
    if (inboxFilter === 'CONTRACTS') return list.filter(e => e.status === 'CONTRACTED');
    return list;
  }, [engagements, inboxFilter]);
  const sendMessage = () => {
    if (!msgInput.trim() || !selectedThread) return;
    const thread = engagements[selectedThread];
    const newMsg: Message = { id: `msg-${Date.now()}`, sender: 'STUDIO', text: msgInput, timestamp: new Date().toISOString(), type: 'TEXT' };
    setEngagements(prev => ({ ...prev, [selectedThread]: { ...thread, messages: [...thread.messages, newMsg], lastActivity: new Date().toISOString() } }));
    setMsgInput('');
  };
  return (
    <div className="h-full flex animate-in fade-in duration-500 overflow-hidden text-left">
      <div className="w-80 border-r border-dark-border bg-dark-base flex flex-col shrink-0">
        <div className="p-6 border-b border-dark-border bg-dark-surface/10 space-y-4">
          <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest">Global Communications</h3>
          <div className="flex flex-wrap gap-2">
            <FilterChip active={inboxFilter === 'ALL'} onClick={() => setInboxFilter('ALL')} label="All" />
            <FilterChip active={inboxFilter === 'NEGOTIATING'} onClick={() => setInboxFilter('NEGOTIATING')} label="Negotiating" />
            <FilterChip active={inboxFilter === 'OFFERS'} onClick={() => setInboxFilter('OFFERS')} label="Offers" />
            <FilterChip active={inboxFilter === 'CONTRACTS'} onClick={() => setInboxFilter('CONTRACTS')} label="Active" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {filteredThreads.map(eng => {
            const talent = talents.find(t => t.id === eng.talentId);
            const lastMsg = eng.messages[eng.messages.length - 1];
            return (
              <button key={eng.talentId} onClick={() => setSelectedThread(eng.talentId)} className={`w-full p-5 text-left border-b border-dark-border/40 transition-all ${selectedThread === eng.talentId ? 'bg-mota-pink/10 border-l-4 border-l-mota-pink shadow-inner' : 'hover:bg-white/5'}`}>
                <div className="flex justify-between items-start mb-1"><span className="text-sm font-bold text-white uppercase font-oswald tracking-tight">{talent?.name}</span><span className="text-[8px] text-gray-500 font-mono">12:45</span></div>
                <div className="text-[9px] text-gray-600 uppercase font-bold truncate mb-2">{talent?.title}</div>
                <div className="text-[10px] text-gray-400 truncate italic opacity-60">{lastMsg?.sender === 'STUDIO' ? 'You: ' : ''}{lastMsg?.text}</div>
              </button>
            );
          })}
        </div>
      </div>
      {activeThread ? (
        <div className="flex-1 flex flex-col bg-dark-surface/5 overflow-hidden">
          <header className="p-6 border-b border-dark-border bg-dark-base flex justify-between items-center backdrop-blur-md">
            <div className="flex items-center gap-4 text-left">
              <div className="w-12 h-12 rounded-xl bg-mota-pink text-dark-base flex items-center justify-center font-oswald font-bold text-2xl shadow-xl">{activeTalent?.id}</div>
              <div><h3 className="text-xl font-bold text-white uppercase font-oswald leading-none tracking-tight">{activeTalent?.name}</h3><div className="flex items-center gap-2 mt-1"><span className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">{activeTalent?.availability}</span><span className="w-1 h-1 bg-gray-700 rounded-full"></span><span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{activeTalent?.memberStatus} Artist</span></div></div>
            </div>
          </header>
          <div className="flex-1 overflow-y-auto p-12 space-y-8 custom-scrollbar flex flex-col bg-dark-base/30">
            {activeThread.messages.map((m) => (
              <div key={m.id} className={`max-w-[70%] ${m.sender === 'STUDIO' ? 'self-end' : 'self-start'} text-left`}>
                {m.type === 'OFFER' ? (
                  <div className="bg-dark-surface border border-mota-pink/50 rounded-[2rem] overflow-hidden shadow-2xl p-10 space-y-6 relative group text-left">
                    <div className="flex justify-between items-center border-b border-dark-border/40 pb-6"><span className="text-[10px] font-black uppercase text-mota-pink tracking-[0.3em]">Vertex Production Engagement Offer</span><span className="text-[9px] font-mono text-gray-500">REF: {m.id}</span></div>
                    <div className="grid grid-cols-2 gap-x-12 gap-y-8">
                      <div><div className="text-[9px] text-gray-600 uppercase font-black mb-1">Show</div><div className="text-lg font-bold text-white font-oswald uppercase tracking-tight">{m.offerData?.show}</div></div>
                      <div><div className="text-[9px] text-gray-600 uppercase font-black mb-1">Role</div><div className="text-lg font-bold text-white font-oswald uppercase tracking-tight">{m.offerData?.role}</div></div>
                      <div><div className="text-[9px] text-gray-600 uppercase font-black mb-1">Day Rate</div><div className="text-2xl font-bold text-emerald-400 font-oswald">{m.offerData?.rate}</div></div>
                      <div><div className="text-[9px] text-gray-600 uppercase font-black mb-1">Dates</div><div className="text-lg font-bold text-white font-oswald tracking-tight">{m.offerData?.dates}</div></div>
                    </div>
                  </div>
                ) : (
                  <div className={`p-6 rounded-[1.5rem] text-sm leading-relaxed shadow-xl ${m.sender === 'STUDIO' ? 'bg-mota-pink text-dark-base rounded-tr-none' : 'bg-dark-surface text-gray-300 rounded-tl-none border border-dark-border'}`}>
                    {m.text}<div className={`text-[9px] mt-4 font-black uppercase tracking-widest ${m.sender === 'STUDIO' ? 'text-dark-base/50' : 'text-gray-600'}`}>{new Date(m.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="p-8 bg-dark-base border-t border-dark-border flex gap-4 shadow-2xl">
            <input type="text" value={msgInput} onChange={(e) => setMsgInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && sendMessage()} placeholder={`Type message to ${activeTalent?.name}...`} className="flex-1 h-12 bg-dark-surface border border-dark-border rounded-2xl px-6 text-sm text-white focus:outline-none focus:border-mota-pink transition-all" />
            <button onClick={sendMessage} className="h-12 bg-mota-pink text-dark-base px-10 rounded-2xl font-black uppercase text-[11px] tracking-[0.2em] shadow-2xl hover:scale-[1.02] transition-all">Dispatch</button>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center opacity-10 space-y-8">
           <svg className="w-32 h-32" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" strokeWidth={1} /></svg>
           <h2 className="text-3xl font-oswald font-bold uppercase tracking-[0.3em]">Operational Inbox Empty</h2>
        </div>
      )}
    </div>
  );
};

// --- SCENARIO LAB VIEW ---
const ScenarioLabView: React.FC<{ activeShow: string; setActiveShow: (s: string) => void; simulatedHires: SimulatedHire[]; setSimulatedHires: any; talents: Talent[]; onAddTalent: () => void }> = ({ activeShow, setActiveShow, simulatedHires, setSimulatedHires, talents, onAddTalent }) => {
  const weeks = Array.from({ length: 12 }).map((_, i) => `Wk ${i + 1}`);
  const roles = ["Lead Compositor", "FX TD", "Env Artist", "Lighting Lead"];
  
  return (
    <div className="h-full flex flex-col p-8 overflow-hidden animate-in fade-in duration-500 text-left">
      <div className="bg-dark-surface/30 rounded-[2rem] border border-dark-border flex-1 overflow-hidden flex flex-col shadow-2xl">
        <header className="px-8 py-6 border-b border-dark-border bg-dark-base/50 flex justify-between items-center">
          <div className="flex gap-10 items-center">
            <h3 className="text-xl font-oswald font-bold uppercase tracking-tight">Show Scenario Lab</h3>
            <div className="flex gap-4">
              {SHOWS.map(s => (
                <button key={s} onClick={() => setActiveShow(s)} className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${activeShow === s ? 'bg-mota-pink text-dark-base' : 'bg-dark-base text-gray-500 hover:text-white border border-dark-border'}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-3">
             <button onClick={onAddTalent} className="bg-dark-base border border-dark-border text-white px-5 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:border-mota-pink transition-all">+ Simulate Talent</button>
             <button className="bg-mota-pink text-dark-base px-6 py-2 rounded-lg text-[10px] font-bold uppercase shadow-lg shadow-mota-pink/20">Analyze Budget Impact</button>
          </div>
        </header>

        <div className="flex-1 overflow-auto custom-scrollbar p-8">
          <div className="min-w-[1200px]">
            <div className="grid grid-cols-13 gap-1 mb-6">
              <div className="col-span-2"></div>
              {weeks.map(wk => (
                <div key={wk} className="text-center text-[9px] font-black text-gray-600 uppercase tracking-widest">{wk}</div>
              ))}
            </div>
            
            <div className="space-y-4">
              {roles.map((role, idx) => (
                <div key={role} className="grid grid-cols-13 gap-1 h-14 items-center group">
                  <div className="col-span-2 text-[10px] font-bold text-gray-400 uppercase tracking-tighter pr-4 border-r border-dark-border/40 h-full flex items-center">
                    {role}
                  </div>
                  <div className="col-span-11 relative h-10 bg-dark-base/20 rounded-xl border border-dark-border/20 shadow-inner group-hover:border-dark-border transition-all">
                     {simulatedHires.map((hire, hIdx) => {
                       const talent = talents.find(t => t.id === hire.talentId);
                       // Simple heuristic mapping to roles for simulation
                       if ((idx === 0 && talent?.title.includes('Lead')) || (idx === 1 && talent?.title.includes('FX')) || (idx === 2 && talent?.title.includes('Matte')) || (idx === 3 && talent?.title.includes('Lighting'))) {
                         return (
                           <div 
                             key={hIdx} 
                             className="absolute h-full bg-mota-pink/40 border border-mota-pink/60 rounded-lg flex items-center px-4 cursor-move group/hire hover:bg-mota-pink hover:scale-[1.01] transition-all z-10"
                             style={{ left: `${(hire.startWeek / 11) * 100}%`, width: `${(hire.duration / 11) * 100}%` }}
                           >
                             <div className="flex items-center gap-3">
                               <div className="w-6 h-6 rounded-md bg-dark-base flex items-center justify-center font-oswald text-[10px] text-white">{talent?.id}</div>
                               <span className="text-[10px] font-black uppercase text-dark-base truncate">{talent?.name}</span>
                             </div>
                             <button 
                               onClick={() => setSimulatedHires(simulatedHires.filter((_, i) => i !== hIdx))} 
                               className="ml-auto opacity-0 group-hover/hire:opacity-100 p-1 hover:text-white transition-opacity"
                             >
                               <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth={3}/></svg>
                             </button>
                           </div>
                         );
                       }
                       return null;
                     })}
                     <div className="absolute inset-0 grid grid-cols-11 pointer-events-none">
                        {Array.from({length: 11}).map((_, i) => (
                          <div key={i} className="border-r border-dark-border/10 last:border-0 h-full"></div>
                        ))}
                     </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-8 border-t border-dark-border bg-dark-base/50 grid grid-cols-4 gap-8">
           <SimStat label="Blended Rate" value="$680/day" sub="Target: $700" color="text-emerald-400" />
           <SimStat label="Diversity Score" value="78%" sub="Regional Target Met" />
           <SimStat label="Global Rebate (Sim)" value="$420k" sub="+12% Efficiency" color="text-mota-pink" />
           <SimStat label="Scenario Margin" value="34.2%" sub="High Creative Fit" />
        </div>
      </div>
    </div>
  );
};

// --- TALENT PROFILE OVERLAY ---
const TalentProfileOverlay: React.FC<{ talent: Talent; onClose: () => void; onConnect: () => void; onOffer: (s: string, r: string, rt: string, d: string) => void; onSimulate: () => void }> = ({ talent, onClose, onConnect, onOffer, onSimulate }) => {
  return (
    <div className="fixed inset-y-0 right-0 w-[750px] bg-dark-surface border-l border-dark-border shadow-[0_0_100px_rgba(0,0,0,0.8)] z-[150] flex flex-col animate-in slide-in-from-right duration-500 text-left">
      <div className="p-6 border-b border-dark-border flex justify-between items-center bg-dark-base/80 backdrop-blur-xl">
        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-mota-pink border border-mota-pink/30 px-3 py-1 rounded bg-mota-pink/5 font-oswald">Comprehensive Artist Dossier</span>
        <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-gray-400 hover:text-white transition-all"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth={2}/></svg></button>
      </div>
      <div className="flex-1 overflow-y-auto p-12 custom-scrollbar space-y-16">
        <div className="flex gap-10 items-start">
          <div className="w-32 h-32 bg-mota-pink text-dark-base rounded-[2.5rem] flex items-center justify-center font-oswald text-5xl font-bold shadow-2xl shrink-0 ring-4 ring-dark-border/20">{talent.id}</div>
          <div className="flex-1 space-y-6">
            <div>
              <div className="flex items-center gap-4 mb-2">
                <h2 className="text-5xl font-oswald font-bold uppercase tracking-tight leading-none text-white">{talent.name}</h2>
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg ${talent.memberStatus === 'ELITE' ? 'bg-mota-pink text-dark-base' : 'bg-blue-500 text-white'}`}>{talent.memberStatus}</span>
              </div>
              <div className="text-2xl text-gray-400 font-light tracking-tight">{talent.title}</div>
            </div>
            <div className="flex gap-4 items-center">
               <span className="px-3 py-1.5 bg-dark-base border border-dark-border rounded-xl text-[10px] font-bold text-gray-400 uppercase tracking-widest">{talent.yearsActive} Yrs Exp</span>
               <span className="text-[12px] font-bold text-emerald-400 uppercase tracking-widest leading-none">{talent.availability}</span>
               <span className="text-[12px] font-bold text-gray-500 uppercase tracking-widest ml-auto">{talent.location}</span>
            </div>
          </div>
        </div>
        <section className="bg-dark-base/50 p-8 rounded-[2rem] border border-dark-border shadow-2xl">
          <div className="flex justify-between items-center mb-8"><h3 className="text-xs font-bold uppercase tracking-[0.3em] text-gray-500">Mota Performance Benchmarks</h3><span className="text-[10px] font-bold text-mota-pink uppercase tracking-widest">Percentile: {talent.motaIndex.composite}%</span></div>
          <div className="grid grid-cols-4 gap-8">
            <BenchmarkStat label="Composite" value={talent.motaIndex.composite} />
            <BenchmarkStat label="Creative" value={talent.motaIndex.creative} />
            <BenchmarkStat label="Technical" value={talent.motaIndex.technical} />
            <BenchmarkStat label="Pipeline" value={talent.motaIndex.pipeline} />
          </div>
        </section>
        <section className="space-y-6">
           <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-gray-500 border-b border-dark-border pb-2">Professional Summary</h3>
           <p className="text-lg text-gray-400 leading-relaxed font-light italic">"{talent.bio}"</p>
           <div className="p-6 bg-mota-pink/5 border border-mota-pink/20 rounded-2xl">
              <h4 className="text-[10px] font-bold text-mota-pink uppercase tracking-widest mb-2">Internal Vetting Note</h4>
              <p className="text-sm text-gray-500 leading-relaxed italic">"Verified by {talent.vettedBy}. Exceptional reliability rating."</p>
           </div>
        </section>
        <section>
          <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-gray-500 mb-6 border-b border-dark-border pb-2">Technical Core Breakdown</h3>
          <div className="flex flex-wrap gap-3">
            {talent.deepTags?.map(tag => (
              <span key={tag} className="px-4 py-2 bg-dark-base border border-dark-border rounded-xl text-[11px] font-bold text-gray-400 uppercase tracking-tighter hover:border-mota-pink transition-all shadow-lg">{tag}</span>
            ))}
          </div>
        </section>
      </div>
      <div className="p-10 bg-dark-base border-t border-dark-border flex gap-4 shadow-2xl relative z-10">
        <button onClick={onSimulate} className="bg-dark-surface border border-dark-border text-white font-bold py-5 px-6 rounded-[1.5rem] uppercase text-[11px] hover:border-mota-pink transition-all shadow-xl flex items-center gap-3">
           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2" strokeWidth={2}/></svg>
           Simulate In Lab
        </button>
        <button onClick={onConnect} className="flex-1 bg-dark-surface border border-dark-border text-white font-bold py-5 rounded-[1.5rem] uppercase text-[11px] hover:border-mota-pink transition-all shadow-xl">Connect / Chat</button>
        <button onClick={() => onOffer("Project Alpha", talent.title, talent.rate, "Nov 2024 - Feb 2025")} className="flex-1 bg-mota-pink text-dark-base font-black py-5 rounded-[1.5rem] uppercase text-[11px] shadow-2xl shadow-mota-pink/20 hover:scale-102 transition-all">Issue Direct Offer</button>
      </div>
    </div>
  );
};

// --- SUB-COMPONENTS ---
const SubNavTab: React.FC<{ active: boolean; onClick: () => void; label: string; icon: string; highlight?: boolean }> = ({ active, onClick, label, icon, highlight }) => (
  <button onClick={onClick} className={`px-6 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all flex items-center gap-3 ${active ? 'bg-mota-pink text-dark-base shadow-xl font-black' : highlight ? 'text-mota-pink border border-mota-pink/20 bg-mota-pink/5' : 'text-gray-500 hover:text-white'}`}>
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} /></svg>
    {label}
  </button>
);

const FilterGroup: React.FC<{ title: string; options: string[] }> = ({ title, options }) => (
  <div className="space-y-4 text-left"><h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] border-b border-dark-border pb-2">{title}</h3><div className="space-y-2.5">{options.map(opt => (<label key={opt} className="flex items-center gap-3 group cursor-pointer"><input type="checkbox" className="hidden" /><div className="w-4 h-4 border border-dark-border rounded group-hover:border-mota-pink transition-all flex items-center justify-center"><div className="w-1.5 h-1.5 rounded-sm bg-mota-pink opacity-0 group-has-[:checked]:opacity-100 transition-opacity"></div></div><span className="text-[11px] text-gray-500 group-hover:text-white transition-colors uppercase font-bold tracking-tight">{opt}</span></label>))}</div></div>
);

const EnhancedTalentCard: React.FC<{ talent: Talent; onSelect: () => void }> = ({ talent, onSelect }) => (
  <div onClick={onSelect} className="bg-dark-surface/40 p-6 rounded-2xl border border-dark-border flex items-center gap-8 group cursor-pointer hover:border-mota-pink transition-all shadow-xl relative overflow-hidden text-left">
    <div className="w-16 h-16 rounded-2xl bg-dark-base border border-dark-border flex items-center justify-center font-oswald font-bold text-gray-500 text-xl group-hover:bg-mota-pink group-hover:text-dark-base transition-all shrink-0">{talent.id}</div>
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-4 mb-2"><h3 className="text-xl font-oswald font-bold text-white uppercase tracking-tight group-hover:text-mota-pink transition-colors">{talent.name}</h3><span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest shadow-lg ${talent.memberStatus === 'ELITE' ? 'bg-mota-pink text-dark-base' : 'bg-blue-500 text-white'}`}>{talent.memberStatus}</span></div>
      <div className="flex items-center gap-3 text-[11px] text-gray-400 font-medium mb-4"><span className="text-white font-bold">{talent.title}</span><span className="w-1 h-1 bg-dark-border rounded-full"></span><span className="text-emerald-400 font-bold uppercase">{talent.availability}</span></div>
      <div className="flex flex-wrap gap-2">{(talent.deepTags?.slice(0, 4) || talent.skills).map(tag => (<span key={tag} className="px-2.5 py-1 bg-dark-base border border-dark-border rounded-lg text-[9px] font-bold text-gray-500 uppercase tracking-tighter">{tag}</span>))}</div>
    </div>
    <div className="flex gap-10 shrink-0 border-l border-dark-border/40 pl-8"><div className="text-center"><div className="text-[8px] text-gray-600 uppercase font-black mb-1">Mota Index</div><div className="text-3xl font-oswald font-bold text-white">{talent.motaIndex.composite}</div></div><div className="text-center"><div className="text-[8px] text-gray-600 uppercase font-black mb-1">Day Rate</div><div className="text-3xl font-oswald font-bold text-white">{talent.rate.split('/')[0]}</div></div></div>
  </div>
);

const BenchmarkStat: React.FC<{ label: string; value: number }> = ({ label, value }) => (
  <div className="space-y-3"><div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-gray-500"><span>{label}</span><span className="text-white">{value}%</span></div><div className="h-1 w-full bg-dark-surface rounded-full overflow-hidden shadow-inner"><div className="h-full bg-mota-pink shadow-[0_0_10px_#FF8585] transition-all duration-1000 ease-out" style={{ width: `${value}%` }}></div></div></div>
);

const FilterChip: React.FC<{ active: boolean; onClick: () => void; label: string }> = ({ active, onClick, label }) => (
  <button onClick={onClick} className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest transition-all border ${active ? 'bg-mota-pink text-dark-base border-mota-pink shadow-lg' : 'bg-dark-base text-gray-600 border-dark-border hover:border-gray-500'}`}>{label}</button>
);

const Legend: React.FC<{ color: string; label: string }> = ({ color, label }) => (
  <div className="flex items-center gap-2">
    <div className={`w-2.5 h-2.5 rounded ${color}`}></div>
    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{label}</span>
  </div>
);

const HeatDetailCard: React.FC<{ title: string; status: string; stat: string; sub: string }> = ({ title, status, stat, sub }) => (
  <div className="p-8 bg-dark-surface border border-dark-border rounded-[2rem] space-y-4 hover:border-mota-pink transition-all group shadow-xl text-left">
    <div className="flex justify-between items-center">
       <h4 className="text-xl font-oswald font-bold uppercase text-white group-hover:text-mota-pink">{title}</h4>
       <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${status === 'Critical' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'}`}>{status}</span>
    </div>
    <div><div className="text-2xl font-oswald font-bold text-white tracking-tight">{stat}</div><p className="text-xs text-gray-500 mt-2 italic font-medium">{sub}</p></div>
    <button className="w-full py-3 bg-dark-base border border-dark-border rounded-xl text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-white transition-all">Audit Hub Data &rarr;</button>
  </div>
);

const SimStat: React.FC<{ label: string; value: string; sub: string; color?: string }> = ({ label, value, sub, color = "text-white" }) => (
  <div className="text-left">
    <div className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-1">{label}</div>
    <div className={`text-2xl font-oswald font-bold ${color}`}>{value}</div>
    <div className="text-[10px] font-bold text-gray-600 uppercase tracking-tighter mt-1">{sub}</div>
  </div>
);
