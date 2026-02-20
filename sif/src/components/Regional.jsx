import React from 'react';
import { Map as MapIcon, Navigation } from 'lucide-react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export default function Regional() {
  const regionalCities = [
    { name: "Eunápolis", coords: [-16.3722, -39.5757] },
    { name: "Porto Seguro", coords: [-16.4497, -39.0647] },
    { name: "Itabela", coords: [-16.5707, -39.5539] },
    { name: "Itamaraju", coords: [-17.0398, -39.5317] },
    { name: "Teixeira de Freitas", coords: [-17.5369, -39.7303] },
    { name: "Belmonte", coords: [-15.8622, -38.8817] },
    { name: "Guaratinga", coords: [-16.5683, -39.7916] },
    { name: "S. Cruz Cabrália", coords: [-16.2796, -39.0253] }
  ];

  const mapCenter = [-16.6, -39.3];

  return (
      <section className="w-full py-32 bg-white relative overflow-hidden border-t border-gray-100">
        <div className="container grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-5 relative z-10 flex flex-col items-start">
                <div className="inline-flex items-center px-3 py-1 border border-[#D91A3C] rounded-full mb-8 bg-[#D91A3C]/5">
                    <MapIcon size={14} className="mr-2 text-[#D91A3C]" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#D91A3C]">Extremo Sul</span>
                </div>
                
                {/* CORREÇÃO: text-[#111] -> text-text-main */}
                <h2 className="text-3xl md:text-4xl font-bold uppercase leading-tight mb-8 section-heading text-text-main">
                    Atuamos <span className="text-[#D91A3C]">Em</span>
                </h2>

                <p className="text-gray-600 text-sm leading-relaxed max-w-md mb-10 font-medium">
                    Sediada em <strong>Eunápolis</strong>, nossa operação garante a capilaridade necessária para conectar sua marca aos principais mercados da região com total eficiência.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-4 w-full">
                    {regionalCities.map((city, i) => (
                        <div key={i} className="flex items-center gap-3 py-1 border-b border-gray-50 last:border-0 group cursor-default">
                            <div className="w-1.5 h-1.5 bg-[#D91A3C] rounded-full group-hover:scale-125 transition-transform"></div>
                            <span className="text-[11px] font-bold uppercase tracking-widest text-gray-800 transition-colors">{city.name}</span>
                        </div>
                    ))}
                </div>
                <div className="mt-12 flex items-center gap-4 group">
                    <div className="w-12 h-12 bg-[#111] text-white rounded-2xl flex items-center justify-center group-hover:bg-[#D91A3C] transition-colors shadow-lg"><Navigation size={20} /></div>
                    <div>
                        {/* CORREÇÃO: text-[#111] -> text-text-main */}
                        <span className="block text-xs font-bold uppercase tracking-widest text-text-main">Logística Local</span>
                        <span className="text-[10px] text-gray-400 font-medium uppercase tracking-tighter">Entregas em até 24h na região</span>
                    </div>
                </div>
            </div>

            <div className="lg:col-span-7 relative flex justify-center items-center h-[500px] w-full">
                <div className="w-full h-full rounded-[40px] overflow-hidden shadow-2xl border border-gray-200 relative z-0">
                    <MapContainer 
                        center={mapCenter} 
                        zoom={9} 
                        scrollWheelZoom={false} 
                        className="w-full h-full z-0"
                        style={{ background: '#f8f9fa' }}
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                        />
                        {regionalCities.map((city, idx) => (
                            <CircleMarker 
                                key={idx}
                                center={city.coords}
                                pathOptions={{ color: '#D91A3C', fillColor: '#D91A3C', fillOpacity: 0.8, weight: 2 }}
                                radius={6}
                            >
                                <Popup>
                                    <span className="font-bold text-[#D91A3C] uppercase text-xs">{city.name}</span>
                                </Popup>
                            </CircleMarker>
                        ))}
                    </MapContainer>
                </div>
            </div>
        </div>
      </section>
  );
}