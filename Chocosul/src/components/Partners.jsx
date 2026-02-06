import React from 'react';

export default function Partners() {
  const brands = ['Mondelez', 'Heinz', 'Ferrero', 'Lacta', 'Trident', 'Nutella', 'Oreo', 'Tang', 'Nestlé', 'Bauducco'];

  return (
      <div className="wrapper my-24">
        <div className="text-center mb-10">
            <span className="text-sm font-bold uppercase tracking-[0.3em] text-gray-600">Nossos Parceiros</span>
        </div>
        <div className="w-full py-8 overflow-hidden relative border-y border-gray-200/60 bg-[#f8f9fa] h-32 flex items-center justify-center">
            <div className="absolute inset-y-0 left-0 w-48 bg-gradient-to-r from-[#f8f9fa] to-transparent z-40"></div>
            <div className="absolute inset-y-0 right-0 w-48 bg-gradient-to-l from-[#f8f9fa] to-transparent z-40"></div>
            <div className="absolute inset-0 flex items-center z-20 pointer-events-none"
                 style={{ maskImage: 'linear-gradient(90deg, transparent 0%, transparent 42%, black 50%, transparent 58%, transparent 100%)', WebkitMaskImage: 'linear-gradient(90deg, transparent 0%, transparent 42%, black 50%, transparent 58%, transparent 100%)' }}>
                <div className="flex w-max animate-scroll gap-32">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="flex gap-32 shrink-0">
                            {brands.map((brand, idx) => (
                               <h3 key={idx} className="text-4xl font-bold font-heading uppercase text-[#D91A3C] tracking-tight whitespace-nowrap drop-shadow-md">{brand}</h3>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
            <div className="absolute inset-0 flex items-center z-10 pointer-events-none"
                 style={{ maskImage: 'linear-gradient(90deg, black 0%, black 42%, transparent 50%, black 58%, black 100%)', WebkitMaskImage: 'linear-gradient(90deg, black 0%, black 42%, transparent 50%, black 58%, black 100%)' }}>
                <div className="flex w-max animate-scroll gap-32">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="flex gap-32 shrink-0">
                            {brands.map((brand, idx) => (
                               <h3 key={idx} className="text-4xl font-bold font-heading uppercase text-gray-400 tracking-tight whitespace-nowrap">{brand}</h3>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </div>
  );
}