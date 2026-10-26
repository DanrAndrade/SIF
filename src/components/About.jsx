import React, { useState } from 'react';
import { Play } from 'lucide-react';
import Button from './ui/Button';
import VideoModal from './ui/VideoModal';

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

  const ytId = youtubeId(c.video_url);
  const [poster, setPoster] = useState(ytId ? `https://i.ytimg.com/vi/${ytId}/maxresdefault.jpg` : null);
  // capa grande nem sempre existe: cai para a média
  const posterFallback = () => {
    if (ytId && poster && !poster.includes('hqdefault')) setPoster(`https://i.ytimg.com/vi/${ytId}/hqdefault.jpg`);
  };

  const hasBadge = !!(c.badge_value || c.badge_label);

  return (
    <div className="w-full max-w-[1280px] mx-auto px-4 md:px-12 mt-12">
      {/* Um bloco só: texto à esquerda, vídeo à direita, tudo no mesmo cartão */}
      <section className="relative bg-white shadow-card rounded-card md:rounded-panel px-6 py-10 sm:px-10 md:px-14 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          <div className="lg:col-span-6 min-w-0">
            <span className="sif-eyebrow mb-5">{txt(c.tag)}</span>
            <h2
              className="sif-title sif-h2 leading-[1.08] tracking-tight text-sif-ink"
              dangerouslySetInnerHTML={{ __html: txt(c.title) }}
            />
            <p className="mt-7 text-lg leading-relaxed text-sif-ink/80">{txt(c.paragraph_1)}</p>
            <p className="mt-5 text-[15px] leading-relaxed text-gray-500">{txt(c.paragraph_2)}</p>
            <p className="mt-4 text-[15px] leading-relaxed text-gray-500">{txt(c.paragraph_3)}</p>
            <div className="mt-9">
              <Button href={c.cta_link || '/institucional'} variant="primary" size="lg">{txt(c.cta_label)}</Button>
            </div>
          </div>

          <div className="lg:col-span-6 min-w-0">
            {c.video_url && (
              <button
                type="button"
                onClick={() => setVideo(true)}
                aria-label="Assistir ao vídeo institucional"
                className="group relative block w-full aspect-video overflow-hidden rounded-card bg-sif-dark shadow-card-hover text-left focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sif-lime"
              >
                {poster && (
                  <img src={poster} onError={posterFallback} alt="" loading="lazy" decoding="async"
                    className="absolute inset-0 w-full h-full object-cover" />
                )}
                <span className="absolute inset-0 bg-gradient-to-t from-sif-dark/70 via-sif-dark/10 to-transparent" />
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="w-16 h-16 md:w-[72px] md:h-[72px] rounded-full bg-white text-sif-dark flex items-center justify-center shadow-card transition-transform duration-500 ease-out group-hover:scale-110">
                    <Play size={24} className="ml-1" fill="currentColor" />
                  </span>
                </span>
                <span className="absolute left-5 bottom-4 md:left-6 md:bottom-5 text-white">
                  <span className="block text-[11px] font-bold uppercase tracking-[0.2em] text-sif-lime mb-1">Vídeo institucional</span>
                  <span className="block text-sm md:text-base font-semibold">Conheça a SIF em poucos minutos</span>
                </span>
              </button>
            )}
            {hasBadge && (
              <div className="mt-6 flex items-end gap-4 border-t border-gray-100 pt-6">
                <span className="sif-title text-5xl md:text-6xl leading-none tracking-tight text-sif-green whitespace-nowrap">{c.badge_value}</span>
                {c.badge_label && <span className="pb-1.5 text-xs font-bold uppercase tracking-[0.2em] text-sif-ink/55">{c.badge_label}</span>}
              </div>
            )}
          </div>
        </div>
      </section>

      {video && <VideoModal url={c.video_url} title="Vídeo Institucional SIF" onClose={() => setVideo(false)} />}
    </div>
  );
}
