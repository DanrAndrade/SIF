import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import NoiseOverlay from '../components/ui/NoiseOverlay';
import { Check, ArrowRight, Map, Shield, Settings, Sprout, Leaf, ChevronDown } from 'lucide-react';

// Importando o icone para o favicon
import iconLogo from '../assets/icone.svg'; 

export default function AreasAtuacao() {
  const { hash } = useLocation();

  useEffect(() => {
    document.title = "SIF | Áreas de Atuação";
    
    const link = document.querySelector("link[rel~='icon']");
    if (link) {
      link.href = iconLogo;
    } else {
      const newLink = document.createElement('link');
      newLink.rel = 'icon';
      newLink.href = iconLogo;
      document.head.appendChild(newLink);
    }

    window.scrollTo(0, 0);
    if (hash) {
      const element = document.querySelector(hash);
      if (element) {
        setTimeout(() => {
          const yOffset = -120;
          const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }, 300);
      }
    }
  }, [hash]);

  const scrollToContent = () => {
    window.scrollTo({ top: window.innerHeight - 100, behavior: 'smooth' });
  };

  const areas = [
    {
      id: "silvicultura",
      title: "Silvicultura",
      tagline: "Cultivando o Futuro",
      desc: "A arte e a ciência de cultivar florestas. Focamos no plantio, regeneração e melhoramento genético para garantir produtividade sustentável.",
      icon: <Sprout className="w-6 h-6" />,
      // IMAGEM ATUALIZADA: Mudas e plantio
      image: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?q=80&w=2070&auto=format&fit=crop",
      items: ["Biotecnologia", "Controle de Plantas Invasoras", "Dendrologia", "Ecologia Florestal", "Genética e Melhoramento", "Propagação de Plantas", "Sementes e Mudas", "Sistemas Agroflorestais", "Solos e Fertilização", "Técnicas Silviculturais"]
    },
    {
      id: "manejo",
      title: "Manejo Florestal",
      tagline: "Inteligência e Estratégia",
      desc: "Planejamento estratégico para o uso racional dos recursos, assegurando a colheita contínua sem comprometer o ecossistema.",
      icon: <Map className="w-6 h-6" />,
      // IMAGEM ATUALIZADA: Floresta densa e planejada
      image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2071&auto=format&fit=crop",
      items: ["Computação Aplicada", "Colheita e Transporte", "Inventário Florestal", "Economia Florestal", "Planejamento e Admin.", "Ergonomia e Segurança", "Estradas Florestais", "Sensoriamento Remoto", "Manejo Sustentável", "Sistemas GIS"]
    },
    {
      id: "ambiencia",
      title: "Ambiência",
      tagline: "Harmonia e Sustentabilidade",
      desc: "O equilíbrio vital entre produção e conservação. Estudos de impacto, biodiversidade e a relação da floresta com a sociedade.",
      icon: <Leaf className="w-6 h-6" />,
      image: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?q=80&w=2070&auto=format&fit=crop",
      items: ["Arborização e Paisagismo", "Impactos Ambientais", "Meio Ambiente", "Manejo de Bacias", "Parques e Reservas", "Reciclagem Urbana", "Recuperação de Áreas"]
    },
    {
      id: "protecao",
      title: "Proteção Florestal",
      tagline: "Defesa e Sanidade",
      desc: "Monitoramento e defesa ativa das florestas contra pragas, doenças e incêndios, garantindo a saúde e longevidade dos plantios.",
      icon: <Shield className="w-6 h-6" />,
      image: "https://images.unsplash.com/photo-1511497584788-876760111969?q=80&w=2070&auto=format&fit=crop",
      items: ["Entomologia Florestal", "Incêndios Florestais", "Patologia Florestal", "Controle Biológico", "Monitoramento Integrado"]
    },
    {
      id: "tecnologia",
      title: "Tecnologia de Produtos",
      tagline: "Inovação e Valor Agregado",
      desc: "Inovação no processamento da madeira e seus derivados, desenvolvendo novos produtos e otimizando a cadeia industrial.",
      icon: <Settings className="w-6 h-6" />,
      image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2070&auto=format&fit=crop",
      items: ["Anatomia da Madeira", "Celulose e Papel", "Energia da Madeira", "Óleos Essenciais", "Preservação da Madeira", "Resinagem", "Serraria e Secagem"]
    }
  ];

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col font-sans overflow-x-hidden">
      <Navbar />
      
      {/* --- HERO SECTION --- */}
      <div className="relative min-h-[85vh] flex items-center pt-20 overflow-hidden">
         <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1511497584788-876760111969?q=80&w=2670&auto=format&fit=crop')] bg-cover bg-center bg-fixed"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-black/100 via-black/80 to-black/20"></div>
            <NoiseOverlay opacity={0.45} />
         </div>
         
         <div className="absolute bottom-0 left-0 right-0 h-24 bg-slate-50 rounded-tr-[80px] z-10"></div>

         <div className="container mx-auto px-6 relative z-10 grid md:grid-cols-12 gap-12 items-center text-white">
            <div className="md:col-span-7">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8">
                    <span className="flex h-2 w-2 rounded-full bg-[#FFC107] animate-pulse"></span>
                    <span className="text-gray-300 text-xs font-bold tracking-[0.2em] uppercase">Expertise & Inovação</span>
                </div>
                
                <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-[1.1] tracking-tight">
                    Nossas Áreas <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4ADE80] to-[#2E7D32]">
                        de Atuação
                    </span>
                </h1>
                
                <p className="text-lg text-gray-400 max-w-xl leading-relaxed font-light mb-10 border-l-2 border-[#2E7D32] pl-6">
                    Mergulhe nas frentes tecnológicas e científicas onde o SIF lidera o desenvolvimento florestal sustentável, conectando pesquisa de ponta à prática de mercado.
                </p>

                <button onClick={scrollToContent} className="group flex items-center gap-3 text-white font-medium hover:text-[#FFC107] transition-colors">
                    <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:border-[#FFC107] transition-colors">
                        <ChevronDown className="animate-bounce" />
                    </div>
                    <span>Explorar Pilares</span>
                </button>
            </div>
         </div>
      </div>

      <main className="flex-grow pt-10 pb-10">
        {areas.map((area, index) => (
          <section key={area.id} id={area.id} className="py-16 md:py-24 relative scroll-mt-28">
            <div className="container mx-auto px-6 md:px-12">
                <div className={`flex flex-col lg:flex-row items-stretch gap-12 lg:gap-24 ${index % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}>
                    <div className="w-full lg:w-1/2 relative group">
                        <div className="relative h-full min-h-[400px] rounded-[32px] overflow-hidden shadow-2xl border border-gray-100">
                            <img src={area.image} alt={area.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                            <div className="absolute top-6 right-6">
                                <div className="bg-white/90 backdrop-blur-md p-3 rounded-2xl shadow-lg border border-white/50 text-[#2E7D32]">
                                    {area.icon}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="w-full lg:w-1/2 flex flex-col justify-center">
                        <span className="text-[#2E7D32] font-bold tracking-widest uppercase text-xs mb-4 flex items-center gap-3">
                           <span className="w-6 h-[2px] bg-[#2E7D32]"></span> {area.tagline}
                        </span>
                        <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">{area.title}</h2>
                        <p className="text-gray-600 text-lg leading-relaxed mb-8">{area.desc}</p>
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
                                {area.items.map((item, idx) => (
                                    <div key={idx} className="flex items-start gap-2 group/item">
                                        <Check size={16} className="text-[#2E7D32] mt-1 shrink-0 group-hover/item:scale-110 transition-transform" />
                                        <span className="text-gray-700 text-sm font-medium group-hover/item:text-[#2E7D32] transition-colors">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {index < areas.length - 1 && (
                <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mt-20 opacity-50"></div>
            )}
          </section>
        ))}
      </main>

      {/* --- CTA FINAL --- */}
      <div className="container mx-auto px-6 mt-10 pb-32 md:pb-48">
        <div className="relative rounded-[2.5rem] overflow-hidden bg-[#1f2937] px-6 py-12 md:py-16 text-center shadow-2xl max-w-4xl mx-auto">
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
            
            <div className="relative z-10 max-w-2xl mx-auto">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 leading-tight">
                    Pronto para inovar com o SIF?
                </h2>
                <p className="text-gray-400 mb-8 text-sm md:text-base font-light">
                    Tenha acesso ao que há de mais avançado em pesquisa e tecnologia florestal.
                </p>
                
                <a 
                    href="/contato" 
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] hover:brightness-110 text-white px-10 py-3.5 rounded-full font-bold transition-all hover:scale-105 shadow-lg shadow-black/20"
                >
                    Fale com um Especialista <ArrowRight size={18} />
                </a>
            </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}