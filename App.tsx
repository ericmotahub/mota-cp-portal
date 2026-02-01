
import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { PartnerDashboard } from './views/PartnerDashboard';
import { AIBiddingTool } from './views/AIBiddingTool';
import { VendorSearch } from './views/VendorSearch';
import { ProductionDatabase } from './views/ProductionDatabase';
import { CrewDashboard } from './views/CrewDashboard';
import { TalentSearch } from './views/TalentSearch';
import { ExecutiveDirectory } from './views/ExecutiveDirectory';
import { PartnerProfile } from './views/PartnerProfile';
import { BizDevCenter, EntityType } from './views/BizDevCenter';
import { PipelineManager, TrackedOpportunity } from './views/PipelineManager';
import { ProjectWorkroom } from './views/ProjectWorkroom';
import { Persona, InternalStatus } from './types';

const INITIAL_PIPELINE: TrackedOpportunity[] = [
  { 
    id: 'op1', 
    entityId: 'p1', 
    entityName: 'Project Alpha', 
    type: 'project', 
    status: 'CURRENT_PROJ', 
    internalStatus: 'IN_PROD',
    addedAt: '2024-09-12T10:00:00Z', 
    notes: 'Awarded. Moving to shot production.', 
    value: '$4.2M', 
    probability: 100 
  },
  { 
    id: 'op2', 
    entityId: 'titan', 
    entityName: 'Project Titan', 
    type: 'project', 
    status: 'ACTIVE_OPP', 
    internalStatus: 'BID_SENT',
    addedAt: '2024-10-01T15:30:00Z', 
    notes: 'Bid sent. Negotiating creative fees.', 
    value: '$8.5M', 
    probability: 75 
  },
  { 
    id: 'op3', 
    entityId: 'neon', 
    entityName: 'Neon Horizon', 
    type: 'project', 
    status: 'ACTIVE_OPP', 
    internalStatus: 'BIDDING_IN_PROG',
    addedAt: '2024-10-05T09:15:00Z', 
    notes: 'Netflix original series. Multi-sequence bid.', 
    value: '$2.8M', 
    probability: 60 
  },
  { 
    id: 'op4', 
    entityId: 'kingdom', 
    entityName: 'Lost Kingdom', 
    type: 'project', 
    status: 'LEAD', 
    internalStatus: 'SCOUTING',
    addedAt: '2024-10-10T11:00:00Z', 
    notes: 'Early development exploration. Amazon MGM.', 
    value: '$12.0M', 
    probability: 25 
  },
  { 
    id: 'op5', 
    entityId: 'pe1', 
    entityName: 'Sarah Connor', 
    type: 'person', 
    status: 'LEAD', 
    internalStatus: 'SCOUTING',
    addedAt: '2024-10-11T16:00:00Z', 
    notes: 'SVP Sony. Interested in Q1 capacity.', 
    value: 'N/A', 
    probability: 90 
  }
];

const App: React.FC = () => {
  const [activePersona, setActivePersona] = useState<Persona>('PARTNER');
  const [activeView, setActiveView] = useState<string>('dashboard');
  const [pipeline, setPipeline] = useState<TrackedOpportunity[]>(INITIAL_PIPELINE);
  const [activeWorkroomId, setActiveWorkroomId] = useState<string | null>(null);

  const handleAddToPipeline = (entity: { type: EntityType; id: string; name: string }) => {
    if (pipeline.find(item => item.entityId === entity.id && item.type === entity.type)) {
      alert(`${entity.name} is already in your pipeline.`);
      return;
    }
    
    const newOp: TrackedOpportunity = {
      id: Math.random().toString(36).substr(2, 9),
      entityId: entity.id,
      entityName: entity.name,
      type: entity.type,
      status: 'LEAD',
      internalStatus: 'SCOUTING',
      addedAt: new Date().toISOString(),
      notes: '',
      value: entity.type === 'project' ? '$0' : 'N/A',
      probability: entity.type === 'project' ? 10 : 50
    };
    
    setPipeline([...pipeline, newOp]);
  };

  const updatePipelineStatus = (id: string, status: TrackedOpportunity['status'], internalStatus?: InternalStatus) => {
    setPipeline(pipeline.map(item => {
      if (item.id === id) {
        return { 
          ...item, 
          status, 
          internalStatus: internalStatus || item.internalStatus 
        };
      }
      return item;
    }));
  };

  const updateInternalStatusOnly = (id: string, internalStatus: InternalStatus) => {
    setPipeline(pipeline.map(item => {
      if (item.id === id) {
        let newStatus = item.status;
        // Automatic column migration based on internal status
        if (['SCOUTING'].includes(internalStatus)) newStatus = 'LEAD';
        else if (['BIDDING_IN_PROG', 'BID_SENT', 'BID_FOR_REVIEW', 'DISCUSSING'].includes(internalStatus)) newStatus = 'ACTIVE_OPP';
        else if (['IN_PROD', 'AWARDED', 'DELIVERED'].includes(internalStatus)) newStatus = 'CURRENT_PROJ';

        return { ...item, status: newStatus, internalStatus };
      }
      return item;
    }));
  };

  const removeFromPipeline = (id: string) => {
    setPipeline(pipeline.filter(item => item.id !== id));
  };

  const handleOpenWorkroom = (id: string) => {
    setActiveWorkroomId(id);
    setActiveView('workroom');
  };

  const handleSelect = (type: EntityType, id: string) => {
    setActiveView('biz-dev');
  };

  const renderView = () => {
    if (activeView === 'workroom' && activeWorkroomId) {
      const opp = pipeline.find(o => o.id === activeWorkroomId);
      if (opp) return <ProjectWorkroom opportunity={opp} onUpdateStatus={updateInternalStatusOnly} onClose={() => setActiveView('pipeline')} />;
    }

    switch (activeView) {
      case 'dashboard': return activePersona === 'PARTNER' ? <PartnerDashboard pipeline={pipeline} onOpenWorkroom={handleOpenWorkroom} setView={setActiveView} /> : activePersona === 'CREW' ? <CrewDashboard /> : <ProductionDatabase onSelect={handleSelect} />;
      case 'bidding': return <AIBiddingTool />;
      case 'biz-dev': return <BizDevCenter onAddToPipeline={handleAddToPipeline} />;
      case 'biz-dev-people': return <BizDevCenter onAddToPipeline={handleAddToPipeline} initialTab="people" />;
      case 'biz-dev-studios': return <BizDevCenter onAddToPipeline={handleAddToPipeline} initialTab="studios" />;
      case 'partner-profile': return <PartnerProfile />;
      case 'pipeline': return <PipelineManager opportunities={pipeline} onStatusChange={updatePipelineStatus} onRemove={removeFromPipeline} onSelectEntity={handleSelect} onOpenWorkroom={handleOpenWorkroom} />;
      case 'vendor-search': return <VendorSearch />;
      case 'prod-db': return <ProductionDatabase onSelect={handleSelect} />;
      case 'exec-dir': return <ExecutiveDirectory />;
      case 'talent-search': return <TalentSearch />;
      default: return <PartnerDashboard pipeline={pipeline} onOpenWorkroom={handleOpenWorkroom} setView={setActiveView} />;
    }
  };

  return (
    <div className="min-h-screen bg-dark-base text-white">
      <div className="fixed bottom-4 right-4 z-50 flex gap-2 bg-dark-surface/80 p-2 rounded-full border border-dark-border backdrop-blur-sm">
        <button 
          onClick={() => { setActivePersona('PARTNER'); setActiveView('dashboard'); }}
          className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${activePersona === 'PARTNER' ? 'bg-mota-pink text-dark-base' : 'text-gray-400 hover:text-white'}`}
        >
          PARTNER
        </button>
      </div>

      <Layout 
        persona={activePersona} 
        activeView={activeView} 
        setView={setActiveView}
      >
        {renderView()}
      </Layout>
    </div>
  );
};

export default App;
