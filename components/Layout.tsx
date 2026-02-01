
import React from 'react';
import { Sidebar } from './Sidebar';
import { Persona } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  persona: Persona;
  activeView: string;
  setView: (view: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, persona, activeView, setView }) => {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar persona={persona} activeView={activeView} setView={setView} />
      <main className="flex-1 overflow-y-auto bg-dark-base custom-scrollbar">
        {children}
      </main>
    </div>
  );
};
