
import React from 'react';
import { ToolbarButton, EntityType, MASTER_DATA } from './BizDevCenter';

export const PeopleDirectory: React.FC<{ onSelect: (type: EntityType, id: string) => void }> = ({ onSelect }) => {
  const people = MASTER_DATA.people;
  const categories = ['STUDIO EXECUTIVES', 'VFX SUPERVISORS', 'VFX PRODUCERS'] as const;

  return (
    <div className="flex flex-col h-full">
      <div className="bg-dark-surface/50 border-b border-dark-border px-6 py-2 flex items-center justify-between gap-4 sticky top-0 z-10 backdrop-blur-sm">
        <div className="flex items-center gap-1">
          <ToolbarButton icon="M4 6h16M4 12h16M4 18h7" label="Views" badge="Full Directory" />
          <div className="h-6 w-px bg-dark-border mx-2" />
          <ToolbarButton icon="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" label="Filter" />
          <ToolbarButton icon="M4 6h16M4 10h16M4 14h16M4 18h16" label="Group" badge="Category" />
        </div>
        <input type="text" placeholder="Find people..." className="bg-dark-base border border-dark-border rounded-full px-4 py-1.5 text-xs focus:outline-none focus:border-mota-pink w-64" />
      </div>

      <div className="overflow-auto flex-1 bg-dark-base">
        <table className="w-full text-left text-xs whitespace-nowrap border-separate border-spacing-0">
          <thead>
            <tr className="bg-dark-surface/30 sticky top-0 z-10">
              <th className="px-6 py-3 border-b border-r border-dark-border font-bold uppercase tracking-widest text-gray-500">Name</th>
              <th className="px-6 py-3 border-b border-r border-dark-border font-bold uppercase tracking-widest text-gray-500">Title</th>
              <th className="px-6 py-3 border-b border-r border-dark-border font-bold uppercase tracking-widest text-gray-500">Company</th>
              <th className="px-6 py-3 border-b border-r border-dark-border font-bold uppercase tracking-widest text-gray-500">Current Show</th>
              <th className="px-6 py-3 border-b border-r border-dark-border font-bold uppercase tracking-widest text-gray-500">Type</th>
              <th className="px-6 py-3 border-b border-r border-dark-border font-bold uppercase tracking-widest text-gray-500">Relationship</th>
              <th className="px-6 py-3 border-b border-dark-border font-bold uppercase tracking-widest text-gray-500">Location</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(cat => (
              <React.Fragment key={cat}>
                <tr className="bg-dark-surface/10">
                  <td colSpan={7} className="px-6 py-2 border-b border-dark-border font-bold text-mota-pink uppercase tracking-widest text-[10px] bg-dark-surface/20">
                    {cat} ({people.filter(p => p.category === cat).length})
                  </td>
                </tr>
                {people.filter(p => p.category === cat).map(person => (
                  <tr key={person.name} className="hover:bg-white/5 transition-colors border-b border-dark-border cursor-pointer group" onClick={() => onSelect('person', person.name)}>
                    <td className="px-6 py-4 border-b border-r border-dark-border font-bold text-white flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-dark-surface border border-dark-border flex items-center justify-center text-[10px] text-gray-500">{person.name[0]}</div>
                      {person.name}
                    </td>
                    <td className="px-6 py-4 border-b border-r border-dark-border text-gray-300">{person.title}</td>
                    <td className="px-6 py-4 border-b border-r border-dark-border text-mota-pink font-medium hover:underline" onClick={(e) => { e.stopPropagation(); onSelect('studio', person.company); }}>{person.company}</td>
                    <td className="px-6 py-4 border-b border-r border-dark-border text-white font-bold hover:text-mota-pink transition-colors" onClick={(e) => { e.stopPropagation(); onSelect('project', person.current); }}>{person.current}</td>
                    <td className="px-6 py-4 border-b border-r border-dark-border">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${person.type === 'Freelance' ? 'text-green-500 bg-green-500/10' : 'text-blue-400 bg-blue-400/10'}`}>
                        {person.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 border-b border-r border-dark-border">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${person.relationship === 'Hot' ? 'bg-orange-500 animate-pulse' : person.relationship === 'Warm' ? 'bg-green-500' : 'bg-gray-700'}`}></div>
                        <span className="font-bold">{person.relationship}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 border-b border-dark-border text-gray-500">{person.location}</td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
