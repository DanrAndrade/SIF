import React, { useState } from 'react';
import { Play } from 'lucide-react';
import { getImageUrl } from '../apiConfig';
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

// Fotos de exemplo (o painel ainda não tem campo de foto para esta seção;
// se um dia existir "image" / "image_2" no config, elas passam a valer).
const PHOTO_MAIN = 'https://images.unsplash.com/photo-1639051119236-475ab61f5bc3?q=80&w=1600&auto=format&fit=crop';
const PHOTO_ALT = 'https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=1200&auto=format&fit=crop';

// Capa do vídeo: miniatura do próprio YouTube; senão, a foto de apoio.
const youtubeId = (url = '') => (url.match(/(?:youtube(?:-nocookie)?\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{6,})/i) || [])[1];

export default function About({ config = {} }) {
  const c = { ...DEFAULTS, ...config };
  const txt = (v) => (v && String(v).trim()) || PENDING;
  const [video, setVideo] = useState(false);
  const compRef = useParallax();

  const ytId = youtubeId(c.video_url);
  const poster = ytId ? `https://i.ytimg.com/vi/${ytId}/hqdefault.jpg` : getImageUrl(c.image_2 || PHOTO_ALT, 800);
  const mainPhoto = getImageUrl(c.image || PHOTO_MAIN, 1100);

  return (
    <div className="w-full max-w-[1280px] mx-auto px-4 md:px-12 mt-12">
      <section className="relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Texto */}
          <div className="lg:col-span-6 xl:col-span-5 min-w-0">
            <span className="sif-eyebrow mb-5">{txt(c.tag)}</span>
            <h2
              className="sif-title sif-h2 lg:text-6xl leading-[1.05] tracking-tight text-sif-ink mb-8"
              dangerouslySetInnerHTML={{ __html: txt(c.title) }}
            />

            <p className="text-lg md:text-xl leading-relaxed text-sif-ink/85 mb-10">
              {txt(c.paragraph_1)}
            </p>

            {/* Selo (valor + legenda do painel) */}
            {(c.badge_value || c.badge_label) && (
              <div className="flex items-end gap-5 mb-10 pb-10 border-b border-sif-dark/10">
                <span className="sif-title text-5xl md:text-6xl leading-none tracking-tight text-sif-green whitespace-nowrap">
                  {c.badge_value}
                </span>
                {c.badge_label && (
                  <span className="pb-1.5 text-xs font-bold uppercase tracking-[0.2em] text-sif-ink/55 leading-snug">
                    {c.badge_label}
                  </span>
                )}
              </div>
            )}

            <Button href={c.cta_link || '/institucional'} variant="primary" size="lg">
              {txt(c.cta_label)}
            </Button>
          </div>

          {/* Composição de fotos com leve parallax */}
          <div ref={compRef} className="lg:col-span-6 xl:col-span-7 relative min-w-0 pb-16 sm:pb-20 lg:pb-10 lg:pl-10">
            <div data-speed="-0.05" className="will-change-transform">
              <div className="relative ml-auto w-[88%] sm:w-[80%] aspect-[5/4] sm:aspect-[4/5] rounded-card md:rounded-panel overflow-hidden bg-sif-dark/10 shadow-card">
                <img
                  src={mainPhoto}
                  alt="Floresta plantada"
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Vídeo institucional (abre em janela) */}
            <div data-speed="0.06" className="absolute left-0 bottom-0 w-[64%] sm:w-[58%] lg:w-[56%] will-change-transform">
              <button
                type="button"
                onClick={() => setVideo(true)}
                aria-label="Assistir ao vídeo institucional"
                className="group relative block w-full aspect-video rounded-card overflow-hidden bg-sif-dark ring-[6px] md:ring-8 ring-[#f6f8f7] shadow-card"
              >
                <img
                  src={poster}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 w-full h-full object-cover scale-[1.02] transition-transform duration-700 group-hover:scale-[1.06]"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-sif-dark/80 via-sif-dark/20 to-transparent" />
                <span className="absolute left-4 bottom-4 md:left-5 md:bottom-5 flex items-center gap-3 text-white text-left">
                  <span className="w-10 h-10 md:w-12 md:h-12 shrink-0 rounded-full bg-white text-sif-dark flex items-center justify-center transition-colors group-hover:bg-sif-leaf group-hover:text-white">
                    <Play size={18} className="ml-0.5" fill="currentColor" />
                  </span>
                  <span className="text-[11px] md:text-xs font-bold uppercase tracking-[0.16em] leading-snug">
                    Vídeo<br className="sm:hidden" /> institucional
                  </span>
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Texto de apoio em duas colunas */}
        <div className="mt-14 lg:mt-20 pt-10 border-t border-sif-dark/10 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-14">
          <p className="text-base leading-relaxed text-gray-600">{txt(c.paragraph_2)}</p>
          <p className="text-base leading-relaxed text-gray-600">{txt(c.paragraph_3)}</p>
        </div>
      </section>

      {video && <VideoModal url={c.video_url} title="Vídeo Institucional SIF" onClose={() => setVideo(false)} />}
    </div>
  );
}
