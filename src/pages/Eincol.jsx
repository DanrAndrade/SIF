import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import NoiseOverlay from '../components/ui/NoiseOverlay';
import { Download, FileText, MapPin, ChevronDown } from 'lucide-react';
import { API_BASE_URL, getImageUrl } from '../apiConfig';

const API_URL = `${API_BASE_URL}/eincol.php`;

export default function Eincol() {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetch(API_URL)
      .then(r => r.json())
      .then(data => { setConfig(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f1f11] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#007a3d] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const title    = config?.hero_title    || 'EINCOL';
  const subtitle = config?.hero_subtitle || '';
  const tabs     = config?.tabs          || [];
  const sections = config?.sections      || [];
  const pdfs     = [
    { url: config?.pdf1_url, title: config?.pdf1_title },
    { url: config?.pdf2_url, title: config?.pdf2_title },
    { url: config?.pdf3_url, title: config?.pdf3_title },
  ].filter(p => p.url);

  return (
    <div className="bg-[#f8f9fa] min-h-screen flex flex-col font-sans overflow-x-hidden selection:bg-[#007a3d] selection:text-white">
      <Navbar />

      {/* ═══════════════════════════════════════
          HERO — FULL-SCREEN QUADRADO COM IMAGEM
      ═══════════════════════════════════════ */}
      <div className="relative w-full" style={{ height: '100svh' }}>
        {/* Imagem de fundo */}
        <div className="absolute inset-0 bg-[#0f1f11]">
          {config?.hero_image && (
            <img
              src={getImageUrl(config.hero_image)}
              alt={title}
              className="w-full h-full object-cover opacity-70"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-[#0f1f11]" />
          <NoiseOverlay opacity={0.3} />
        </div>

        {/* Conteúdo do Hero */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-8">
            <span className="flex h-2 w-2 rounded-full bg-[#007a3d] animate-pulse" />
            <span className="text-white text-[10px] font-black tracking-[0.25em] uppercase">Evento Especial SIF</span>
          </div>

          <h1 className="text-6xl sm:text-8xl md:text-[10rem] font-black text-white uppercase tracking-tighter leading-none mb-6 drop-shadow-2xl">
            {title}
          </h1>

          {subtitle && (
            <p className="text-white/70 text-base md:text-xl font-medium max-w-3xl leading-relaxed mb-12">
              {subtitle}
            </p>
          )}

          <button
            onClick={() => {
              const el = document.getElementById('eincol-content');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="flex flex-col items-center gap-3 text-white/50 hover:text-white transition-colors group"
          >
            <span className="text-[10px] font-black uppercase tracking-[0.25em]">Saiba Mais</span>
            <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:border-[#007a3d] group-hover:bg-[#007a3d] transition-all">
              <ChevronDown size={20} className="animate-bounce" />
            </div>
          </button>
        </div>
      </div>

      {/* ═══════════════════════════════════════
          CONTEÚDO PRINCIPAL
      ═══════════════════════════════════════ */}
      <main id="eincol-content" className="flex-grow">

        {/* SEÇÃO: TEXTO PRINCIPAL */}
        {config?.main_content && (
          <section className="py-24 bg-white">
            <div className="container mx-auto px-6 max-w-4xl">
              <div
                className="prose prose-lg max-w-none text-gray-700 prose-headings:uppercase prose-headings:tracking-tighter prose-headings:text-[#1f2937] prose-strong:text-[#007a3d] prose-a:text-[#007a3d]"
                dangerouslySetInnerHTML={{ __html: config.main_content }}
              />
            </div>
          </section>
        )}

        {/* SEÇÃO: RENDER DO EVENTO */}
        {config?.render_image && (
          <section className="py-0 bg-[#1f2937] relative overflow-hidden">
            <img
              src={getImageUrl(config.render_image)}
              alt="Render do Evento"
              className="w-full max-h-[70vh] object-cover opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1f2937] via-transparent to-transparent pointer-events-none" />
          </section>
        )}

        {/* SEÇÃO: PLANTA BAIXA */}
        {(config?.planta_image || config?.planta_url) && (
          <section className="py-24 bg-[#1f2937]">
            <div className="container mx-auto px-6 max-w-6xl">
              <div className="flex flex-col md:flex-row items-center gap-12">
                {config.planta_image && (
                  <div className="flex-1">
                    <div className="rounded-[32px] overflow-hidden shadow-2xl border border-white/10">
                      <img
                        src={getImageUrl(config.planta_image)}
                        alt="Planta do Evento"
                        className="w-full h-auto object-contain"
                      />
                    </div>
                  </div>
                )}
                <div className="flex-shrink-0 md:w-72 text-center md:text-left">
                  <span className="text-[#7FBA00] text-[10px] font-black uppercase tracking-[0.25em] block mb-4">Planta do Evento</span>
                  <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter mb-6">
                    Conheça o<br /><span className="text-[#007a3d]">Espaço</span>
                  </h2>
                  {config.planta_url && (
                    <a
                      href={config.planta_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-3 px-8 py-4 bg-[#007a3d] text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-[#047857] transition-all shadow-lg shadow-emerald-900/40"
                    >
                      <Download size={18} /> Baixar Planta
                    </a>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* SEÇÃO: PDFs PARA DOWNLOAD */}
        {pdfs.length > 0 && (
          <section className="py-16 bg-[#f8f9fa] border-t border-gray-100">
            <div className="container mx-auto px-6 max-w-4xl">
              <h2 className="text-2xl font-black uppercase tracking-tighter text-[#1f2937] mb-8">
                Downloads
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {pdfs.map((pdf, i) => (
                  <a
                    key={i}
                    href={getImageUrl(pdf.url)}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-4 p-5 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all group"
                  >
                    <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center text-red-500 flex-shrink-0 group-hover:bg-red-100 transition-colors">
                      <FileText size={22} />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-sm text-[#1f2937] truncate">{pdf.title || `Documento ${i + 1}`}</p>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">PDF · Baixar</p>
                    </div>
                    <Download size={14} className="ml-auto text-gray-300 group-hover:text-[#007a3d] transition-colors flex-shrink-0" />
                  </a>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* SEÇÃO: ABAS DE PROGRAMAÇÃO */}
        {tabs.length > 0 && (
          <section className="py-24 bg-white">
            <div className="container mx-auto px-6 max-w-5xl">
              <h2 className="text-4xl font-black uppercase tracking-tighter text-[#1f2937] mb-12">
                Programação
              </h2>

              {/* Tab pills */}
              <div className="flex flex-wrap gap-3 mb-10">
                {tabs.map((tab, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveTab(i)}
                    className={`px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border ${
                      activeTab === i
                        ? 'bg-[#1f2937] text-white border-[#1f2937] shadow-lg'
                        : 'bg-white text-gray-400 border-gray-200 hover:border-[#007a3d] hover:text-[#007a3d]'
                    }`}
                  >
                    {tab.title}
                  </button>
                ))}
              </div>

              {/* Tab content */}
              {tabs[activeTab] && (
                <div className="bg-gray-50 rounded-[32px] p-8 md:p-12 border border-gray-100 shadow-sm min-h-[200px]">
                  <h3 className="text-xl font-bold uppercase tracking-tight text-[#007a3d] mb-6">{tabs[activeTab].title}</h3>
                  <div
                    className="prose prose-sm max-w-none text-gray-700 prose-headings:text-[#1f2937] prose-headings:uppercase prose-headings:tracking-tight prose-strong:text-[#007a3d] prose-a:text-[#007a3d] prose-li:marker:text-[#007a3d]"
                    dangerouslySetInnerHTML={{ __html: tabs[activeTab].content }}
                  />
                </div>
              )}
            </div>
          </section>
        )}

        {/* SEÇÕES CONFIGURÁVEIS ADICIONAIS */}
        {sections.map((sec, i) => (
          <section key={i} className={`py-20 ${i % 2 === 0 ? 'bg-[#f8f9fa]' : 'bg-white'}`}>
            <div className="container mx-auto px-6 max-w-4xl">
              {sec.title && (
                <h2 className="text-3xl font-black uppercase tracking-tighter text-[#1f2937] mb-8">
                  {sec.title}
                </h2>
              )}
              {sec.text && (
                <div
                  className="prose prose-base max-w-none text-gray-600 prose-headings:text-[#1f2937] prose-headings:uppercase prose-headings:tracking-tight prose-strong:text-[#007a3d] prose-a:text-[#007a3d] prose-li:marker:text-[#007a3d]"
                  dangerouslySetInnerHTML={{ __html: sec.text }}
                />
              )}
            </div>
          </section>
        ))}
      </main>

      <Footer />
    </div>
  );
}
