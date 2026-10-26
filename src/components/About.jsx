import React, { useState } from 'react';
import { Play } from 'lucide-react';
import Button from './ui/Button';
import VideoModal from './ui/VideoModal';
import useParallax from './about/useParallax';

const PENDING = '[aguardando conteúdo da SIF]';

const DEFAULTS = {
  tag: 'Quem Somos',
  title: 'Referência em <span class="text-[#007a3d]">Pesquisa Florestal</span>',
  paragraph_1: 'Fundada em 1974, a Sociedade de Investigações Florestais (SIF) consolida uma trajetória de cinco décadas como o elo estratégico entre a Universidade Federal de Viçosa (UFV) e o setor produtivo. Nossa missão é impulsionar o desenvolvimento do setor florestal através da pesquisa aplicada, da geração de conhecimento e da qualificação profissional de excelência.',
  paragraph_2: 'Atualmente, conectamos mais de 28 empresas associadas, abrangendo segmentos fundamentais como celulose e papel, siderurgia, painéis de madeira e o mercado de crédito de carbono. Essa cooperação público-privada permite que projetos de Pesquisa, Desenvolvimento e Inovação (PD&I) sejam conduzidos por especialistas renomados, utilizando a infraestrutura avançada e o capital intelectual do Departamento de Engenharia Florestal da UFV.',
  paragraph_3: 'Nosso compromisso estende-se à sociedade por meio da democratização do saber técnico. Os avanços científicos gerados em nossos grupos temáticos e parcerias são compartilhados através da Revista Árvore, de boletins técnicos e de treinamentos especializados, garantindo que a inovação e a sustentabilidade norteiem o futuro das florestas.',
  cta_label: 'Conheça Nossa História',
  cta_link: '/institucional',
  video_url: 'https://www.youtube.com/embed/9AWrRQWYIcw?rel=0&modestbranding=1',
  badge_value: '+50 Anos',
  badge_label: 'De excelência',
};

// ID do YouTube para usar a capa do próprio vídeo.
const youtubeId = (url = '') => (url.match(/(?:youtube(?:-nocookie)?\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{6,})/i) || [])[1];

export default function About({ config = {} }) {
  const c = { ...DEFAULTS, ...config };
  const txt = (v) => (v && String(v).trim()) || PENDING;
  const [video, setVideo] = useState(false);
  const compRef = useParallax();

  const ytId = youtubeId(c.video_url);
  const [poster, setPoster] = useState(ytId ? `https://i.ytimg.com/vi/${ytId}/maxresdefault.jpg` : null);
  // capa grande nem sempre existe: cai para a média
  const posterFallback = () => {
    if (ytId && poster && !poster.includes('hqdefault')) setPoster(`https://i.ytimg.com/vi/${ytId}/hqdefault.jpg`);
  };

  return (
    <div className="w-full max-w-[1280px] mx-auto px-4 md:px-12 mt-12">
      <section className="relative">
        {/* Cabeçalho: título à esquerda, texto principal à direita */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-16 items-end mb-10 md:mb-14">
          <div className="lg:col-span-7 min-w-0">
            <span className="sif-eyebrow mb-5">{txt(c.tag)}</span>
            <h2
              className="sif-title sif-h2 lg:text-6xl leading-[1.05] tracking-tight text-sif-ink"
              dangerouslySetInnerHTML={{ __html: txt(c.title) }}
            />
          </div>
          <div className="lg:col-span-5 min-w-0 lg:pb-2">
            <p className="text-lg leading-relaxed text-sif-ink/80 mb-7">
              {txt(c.paragraph_1)}
            </p>
            <Button href={c.cta_link || '/institucional'} variant="primary" size="lg">
              {txt(c.cta_label)}
            </Button>
          </div>
        </div>

        {/* Vídeo institucional em destaque (abre em janela) */}
        {c.video_url && (
          <div ref={compRef} className="relative rounded-card md:rounded-panel overflow-hidden bg-sif-dark shadow-card">
            <button
              type="button"
              onClick={() => setVideo(true)}
              aria-label="Assistir ao vídeo institucional"
              className="group relative block w-full aspect-[4/3] sm:aspect-video lg:aspect-[21/9] text-left focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-sif-lime"
            >
              {poster && (
                <span data-speed="0.07" className="absolute inset-x-0 -inset-y-12 will-change-transform">
                  <img
                    src={poster}
                    onError={posterFallback}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  />
                </span>
              )}
              <span className="absolute inset-0 bg-gradient-to-t from-sif-dark/85 via-sif-dark/25 to-sif-dark/10" />

              {/* Play central */}
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="relative flex items-center justify-center">
                  <span className="absolute w-20 h-20 md:w-28 md:h-28 rounded-full bg-white/20 transition-transform duration-500 ease-out group-hover:scale-125" />
                  <span className="relative w-16 h-16 md:w-20 md:h-20 rounded-full bg-white text-sif-dark flex items-center justify-center shadow-card transition-transform duration-500 ease-out group-hover:scale-105">
                    <Play size={26} className="ml-1" fill="currentColor" />
                  </span>
                </span>
              </span>

              {/* Legenda e selo */}
              <span className="absolute inset-x-0 bottom-0 p-5 md:p-8 flex items-end justify-between gap-4 text-white">
                <span className="min-w-0">
                  <span className="block text-[11px] md:text-xs font-bold uppercase tracking-[0.2em] text-sif-lime mb-1.5">Vídeo institucional</span>
                  <span className="block text-base md:text-xl font-semibold leading-snug">Conheça a SIF em poucos minutos</span>
                </span>
                {(c.badge_value || c.badge_label) && (
                  <span className="hidden sm:flex flex-col items-end text-right shrink-0">
                    <span className="sif-title text-4xl md:text-5xl leading-none tracking-tight whitespace-nowrap">{c.badge_value}</span>
                    {c.badge_label && (
                      <span className="mt-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-white/70">{c.badge_label}</span>
                    )}
                  </span>
                )}
              </span>
            </button>
          </div>
        )}

        {/* Selo no celular (no computador ele fica sobre o vídeo) */}
        {(c.badge_value || c.badge_label) && (
          <div className="sm:hidden mt-8 flex items-end gap-4">
            <span className="sif-title text-5xl leading-none tracking-tight text-sif-green whitespace-nowrap">{c.badge_value}</span>
            {c.badge_label && (
              <span className="pb-1 text-xs font-bold uppercase tracking-[0.2em] text-sif-ink/55">{c.badge_label}</span>
            )}
          </div>
        )}

        {/* Texto de apoio em duas colunas */}
        <div className="mt-8 sm:mt-12 md:mt-14 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-14">
          <p className="text-base leading-relaxed text-gray-600">{txt(c.paragraph_2)}</p>
          <p className="text-base leading-relaxed text-gray-600">{txt(c.paragraph_3)}</p>
        </div>
      </section>

      {video && <VideoModal url={c.video_url} title="Vídeo Institucional SIF" onClose={() => setVideo(false)} />}
    </div>
  );
}
