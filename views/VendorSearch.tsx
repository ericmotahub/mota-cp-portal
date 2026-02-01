
import React from 'react';

export const VendorSearch: React.FC = () => {
  return (
    <div className="flex h-full bg-dark-base">
      <div className="w-80 border-r border-dark-border flex flex-col p-6 overflow-y-auto shrink-0">
        <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-6">Filters</h2>
        
        <div className="space-y-6">
          <FilterGroup title="Territory" options={['UK Vendors', 'Canada (BC)', 'Australia', 'Hungary']} />
          <FilterGroup title="Specialty" options={['Creature FX', 'Environments', 'FX Simulation', 'Hard Surface']} />
          <FilterGroup title="Availability" options={['Q4 Availability', 'Avail Now', '2026 Ready']} />
          <FilterGroup title="Capacity" options={['Full Service', 'Boutique']} />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8">
        <header className="mb-8">
          <h1 className="text-4xl font-oswald font-bold mb-1">United Kingdom</h1>
          <p className="text-gray-400 text-sm">42 Partners found matching criteria</p>
        </header>

        <div className="space-y-4">
          <VendorRow 
            name="Vertex VFX" 
            location="London (Soho)" 
            type="Full Service" 
            tax="25.5%" 
            avail="Avail Q4" 
            availColor="text-green-400"
          />
          <VendorRow 
            name="Nebula Studios" 
            location="London (Shoreditch)" 
            type="Animation" 
            tax="25.5%" 
            avail="Limited" 
            availColor="text-yellow-400"
          />
          <VendorRow 
            name="Pixel Forge" 
            location="Manchester" 
            type="Compositing" 
            tax="25.5%" 
            avail="Avail Now" 
            availColor="text-green-400"
          />
          <VendorRow 
            name="Ironclad Post" 
            location="Bristol" 
            type="Environments" 
            tax="25.5%" 
            avail="Avail Q4" 
            availColor="text-green-400"
          />
        </div>
      </div>

      <div className="w-1/3 bg-[#111] relative overflow-hidden">
        {/* Mock Map View */}
        <div className="absolute inset-0 flex items-center justify-center opacity-30">
          <svg className="w-full h-full" viewBox="0 0 800 600" fill="none" xmlns="http://www.w3.org/2000/svg">
             <path d="M100 100 Q 200 50, 300 100 T 500 150 T 700 100" stroke="white" strokeWidth="2" />
             <circle cx="450" cy="300" r="10" fill="#FF8585" />
             <circle cx="480" cy="320" r="15" fill="#FF8585" opacity="0.4" />
             <circle cx="430" cy="350" r="8" fill="#FF8585" />
             <circle cx="500" cy="280" r="12" fill="#FF8585" />
          </svg>
        </div>
        
        <div className="absolute top-6 right-6 bg-dark-surface/90 border border-dark-border p-4 rounded-lg backdrop-blur-md w-48 shadow-2xl">
          <div className="text-[10px] uppercase font-bold text-gray-500 mb-2">Region Info</div>
          <div className="flex justify-between text-xs mb-1"><span>Region</span><span className="font-bold">UK / Europe</span></div>
          <div className="flex justify-between text-xs mb-1"><span>Incentive</span><span className="font-bold">25.5% - 34%</span></div>
          <div className="flex justify-between text-xs"><span>Total Cap</span><span className="font-bold text-mota-pink">~4,500 Artists</span></div>
        </div>
      </div>
    </div>
  );
};

const FilterGroup: React.FC<{ title: string; options: string[] }> = ({ title, options }) => (
  <div>
    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-tighter mb-3">{title}</h3>
    <div className="space-y-2">
      {options.map(opt => (
        <label key={opt} className="flex items-center gap-2 group cursor-pointer">
          <input type="checkbox" className="hidden" />
          <div className="w-4 h-4 border border-dark-border rounded group-hover:border-mota-pink transition-colors"></div>
          <span className="text-sm text-gray-500 group-hover:text-white transition-colors">{opt}</span>
        </label>
      ))}
    </div>
  </div>
);

const VendorRow: React.FC<{ name: string; location: string; type: string; tax: string; avail: string; availColor: string }> = ({ name, location, type, tax, avail, availColor }) => (
  <div className="bg-dark-surface p-6 rounded-lg border border-dark-border flex justify-between items-center hover:border-mota-pink transition-all group cursor-pointer">
    <div className="border-l-4 border-mota-pink pl-6">
      <h3 className="text-lg font-bold group-hover:text-mota-pink transition-colors">{name}</h3>
      <div className="text-sm text-gray-500">{location} • {type}</div>
    </div>
    <div className="text-right">
      <div className="text-xs text-gray-500 mb-1 uppercase tracking-widest">Tax: {tax}</div>
      <div className={`text-sm font-bold uppercase ${availColor}`}>{avail}</div>
    </div>
  </div>
);
