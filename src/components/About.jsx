import React from 'react';
import { CheckCircle, ArrowRight } from 'lucide-react';
import SectionHeader from './ui/SectionHeader';
import Button from './ui/Button';

export default function About() {
  return (
      <div className="wrapper mt-12">
        <section className="w-full py-20 px-6 md:px-16 lg:px-24 mt-4 relative">
            
            <SectionHeader 
                tag="Quem Somos"
                title="Referência em<br/><span class='text-transparent bg-clip-text bg-gradient-to-r from-[#3c7a43] to-[#92b735]'>Pesquisa Florestal</span>"
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10 -mt-8">
                
                {/* COLUNA 1: Texto */}
                <div className="lg:col-span-4 flex flex-col justify-center relative z-20">
                    <p className="text-gray-600 text-sm leading-relaxed max-w-sm mb-6">
                        Criada em 1974 pela parceria entre a Universidade Federal de Viçosa (UFV) e as principais empresas florestais do Brasil, a SIF visa a transferência de tecnologia em projetos de P&D+I somado à qualificação profissional.
                    </p>
                    <p className="text-gray-600 text-sm leading-relaxed max-w-sm mb-12">
                        Com 50 anos de história, a SIF tem mais de 30 associadas, agregando empresas de celulose e papel, siderúrgicas, painéis, crédito de carbono e produtos alimentícios. Buscamos inovar e promover a sustentabilidade em conjunto!
                    </p>
                </div>

                {/* COLUNA 2: Vídeo (CORRIGIDO PARA HORIZONTAL) */}
                <div className="lg:col-span-4 flex justify-center py-10 lg:py-0 relative z-10">
                    {/* MUDANÇA AQUI:
                       1. Removi 'h-[450px]' (que forçava vertical).
                       2. Adicionei 'aspect-video' (que força 16:9 horizontal).
                       3. Adicionei 'w-full' para ocupar a largura da coluna.
                    */}
                    <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-gray-200 group shadow-2xl bg-black">
                        <iframe 
                            className="w-full h-full object-cover"
                            src="https://www.youtube.com/embed/9AWrRQWYIcw?rel=0&modestbranding=1" 
                            title="Vídeo Institucional SIF" 
                            frameBorder="0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                            allowFullScreen
                        ></iframe>
                    </div>
                </div>

                {/* COLUNA 3: Box Lateral */}
                <div className="lg:col-span-4 flex flex-col justify-between h-full space-y-8 lg:space-y-12">
                    
                    <div className="bg-white p-8 rounded-2xl border-l-4 border-[#3c7a43] shadow-lg">
                        <h4 className="font-bold text-sm mb-4 uppercase text-text-main tracking-widest">Nossa Atuação</h4>
                        <ul className="text-xs text-gray-500 space-y-3 font-medium">
                            <li className="flex items-center gap-3"><CheckCircle size={14} className="text-[#3c7a43]" /> Pesquisa & Inovação</li>
                            <li className="flex items-center gap-3"><CheckCircle size={14} className="text-[#3c7a43]" /> Grupos Temáticos</li>
                            <li className="flex items-center gap-3"><CheckCircle size={14} className="text-[#3c7a43]" /> Publicações Técnicas</li>
                        </ul>
                    </div>

                    <div className="flex justify-end pt-4 border-t border-gray-200">
                        <Button 
                            href="/historia" 
                            variant="primary" 
                            icon={ArrowRight} 
                            className="w-full text-center bg-[#3c7a43] hover:bg-[#2a5530] text-white border-none"
                        >
                            Conheça Nossa História
                        </Button>
                    </div>
                </div>
            </div>
        </section>
      </div>
  );
}