
import React, { useState, useMemo, useEffect } from 'react';
import { ProductionDatabase } from './ProductionDatabase';
import { PeopleDirectory } from './PeopleDirectory';
import { StudiosDatabase } from './StudiosDatabase';

export type EntityType = 'project' | 'person' | 'studio';

export interface Selection {
  type: EntityType;
  id: string; // The Name or Title of the entity
}

// --- MASTER DATA REGISTRY: THE KNOWLEDGE GRAPH ---
export const MASTER_DATA = {
  projects: [
    { 
      id: 'p1', 
      title: 'Project Alpha', 
      studio: 'Sony Pictures', 
      status: 'PROD', 
      executives: ['Sarah Connor', 'Mike Ross'], 
      vfxSup: 'David Chen', 
      vfxProducer: 'Sarah Jenkins', 
      directors: ['Christopher Nolan'], 
      producers: ['Emma Thomas', 'Charles Roven'], 
      isMotaOpportunity: true, 
      location: 'London', 
      territory: 'UK (Soho)', 
      budget: '$165M', 
      genre: 'Sci-Fi / Noir', 
      complexity: 'Extreme', 
      fit: 98, 
      quarter: 'Q4 2024', 
      type: 'Feature', 
      synopsis: "A mind-bending heist thriller involving memory auditing. Significant technical requirement for practical-to-digital asset transitions.",
      reason: "Matches our Soho hub's specialized deep-compositing pipeline. Nolan's team requires local presence for dailies.",
      technicalHook: "Bespoke Neural-Render bridge required for memory sequences. High-resolution 65mm plate processing pipeline necessary.",
      rebateIntel: "UK Global Screen Fund (AVEC) qualifying. Reaching 84% labor threshold in London hub."
    },
    { 
      id: 'titan', 
      title: 'Project Titan', 
      studio: 'Warner Bros. Discovery', 
      status: 'PREP', 
      executives: ['Eric Kohler', 'Kathy L.'], 
      vfxSup: 'James Miller', 
      vfxProducer: 'Sarah Jenkins', 
      directors: ['Denis Villeneuve'], 
      producers: ['Mary Parent', 'Cale Boyter'], 
      isMotaOpportunity: true, 
      location: 'LA / London', 
      territory: 'US (California)', 
      budget: '$210M', 
      genre: 'Epic Action', 
      complexity: 'V. High', 
      fit: 92, 
      quarter: 'Q1 2025', 
      type: 'Feature', 
      synopsis: "The second chapter of the resource struggle on the water moon. Focus on massive-scale adaptive FLIP fluid simulations.",
      reason: "Strategic entry point for WBD's 2025 slate. Denis V. looking for sequence leads to handle 'The Deep' ecosystem.",
      technicalHook: "Massive-scale Solaris/USD simulation pipeline. Integration with Vertex's follow-the-sun rendering infrastructure.",
      rebateIntel: "CA Program 3.0 (20-25%). Exploring London tax wrap for specific fluid simulation sequences."
    },
    { 
      id: 'neon', 
      title: 'Neon Horizon', 
      studio: 'Netflix', 
      status: 'PREP', 
      executives: ['James Miller', 'Alex Parker'], 
      vfxSup: 'Mike Ross', 
      vfxProducer: 'Emily Zhang', 
      directors: ['Greta Gerwig'], 
      producers: ['David Heyman'], 
      isMotaOpportunity: true, 
      location: 'Dublin', 
      territory: 'Ireland', 
      budget: '$95M', 
      genre: 'Cyberpunk Drama', 
      complexity: 'High', 
      fit: 85, 
      quarter: 'Q4 2024', 
      type: 'Series', 
      synopsis: "AI architect in near-future Dublin discovers emotional glitches. Procedural city-building and real-time environment extensions.",
      reason: "Perfect candidate for the Ireland S481 rebate (32%). Netflix is moving episodic volume to Dublin for cost-efficiency.",
      technicalHook: "Unreal 5.4 city-builder toolkit deployment. Real-time compositing for virtual production sequences.",
      rebateIntel: "Section 481 fully utilized. Project optimized for 34% total realization via Dublin labor spend."
    },
    { 
      id: 'kingdom', 
      title: 'Lost Kingdom', 
      studio: 'Amazon MGM Studios', 
      status: 'DEV', 
      executives: ['Lisa Jenkins'], 
      vfxSup: 'TBD', 
      vfxProducer: 'Emily Zhang', 
      directors: ['Ridley Scott'], 
      producers: ['Kevin J. Walsh'], 
      isMotaOpportunity: true, 
      location: 'Malta', 
      territory: 'UK (London)', 
      budget: '$140M', 
      genre: 'Historical Epic', 
      complexity: 'High', 
      fit: 89, 
      quarter: 'Q2 2025', 
      type: 'Feature', 
      synopsis: "Epic historical saga requiring massive crowd simulations and digital set extensions of ancient architecture.",
      reason: "High volume of environment assets fits our new Golaem-to-USD bridge. Amazon is scouting for 2025 anchor vendors.",
      technicalHook: "Large scale historical asset replication. High-fidelity crowd AI integration with Solaris lighting pipeline.",
      rebateIntel: "UK/Malta co-production. Projected 40% effective rebate scenario based on Maltese minority spend."
    },
    { 
      id: 'p4', 
      title: 'Dark Ocean', 
      studio: 'Disney', 
      status: 'POST', 
      executives: ['Kathy L.'], 
      vfxSup: 'Joe Letteri', 
      vfxProducer: 'Emily Zhang', 
      directors: ['James Cameron'], 
      producers: ['Jon Landau'], 
      isMotaOpportunity: false, 
      location: 'Sydney', 
      territory: 'Australia', 
      budget: '$300M', 
      genre: 'Adventure / Fantasy', 
      complexity: 'Extreme', 
      fit: 94, 
      quarter: 'Q1 2025', 
      type: 'Feature', 
      synopsis: "Biological exploration of alien oceanic trenches. Biological translucency and high-fps fluid interaction.",
      reason: "Touchpoint for Kathy L. to secure Q1 capacity. We are bidding the 2026 sequel work currently.",
      technicalHook: "Underwater rendering and light scatter optimization. Benchmarking against Wētā biological asset benchmarks.",
      rebateIntel: "PDV Offset (30%). Strong incentive for Sydney/Melbourne hub utilization."
    },
    {
      id: 'velocity',
      title: 'Velocity',
      studio: 'Sony Pictures',
      status: 'PREP',
      executives: ['Sarah Connor'],
      vfxSup: 'David Chen',
      vfxProducer: 'Alex Parker',
      directors: ['Joseph Kosinski'],
      producers: ['Jerry Bruckheimer'],
      isMotaOpportunity: true,
      location: 'London',
      territory: 'UK',
      budget: '$120M',
      genre: 'Action',
      complexity: 'High',
      fit: 90,
      quarter: 'Q2 2025',
      type: 'Feature',
      synopsis: "High-octane racing drama focusing on autonomous jet fighters.",
      technicalHook: "Aerial photography integration and specialized motion blur optimization. High-speed plate processing.",
      rebateIntel: "Standard UK AVEC (34%). Strategy focuses on pinewood based production spend."
    }
  ],
  people: [
    { 
      id: 'pe1', 
      name: 'Sarah Connor', 
      title: 'SVP, Visual Effects', 
      company: 'Sony Pictures', 
      division: 'Motion Picture Group', 
      type: 'Staff', 
      location: 'Los Angeles', 
      current: 'Project Alpha', 
      past: ['Spider-Man: No Way Home', 'Venom', 'Ghostbusters'], 
      email: 's.connor@sony.com', 
      linkedIn: 'linkedin.com/in/sconnor', 
      imdb: 'imdb.com/nm1234', 
      category: 'STUDIO EXECUTIVES', 
      relationship: 'Hot',
      bio: "20+ years experience. Known for stabilizing high-budget franchises and pioneering EMEA tax incentive optimization.",
      motaNote: "Key champion for our London hub. Prefers fixed-bid scenarios supported by AI breakdown metrics."
    },
    { 
      id: 'pe2', 
      name: 'James Miller', 
      title: 'VP Production', 
      company: 'Netflix', 
      division: 'Original Series', 
      type: 'Staff', 
      location: 'London', 
      current: 'Neon Horizon', 
      past: ['Stranger Things', 'The Witcher', 'The Crown'], 
      email: 'jmiller@netflix.com', 
      linkedIn: 'linkedin.com/in/jmiller', 
      imdb: 'imdb.com/nm5678', 
      category: 'STUDIO EXECUTIVES', 
      relationship: 'Hot',
      bio: "Leads UK Netflix production. Focuses on regional vendor ecosystems and localized talent pipelines in the EU.",
      motaNote: "Highly interested in our Ireland S481 workflow. Critical for Q1-Q2 2025 episodic planning."
    },
    { 
      id: 'pe3', 
      name: 'David Chen', 
      title: 'VFX Supervisor', 
      company: 'Freelance', 
      division: 'Creative Lead', 
      type: 'Freelance', 
      location: 'Vancouver', 
      current: 'Project Alpha', 
      past: ['Inception', 'Dunkirk', 'Tenet'], 
      email: 'david.vfx@gmail.com', 
      linkedIn: 'linkedin.com/in/davidchen', 
      imdb: 'imdb.com/nm9012', 
      category: 'VFX SUPERVISORS', 
      relationship: 'Warm',
      bio: "Auteur-focused supervisor. Specializes in practical/digital seamless integration. Multiple Academy Award nominee.",
      motaNote: "Loyal collaborator of Nolan. Influential in vendor selection for complex environment sequences."
    },
    { 
      id: 'pe4', 
      name: 'Emily Zhang', 
      title: 'VFX Producer', 
      company: 'Disney', 
      division: 'Marvel Studios', 
      type: 'Staff', 
      location: 'Atlanta', 
      current: 'Dark Ocean', 
      past: ['Avengers: Endgame', 'Black Panther'], 
      email: 'e.zhang@marvel.com', 
      linkedIn: 'linkedin.com/in/ezhang', 
      imdb: 'imdb.com/nm3456', 
      category: 'VFX PRODUCERS', 
      relationship: 'Cold',
      bio: "Logistics specialist. Managed 3,500+ shots for the Avengers cycle. Metrics-driven bidding approach.",
      motaNote: "Responds well to volume-based incentive modeling and sustainability reporting."
    },
    { 
      id: 'pe5', 
      name: 'Eric Kohler', 
      title: 'SVP Physical Production', 
      company: 'Warner Bros. Discovery', 
      division: 'Studio Operations', 
      type: 'Staff', 
      location: 'Burbank', 
      current: 'Project Titan', 
      past: ['Dune', 'The Batman', 'Aquaman'], 
      email: 'e.kohler@wbd.com', 
      linkedIn: 'linkedin.com/in/ekohler', 
      category: 'STUDIO EXECUTIVES', 
      relationship: 'Hot',
      bio: "Strategist behind WBD's global production footprint. Heavy focus on ROI and follow-the-sun workflow efficiency.",
      motaNote: "Major contact for Project Titan. Interested in London hub labor qualifying spend for tax optimization."
    },
    { 
      id: 'pe6', 
      name: 'Joe Letteri', 
      title: 'Creative Director', 
      company: 'Wētā FX', 
      division: 'VFX Hub', 
      type: 'Staff', 
      location: 'Wellington', 
      current: 'Dark Ocean', 
      past: ['The Lord of the Rings', 'Avatar'], 
      email: 'joe@weta.co.nz', 
      linkedIn: 'linkedin.com/in/jletteri', 
      imdb: 'imdb.com/nm0503', 
      category: 'VFX SUPERVISORS', 
      relationship: 'Hot',
      bio: "Industry standard for digital performance and character creation. Five-time Academy Award winner.",
      motaNote: "Open to co-vendor models for environment/background extension while Wētā handles hero assets."
    }
  ],
  studios: [
    { 
      id: 's1', 
      name: 'Sony Pictures', 
      parent: 'Sony Group Corp', 
      level: 'Primary Studio', 
      type: 'Major Studio', 
      hq: 'Culver City, CA', 
      divisions: ['Columbia Pictures', 'TriStar', 'Sony Animation', 'Screen Gems'], 
      slateCount: 14, 
      contacts: ['Sarah Connor'], 
      activeProjects: ['Project Alpha', 'Velocity'],
      website: 'sonypictures.com',
      financialHealth: 'Stable / Expanding',
      motaNote: "Key revenue partner. Moving toward a volume-based strategy for 2025."
    },
    { 
      id: 's2', 
      name: 'Netflix', 
      parent: 'Independent', 
      level: 'Streaming Network', 
      type: 'Streamer', 
      hq: 'Los Gatos, CA', 
      divisions: ['Original Film', 'Original Series', 'Animation', 'Games'], 
      slateCount: 42, 
      contacts: ['James Miller', 'Alex Parker'], 
      activeProjects: ['Neon Horizon', 'Stranger Things'],
      website: 'netflix.com',
      financialHealth: 'High Growth',
      motaNote: "Aggressively moving episodic volume to EMEA. Dublin is their primary hub for Q4 2024."
    },
    { 
      id: 's3', 
      name: 'Disney', 
      parent: 'The Walt Disney Company', 
      level: 'Global Conglomerate', 
      type: 'Major Studio', 
      hq: 'Burbank, CA', 
      divisions: ['Marvel Studios', 'Lucasfilm', 'Pixar', 'Disney Live Action'], 
      slateCount: 22, 
      contacts: ['Kathy L.', 'Emily Zhang'], 
      activeProjects: ['Dark Ocean', 'Starfall'],
      website: 'disney.com',
      financialHealth: 'Stable',
      motaNote: "Tight vendor pool. Focus on long-term capacity reservations in Sydney and London."
    },
    { 
      id: 's4', 
      name: 'Amazon MGM Studios', 
      parent: 'Amazon.com', 
      level: 'Tech/Studio Hybrid', 
      type: 'Streamer', 
      hq: 'Culver City, CA', 
      divisions: ['MGM Features', 'Amazon Originals'], 
      slateCount: 18, 
      contacts: ['Lisa Jenkins'], 
      activeProjects: ['Lost Kingdom', 'Cyber City'],
      website: 'amazonstudios.com',
      financialHealth: 'Aggressive Scaling',
      motaNote: "Highly tech-focused. Requires deep cloud-pipeline integration (AWS) for all vendors."
    },
    {
      id: 's5', 
      name: 'Warner Bros. Discovery', 
      parent: 'Warner Bros. Discovery, Inc.', 
      level: 'Major Studio', 
      type: 'Major Studio', 
      hq: 'Burbank, CA', 
      divisions: ['Warner Bros. Pictures', 'New Line', 'DC Studios'], 
      slateCount: 28, 
      contacts: ['Eric Kohler'], 
      activeProjects: ['Project Titan', 'The Void'],
      website: 'wbd.com',
      financialHealth: 'Cost-Optimizing',
      motaNote: "High focus on Project Titan as a proof-of-concept for their 2025 'Global VFX Consolidation' plan."
    }
  ]
};

export type BizDevTab = 'slate' | 'people' | 'studios';

interface BizDevCenterProps {
  onAddToPipeline: (entity: { type: EntityType; id: string; name: string }) => void;
  initialTab?: BizDevTab;
}

export const BizDevCenter: React.FC<BizDevCenterProps> = ({ onAddToPipeline, initialTab = 'slate' }) => {
  const [activeTab, setActiveTab] = useState<BizDevTab>(initialTab);
  const [selection, setSelection] = useState<Selection | null>(null);
  const [matrixQuarter, setMatrixQuarter] = useState<string>('All');
  const [matrixGenre, setMatrixGenre] = useState<string>('All');
  const [selectedHub, setSelectedHub] = useState<string | null>(null);

  // Synchronize internal state with initialTab prop updates from App
  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  const handleSelect = (type: EntityType, id: string) => {
    setSelection({ type, id });
    if (type === 'project') setActiveTab('slate');
    if (type === 'person') setActiveTab('people');
    if (type === 'studio') setActiveTab('studios');
  };

  const selectedData = useMemo(() => {
    if (!selection) return null;
    if (selection.type === 'project') return MASTER_DATA.projects.find(p => p.title === selection.id);
    if (selection.type === 'person') return MASTER_DATA.people.find(p => p.name === selection.id);
    if (selection.type === 'studio') return MASTER_DATA.studios.find(s => s.name === selection.id);
    return null;
  }, [selection]);

  const handlePipelineClick = () => {
    if (selectedData) {
      onAddToPipeline({ type: selection!.type, id: selectedData.id, name: selection!.id });
    }
  };

  const strategicTargets = useMemo(() => {
    let list = MASTER_DATA.projects;
    if (selectedHub) {
       list = list.filter(p => p.location.includes(selectedHub));
    }
    return list.filter(p => p.fit >= 88).sort((a,b) => b.fit - a.fit).slice(0, 3);
  }, [selectedHub]);

  return (
    <div className="h-full flex flex-col bg-dark-base relative overflow-hidden">
      <div className="px-8 pt-6 pb-2 border-b border-dark-border bg-dark-base sticky top-0 z-20 space-y-6">
        <div className="flex justify-between items-end max-w-[1440px] mx-auto">
          <div className="text-left">
            <h1 className="text-3xl font-oswald font-bold uppercase tracking-tight leading-none text-white">Market Intelligence</h1>
            <p className="text-gray-500 text-[10px] mt-1 uppercase tracking-widest font-bold">Strategic BizDev Mission Control</p>
          </div>
          <div className="flex gap-4 items-center">
            <div className="text-[9px] text-gray-600 font-mono flex items-center gap-2 border border-dark-border/40 px-3 py-1 rounded-full bg-dark-surface/30">
               GLOBAL SLATE: <span className="text-mota-pink font-bold">1,248 PROJECTS</span>
               <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_5px_rgba(34,197,94,0.5)]"></span>
            </div>
            <button className="bg-mota-pink px-4 py-2 rounded-xl text-dark-base font-bold text-[10px] uppercase tracking-widest shadow-lg shadow-mota-pink/20 hover:scale-[1.02] transition-all">Export Slate</button>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6 max-w-[1440px] mx-auto text-left">
          {/* GLOBAL HEAT MATRIX SECTION */}
          <div className="col-span-7 bg-dark-surface/20 p-6 rounded-2xl border border-dark-border shadow-xl backdrop-blur-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-mota-pink/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
            <div className="flex justify-between items-center mb-6">
               <div className="space-y-1">
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-mota-pink rounded-full"></span> Global Capacity Matrix
                  </h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <MatrixFilter label="Q" value={matrixQuarter} options={['All', 'Q4 2024', 'Q1 2025', 'Q2 2025']} onChange={setMatrixQuarter} />
                    <MatrixFilter label="G" value={matrixGenre} options={['All', 'Sci-Fi', 'Action', 'Drama', 'Epic']} onChange={setMatrixGenre} />
                  </div>
               </div>
               {selectedHub && (
                 <button onClick={() => setSelectedHub(null)} className="text-[9px] font-bold text-mota-pink uppercase tracking-widest hover:underline">Clear Hub Selection</button>
               )}
            </div>
            <GlobalHeatMatrix selectedHub={selectedHub} onHubSelect={setSelectedHub} />
          </div>

          <div className="col-span-5 space-y-3 flex flex-col h-full text-left">
             <div className="flex justify-between items-center px-1">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">AI High-Priority Matches</h3>
                <span className="text-[8px] text-blue-400 font-bold uppercase tracking-widest">Live Slate Logic</span>
             </div>
             <div className="grid grid-cols-1 gap-3 flex-1 overflow-y-auto max-h-[220px] custom-scrollbar">
                {strategicTargets.length > 0 ? strategicTargets.map(proj => (
                  <div key={proj.id} onClick={() => handleSelect('project', proj.title)} className="p-3 bg-dark-surface/30 border border-dark-border rounded-2xl hover:border-mota-pink transition-all cursor-pointer group relative overflow-hidden shadow-lg flex gap-4">
                    <div className="absolute top-2 right-3 text-right"><div className="text-lg font-oswald font-bold text-mota-pink leading-none">{proj.fit}%</div></div>
                    <div className="w-10 h-10 bg-dark-base rounded-xl flex items-center justify-center border border-dark-border group-hover:border-mota-pink/40 transition-all shrink-0"><span className="text-lg font-oswald font-bold text-white leading-none tracking-tighter">{proj.title[0]}</span></div>
                    <div className="flex-1 min-w-0 pr-8">
                      <div className="flex items-center gap-2 mb-0.5"><div className="text-sm font-oswald font-bold text-white group-hover:text-mota-pink transition-colors uppercase truncate tracking-tight">{proj.title}</div></div>
                      <div className="flex items-center gap-2 text-[8px] text-gray-600 uppercase font-bold tracking-tighter truncate"><span className="text-gray-400">{proj.studio}</span><span className="w-0.5 h-0.5 bg-dark-border rounded-full"></span><span className="text-blue-500/70">{proj.location}</span></div>
                    </div>
                  </div>
                )) : (
                  <div className="flex flex-col items-center justify-center h-full opacity-30 text-center py-10">
                    <p className="text-[10px] font-bold uppercase tracking-widest">No matching targets for {selectedHub}</p>
                  </div>
                )}
             </div>
          </div>
        </div>

        {/* NAVIGATION: LEFT-ALIGNED SEGMENTED CONTROL */}
        <div className="flex justify-start max-w-[1440px] mx-auto pb-4">
          <div className="bg-dark-surface/50 border border-dark-border p-1 rounded-2xl flex gap-1 shadow-2xl backdrop-blur-md">
            <NavTab active={activeTab === 'slate'} onClick={() => setActiveTab('slate')} label="Production Slate" icon="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2" />
            <NavTab active={activeTab === 'people'} onClick={() => setActiveTab('people')} label="Talent & Execs" icon="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            <NavTab active={activeTab === 'studios'} onClick={() => setActiveTab('studios')} label="Studios" icon="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        {activeTab === 'slate' && <ProductionDatabase onSelect={handleSelect} />}
        {activeTab === 'people' && <PeopleDirectory onSelect={handleSelect} />}
        {activeTab === 'studios' && <StudiosDatabase onSelect={handleSelect} />}
      </div>

      {selection && (
        <div className="absolute inset-y-0 right-0 w-[700px] bg-dark-surface border-l border-dark-border shadow-[0_0_100px_rgba(0,0,0,0.8)] z-50 transform transition-transform animate-in slide-in-from-right duration-500 flex flex-col text-left">
          <div className="p-5 border-b border-dark-border flex justify-between items-center bg-dark-base/80 backdrop-blur-md">
            <div className="flex items-center gap-4"><span className="text-[10px] font-bold uppercase tracking-[0.2em] text-mota-pink border border-mota-pink/30 px-3 py-1 rounded bg-mota-pink/5">{selection.type} Intelligence</span></div>
            <button onClick={() => setSelection(null)} className="p-2 hover:bg-white/5 rounded-full text-gray-400 hover:text-white transition-all"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
          </div>

          <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
            {selection.type === 'project' && selectedData && <ProjectDetail data={selectedData} onNavigate={handleSelect} />}
            {selection.type === 'person' && selectedData && <PersonDetail data={selectedData} onNavigate={handleSelect} />}
            {selection.type === 'studio' && selectedData && <StudioDetail data={selectedData} onNavigate={handleSelect} />}
          </div>

          <div className="p-8 bg-dark-base border-t border-dark-border flex gap-4">
            <button onClick={handlePipelineClick} className="flex-1 bg-mota-pink text-dark-base font-bold py-3 rounded uppercase text-[10px] tracking-widest shadow-xl">Add to Pipeline</button>
            <button className="flex-1 bg-dark-surface border border-dark-border text-white font-bold py-3 rounded uppercase text-[10px] tracking-widest hover:border-mota-pink">Audit Trail</button>
          </div>
        </div>
      )}
    </div>
  );
};

// --- MATRIX COMPONENT ---
const GlobalHeatMatrix: React.FC<{ selectedHub: string | null; onHubSelect: (h: string) => void }> = ({ selectedHub, onHubSelect }) => {
  const studios = ['Sony', 'Netflix', 'Disney', 'Warner', 'Amazon'];
  const hubs = ['London', 'Dublin', 'LA', 'Vancouver', 'Sydney'];
  
  return (
    <div className="grid grid-cols-6 gap-2 min-w-[500px]">
      <div className="h-6"></div>
      {hubs.map(hub => (
        <div key={hub} className="text-center">
          <button 
            onClick={() => onHubSelect(hub)}
            className={`text-[8px] font-black uppercase tracking-widest transition-all ${selectedHub === hub ? 'text-mota-pink' : 'text-gray-500 hover:text-white'}`}
          >
            {hub}
          </button>
        </div>
      ))}
      {studios.map(studio => (
        <React.Fragment key={studio}>
          <div className="flex items-center text-[9px] font-bold text-gray-400 uppercase tracking-tight h-10 border-r border-dark-border/20 pr-4">
            {studio}
          </div>
          {hubs.map(hub => {
             // Mock heat value calculation based on Master Data project counts per hub
             const projectCount = MASTER_DATA.projects.filter(p => p.studio.includes(studio) && p.location.includes(hub)).length;
             const heatLevel = projectCount > 2 ? 'high' : projectCount > 1 ? 'medium' : projectCount > 0 ? 'low' : 'none';
             const isHubActive = selectedHub === hub;

             return (
               <div 
                 key={`${studio}-${hub}`} 
                 className={`h-10 rounded-lg transition-all duration-300 relative group cursor-pointer border ${
                    isHubActive ? 'border-mota-pink/50 scale-105 z-10' : 'border-white/5'
                 } ${
                    heatLevel === 'high' ? 'bg-mota-pink/30 shadow-[inset_0_0_10px_rgba(255,133,133,0.1)]' : 
                    heatLevel === 'medium' ? 'bg-orange-500/10' : 
                    heatLevel === 'low' ? 'bg-blue-400/5' : 'bg-dark-base/20'
                 } hover:border-mota-pink/40 hover:bg-mota-pink/10`}
               >
                 {projectCount > 0 && (
                   <div className="absolute inset-0 flex items-center justify-center">
                      <div className={`w-1.5 h-1.5 rounded-full ${heatLevel === 'high' ? 'bg-mota-pink shadow-[0_0_5px_#FF8585]' : 'bg-white/40'}`}></div>
                   </div>
                 )}
                 <div className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity bg-dark-surface border border-dark-border px-1.5 py-0.5 rounded shadow-xl z-50 pointer-events-none">
                    <span className="text-[7px] font-black text-white uppercase whitespace-nowrap">{projectCount} Active Titles</span>
                 </div>
               </div>
             );
          })}
        </React.Fragment>
      ))}
    </div>
  );
};

// --- RICH DETAIL COMPONENTS ---

const ProjectDetail: React.FC<{ data: any; onNavigate: any }> = ({ data, onNavigate }) => (
  <div className="space-y-12 animate-in fade-in slide-in-from-bottom-2 duration-400">
    <div>
      <h2 className="text-5xl font-oswald font-bold uppercase mb-2 leading-none text-white tracking-tight">{data.title}</h2>
      <button onClick={() => onNavigate('studio', data.studio)} className="text-mota-pink text-lg font-bold uppercase tracking-tight hover:underline">{data.studio}</button>
      <p className="text-gray-400 text-sm mt-4 leading-relaxed font-medium">"{data.synopsis}"</p>
    </div>
    <div className="grid grid-cols-3 gap-6">
      <StatsBlock label="AI Fit Score" value={`${data.fit}%`} color="text-mota-pink" />
      <StatsBlock label="Complexity" value={data.complexity} color="text-yellow-500" />
      <StatsBlock label="Quarter" value={data.quarter} />
    </div>
    <DetailGrid title="Creative Stakeholders">
      <DetailItem label="Director(s)" value={data.directors.join(', ')} />
      <DetailItem label="Producer(s)" value={data.producers.join(', ')} />
      <DetailItem label="VFX Supervisor" value={data.vfxSup} isLink onClick={() => data.vfxSup !== 'TBD' && onNavigate('person', data.vfxSup)} />
      <DetailItem label="VFX Producer" value={data.vfxProducer} isLink onClick={() => onNavigate('person', data.vfxProducer)} />
    </DetailGrid>
    <div className="grid grid-cols-2 gap-8">
      <div className="bg-dark-base/50 p-6 rounded-2xl border border-dark-border shadow-xl">
        <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">Production Hook</h3>
        <p className="text-xs text-gray-400 leading-relaxed italic">{data.technicalHook}</p>
      </div>
      <div className="bg-emerald-500/5 p-6 rounded-2xl border border-emerald-500/20 shadow-xl">
        <h3 className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-4">Rebate Optimization</h3>
        <p className="text-xs text-gray-500 leading-relaxed italic">{data.rebateIntel}</p>
      </div>
    </div>
  </div>
);

const PersonDetail: React.FC<{ data: any; onNavigate: any }> = ({ data, onNavigate }) => (
  <div className="space-y-12 animate-in fade-in slide-in-from-bottom-2 duration-400">
    <div className="flex gap-8 items-start">
      <div className="w-24 h-24 bg-mota-pink text-dark-base rounded-[2rem] flex items-center justify-center font-oswald text-4xl font-bold shadow-xl shrink-0 border-4 border-dark-border">{data.name.split(' ').map((n: string) => n[0]).join('')}</div>
      <div>
        <h2 className="text-5xl font-oswald font-bold uppercase mb-1 leading-none text-white tracking-tight">{data.name}</h2>
        <div className="text-xl text-gray-400 font-medium mb-3">{data.title}</div>
        <div className="flex items-center gap-2"><div className={`w-2 h-2 rounded-full ${data.relationship === 'Hot' ? 'bg-orange-500 shadow-[0_0_8px_#f97316]' : 'bg-green-400'}`}></div><span className="text-[10px] font-black uppercase tracking-widest text-white">{data.relationship} Relationship</span></div>
      </div>
    </div>
    <div className="bg-dark-base/50 p-8 rounded-3xl border border-dark-border shadow-xl">
      <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">Dossier Narrative</h3>
      <p className="text-sm text-gray-300 leading-relaxed">{data.bio}</p>
      <div className="mt-6 pt-6 border-t border-dark-border/50 text-[10px] text-mota-pink font-bold uppercase italic tracking-widest">"{data.motaNote}"</div>
    </div>
    <DetailGrid title="Current Deployment">
      <DetailItem label="Company" value={data.company} isLink onClick={() => data.company !== 'Freelance' && onNavigate('studio', data.company)} />
      <DetailItem label="Active Show" value={data.current} isLink onClick={() => onNavigate('project', data.current)} />
      <DetailItem label="Location" value={data.location} />
      <DetailItem label="Contract" value={data.type} isBadge />
    </DetailGrid>
    <div>
      <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4 border-b border-dark-border pb-2">Verified Production History</h3>
      <div className="flex flex-wrap gap-2">
        {data.past.map((proj: string) => (
          <span key={proj} onClick={() => onNavigate('project', proj)} className="px-3 py-1 bg-dark-base border border-dark-border rounded-xl text-[10px] font-bold text-gray-400 uppercase cursor-pointer hover:text-mota-pink hover:border-mota-pink transition-all">{proj}</span>
        ))}
      </div>
    </div>
  </div>
);

const StudioDetail: React.FC<{ data: any; onNavigate: any }> = ({ data, onNavigate }) => (
  <div className="space-y-12 animate-in fade-in slide-in-from-bottom-2 duration-400">
    <div className="flex justify-between items-start">
      <div>
        <h2 className="text-5xl font-oswald font-bold uppercase mb-2 leading-none text-white tracking-tight">{data.name}</h2>
        <div className="text-gray-400 text-lg font-bold uppercase tracking-widest">{data.parent}</div>
      </div>
      <div className="bg-dark-base p-6 rounded-2xl border border-dark-border text-center shadow-xl min-w-[120px]">
         <div className="text-[10px] text-gray-500 uppercase mb-1 font-bold">Verified Slate</div>
         <div className="text-4xl font-oswald font-bold text-mota-pink">{data.slateCount}</div>
      </div>
    </div>
    <div className="p-6 bg-mota-pink/5 rounded-2xl border border-mota-pink/20">
       <h4 className="text-[10px] font-bold text-mota-pink uppercase mb-2 tracking-widest">Internal Strategy Insight</h4>
       <p className="text-sm text-gray-400 leading-relaxed italic">"{data.motaNote}"</p>
    </div>
    <DetailGrid title="Corporate Intelligence">
      <DetailItem label="HQ Location" value={data.hq} />
      <DetailItem label="Key Executives" value={data.contacts.join(', ')} isLink onClick={() => onNavigate('person', data.contacts[0])} />
      <DetailItem label="Health Rating" value={data.financialHealth} color="text-emerald-400" />
      <DetailItem label="Studio Tier" value={data.type} isBadge />
    </DetailGrid>
    <div>
      <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4 border-b border-dark-border pb-2">Engaged Production Slate</h3>
      <div className="grid grid-cols-2 gap-4">
        {data.activeProjects.map((p: string) => (
          <div key={p} onClick={() => onNavigate('project', p)} className="p-4 bg-dark-base border border-dark-border rounded-xl hover:border-mota-pink transition-all cursor-pointer group">
             <div className="text-sm font-bold text-white group-hover:text-mota-pink transition-colors uppercase tracking-tight">{p}</div>
             <div className="text-[9px] text-gray-500 uppercase font-bold mt-1 tracking-widest">Active Intelligence Link</div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// --- ATOMIC UI COMPONENTS ---

const StatsBlock: React.FC<{ label: string; value: any; color?: string }> = ({ label, value, color = 'text-white' }) => (
  <div className="bg-dark-base/50 p-6 rounded-2xl border border-dark-border text-center shadow-xl">
    <div className="text-[9px] text-gray-500 uppercase tracking-widest mb-1 font-bold">{label}</div>
    <div className={`text-2xl font-oswald font-bold ${color}`}>{value}</div>
  </div>
);

const DetailGrid: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="text-left">
    <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-6 border-b border-dark-border pb-2">{title}</h3>
    <div className="grid grid-cols-2 gap-y-6 gap-x-12">
      {children}
    </div>
  </div>
);

const DetailItem: React.FC<{ label: string; value: any; isLink?: boolean; onClick?: any; isBadge?: boolean; color?: string }> = ({ label, value, isLink, onClick, isBadge, color }) => (
  <div className="text-left">
    <div className="text-[10px] text-gray-500 uppercase tracking-tighter mb-1 font-bold">{label}</div>
    {isBadge ? (
      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${color || 'bg-dark-surface text-gray-300 border-dark-border'}`}>{value}</span>
    ) : isLink ? (
      <button onClick={onClick} className="text-mota-pink font-bold hover:underline text-sm text-left uppercase tracking-tight transition-all">{value}</button>
    ) : (
      <div className={`text-sm font-bold tracking-tight ${color || 'text-white'}`}>{value}</div>
    )}
  </div>
);

const MatrixFilter: React.FC<{ label: string; value: string; options: string[]; onChange: (v: string) => void }> = ({ label, value, options, onChange }) => (
  <div className="flex items-center gap-1.5 bg-dark-base border border-dark-border/40 rounded px-2 py-0.5">
    <span className="text-[7px] font-black text-gray-600 uppercase tracking-widest">{label}:</span>
    <select value={value} onChange={(e) => onChange(e.target.value)} className="bg-transparent text-[9px] font-bold text-gray-300 focus:outline-none cursor-pointer uppercase tracking-tight">
      {options.map(opt => <option key={opt} value={opt} className="bg-dark-surface text-white">{opt}</option>)}
    </select>
  </div>
);

const NavTab: React.FC<{ active: boolean; onClick: () => void; label: string; icon: string }> = ({ active, onClick, label, icon }) => (
  <button 
    onClick={onClick} 
    className={`px-6 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all flex items-center gap-3 ${active ? 'bg-mota-pink text-dark-base shadow-xl' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
  >
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
    </svg>
    {label}
  </button>
);

export const ToolbarButton: React.FC<{ icon: string; label: string; badge?: string }> = ({ icon, label, badge }) => (
  <button className="flex items-center gap-2 px-3 py-1.5 rounded hover:bg-dark-surface text-gray-400 hover:text-white transition-all">
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} /></svg>
    <span className="text-[11px] font-semibold">{label}</span>
    {badge && <span className="text-[10px] bg-mota-pink/20 text-mota-pink px-1.5 rounded font-bold ml-1 uppercase">{badge}</span>}
  </button>
);
