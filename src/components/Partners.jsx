import React from 'react';

// --- IMPORTAÇÃO DOS LOGOS ---
import logoAgropalma from '../assets/logos/Agropalma-Logo.png';
import logoAperam from '../assets/logos/APERAM-LOGO-200x113.png';
import logoArauco from '../assets/logos/ARAUCO-LOGO-200x37.png';
import logoArborGen from '../assets/logos/ArborGen-2021-Logo-with-Tagline-SMALL-200x145.png';
import logoArcelor from '../assets/logos/ARCELORMITTAL-LOGO-200x113.png';
import logoBracell from '../assets/logos/bracell-logo-200x45.png';
import logoBunge from '../assets/logos/Bunge-Logo-200x46.png';
import logoCenibra from '../assets/logos/CENIBRA-LOGO-200x198.png';
import logoCmpc from '../assets/logos/Logo-CMPC-1024x496.png';
import logoConcrem from '../assets/logos/CONCREM.png';
import logoDeforsa from '../assets/logos/DEFORSA-LOGO-200x228.png';
import logoDexco from '../assets/logos/logo-dexco.jpg';
import logoGerdau from '../assets/logos/GERDAU-LOGO-HORIZONTAL-200x113.png';
import logoGrupoIndex from '../assets/logos/GRUPO-INDEX-LOGO-200x78.png';
import logoAssociadaUnknown from '../assets/logos/associadas-13-1-e1568898614510.jpg'; 
import logoLdCelulose from '../assets/logos/LD-CELULOSE-1.png';
import logoGrupoMaringa from '../assets/logos/GRUPO-MARINGA-LOGO-200x112.png';
import logoMetalSider from '../assets/logos/Metal-Sider-Logo-200x113.png';
import logoMontesDelPlata from '../assets/logos/Logo-Montes-del-Plata-200x100.png';
import logoPanBioenergia from '../assets/logos/PAN-BIOENERGIA.png';
import logoParacel from '../assets/logos/PARACEL-LOGO-200x47.png';
import logoPlacasDoBrasil from '../assets/logos/Placas-Do-Brasil-LOGO-200x67.png';
import logoSinobras from '../assets/logos/SINOBRAS-LOGO-200x71.png';
import logoSmurfit from '../assets/logos/SMURFIT-WESTROCK-1.png';
import logoSuzano from '../assets/logos/SUZANO-HORIZONTAL-LOGO-200x53.png';
import logoForestCompany from '../assets/logos/THE-FOREST-COMPANY.png';
import logoVallourec from '../assets/logos/VALLOUREC-LOGO-200x47.png';
import logoVeracel from '../assets/logos/VERACEL-LOGO-200x73.png';
import logoVetorial from '../assets/logos/Vetorial-Logo-200x113.png';

export default function Partners() {
  const partners = [
    { name: 'Suzano', src: logoSuzano },
    { name: 'Gerdau', src: logoGerdau },
    { name: 'ArcelorMittal', src: logoArcelor },
    { name: 'Cenibra', src: logoCenibra },
    { name: 'Veracel', src: logoVeracel },
    { name: 'Aperam', src: logoAperam },
    { name: 'Bracell', src: logoBracell },
    { name: 'Vallourec', src: logoVallourec },
    { name: 'Arauco', src: logoArauco },
    { name: 'CMPC', src: logoCmpc },
    { name: 'Smurfit Westrock', src: logoSmurfit },
    { name: 'Dexco', src: logoDexco },
    { name: 'LD Celulose', src: logoLdCelulose },
    { name: 'Agropalma', src: logoAgropalma },
    { name: 'Bunge', src: logoBunge },
    { name: 'ArborGen', src: logoArborGen },
    { name: 'Placas do Brasil', src: logoPlacasDoBrasil },
    { name: 'Paracel', src: logoParacel },
    { name: 'Montes del Plata', src: logoMontesDelPlata },
    { name: 'Sinobras', src: logoSinobras },
    { name: 'Vetorial', src: logoVetorial },
    { name: 'Metal Sider', src: logoMetalSider },
    { name: 'Grupo Maringá', src: logoGrupoMaringa },
    { name: 'Grupo Index', src: logoGrupoIndex },
    { name: 'Deforsa', src: logoDeforsa },
    { name: 'Concrem', src: logoConcrem },
    { name: 'The Forest Company', src: logoForestCompany },
    { name: 'Pan Bioenergia', src: logoPanBioenergia },
    { name: 'Outros', src: logoAssociadaUnknown },
  ];

  const duplicatedPartners = [...partners, ...partners];

  return (
      // ALTERADO: Aumentei para 'my-40' (mais espaço vertical)
      <div className="wrapper my-40 border-y border-gray-100 bg-[#f8f9fa] py-16 relative overflow-hidden">
        
        <div className="text-center mb-14">
            <h3 className="text-2xl md:text-3xl font-bold uppercase tracking-widest text-gray-400">
                Nossos Parceiros
            </h3>
        </div>

        <div className="relative w-full overflow-hidden group">
            
            <div className="absolute top-0 left-0 h-full w-32 bg-gradient-to-r from-[#f8f9fa] to-transparent z-10 pointer-events-none"></div>
            <div className="absolute top-0 right-0 h-full w-32 bg-gradient-to-l from-[#f8f9fa] to-transparent z-10 pointer-events-none"></div>

            {/* ALTERADO: Removi a classe 'hover:[animation-play-state:paused]' */}
            <div className="flex w-max animate-scroll" style={{ animationDuration: '80s' }}>
                {duplicatedPartners.map((partner, index) => (
                    <div 
                        key={index} 
                        className="flex items-center justify-center mx-8 w-[180px] h-[100px] opacity-100 grayscale-0 hover:scale-105 transition-all duration-300 cursor-pointer"
                        title={partner.name}
                    >
                        <img 
                            src={partner.src} 
                            alt={partner.name} 
                            className="max-h-16 max-w-full object-contain mix-blend-multiply" 
                        />
                    </div>
                ))}
            </div>
        </div>
      </div>
  );
}