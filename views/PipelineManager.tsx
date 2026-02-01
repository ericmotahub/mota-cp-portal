
import React, { useState, useEffect, useRef } from 'react';
import { EntityType, ToolbarButton } from './BizDevCenter';
import { InternalStatus } from '../types';

export interface TrackedOpportunity {
  id: string;
  entityId: string;
  entityName: string;
  type: EntityType;
  status: 'LEAD' | 'ACTIVE_OPP' | 'CURRENT_PROJ';
  internalStatus: InternalStatus;
  addedAt: string;
  notes: string;
  value?: string;
  probability?: number;
}

interface PipelineManagerProps {
  opportunities: TrackedOpportunity[];
  onStatusChange: (id: string, status: TrackedOpportunity['status'], internalStatus?: InternalStatus) => void;
  onRemove: (id: string) => void;
  onSelectEntity: (type: EntityType, id: string) => void;
  onOpenWorkroom: (id: string) => void;
}

type ViewType = 'kanban' | 'table';

export const STATUS_CONFIG: Record<InternalStatus, { label: string; color: string; bg: string }> = {
  SCOUTING: { label: 'Scouting', color: 'text-gray-400', bg: 'bg-gray-400/10' },
  BIDDING_IN_PROG: { label: 'Bidding in Progress', color: 'text-blue-400', bg: 'bg-blue-400/10' },
  BID_SENT: { label: 'Bid Sent', color: 'text-purple-400', bg: 'bg-purple-400/10' },
  BID_FOR_REVIEW: { label: 'Bid for Review', color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
  DISCUSSING: { label: 'Discussing with Client', color: 'text-cyan-400', bg: 'bg-cyan-400/10' },
  AWARDED: { label: 'Project Awarded', color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
  IN_PROD: { label: 'In Production', color: 'text-mota-pink', bg: 'bg-mota-pink/10' },
  DELIVERED: { label: 'Delivered', color: 'text-white', bg: 'bg-white/10' },
  LOST: { label: 'Project Lost', color: 'text-red-400', bg: 'bg-red-400/10' }
};

export const PipelineManager: React.FC<PipelineManagerProps> = ({ 
  opportunities, 
  onStatusChange, 
  onRemove,
  onSelectEntity,
  onOpenWorkroom
}) => {
  const [viewType, setViewType] = useState<ViewType>('kanban');

  const columns: { label: string; value: TrackedOpportunity['status'] }[] = [
    { label: 'Leads & Prospects', value: 'LEAD' },
    { label: 'Active Opportunities', value: 'ACTIVE_OPP' },
    { label: 'Current Projects', value: 'CURRENT_PROJ' }
  ];

  return (
    <div className="h-full flex flex-col bg-dark-base text-left">
      <header className="px-8 pt-8 pb-6 border-b border-dark-border bg-dark-base z-20">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h1 className="text-4xl font-oswald font-bold uppercase tracking-tight text-white">Pipeline Manager</h1>
            <p className="text-gray-400 text-sm mt-1 uppercase tracking-widest font-medium">Tracking {opportunities.length} Active Engagements</p>
          </div>
          <div className="flex gap-2">
            <button className="bg-dark-surface border border-dark-border px-4 py-2 rounded text-xs font-bold uppercase tracking-widest hover:border-mota-pink transition-colors">Export CRM</button>
            <button className="bg-mota-pink text-dark-base px-4 py-2 rounded text-dark-base font-bold text-xs uppercase tracking-widest shadow-lg shadow-mota-pink/20">+ Custom Entry</button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <button onClick={() => setViewType('kanban')} className={`flex items-center gap-2 px-3 py-1.5 rounded transition-all ${viewType === 'kanban' ? 'bg-dark-surface text-white border border-dark-border/50 shadow-inner' : 'text-gray-500 hover:text-white'}`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
              <span className="text-[11px] font-bold uppercase tracking-widest">Kanban</span>
            </button>
            <button onClick={() => setViewType('table')} className={`flex items-center gap-2 px-3 py-1.5 rounded transition-all ${viewType === 'table' ? 'bg-dark-surface text-white border border-dark-border/50 shadow-inner' : 'text-gray-500 hover:text-white'}`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
              <span className="text-[11px] font-bold uppercase tracking-widest">Table View</span>
            </button>
            <div className="h-6 w-px bg-dark-border mx-2" />
            <ToolbarButton icon="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" label="Filter" />
          </div>
          <div className="text-[10px] text-gray-500 font-mono">WEIGHTED PIPELINE: <span className="text-mota-pink font-bold">$12.4M</span></div>
        </div>
      </header>

      <div className="flex-1 overflow-hidden">
        {viewType === 'kanban' ? (
          <div className="h-full overflow-x-auto p-8 flex gap-6 bg-dark-base/50">
            {columns.map(col => (
              <PipelineColumn 
                key={col.value} 
                title={col.label} 
                items={opportunities.filter(o => o.status === col.value)}
                onStatusChange={onStatusChange}
                onRemove={onRemove}
                onSelect={onSelectEntity}
                onOpenWorkroom={onOpenWorkroom}
                status={col.value}
              />
            ))}
          </div>
        ) : (
          <div className="h-full overflow-auto bg-dark-base">
            <table className="w-full text-left text-xs border-separate border-spacing-0">
              <thead>
                <tr className="bg-dark-surface/30 sticky top-0 z-10">
                  <th className="px-8 py-4 border-b border-r border-dark-border font-bold uppercase tracking-widest text-gray-500">Engagement Name</th>
                  <th className="px-8 py-4 border-b border-r border-dark-border font-bold uppercase tracking-widest text-gray-500">Mota Stage</th>
                  <th className="px-8 py-4 border-b border-r border-dark-border font-bold uppercase tracking-widest text-gray-500">Value (USD)</th>
                  <th className="px-8 py-4 border-b border-r border-dark-border font-bold uppercase tracking-widest text-gray-500">Prob.</th>
                  <th className="px-8 py-4 border-b border-r border-dark-border font-bold uppercase tracking-widest text-gray-500">Inbound Date</th>
                  <th className="px-8 py-4 border-b border-dark-border font-bold uppercase tracking-widest text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {columns.map(col => {
                  const group = opportunities.filter(o => o.status === col.value);
                  return (group.length > 0 && 
                    <React.Fragment key={col.value}>
                      <tr className="bg-dark-surface/10">
                        <td colSpan={6} className="px-8 py-2 border-b border-dark-border font-bold text-mota-pink uppercase tracking-[0.2em] text-[10px] bg-dark-surface/20">
                          {col.label} ({group.length})
                        </td>
                      </tr>
                      {group.map(item => (
                        <tr 
                          key={item.id} 
                          className="hover:bg-white/5 transition-colors border-b border-dark-border cursor-pointer group"
                          onClick={() => onOpenWorkroom(item.id)}
                        >
                          <td className="px-8 py-5 border-b border-r border-dark-border font-bold text-white group-hover:text-mota-pink transition-colors">
                            {item.entityName}
                          </td>
                          <td className="px-8 py-5 border-b border-r border-dark-border">
                            <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border border-dark-border ${STATUS_CONFIG[item.internalStatus].color} ${STATUS_CONFIG[item.internalStatus].bg}`}>
                              {STATUS_CONFIG[item.internalStatus].label}
                            </span>
                          </td>
                          <td className="px-8 py-5 border-b border-r border-dark-border font-mono text-gray-300">
                            <div className="flex flex-col">
                              <span>{item.value || '--'}</span>
                              <span className="text-[9px] text-gray-500 uppercase font-bold tracking-tighter">
                                {item.status === 'LEAD' ? 'Projected Value' : (item.status === 'CURRENT_PROJ' ? 'Verified Award' : 'Bid Value')}
                              </span>
                            </div>
                          </td>
                          <td className="px-8 py-5 border-b border-r border-dark-border">
                            <div className="flex items-center gap-2">
                              <div className="w-12 h-1.5 bg-dark-surface rounded-full overflow-hidden">
                                <div className="h-full bg-mota-pink" style={{ width: `${item.probability || 0}%` }}></div>
                              </div>
                              <span className="text-[10px] font-mono">{item.probability || 0}%</span>
                            </div>
                          </td>
                          <td className="px-8 py-5 border-b border-r border-dark-border text-gray-500 uppercase">
                            {new Date(item.addedAt).toLocaleDateString()}
                          </td>
                          <td className="px-8 py-5 border-b border-dark-border" onClick={e => e.stopPropagation()}>
                            <div className="flex gap-2">
                              <select 
                                value={item.internalStatus}
                                onChange={(e) => onStatusChange(item.id, item.status, e.target.value as InternalStatus)}
                                className="bg-dark-base border border-dark-border rounded text-[10px] font-bold uppercase p-1 focus:outline-none focus:border-mota-pink"
                              >
                                {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                                  <option key={key} value={key}>{cfg.label}</option>
                                ))}
                              </select>
                              <button onClick={() => onRemove(item.id)} className="p-1 hover:text-red-400 text-gray-600 transition-colors">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

const PipelineColumn: React.FC<{ 
  title: string; 
  items: TrackedOpportunity[]; 
  status: TrackedOpportunity['status'];
  onStatusChange: (id: string, status: TrackedOpportunity['status'], internalStatus?: InternalStatus) => void;
  onRemove: (id: string) => void;
  onSelect: (type: EntityType, id: string) => void;
  onOpenWorkroom: (id: string) => void;
}> = ({ title, items, onStatusChange, onRemove, onSelect, onOpenWorkroom, status }) => (
  <div className="w-[420px] shrink-0 flex flex-col h-full bg-dark-base/30 rounded-2xl border border-dark-border/50">
    <div className="p-5 border-b border-dark-border flex justify-between items-center bg-dark-surface/40 rounded-t-2xl">
      <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">{title}</h2>
      <span className="bg-mota-pink/10 border border-mota-pink/20 px-3 py-1 rounded-full text-[10px] font-bold text-mota-pink shadow-[0_0_10px_rgba(255,133,133,0.1)]">{items.length}</span>
    </div>
    <div className="flex-1 overflow-y-auto p-5 space-y-5 custom-scrollbar">
      {items.map(item => (
        <OpportunityCard 
          key={item.id} 
          item={item} 
          onStatusChange={onStatusChange} 
          onRemove={onRemove}
          onSelect={onSelect}
          onOpenWorkroom={onOpenWorkroom}
        />
      ))}
    </div>
  </div>
);

const OpportunityCard: React.FC<{ 
  item: TrackedOpportunity; 
  onStatusChange: (id: string, status: TrackedOpportunity['status'], internalStatus?: InternalStatus) => void; 
  onRemove: (id: string) => void;
  onSelect: (type: EntityType, id: string) => void;
  onOpenWorkroom: (id: string) => void;
}> = ({ item, onStatusChange, onRemove, onSelect, onOpenWorkroom }) => {
  const [showMove, setShowMove] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowMove(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div 
      onClick={() => onOpenWorkroom(item.id)}
      className="bg-dark-surface p-6 rounded-2xl border border-dark-border hover:border-mota-pink/50 transition-all group relative shadow-lg shadow-black/20 overflow-visible cursor-pointer transform active:scale-[0.98]"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex flex-col gap-1.5">
          <span className="text-[8px] font-bold uppercase tracking-[0.1em] text-mota-pink bg-mota-pink/5 px-2.5 py-1 rounded border border-mota-pink/10 w-fit">
            {item.type}
          </span>
          <span className={`text-[10px] font-bold uppercase tracking-tight ${item.internalStatus === 'IN_PROD' ? 'text-mota-pink' : STATUS_CONFIG[item.internalStatus].color}`}>
            • {STATUS_CONFIG[item.internalStatus].label}
          </span>
        </div>
        <button 
          onClick={(e) => { e.stopPropagation(); onRemove(item.id); }} 
          className="text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity p-1"
          title="Remove from Pipeline"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
        </button>
      </div>

      <h3 className="text-xl font-oswald font-bold uppercase mb-4 leading-tight text-white group-hover:text-mota-pink transition-colors">
        {item.entityName}
      </h3>

      <div className="grid grid-cols-2 gap-4 mb-6 pointer-events-none">
        <div>
          <div className="text-[8px] text-gray-500 uppercase tracking-widest mb-1 font-bold">
            {item.status === 'LEAD' ? 'Projected Value' : (item.status === 'CURRENT_PROJ' ? 'Awarded Value' : 'Bid Value')}
          </div>
          <div className={`text-sm font-mono font-bold ${item.status === 'CURRENT_PROJ' ? 'text-emerald-400' : 'text-gray-200'}`}>{item.value || '$0'}</div>
        </div>
        <div>
          <div className="text-[8px] text-gray-500 uppercase tracking-widest mb-1 font-bold">Win Probability</div>
          <div className="text-sm font-mono font-bold text-white">{item.probability || 0}%</div>
        </div>
      </div>

      <div className="flex justify-between items-center border-t border-dark-border pt-4">
        <div className="text-[9px] text-gray-600 font-mono font-bold">
          ADDED {new Date(item.addedAt).toLocaleDateString()}
        </div>
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={(e) => { e.stopPropagation(); setShowMove(!showMove); }}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all shadow-lg ${showMove ? 'bg-mota-pink text-dark-base border-mota-pink' : 'bg-dark-base border border-dark-border text-gray-400 hover:border-mota-pink hover:text-white'}`}
          >
            Workflow <svg className={`w-3 h-3 transition-transform ${showMove ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          {showMove && (
            <div className="absolute bottom-full right-0 mb-2 w-64 bg-dark-surface border border-dark-border rounded-2xl shadow-2xl z-[100] py-3 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200" onClick={(e) => e.stopPropagation()}>
              <div className="px-4 py-2 text-[9px] font-bold text-gray-500 uppercase border-b border-dark-border/40 mb-1">Status Shift</div>
              {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                <button key={key} onClick={() => { onStatusChange(item.id, item.status, key as InternalStatus); setShowMove(false); }} className={`w-full text-left px-4 py-2 text-[10px] font-bold uppercase hover:bg-dark-base hover:text-white flex items-center gap-2 ${item.internalStatus === key ? 'text-mota-pink bg-mota-pink/5' : 'text-gray-400'}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${cfg.bg.replace('/10', '')}`}></span> {cfg.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const MoveOption: React.FC<{ children: React.ReactNode; onClick: () => void; active: boolean }> = ({ children, onClick, active }) => (
  <button onClick={onClick} className={`w-full text-left px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest transition-all ${active ? 'bg-mota-pink text-dark-base' : 'text-gray-400 hover:bg-dark-base hover:text-white'}`}>
    {children}
  </button>
);
