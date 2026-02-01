
import React from 'react';
import { ToolbarButton, EntityType, MASTER_DATA } from './BizDevCenter';

export const StudiosDatabase: React.FC<{ onSelect: (type: EntityType, id: string) => void }> = ({ onSelect }) => {
  const studios = MASTER_DATA.studios;

  return (
    <div className="flex flex-col h-full">
      <div className="bg-dark-surface/50 border-b border-dark-border px-6 py-2 flex items-center justify-between gap-4 sticky top-0 z-10 backdrop-blur-sm">
        <div className="flex items-center gap-1">
          <ToolbarButton icon="M4 6h16M4 12h16M4 18h7" label="Views" badge="All Companies" />
          <div className="h-6 w-px bg-dark-border mx-2" />
          <ToolbarButton icon="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" label="Filter" />
          <ToolbarButton icon="M4 6h16M4 10h16M4 14h16M4 18h16" label="Group" badge="Type" />
        </div>
        <input type="text" placeholder="Search entities..." className="bg-dark-base border border-dark-border rounded-full px-4 py-1.5 text-xs focus:outline-none focus:border-mota-pink w-64" />
      </div>

      <div className="overflow-auto flex-1 bg-dark-base">
        <table className="w-full text-left text-xs whitespace-nowrap border-separate border-spacing-0">
          <thead>
            <tr className="bg-dark-surface/30 sticky top-0 z-10">
              <th className="px-6 py-3 border-b border-r border-dark-border font-bold uppercase tracking-widest text-gray-500">Company Name</th>
              <th className="px-6 py-3 border-b border-r border-dark-border font-bold uppercase tracking-widest text-gray-500">Parent / Level</th>
              <th className="px-6 py-3 border-b border-r border-dark-border font-bold uppercase tracking-widest text-gray-500">Type</th>
              <th className="px-6 py-3 border-b border-r border-dark-border font-bold uppercase tracking-widest text-gray-500">Active Slate</th>
              <th className="px-6 py-3 border-b border-r border-dark-border font-bold uppercase tracking-widest text-gray-500">Key Contacts</th>
              <th className="px-6 py-3 border-b border-dark-border font-bold uppercase tracking-widest text-gray-500">HQ</th>
            </tr>
          </thead>
          <tbody>
            {studios.map(studio => (
              <tr key={studio.name} className="hover:bg-white/5 transition-colors border-b border-dark-border cursor-pointer group" onClick={() => onSelect('studio', studio.name)}>
                <td className="px-6 py-4 border-b border-r border-dark-border">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-dark-surface border border-dark-border flex items-center justify-center font-oswald text-[10px] font-bold text-mota-pink uppercase">{studio.name.substring(0, 2)}</div>
                    <div>
                      <div className="font-bold text-white group-hover:text-mota-pink transition-colors">{studio.name}</div>
                      <a href={`https://${studio.website}`} target="_blank" className="text-[9px] text-gray-500 hover:text-white" onClick={e => e.stopPropagation()}>{studio.website}</a>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 border-b border-r border-dark-border">
                  <div className="flex flex-col">
                    <span className="text-gray-300">{studio.parent}</span>
                    <span className="text-[9px] font-bold text-gray-500 uppercase">{studio.level}</span>
                  </div>
                </td>
                <td className="px-6 py-4 border-b border-r border-dark-border">
                  <span className="px-2 py-0.5 rounded bg-dark-surface border border-dark-border text-[9px] font-bold text-blue-400 uppercase">{studio.type}</span>
                </td>
                <td className="px-6 py-4 border-b border-r border-dark-border font-mono font-bold text-mota-pink">{studio.slateCount} Titles</td>
                <td className="px-6 py-4 border-b border-r border-dark-border">
                  {studio.contacts.map((contact, cidx) => (
                    <span key={contact} className="hover:text-mota-pink font-medium transition-colors" onClick={(e) => { e.stopPropagation(); onSelect('person', contact); }}>
                      {contact}{cidx < studio.contacts.length - 1 ? ', ' : ''}
                    </span>
                  ))}
                </td>
                <td className="px-6 py-4 border-b border-dark-border text-gray-500">{studio.hq}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
