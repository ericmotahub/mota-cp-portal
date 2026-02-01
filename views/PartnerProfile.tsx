
import React, { useState } from 'react';

interface StudioData {
  name: string;
  tagline: string;
  description: string;
  hubs: { location: string; totalFte: number; bookedPercent: number }[];
  leadership: { name: string; role: string; bio: string }[];
  specialties: string[];
  credits: { title: string; studio: string; year: string }[];
}

const INITIAL_DATA: StudioData = {
  name: "Vertex VFX",
  tagline: "Global Visual Effects Infrastructure & Creative Artistry",
  description: "Vertex VFX is a premier global visual effects studio with primary hubs in London, Dublin, and Los Angeles. We specialize in photoreal creature work, massive-scale environment simulations, and high-end compositing for major streaming platforms and theatrical releases.",
  hubs: [
    { location: "London (Soho)", totalFte: 185, bookedPercent: 82 },
    { location: "Dublin (IE)", totalFte: 120, bookedPercent: 45 },
    { location: "Los Angeles (CA)", totalFte: 65, bookedPercent: 95 }
  ],
  leadership: [
    { name: "Sarah Connor", role: "Head of Studio (Global)", bio: "20+ years in VFX management." },
    { name: "James Miller", role: "VFX Supervisor (LA/UK)", bio: "Oscar-winning creative lead." },
    { name: "Emily Zhang", role: "Head of Production (IE)", bio: "Specialist in regional incentives." },
    { name: "David Chen", role: "Head of Technology", bio: "Architect of the Mota-Vertex bridge." }
  ],
  specialties: ["Photoreal Creatures", "Unreal Engine 5.4", "Complex FX Sims", "Global Tax Optimization", "Virtual Production", "Deep Compositing"],
  credits: [
    { title: "Project Alpha", studio: "Sony Pictures", year: "2024" },
    { title: "Neon Horizon", studio: "Netflix", year: "2024" },
    { title: "The Void", studio: "Warner Bros.", year: "2025" }
  ]
};

export const PartnerProfile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(true);
  const [studioData, setStudioData] = useState<StudioData>(INITIAL_DATA);
  const [isPublishing, setIsPublishing] = useState(false);

  const handlePublish = () => {
    setIsPublishing(true);
    setTimeout(() => {
      setIsPublishing(false);
      setIsEditing(false); // Move to view mode after publishing
    }, 1500);
  };

  // --- VIEW MODE: THE FILMMAKER FACING DOSSIER ---
  if (!isEditing) {
    return (
      <div className="p-8 max-w-7xl mx-auto animate-in fade-in duration-700 text-left">
        <header className="flex justify-between items-center mb-8 bg-dark-surface/50 p-6 rounded-2xl border border-dark-border backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_8px_#10b981]"></div>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Live Dossier: Filmmaker Portal Preview</span>
          </div>
          <button 
            onClick={() => setIsEditing(true)}
            className="px-6 py-2 bg-dark-base border border-dark-border rounded-xl text-[10px] font-black uppercase tracking-widest text-mota-pink hover:bg-mota-pink hover:text-dark-base transition-all"
          >
            Edit Studio Data
          </button>
        </header>

        <div className="relative h-80 rounded-[2.5rem] overflow-hidden mb-12 border border-dark-border shadow-2xl group">
           <img src="https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&q=80&w=1200&h=400" className="w-full h-full object-cover grayscale opacity-30 group-hover:scale-105 transition-all duration-[30s]" alt="Vertex VFX Studio" />
           <div className="absolute inset-0 bg-gradient-to-t from-dark-base via-dark-base/40 to-transparent"></div>
           
           <div className="absolute bottom-10 left-10 flex items-end gap-10">
              <div className="w-40 h-40 bg-white rounded-3xl flex items-center justify-center font-oswald text-5xl text-dark-base font-bold shadow-2xl border-8 border-dark-surface overflow-hidden">
                 <span className="tracking-tighter">VX</span>
              </div>
              <div className="mb-4">
                 <div className="flex items-center gap-4 mb-2">
                    <h1 className="text-6xl font-oswald font-bold tracking-tighter uppercase leading-none">{studioData.name}</h1>
                    <span className="px-3 py-1 bg-mota-pink/10 border border-mota-pink/30 rounded-full text-[10px] font-bold text-mota-pink uppercase tracking-widest shadow-lg shadow-mota-pink/10">Mota Verified Partner</span>
                 </div>
                 <div className="text-gray-400 flex items-center gap-6 text-sm font-medium uppercase tracking-[0.2em]">
                    {studioData.hubs.map(hub => (
                      <span key={hub.location} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-mota-pink rounded-full"></div> {hub.location.split(' ')[0]}
                      </span>
                    ))}
                 </div>
              </div>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
           <div className="lg:col-span-8 space-y-16">
              <section>
                 <h2 className="text-xs font-black uppercase tracking-[0.4em] text-gray-500 mb-8 border-b border-dark-border pb-3">Creative Dossier</h2>
                 <p className="text-gray-300 leading-relaxed text-2xl font-light italic">"{studioData.description}"</p>
              </section>

              <section>
                 <h2 className="text-xs font-black uppercase tracking-[0.4em] text-gray-500 mb-8 border-b border-dark-border pb-3">Studio Credits</h2>
                 <div className="grid grid-cols-3 gap-8">
                    {studioData.credits.map(c => <CreditCard key={c.title} title={c.title} studio={c.studio} image={`https://picsum.photos/seed/${c.title.replace(' ', '')}/400/600`} />)}
                 </div>
              </section>

              <section>
                 <h2 className="text-xs font-black uppercase tracking-[0.4em] text-gray-500 mb-8 border-b border-dark-border pb-3">Operational Leadership</h2>
                 <div className="grid grid-cols-2 gap-8">
                    {studioData.leadership.map(l => <LeaderCard key={l.name} name={l.name} role={l.role} bio={l.bio} image={`https://i.pravatar.cc/150?u=${l.name[0]}`} />)}
                 </div>
              </section>
           </div>

           <div className="lg:col-span-4 space-y-10">
              <div className="bg-dark-surface p-10 rounded-[2rem] border border-dark-border shadow-2xl relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -mr-16 -mt-16"></div>
                 <h2 className="font-oswald font-bold text-2xl uppercase tracking-tight mb-10 text-white flex items-center gap-3">
                    <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 01-2 2h2a2 2 0 012-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                    Live Hub Capacity
                 </h2>
                 <div className="space-y-8">
                    {studioData.hubs.map(hub => <CapacityRow key={hub.location} label={hub.location} count={hub.totalFte} booked={hub.bookedPercent} />)}
                 </div>
                 <button className="w-full mt-12 py-5 bg-mota-pink text-dark-base font-black uppercase text-[11px] tracking-[0.2em] rounded-2xl shadow-xl shadow-mota-pink/20 hover:scale-105 transition-all">Request Production Bid</button>
              </div>

              <div className="bg-dark-surface p-10 rounded-[2rem] border border-dark-border space-y-8 shadow-2xl">
                 <h2 className="text-xs font-black uppercase tracking-[0.3em] text-gray-500 border-b border-dark-border pb-3">Technical Specialties</h2>
                 <div className="flex flex-wrap gap-3">
                    {studioData.specialties.map(s => <Pill key={s} label={s} />)}
                 </div>
              </div>
           </div>
        </div>
      </div>
    );
  }

  // --- EDIT MODE: INTERNAL STUDIO DATA ENTRY ---
  return (
    <div className="p-10 max-w-5xl mx-auto space-y-12 animate-in fade-in duration-500 text-left">
      <header className="flex justify-between items-end border-b border-dark-border pb-10">
        <div>
          <div className="flex items-center gap-3 mb-3">
             <div className="w-2 h-2 bg-mota-pink rounded-full shadow-[0_0_10px_#FF8585]"></div>
             <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.5em]">Studio Management Dashboard</span>
          </div>
          <h1 className="text-5xl font-oswald font-bold uppercase tracking-tight">Facility Intelligence Entry</h1>
          <p className="text-sm text-gray-500 font-medium mt-2">Manage the global data points that power your Filmmaker Portal presence.</p>
        </div>
        <div className="flex gap-4">
           <button 
            onClick={() => setIsEditing(false)}
            className="px-8 py-4 bg-dark-surface border border-dark-border rounded-2xl text-[10px] font-black uppercase tracking-widest text-white hover:border-white transition-all shadow-xl"
           >
             Preview Live Dossier
           </button>
           <button 
            onClick={handlePublish}
            disabled={isPublishing}
            className={`px-10 py-4 bg-mota-pink text-dark-base rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-mota-pink/20 transition-all ${isPublishing ? 'opacity-50 cursor-wait' : 'hover:scale-[1.02] active:scale-95'}`}
           >
             {isPublishing ? 'Syncing to Mota Node...' : 'Publish Changes'}
           </button>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-12">
        <div className="col-span-8 space-y-12 pb-40">
          {/* Studio Identity */}
          <section className="bg-dark-surface/40 p-12 rounded-[2.5rem] border border-dark-border space-y-10 shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
             </div>
             <div className="flex items-center gap-5 border-b border-dark-border pb-6 mb-6">
                <div className="w-2 h-12 bg-mota-pink rounded-full"></div>
                <h3 className="text-2xl font-oswald font-bold uppercase tracking-tight">Public Identity</h3>
             </div>
             <div className="grid grid-cols-1 gap-8">
               <FormGroup label="Studio Name" value={studioData.name} onChange={(v) => setStudioData({...studioData, name: v})} />
               <FormGroup label="Corporate Tagline" value={studioData.tagline} onChange={(v) => setStudioData({...studioData, tagline: v})} />
               <div className="space-y-4">
                 <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">About / Studio History</label>
                 <textarea 
                  className="w-full bg-dark-base border border-dark-border rounded-3xl px-8 py-6 text-sm text-white focus:outline-none focus:border-mota-pink min-h-[180px] leading-relaxed transition-all shadow-inner"
                  defaultValue={studioData.description}
                  onChange={(e) => setStudioData({...studioData, description: e.target.value})}
                 />
               </div>
             </div>
          </section>

          {/* Global Hubs */}
          <section className="bg-dark-surface/40 p-12 rounded-[2.5rem] border border-dark-border space-y-10 shadow-2xl relative overflow-hidden">
             <div className="flex items-center gap-5 border-b border-dark-border pb-6 mb-6">
                <div className="w-2 h-12 bg-blue-500 rounded-full"></div>
                <h3 className="text-2xl font-oswald font-bold uppercase tracking-tight">Regional Hub Management</h3>
             </div>
             <div className="space-y-8">
                {studioData.hubs.map((hub, idx) => (
                  <div key={idx} className="grid grid-cols-3 gap-8 p-8 bg-dark-base/40 border border-dark-border rounded-3xl relative group shadow-xl">
                    <FormGroup label="Location Name" value={hub.location} onChange={() => {}} />
                    <FormGroup label="Studio FTE" value={hub.totalFte} type="number" onChange={() => {}} />
                    <FormGroup label="% Booked" value={hub.bookedPercent} type="number" onChange={() => {}} />
                    <button className="absolute -top-4 -right-4 w-10 h-10 bg-dark-surface border border-dark-border rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 hover:text-red-400 transition-all text-gray-500 shadow-2xl">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeWidth={2}/></svg>
                    </button>
                  </div>
                ))}
                <button className="w-full py-6 border-2 border-dashed border-dark-border rounded-3xl text-[11px] font-black uppercase text-gray-500 hover:border-mota-pink hover:text-mota-pink transition-all bg-dark-base/20 tracking-[0.2em]">+ Provision New Hub</button>
             </div>
          </section>

          {/* Personnel */}
          <section className="bg-dark-surface/40 p-12 rounded-[2.5rem] border border-dark-border space-y-10 shadow-2xl relative overflow-hidden">
             <div className="flex items-center gap-5 border-b border-dark-border pb-6 mb-6">
                <div className="w-2 h-12 bg-emerald-500 rounded-full"></div>
                <h3 className="text-2xl font-oswald font-bold uppercase tracking-tight">Key Studio Personnel</h3>
             </div>
             <div className="grid grid-cols-2 gap-8">
                {studioData.leadership.map((l, idx) => (
                  <div key={idx} className="p-8 bg-dark-base/40 border border-dark-border rounded-3xl space-y-6 shadow-xl">
                     <FormGroup label="Executive Name" value={l.name} onChange={() => {}} />
                     <FormGroup label="Internal Role" value={l.role} onChange={() => {}} />
                  </div>
                ))}
                <button className="h-full py-16 border-2 border-dashed border-dark-border rounded-3xl text-[11px] font-black uppercase text-gray-500 hover:border-mota-pink hover:text-mota-pink transition-all tracking-[0.2em]">+ Add Executive Lead</button>
             </div>
          </section>
        </div>

        {/* Right Sidebar */}
        <div className="col-span-4 space-y-10">
           <section className="bg-dark-surface/40 p-10 rounded-[2.5rem] border border-dark-border space-y-8 shadow-2xl">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 border-b border-dark-border pb-3">Facility Skill Matrix</h3>
              <div className="flex flex-wrap gap-3">
                 {studioData.specialties.map(s => (
                   <div key={s} className="px-4 py-2 bg-dark-base border border-dark-border rounded-2xl text-[11px] font-bold text-mota-pink flex items-center gap-3 shadow-lg">
                     {s} <button className="hover:text-white transition-colors opacity-40 hover:opacity-100">×</button>
                   </div>
                 ))}
                 <button className="px-4 py-2 bg-mota-pink/10 border border-mota-pink/30 rounded-2xl text-[11px] font-black text-mota-pink uppercase tracking-widest hover:bg-mota-pink hover:text-dark-base transition-all">+</button>
              </div>
           </section>

           <section className="bg-emerald-500/5 p-10 rounded-[2.5rem] border border-emerald-500/20 space-y-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-400 opacity-[0.03] rounded-full -mr-20 -mt-20"></div>
              <div className="flex justify-between items-center">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400">Dossier Integrity</h3>
                <span className="text-emerald-400 font-oswald font-bold text-xl">92%</span>
              </div>
              <div className="space-y-4">
                 <div className="h-2.5 w-full bg-dark-base rounded-full overflow-hidden shadow-inner">
                    <div className="h-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)] transition-all duration-1000" style={{ width: '92%' }}></div>
                 </div>
                 <p className="text-[11px] text-gray-500 italic leading-relaxed font-medium">"Your studio is ranking in the top 5% for technical completeness. High-resolution credit stills would boost visibility by 14%."</p>
              </div>
           </section>

           <div className="bg-dark-base p-8 rounded-[2rem] border border-dark-border space-y-6 shadow-2xl opacity-60 grayscale hover:opacity-100 hover:grayscale-0 transition-all cursor-not-allowed">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Asset Management</h3>
              <p className="text-xs text-gray-600 font-bold uppercase tracking-widest text-center py-10 border-2 border-dashed border-dark-border rounded-2xl">Drop Credit Reel (.mp4)</p>
           </div>
        </div>
      </div>
    </div>
  );
};

// --- HELPER COMPONENTS ---

const FormGroup: React.FC<{ label: string; value: any; type?: string; onChange: (v: string) => void }> = ({ label, value, type = 'text', onChange }) => (
  <div className="space-y-3 flex-1 text-left">
    <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">{label}</label>
    <input 
      type={type} 
      defaultValue={value} 
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-dark-base border border-dark-border rounded-2xl px-6 py-4 text-sm text-white focus:outline-none focus:border-mota-pink transition-all font-medium shadow-inner"
    />
  </div>
);

const LeaderCard: React.FC<{ name: string; role: string; bio: string; image: string }> = ({ name, role, bio, image }) => (
  <div className="flex gap-6 p-6 bg-dark-surface/50 border border-dark-border rounded-[2rem] group hover:border-mota-pink transition-all shadow-xl">
    <img src={image} className="w-20 h-20 rounded-[1.5rem] border-2 border-dark-border group-hover:grayscale-0 grayscale transition-all shadow-xl" alt={name} />
    <div className="space-y-2">
      <div className="font-oswald font-bold text-xl uppercase tracking-tight group-hover:text-mota-pink transition-colors">{name}</div>
      <div className="text-[10px] text-gray-500 uppercase font-bold tracking-[0.2em]">{role}</div>
      <p className="text-xs text-gray-400 font-medium leading-relaxed italic truncate-2-lines">"{bio}"</p>
    </div>
  </div>
);

const CreditCard: React.FC<{ title: string; image: string; studio: string }> = ({ title, image, studio }) => (
  <div className="group cursor-pointer text-center">
    <div className="aspect-[2/3] rounded-3xl overflow-hidden border border-dark-border mb-4 relative shadow-2xl">
      <img src={image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-100 group-hover:scale-110" alt={title} />
      <div className="absolute inset-0 bg-gradient-to-t from-dark-base via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
         <div className="text-xs font-bold uppercase text-mota-pink tracking-[0.2em]">{studio}</div>
      </div>
    </div>
    <div className="font-oswald font-bold uppercase text-lg tracking-tight group-hover:text-mota-pink transition-colors">{title}</div>
  </div>
);

const CapacityRow: React.FC<{ label: string; count: number; booked: number }> = ({ label, count, booked }) => (
  <div className="space-y-3">
    <div className="flex justify-between text-[11px] font-black uppercase tracking-[0.2em] text-gray-400">
      <span>{label}</span>
      <span className={booked > 90 ? 'text-red-400' : 'text-emerald-400'}>{booked}% Loaded</span>
    </div>
    <div className="h-2.5 w-full bg-dark-base rounded-full overflow-hidden shadow-inner flex">
      <div 
        className={`h-full transition-all duration-1000 ${booked > 90 ? 'bg-red-400 shadow-[0_0_10px_#f87171]' : booked > 70 ? 'bg-yellow-400 shadow-[0_0_10px_#fbbf24]' : 'bg-emerald-400 shadow-[0_0_10px_#34d399]'}`} 
        style={{ width: `${booked}%` }}
      ></div>
    </div>
    <div className="text-[9px] text-gray-600 text-right uppercase font-mono font-bold tracking-tighter">{count} Verified Artists Active</div>
  </div>
);

const Pill: React.FC<{ label: string }> = ({ label }) => (
  <span className="px-5 py-2.5 bg-dark-base border border-dark-border rounded-2xl text-[10px] font-black text-gray-500 uppercase hover:text-mota-pink hover:border-mota-pink transition-all cursor-default shadow-lg tracking-[0.1em]">
    {label}
  </span>
);
