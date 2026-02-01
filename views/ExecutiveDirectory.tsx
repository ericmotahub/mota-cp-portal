
import React from 'react';

const executives = [
  { studio: 'THE WALT DISNEY COMPANY', people: [
    { name: 'James C.', title: 'President, Physical Prod', division: 'Marvel Studios', location: 'Burbank', projects: ['Dark Ocean', 'Thunderbolts'] },
    { name: 'Kathy L.', title: 'SVP, Visual Effects', division: 'Lucasfilm', location: 'SF', projects: ['Mandalorian'] },
  ]},
  { studio: 'NETFLIX', people: [
    { name: 'Alex P.', title: 'VP, VFX Production', division: 'Original Series', location: 'LA', projects: ['Stranger Things', 'Sandman'] },
    { name: 'Tom G.', title: 'Manager, VFX Assets', division: 'Original Film', location: 'Vancouver', projects: ['Lost Sector'] },
  ]}
];

export const ExecutiveDirectory: React.FC = () => {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <header className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-4xl font-oswald font-bold uppercase">Executive Directory</h1>
          <p className="text-gray-400 text-sm font-medium mt-1">VFX Dept • 148 Contacts</p>
        </div>
        <button className="bg-mota-pink px-4 py-2 rounded text-dark-base font-bold text-sm">+ Add Contact</button>
      </header>

      <div className="bg-dark-surface border border-dark-border rounded-xl overflow-hidden shadow-2xl">
         <div className="p-4 bg-dark-base/50 flex gap-4 border-b border-dark-border">
            <input type="text" placeholder="Search people, titles, or projects..." className="flex-1 bg-dark-surface border border-dark-border rounded px-4 py-2 text-sm focus:outline-none focus:border-mota-pink" />
            <div className="flex gap-2">
               <FilterButton label="Role: All" />
               <FilterButton label="Studio" />
               <FilterButton label="Region" />
            </div>
         </div>

         <table className="w-full text-left text-sm">
           <thead>
             <tr className="bg-dark-base/30 text-[10px] uppercase tracking-widest text-gray-500 font-bold border-b border-dark-border">
               <th className="px-6 py-4">Name</th>
               <th className="px-6 py-4">Title</th>
               <th className="px-6 py-4">Division</th>
               <th className="px-6 py-4">Location</th>
               <th className="px-6 py-4">Active Projects</th>
               <th className="px-6 py-4">Action</th>
             </tr>
           </thead>
           <tbody>
             {executives.map((group, gIdx) => (
               <React.Fragment key={gIdx}>
                 <tr className="bg-dark-base/80 border-b border-dark-border/50">
                    <td colSpan={6} className="px-6 py-2 text-[10px] font-bold uppercase tracking-widest text-white flex items-center gap-2">
                       <span className="w-1 h-1 bg-mota-pink rounded-full"></span> {group.studio}
                    </td>
                 </tr>
                 {group.people.map((person, pIdx) => (
                   <tr key={pIdx} className="hover:bg-white/5 border-b border-dark-border/30 group">
                      <td className="px-6 py-5">
                         <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-[10px] font-bold text-white">
                               {person.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <span className="font-bold">{person.name}</span>
                         </div>
                      </td>
                      <td className="px-6 py-5 text-gray-300">{person.title}</td>
                      <td className="px-6 py-5 italic text-gray-500">{person.division}</td>
                      <td className="px-6 py-5 text-gray-300">{person.location}</td>
                      <td className="px-6 py-5">
                         <div className="flex gap-1">
                            {person.projects.map(p => (
                               <span key={p} className="px-2 py-0.5 rounded bg-dark-base text-[9px] font-bold text-gray-500 uppercase">{p}</span>
                            ))}
                         </div>
                      </td>
                      <td className="px-6 py-5">
                         <button className="px-3 py-1 bg-dark-base border border-dark-border rounded text-[10px] font-bold uppercase hover:border-mota-pink transition-colors">Msg</button>
                      </td>
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

const FilterButton: React.FC<{ label: string }> = ({ label }) => (
  <button className="px-3 py-2 bg-dark-surface border border-dark-border rounded text-xs text-gray-400 hover:text-white transition-colors flex items-center gap-1">
    {label}
  </button>
);
