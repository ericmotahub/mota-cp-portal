
import React, { useState, useMemo } from 'react';
import { TrackedOpportunity, STATUS_CONFIG } from './PipelineManager';
import { InternalStatus } from '../types';
import { BidManager } from './BidManager';
import { ProjectHealthDashboard } from './ProjectHealthDashboard';
import { MASTER_DATA } from './BizDevCenter';

interface ProjectWorkroomProps {
  opportunity: TrackedOpportunity;
  onUpdateStatus: (id: string, internalStatus: InternalStatus) => void;
  onClose: () => void;
}

type WorkroomTab = 'OVERVIEW' | 'HEALTH' | 'BIDS' | 'NOTES' | 'CLIENT';

export const ProjectWorkroom: React.FC<ProjectWorkroomProps> = ({ opportunity, onUpdateStatus, onClose }) => {
  const [activeTab, setActiveTab] = useState<WorkroomTab>('OVERVIEW');
  const showHealth = opportunity.internalStatus === 'IN_PROD' || opportunity.internalStatus === 'AWARDED';

  // Source of Truth Intelligence lookup
  const projectMetadata = useMemo(() => {
    return MASTER_DATA.projects.find(p => p.title === opportunity.entityName || p.id === opportunity.entityId);
  }, [opportunity]);

  const personMetadata = useMemo(() => {
    if (opportunity.type === 'person') {
      return MASTER_DATA.people.find(p => p.name === opportunity.entityName || p.id === opportunity.entityId);
    }
    return null;
  }, [opportunity]);

  return (
    <div className="h-full flex flex-col bg-dark-base overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Area */}
      <header className="px-8 py-6 border-b border-dark-border bg-dark-surface/30 backdrop-blur-xl z-20">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-4">
            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-gray-400 hover:text-white transition-all">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-mota-pink bg-mota-pink/10 px-2 py-0.5 rounded">Workroom</span>
                <span className="text-gray-500 font-mono text-[10px] uppercase tracking-tighter">REF: {opportunity.entityId}</span>
              </div>
              <h1 className="text-4xl font-oswald font-bold uppercase tracking-tight leading-none">{opportunity.entityName}</h1>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Stage:</span>
              <select 
                value={opportunity.internalStatus}
                onChange={(e) => onUpdateStatus(opportunity.id, e.target.value as InternalStatus)}
                className={`bg-dark-base border border-dark-border rounded px-4 py-2 text-xs font-bold uppercase focus:outline-none focus:border-mota-pink transition-all ${STATUS_CONFIG[opportunity.internalStatus].color}`}
              >
                {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                  <option key={key} value={key}>{cfg.label}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-2">
              <button className="bg-dark-base border border-dark-border px-4 py-2 rounded text-[10px] font-bold uppercase hover:border-mota-pink transition-all">Global Sync</button>
              <button className="bg-mota-pink text-dark-base px-4 py-2 rounded text-[10px] font-bold uppercase shadow-lg shadow-mota-pink/20">
                {opportunity.status === 'CURRENT_PROJ' ? 'Manage Delivery' : 'Finalize Award'}
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-10">
          <TabButton active={activeTab === 'OVERVIEW'} onClick={() => setActiveTab('OVERVIEW')} label="Engagement Overview" />
          {showHealth && (
            <TabButton 
              active={activeTab === 'HEALTH'} 
              onClick={() => setActiveTab('HEALTH')} 
              label="Production Health" 
              highlight 
            />
          )}
          <TabButton active={activeTab === 'BIDS'} onClick={() => setActiveTab('BIDS')} label="Bid Manager" />
          <TabButton active={activeTab === 'NOTES'} onClick={() => setActiveTab('NOTES')} label="Team Discussion" />
          <TabButton active={activeTab === 'CLIENT'} onClick={() => setActiveTab('CLIENT')} label="Client Communications" />
        </div>
      </header>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden custom-scrollbar">
        {activeTab === 'OVERVIEW' && (
          <div className="p-10 max-w-7xl mx-auto space-y-12 overflow-y-auto h-full pb-20">
            <div className="grid grid-cols-4 gap-6">
              <WorkroomStat 
                label={opportunity.status === 'LEAD' ? 'Projected Rev' : 'Verified Award'} 
                value={opportunity.value || '$0'} 
                color={opportunity.status === 'CURRENT_PROJ' ? 'text-emerald-400' : 'text-white'} 
              />
              <WorkroomStat label="Win Probability" value={`${opportunity.probability || 0}%`} color="text-white" />
              <WorkroomStat label="Mota Fit Score" value={projectMetadata?.fit ? `${projectMetadata.fit}%` : '--'} color="text-mota-pink" />
              <WorkroomStat label="Complexity" value={projectMetadata?.complexity || 'N/A'} color="text-yellow-500" />
            </div>

            <div className="grid grid-cols-12 gap-10">
              <div className="col-span-8 space-y-12">
                {/* Master Intelligence Block - Mirroring BD Detail View */}
                <section>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-6 pb-2 border-b border-dark-border">Master Project Intelligence</h3>
                  {projectMetadata ? (
                    <div className="grid grid-cols-2 gap-x-12 gap-y-8 bg-dark-surface/40 p-8 rounded-2xl border border-dark-border shadow-xl">
                      <IntelligenceItem label="Studio / Production" value={projectMetadata.studio} subValue="Parent Organization" />
                      <IntelligenceItem label="Global Territory" value={projectMetadata.territory} subValue="Tax Strategy Target" />
                      <IntelligenceItem label="Director(s)" value={projectMetadata.directors.join(', ')} />
                      <IntelligenceItem label="Producer(s)" value={projectMetadata.producers.join(', ')} />
                      <IntelligenceItem label="Internal VFX Supervisor" value={projectMetadata.vfxSup} highlight />
                      <IntelligenceItem label="Internal VFX Producer" value={projectMetadata.vfxProducer} highlight />
                      <IntelligenceItem label="Budget Tier" value={projectMetadata.budget} />
                      <IntelligenceItem label="Genre / Scope" value={`${projectMetadata.genre} • ${projectMetadata.complexity} Complexity`} />
                      <IntelligenceItem label="Location Hub" value={projectMetadata.location} />
                      <IntelligenceItem label="Project Status" value={projectMetadata.status} isBadge />
                    </div>
                  ) : personMetadata ? (
                    <div className="bg-dark-surface/40 p-8 rounded-2xl border border-dark-border shadow-xl">
                      <IntelligenceItem label="Target Contact" value={personMetadata.name} subValue={personMetadata.title} />
                      <IntelligenceItem label="Affiliation" value={personMetadata.company} subValue={personMetadata.division} />
                    </div>
                  ) : (
                    <div className="p-10 border-2 border-dashed border-dark-border rounded-2xl text-center opacity-40">
                      <p className="text-xs uppercase font-bold">No Master Metadata Linked</p>
                    </div>
                  )}
                </section>

                <section>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-6 pb-2 border-b border-dark-border">Engagement Roadmap</h3>
                  <div className="space-y-3">
                    <MilestoneItem label="Lead Qualified via Studio Slate" status="COMPLETE" date="OCT 02" />
                    <MilestoneItem label="Initial Scoping & Rebate Analysis" status={opportunity.status === 'LEAD' ? 'PENDING' : 'COMPLETE'} date="OCT 05" />
                    <MilestoneItem label="Executive Creative Review" status={opportunity.internalStatus === 'AWARDED' ? 'COMPLETE' : 'PENDING'} date="TBD" />
                    <MilestoneItem label="Contract Execution" status={opportunity.status === 'CURRENT_PROJ' ? 'COMPLETE' : 'WAITING'} date="TBD" />
                  </div>
                </section>
              </div>

              <div className="col-span-4 space-y-8">
                <section>
                   <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-6 pb-2 border-b border-dark-border">Strategic Alignment</h3>
                   <div className="bg-dark-base border border-dark-border p-6 rounded-2xl space-y-4 shadow-xl">
                      <div className="text-[10px] text-mota-pink font-bold uppercase tracking-widest">Internal Narrative</div>
                      <p className="text-sm text-gray-400 leading-relaxed italic">
                        "{opportunity.entityName} represents a key milestone in our relationship with {projectMetadata?.studio || 'the client'}. 
                        The primary sales hook is our proprietary {projectMetadata?.genre === 'Sci-Fi' ? 'Unreal 5.4 environment' : 'advanced asset'} tools which reduce cost by 15%."
                      </p>
                      <div className="pt-4 flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-dark-surface rounded-full text-[9px] font-bold text-gray-500 uppercase">{projectMetadata?.genre === 'Sci-Fi' ? 'UNREAL 5.4' : 'UE5 PIPELINE'}</span>
                        <span className="px-3 py-1 bg-dark-surface rounded-full text-[9px] font-bold text-gray-500 uppercase">{projectMetadata?.territory?.split(' ')[0] || 'VERTEX'} HUB</span>
                      </div>
                   </div>
                </section>

                <div className="bg-mota-pink/5 border border-mota-pink/20 p-6 rounded-xl">
                   <h4 className="text-[10px] font-bold uppercase text-mota-pink mb-2">BD Quick Action</h4>
                   <p className="text-xs text-gray-400 mb-4 italic">"Projected margin audit required before client engagement phase."</p>
                   {showHealth ? (
                     <button onClick={() => { setActiveTab('HEALTH'); }} className="w-full bg-mota-pink text-dark-base font-bold py-2 rounded text-[10px] uppercase shadow-lg">View Health Matrix</button>
                   ) : (
                     <button onClick={() => { setActiveTab('BIDS'); }} className="w-full bg-dark-surface border border-dark-border text-white font-bold py-2 rounded text-[10px] uppercase hover:border-mota-pink transition-all">Initiate Bid Strategy</button>
                   )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'HEALTH' && showHealth && (
          <div className="h-full overflow-y-auto">
            <ProjectHealthDashboard opportunity={opportunity} />
          </div>
        )}

        {activeTab === 'BIDS' && (
          <div className="h-full">
            <BidManager opportunity={opportunity} />
          </div>
        )}

        {activeTab === 'NOTES' && (
          <div className="p-10 max-w-4xl mx-auto space-y-6 overflow-y-auto h-full">
            <h3 className="text-xl font-oswald font-bold uppercase">Internal Workroom Discussion</h3>
            <div className="space-y-4 bg-dark-surface p-8 rounded-2xl border border-dark-border min-h-[400px]">
               <ChatMessage user="Eric Kohler" time="2h ago" msg="Verify if we have reached the 80% labor threshold for the UK uplift." />
               <ChatMessage user="Sarah Connor" time="1h ago" msg="Initial reports show we're at 84.2%. Margin looking solid for Q4." />
            </div>
            <div className="flex gap-4">
               <input type="text" placeholder="Add internal note..." className="flex-1 bg-dark-base border border-dark-border rounded-xl px-6 py-4 focus:outline-none focus:border-mota-pink shadow-xl" />
               <button className="bg-mota-pink text-dark-base px-8 rounded-xl font-bold uppercase text-xs shadow-lg shadow-mota-pink/20">Post</button>
            </div>
          </div>
        )}

        {activeTab === 'CLIENT' && (
           <div className="p-10 max-w-5xl mx-auto space-y-10 overflow-y-auto h-full">
              <h3 className="text-xl font-oswald font-bold uppercase tracking-tight">Client Engagement Ledger</h3>
              <div className="space-y-6">
                 <EngagementRow date="OCT 10, 2024" type="OUTBOUND CALL" user="Sarah Connor (Sony)" notes="Discussed environment scope. They are pleased with the initial costing logic." />
                 <EngagementRow date="OCT 05, 2024" type="EMAIL SYNC" user="Kathy L. (Sony)" notes="Sent updated bid for Seq 001. Awaiting creative feedback." />
              </div>
           </div>
        )}
      </div>
    </div>
  );
};

const TabButton: React.FC<{ active: boolean; onClick: () => void; label: string; highlight?: boolean }> = ({ active, onClick, label, highlight }) => (
  <button 
    onClick={onClick} 
    className={`pb-4 text-xs font-bold uppercase tracking-widest transition-all relative ${active ? 'text-mota-pink' : 'text-gray-500 hover:text-white'} ${highlight && !active ? 'text-emerald-400' : ''}`}
  >
    {label}
    {active && <div className={`absolute bottom-0 left-0 right-0 h-1 rounded-t ${highlight ? 'bg-mota-pink shadow-[0_0_10px_#FF8585]' : 'bg-mota-pink'}`} />}
    {highlight && !active && <div className="absolute top-0 right-[-10px] w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_#10b981]" />}
  </button>
);

const IntelligenceItem: React.FC<{ label: string; value: string; subValue?: string; highlight?: boolean; isBadge?: boolean }> = ({ label, value, subValue, highlight, isBadge }) => (
  <div>
    <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">{label}</div>
    {isBadge ? (
      <span className="px-2 py-0.5 rounded bg-dark-base border border-dark-border text-[10px] font-bold text-blue-400 uppercase">{value}</span>
    ) : (
      <div className={`text-sm font-bold ${highlight ? 'text-mota-pink' : 'text-white'}`}>{value}</div>
    )}
    {subValue && <div className="text-[10px] text-gray-600 uppercase mt-0.5">{subValue}</div>}
  </div>
);

const WorkroomStat: React.FC<{ label: string; value: string; color: string }> = ({ label, value, color }) => (
  <div className="bg-dark-surface p-6 rounded-2xl border border-dark-border text-center shadow-lg group hover:border-mota-pink/30 transition-all">
    <div className="text-[9px] text-gray-500 uppercase tracking-widest mb-1 font-bold">{label}</div>
    <div className={`text-2xl font-oswald font-bold ${color}`}>{value}</div>
  </div>
);

const MilestoneItem: React.FC<{ label: string; status: string; date: string }> = ({ label, status, date }) => (
  <div className="flex items-center justify-between p-4 bg-dark-surface/30 border border-dark-border rounded-xl">
    <div className="flex items-center gap-4">
       <div className={`w-3 h-3 rounded-full ${status === 'COMPLETE' ? 'bg-emerald-500' : status === 'PENDING' ? 'bg-yellow-500 animate-pulse' : 'bg-dark-base border border-gray-600'}`}></div>
       <span className="text-sm font-medium">{label}</span>
    </div>
    <div className="flex items-center gap-6">
       <span className="text-[10px] font-mono text-gray-500 uppercase">{date}</span>
       <span className={`text-[10px] font-bold uppercase tracking-widest ${status === 'COMPLETE' ? 'text-emerald-400' : 'text-gray-500'}`}>{status}</span>
    </div>
  </div>
);

const ChatMessage: React.FC<{ user: string; time: string; msg: string }> = ({ user, time, msg }) => (
  <div className="space-y-1">
     <div className="flex items-center gap-3">
        <span className="text-xs font-bold text-mota-pink uppercase tracking-widest">{user}</span>
        <span className="text-[9px] font-mono text-gray-600 uppercase">{time}</span>
     </div>
     <p className="text-sm text-gray-400 bg-dark-base/40 p-3 rounded-lg border border-dark-border/40 leading-relaxed">{msg}</p>
  </div>
);

const EngagementRow: React.FC<{ date: string; type: string; user: string; notes: string }> = ({ date, type, user, notes }) => (
  <div className="grid grid-cols-12 gap-6 p-6 border border-dark-border rounded-2xl bg-dark-surface/30 shadow-xl">
     <div className="col-span-2">
        <div className="text-[10px] font-mono text-gray-500 uppercase">{date}</div>
        <div className="text-xs font-bold uppercase tracking-widest text-white mt-1">{type}</div>
     </div>
     <div className="col-span-3">
        <div className="text-[9px] text-gray-500 uppercase mb-1 font-bold">Client Point</div>
        <div className="text-sm font-bold text-mota-pink">{user}</div>
     </div>
     <div className="col-span-7">
        <div className="text-[9px] text-gray-500 uppercase mb-1 font-bold">Communications Outcome</div>
        <p className="text-sm text-gray-400 leading-relaxed italic">"{notes}"</p>
     </div>
  </div>
);
