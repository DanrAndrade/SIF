import React from 'react';
import { CheckCircle, ArrowRight, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import SectionHeader from './ui/SectionHeader';

export default function About() {
  return (
      <div className="wrapper mt-12">
        <section className="w-full py-24 px-6 md:px-16 lg:px-24 mt-4 relative bg-white rounded-[60px] shadow-sm border border-gray-50 overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-50 rounded-full blur-[120px] opacity-30 -translate-y-1/2 translate-x-1/2"></div>
            
            <SectionHeader 
                tag="Quem Somos"
                title="Referência em <span class='text-[#059669]'>Pesquisa Florestal</span>"
                align="left"
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center relative z-10">
                
                {/* COLUNA 1: Texto */}
                <div className="lg:col-span-5 flex flex-col justify-center">
                    <p className="text-gray-500 text-lg leading-relaxed mb-8 font-medium">
                        Criada em 1974 pela parceria entre a Universidade Federal de Viçosa (UFV) e as principais empresas florestais do Brasil, a SIF visa a transferência de tecnologia em projetos de P&D+I somado à qualificação profissional.
                    </p>
                    <p className="text-gray-400 text-base leading-relaxed mb-12">
                        Com 50 anos de história, a SIF tem mais de 30 associadas, agregando empresas de celulose e papel, siderúrgicas, painéis, crédito de carbono e produtos alimentícios. Buscamos inovar e promover a sustentabilidade em conjunto!
                    </p>

                    <div className="flex flex-col sm:flex-row gap-6">
                        <Link 
                            to="/institucional" 
                            className="inline-flex items-center justify-center gap-3 bg-[#1f2937] hover:bg-[#059669] text-white px-10 py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] transition-all hover:scale-105 shadow-xl shadow-gray-900/10"
                        >
                            Conheça Nossa História <ArrowRight size={18} />
                        </Link>
                    </div>
                </div>

                {/* COLUNA 2: Vídeo */}
                <div className="lg:col-span-7 relative">
                    <div className="relative w-full aspect-video rounded-[40px] overflow-hidden border border-gray-100 group shadow-2xl bg-black">
                        <iframe 
                            className="w-full h-full object-cover opacity-90 transition-opacity group-hover:opacity-100"
                            src="https://www.youtube.com/embed/9AWrRQWYIcw?rel=0&modestbranding=1" 
                            title="Vídeo Institucional SIF" 
                            frameBorder="0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                            allowFullScreen
                        ></iframe>
                        <div className="absolute inset-0 pointer-events-none border-[12px] border-white/5 rounded-[40px]"></div>
                    </div>
                    
                    {/* Badge flutuante */}
                    <div className="absolute -bottom-8 -left-8 bg-white p-8 rounded-[32px] shadow-2xl border border-gray-50 hidden md:block animate-in fade-in slide-in-from-bottom-8 duration-700 delay-500">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-[#059669]">
                                <CheckCircle size={24} />
                            </div>
                            <div>
                                <span className="block text-2xl font-black text-[#1f2937] leading-none">+50 Anos</span>
                                <span className="text-[10px] uppercase font-black tracking-widest text-gray-400">De excelência</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
      </div>
  );
}