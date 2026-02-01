
import React from 'react';

export const CrewDashboard: React.FC = () => {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <header className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-oswald font-bold mb-1">My Dashboard</h1>
          <p className="text-gray-400">Good afternoon, Sarah. You have 2 bookings pending.</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 rounded-full border border-green-500/30">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs font-bold text-green-500 uppercase tracking-widest">Available Now</span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <div className="lg:col-span-2 space-y-8">
          {/* Earnings */}
          <div className="bg-dark-surface p-8 rounded-xl border border-dark-border">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Earnings Snapshot</h2>
              <button className="text-mota-pink text-xs font-bold uppercase tracking-widest hover:underline">View Details &rarr;</button>
            </div>
            <div className="grid grid-cols-3 gap-6">
              <div className="border-r border-dark-border">
                <div className="text-[10px] uppercase font-bold text-gray-500 mb-1">YTD Earnings</div>
                <div className="text-3xl font-bold font-oswald tracking-tight">$84,250</div>
                <div className="text-[10px] text-green-400 font-bold">+12% vs last year</div>
              </div>
              <div className="border-r border-dark-border">
                <div className="text-[10px] uppercase font-bold text-gray-500 mb-1">Next Payout</div>
                <div className="text-3xl font-bold font-oswald tracking-tight">$3,200</div>
                <div className="text-[10px] text-gray-400 font-bold">Due: Oct 15th</div>
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-gray-500 mb-1">Tax Est.</div>
                <div className="text-3xl font-bold font-oswald tracking-tight">$21,062</div>
                <div className="text-[10px] text-gray-400 font-bold italic">Set aside</div>
              </div>
            </div>
          </div>

          {/* Matches */}
          <div className="bg-dark-surface p-8 rounded-xl border border-dark-border">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Curated Matches</h2>
              <button className="text-mota-pink text-xs font-bold hover:underline">Browse All</button>
            </div>
            <div className="space-y-4">
              <MatchRow title="Senior Nuke Compositor" company="Vertex VFX" location="London (Remote)" match="98%" rate="$750/day" />
              <MatchRow title="Lead Compositor" company="Netflix" location="Project 'Solar Flare'" match="92%" rate="$850/day" />
              <MatchRow title="Nuke Artist (Cleanup)" company="North Star" location="Glasgow" match="85%" rate="$550/day" />
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Profile Card */}
          <div className="bg-dark-surface p-8 rounded-xl border border-dark-border text-center">
            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-6">My Profile</h2>
            <div className="relative w-32 h-32 mx-auto mb-6">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-dark-base" />
                <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray="364.4" strokeDashoffset="18.2" className="text-mota-pink" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold font-oswald">95%</span>
                <span className="text-[10px] text-gray-500 uppercase font-bold">Score</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <button className="px-3 py-2 bg-dark-base border border-dark-border rounded text-[10px] font-bold uppercase hover:border-mota-pink transition-colors">Edit Skills</button>
              <button className="px-3 py-2 bg-dark-base border border-dark-border rounded text-[10px] font-bold uppercase hover:border-mota-pink transition-colors">View Public</button>
            </div>
            <button className="w-full py-2 bg-dark-base border border-dark-border rounded text-[10px] font-bold uppercase mb-2 hover:border-mota-pink">Update Reel</button>
            <button className="w-full py-2 bg-mota-pink text-dark-base rounded text-[10px] font-bold uppercase">Availability</button>
          </div>

          {/* Academy */}
          <div className="bg-dark-surface p-8 rounded-xl border border-dark-border">
            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-6">Mota Academy</h2>
            <div className="space-y-6">
               <div className="flex gap-4">
                  <div className="bg-dark-base p-2 rounded text-center min-w-[50px]">
                    <div className="text-lg font-bold font-oswald">12</div>
                    <div className="text-[8px] text-gray-500 uppercase font-bold">OCT</div>
                  </div>
                  <div>
                    <div className="text-sm font-bold">Unreal 5.4 for Comp</div>
                    <div className="text-[10px] text-gray-500">Live Workshop • 2pm PST</div>
                  </div>
               </div>
               <div className="flex gap-4">
                  <div className="bg-dark-base p-2 rounded text-center min-w-[50px]">
                    <div className="text-lg font-bold font-oswald">24</div>
                    <div className="text-[8px] text-gray-500 uppercase font-bold">OCT</div>
                  </div>
                  <div>
                    <div className="text-sm font-bold">Negotiating Rates</div>
                    <div className="text-[10px] text-gray-500">Mentorship Session</div>
                  </div>
               </div>
               <button className="w-full text-center text-xs text-gray-500 hover:text-white mt-4 uppercase font-bold tracking-widest">Browse Library</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MatchRow: React.FC<{ title: string; company: string; location: string; match: string; rate: string }> = ({ title, company, location, match, rate }) => (
  <div className="flex justify-between items-center p-4 rounded-lg bg-dark-base/50 border border-transparent hover:border-mota-pink/30 cursor-pointer transition-all group">
    <div>
      <div className="flex items-center gap-2 mb-1">
        <h3 className="font-bold group-hover:text-mota-pink transition-colors">{title}</h3>
        <span className="text-[10px] font-bold text-mota-pink">{match}</span>
      </div>
      <div className="text-xs text-gray-500 flex items-center gap-3">
         <span className="flex items-center gap-1">
           <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
           {company}
         </span>
         <span className="flex items-center gap-1">
           <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
           {location}
         </span>
      </div>
    </div>
    <div className="text-right font-bold text-sm">{rate}</div>
  </div>
);
