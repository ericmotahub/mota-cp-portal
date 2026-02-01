
import React from 'react';
import { Persona } from '../types';

interface SidebarProps {
  persona: Persona;
  activeView: string;
  setView: (view: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ persona, activeView, setView }) => {
  const navItems = {
    PARTNER: [
      { id: 'dashboard', label: 'Dashboard', icon: 'M4 6h16M4 12h16M4 18h16' },
      { id: 'pipeline', label: 'Pipeline Manager', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
      { id: 'biz-dev', label: 'Business Development', icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
      { id: 'talent-search', label: 'Resource Suite', icon: 'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 7a4 4 0 110-8 4 4 0 010 8z' },
      { id: 'partner-profile', label: 'Vertex Profile', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
    ],
  }[persona];

  return (
    <aside className="w-64 bg-[#1a1a1a] border-r border-dark-border flex flex-col h-full shrink-0">
      <div className="p-6">
        <div className="text-mota-pink font-oswald text-2xl font-bold tracking-tighter flex items-center gap-2">
          MOTA <span className="text-white opacity-40 text-sm font-sans tracking-normal">| {persona}</span>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1 mt-4">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors ${
              activeView === item.id 
                ? 'bg-dark-surface text-mota-pink border-l-4 border-mota-pink' 
                : 'text-gray-400 hover:text-white hover:bg-dark-surface/50'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
            </svg>
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-6 mt-auto border-t border-dark-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-mota-pink flex items-center justify-center text-dark-base font-bold">
            EK
          </div>
          <div className="flex-1 overflow-hidden">
            <div className="text-sm font-semibold truncate">Eric Kohler</div>
            <div className="text-xs text-gray-500 truncate">Head of Studio</div>
          </div>
        </div>
      </div>
    </aside>
  );
};
