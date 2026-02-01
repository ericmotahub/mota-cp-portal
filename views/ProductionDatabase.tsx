
import React from 'react';
import { ToolbarButton, EntityType, MASTER_DATA } from './BizDevCenter';

export const ProductionDatabase: React.FC<{ onSelect: (type: EntityType, id: string) => void }> = ({ onSelect }) => {
  const projects = MASTER_DATA.projects;
  const statuses = ['PREP', 'PROD', 'POST', 'DEV'] as const;

  return (
    <div className="flex flex-col h-full">
      <div className="bg-dark-surface/50 border-b border-dark-border px-6 py-2 flex items-center justify-between gap-4 sticky top-0 z-10 backdrop-blur-sm">
        <div className="flex items-center gap-1">
          <ToolbarButton icon="M4 6h16M4 12h16M4 18h7" label="Views" badge="Main Table" />
          <div className="h-6 w-px bg-dark-border mx-2" />
          <ToolbarButton icon="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" label="Filter" />
          <ToolbarButton icon="M4 6h16M4 10h16M4 14h16M4 18h16" label="Group" badge="Status" />
          <ToolbarButton icon="M15 12a3 3 0 11-6 0 3 3 0 016 0z" label="Hide fields" />
        </div>
        <input type="text" placeholder="Search projects..." className="bg-dark-base border border-dark-border rounded-full pl-9 pr-4 py-1.5 text-xs focus:outline-none focus:border-mota-pink w-64" />
      </div>

      <div className="overflow-auto flex-1 bg-dark-base">
        <table className="w-full text-left text-xs whitespace-nowrap border-separate border-spacing-0">
          <thead>
            <tr className="bg-dark-surface/30 sticky top-0 z-10">
              <th className="px-6 py-3 border-b border-r border-dark-border font-bold uppercase tracking-widest text-gray-500 w-10 text-center">#</th>
              <th className="px-6 py-3 border-b border-r border-dark-border font-bold uppercase tracking-widest text-gray-500">Mota Opp</th>
              <th className="px-6 py-3 border-b border-r border-dark-border font-bold uppercase tracking-widest text-gray-500">Project Title</th>
              <th className="px-6 py-3 border-b border-r border-dark-border font-bold uppercase tracking-widest text-gray-500">Studio</th>
              <th className="px-6 py-3 border-b border-r border-dark-border font-bold uppercase tracking-widest text-gray-500">Filmmakers (Dir/Prod)</th>
              <th className="px-6 py-3 border-b border-r border-dark-border font-bold uppercase tracking-widest text-gray-500">Execs</th>
              <th className="px-6 py-3 border-b border-r border-dark-border font-bold uppercase tracking-widest text-gray-500">VFX Sup / Producer</th>
              <th className="px-6 py-3 border-b border-r border-dark-border font-bold uppercase tracking-widest text-gray-500">Fit</th>
              <th className="px-6 py-3 border-b border-r border-dark-border font-bold uppercase tracking-widest text-gray-500">Budget</th>
              <th className="px-6 py-3 border-b border-dark-border font-bold uppercase tracking-widest text-gray-500">Territory</th>
            </tr>
          </thead>
          <tbody>
            {statuses.map(status => {
              const group = projects.filter(p => p.status === status);
              if (group.length === 0) return null;
              return (
                <React.Fragment key={status}>
                  <tr className="bg-dark-surface/10">
                    <td colSpan={10} className="px-6 py-2 border-b border-dark-border font-bold text-mota-pink uppercase tracking-widest text-[10px] bg-dark-surface/20">
                      {status} ({group.length})
                    </td>
                  </tr>
                  {group.map((project, idx) => (
                    <tr key={project.id} className="hover:bg-white/5 group transition-colors border-b border-dark-border cursor-pointer" onClick={() => onSelect('project', project.title)}>
                      <td className="px-6 py-4 border-b border-r border-dark-border text-gray-600 font-mono text-center">{idx + 1}</td>
                      <td className="px-6 py-4 border-b border-r border-dark-border text-center">
                        {project.isMotaOpportunity && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[8px] font-bold bg-mota-pink text-dark-base uppercase shadow-lg shadow-mota-pink/20">Active</span>
                        )}
                      </td>
                      <td className="px-6 py-4 border-b border-r border-dark-border font-bold text-white group-hover:text-mota-pink transition-colors">{project.title}</td>
                      <td className="px-6 py-4 border-b border-r border-dark-border text-gray-400 hover:text-mota-pink" onClick={(e) => { e.stopPropagation(); onSelect('studio', project.studio); }}>{project.studio}</td>
                      <td className="px-6 py-4 border-b border-r border-dark-border">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-white">D: {project.directors.join(', ')}</span>
                          <span className="text-gray-500 text-[10px]">P: {project.producers.join(', ')}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 border-b border-r border-dark-border text-gray-400 text-[10px]">
                        {project.executives.map((exec, eidx) => (
                          <span key={exec} className="hover:text-mota-pink transition-colors" onClick={(e) => { e.stopPropagation(); onSelect('person', exec); }}>
                            {exec}{eidx < project.executives.length - 1 ? ', ' : ''}
                          </span>
                        ))}
                      </td>
                      <td className="px-6 py-4 border-b border-r border-dark-border">
                        <div className="flex flex-col">
                          <span className="text-mota-pink font-medium hover:underline" onClick={(e) => { e.stopPropagation(); onSelect('person', project.vfxSup); }}>{project.vfxSup}</span>
                          <span className="text-gray-500 text-[10px] hover:text-white" onClick={(e) => { e.stopPropagation(); onSelect('person', project.vfxProducer); }}>{project.vfxProducer}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 border-b border-r border-dark-border font-mono text-green-400 font-bold">{project.fit}%</td>
                      <td className="px-6 py-4 border-b border-r border-dark-border font-mono text-gray-300">{project.budget}</td>
                      <td className="px-6 py-4 border-b border-dark-border text-gray-500 text-[10px] uppercase">{project.territory}</td>
                    </tr>
                  ))}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
