import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import NoiseOverlay from '../components/ui/NoiseOverlay';
import { Check, ArrowRight, Map, Shield, Settings, Sprout, Leaf, ChevronDown } from 'lucide-react';

// Importando o icone para uso em componentes
import iconLogo from '../assets/icone.svg';

export default function AreasAtuacao() {
  const { hash } = useLocation();

  useEffect(() => {
    document.title = "SIF | Áreas de Atuação";

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
      image: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?q=80&w=2070&auto=format&fit=crop",
      items: ["Biotecnologia", "Controle de Plantas Invasoras", "Dendrologia", "Ecologia Florestal", "Genética e Melhoramento", "Propagação de Plantas", "Sementes e Mudas", "Sistemas Agroflorestais", "Solos e Fertilização", "Técnicas Silviculturais"]
    },
    {
      id: "manejo",
      title: "Manejo Florestal",
      tagline: "Inteligência & Estratégia",
      desc: "Planejamento estratégico para o uso racional dos recursos, assegurando a colheita contínua sem comprometer o ecossistema florestal.",
      icon: <Map className="w-6 h-6" />,
      image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2071&auto=format&fit=crop",
      items: ["Computação Aplicada", "Colheita e Transporte", "Inventário Florestal", "Economia Florestal", "Planejamento e Admin.", "Ergonomia e Segurança", "Estradas Florestais", "Sensoriamento Remoto", "Manejo Sustentável", "Sistemas GIS"]
    },
    {
      id: "ambiencia",
      title: "Ambiência",
      tagline: "Harmonia & Conservação",
      desc: "O equilíbrio vital entre produção e proteção ambiental. Estudos de impacto, biodiversidade e a relação sistêmica da floresta com a sociedade.",
      icon: <Leaf className="w-6 h-6" />,
      image: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?q=80&w=2070&auto=format&fit=crop",
      items: ["Arborização e Paisagismo", "Impactos Ambientais", "Meio Ambiente", "Manejo de Bacias", "Parques e Reservas", "Reciclagem Urbana", "Recuperação de Áreas"]
    },
    {
      id: "protecao",
      title: "Proteção Florestal",
      tagline: "Defesa & Sanidade",
      desc: "Monitoramento e defesa ativa das florestas contra pragas, doenças e incêndios, garantindo a saúde e longevidade dos plantios produtivos.",
      icon: <Shield className="w-6 h-6" />,
      image: "https://images.unsplash.com/photo-1511497584788-876760111969?q=80&w=2070&auto=format&fit=crop",
      items: ["Entomologia Florestal", "Incêndios Florestais", "Patologia Florestal", "Controle Biológico", "Monitoramento Integrado"]
    },
    {
      id: "tecnologia",
      title: "Tecnologia de Produtos",
      tagline: "Inovação & Valor",
      desc: "Inovação no processamento da madeira e seus derivados, desenvolvendo novos biocombustíveis e otimizando a cadeia industrial.",
      icon: <Settings className="w-6 h-6" />,
      image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2070&auto=format&fit=crop",
      items: ["Anatomia da Madeira", "Celulose e Papel", "Energia da Madeira", "Óleos Essenciais", "Preservação da Madeira", "Resinagem", "Serraria e Secagem"]
    }
  ];

  return (
    <div className="bg-[#f8f9fa] min-h-screen flex flex-col font-sans overflow-x-hidden selection:bg-[#007a3d] selection:text-white">
      <Navbar />

      {/* HERO PADRÃO SIF COM IMAGEM */}
      <div className="relative h-[80vh] flex items-center pt-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1473448912268-2022ce9509d8?q=80&w=2071')] bg-cover bg-center"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/100 via-black/80 to-transparent"></div>
          <NoiseOverlay opacity={0.4} />
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-[#f8f9fa] rounded-tr-[80px] z-10"></div>
        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-8">
            <span className="flex h-2 w-2 rounded-full bg-[#007a3d] animate-pulse"></span>
            <span className="text-white text-[10px] font-black tracking-[0.2em] uppercase">Expertise & Fronteira Tecnológica</span>
          </div>

          <h1 className="text-5xl md:text-8xl font-bold font-heading uppercase text-white leading-[0.9] tracking-tighter mb-8">
            Nossas Áreas <br />
            <span className="text-[#007a3d]">de Atuação</span>
          </h1>

          <p className="text-xs sm:text-sm md:text-base text-gray-300 max-w-2xl leading-relaxed font-medium mb-12">
            Mergulhe nas frentes científicas onde o SIF lidera o desenvolvimento florestal, conectando pesquisa de ponta à prática de mercado.
          </p>

          <button
            onClick={scrollToContent}
            className="group flex flex-col items-start gap-4 text-white font-black uppercase tracking-widest text-[10px] transition-all hover:text-[#007a3d]"
          >
            <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:border-[#007a3d] group-hover:bg-[#007a3d] group-hover:text-white transition-all shadow-sm">
              <ChevronDown className="animate-bounce" size={20} />
            </div>
          </button>
        </div>
      </div>

      <main className="flex-grow">
        {areas.map((area, index) => (
          <section key={area.id} id={area.id} className="py-24 md:py-32 relative scroll-mt-28 bg-white first:bg-[#f8f9fa] odd:bg-[#f8f9fa] group">
            <div className="container mx-auto px-6 md:px-12 max-w-7xl">
              <div className={`flex flex-col lg:flex-row items-center gap-16 lg:gap-24 ${index % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}>
                {/* Imagem */}
                <div className="w-full lg:w-1/2 relative">
                  <div className="absolute inset-0 bg-emerald-100 rounded-[40px] translate-x-6 translate-y-6 -z-10 blur-2xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative aspect-[4/3] rounded-[40px] overflow-hidden shadow-2xl border border-white">
                    <img src={area.image} alt={area.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-[#1f2937]/10 group-hover:bg-transparent transition-colors"></div>
                  </div>
                </div>

                {/* Texto */}
                <div className="w-full lg:w-1/2 flex flex-col">
                  <span className="text-[#007a3d] font-black tracking-[0.3em] uppercase text-[10px] mb-6 flex items-center gap-4 animate-in slide-in-from-left duration-700">
                    <span className="w-10 h-[2px] bg-[#007a3d]"></span> {area.tagline}
                  </span>
                  <h2 className="text-4xl md:text-6xl font-bold font-heading uppercase text-[#1f2937] mb-8 leading-none tracking-tighter transition-colors group-hover:text-[#007a3d]">{area.title}</h2>
                  <p className="text-gray-500 text-base leading-relaxed mb-10 font-medium">{area.desc}</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 pt-8 border-t border-gray-100">
                    {area.items.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-3 group/item">
                        <Check size={18} className="text-[#007a3d] mt-0.5 shrink-0 transition-transform group-hover/item:scale-125" />
                        <span className="text-[#1f2937] text-xs font-black uppercase tracking-widest group-hover/item:text-[#007a3d] transition-colors">{item}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-12 flex justify-end">
                    <a href="/contato" className="inline-flex items-center gap-4 text-[#1f2937] font-black uppercase tracking-[0.2em] text-[10px] hover:text-[#007a3d] transition-all group/btn">
                      Solicitar Projeto Técnico
                      <div className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center group-hover/btn:border-[#007a3d] group-hover/btn:bg-[#007a3d] group-hover/btn:text-white transition-all">
                        <ArrowRight size={16} />
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>
        ))}
      </main>

      {/* --- CTA FINAL --- */}
      <div className="py-32 bg-white">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="relative rounded-[3rem] overflow-hidden bg-[#1f2937] px-8 py-20 text-center shadow-2xl relative">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#007a3d] rounded-full blur-[140px] opacity-20 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-900 rounded-full blur-[100px] opacity-10 pointer-events-none"></div>

            <div className="relative z-10 max-w-2xl mx-auto">
              <span className="text-[#007a3d] font-black uppercase tracking-[0.3em] text-[10px] mb-6 block">Parcerias Estratégicas</span>
              <h2 className="text-4xl md:text-6xl font-bold font-heading uppercase text-white mb-8 leading-none tracking-tight">
                Pronto para <br />inovar conosco?
              </h2>
              <p className="text-gray-400 mb-12 text-base md:text-base font-medium leading-relaxed">
                Tenha acesso ao que há de mais avançado em ciência florestal. Fale com um de nossos coordenadores técnicos hoje mesmo.
              </p>

              <a
                href="/contato"
                className="inline-flex items-center gap-3 bg-[#007a3d] hover:bg-[#047857] text-white px-12 py-5 rounded-2xl font-black uppercase tracking-widest text-xs transition-all hover:scale-105 shadow-xl shadow-emerald-900/40"
              >
                Fale com um Especialista <ArrowRight size={20} />
              </a>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
