import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import EditablePageHero from '../components/EditablePageHero';
import { Calendar, MapPin, ArrowRight, Clock, Sparkles } from 'lucide-react';
import { API_BASE_URL, getImageUrl } from '../apiConfig';
import { useEincolActive } from '../hooks/useEincolActive';

const HERO_DEFAULTS = {
  hero_image: '',
  hero_badge: 'Networking & Negócios',
  hero_title_line1: 'Nossos',
  hero_title_highlight: 'Eventos',
  hero_subtitle: 'Conectando lideranças e transformando o conhecimento em prática nos maiores fóruns florestais.',
  hero_scroll_label: 'Ver Agenda',
};

const STATUS_DOT = {
  'Em Andamento':     'bg-amber-400',
  'Concluído':        'bg-emerald-500',
};

// Determina se evento está ativo: respeita status manual, usa event_date como fallback
const isEventoAtivo = (ev) => {
  // Se status for "Concluído" explicitamente, sempre concluído
  if (ev.status === 'Concluído') return false;
  // Se status for "Em Andamento" explicitamente, sempre em andamento
  if (ev.status === 'Em Andamento') return true;
  // Se status for "Automático" ou vazio, usa event_date
  if (!ev.status || ev.status === 'Automático (por data)') {
    if (!ev.event_date) return true;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const d = new Date(ev.event_date + 'T12:00:00');
    return !isNaN(d) && d >= today;
  }
  return true;
};

// Formato amigável: "20 Out 2026"
function formatEventDate(ev) {
  if (ev.event_date) {
    const d = new Date(ev.event_date + 'T12:00:00');
    if (!isNaN(d)) return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
  }
  return ev.date || '';
}

function EventoCard({ ev, faded = false }) {
  return (
    <Link
      to={`/eventos/${ev.slug}`}
      className={`bg-white rounded-[40px] overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-500 group flex flex-col block ${faded ? 'opacity-80 hover:opacity-100' : ''}`}
    >
      {ev.image_url && (
        <div className="h-48 overflow-hidden bg-gray-100">
          <img
            src={getImageUrl(ev.image_url)}
            alt={ev.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />
        </div>
      )}
      <div className="p-8 flex flex-col flex-grow">
        <div className="flex flex-wrap items-center gap-3 mb-5">
          {ev.location && (
            <span className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-gray-500">
              <MapPin size={10} /> {ev.location}
            </span>
          )}
          {ev.status && (
            <span className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-gray-500">
              <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${STATUS_DOT[ev.status] || 'bg-gray-400'}`}></span>
              {ev.status}
            </span>
          )}
        </div>

        <h3 className="text-xl font-bold font-heading uppercase text-[#1f2937] mb-4 leading-tight group-hover:text-[#007a3d] transition-colors flex-grow">
          {ev.title}
        </h3>

        {formatEventDate(ev) && (
          <div className="flex items-center gap-2 mb-4 text-[10px] font-black uppercase tracking-widest text-gray-400">
            <Calendar size={12} />
            {formatEventDate(ev)}
            {ev.time && <span className="text-gray-300">• {ev.time}</span>}
          </div>
        )}

        <div className="flex items-center justify-between pt-5 border-t border-gray-50 mt-auto">
          <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">{faded ? 'Concluído' : 'Inscrições Abertas'}</span>
          <span className="flex items-center gap-1 text-[#007a3d] text-[10px] font-black uppercase tracking-wider group-hover:text-[#007a3d] transition-all">
            Ver Detalhes <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </span>
        </div>
      </div>
    </Link>
  );
}

function SectionTitle({ title, accent }) {
  return (
    <div className="mb-16 border-b border-gray-100 pb-10">
      <h2 className="text-4xl md:text-5xl font-bold font-heading uppercase text-[#1f2937] tracking-tighter">
        {title} <span className="text-[#007a3d]">{accent}</span>
      </h2>
    </div>
  );
}

export default function Eventos() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const eincolActive = useEincolActive();

  useEffect(() => { fetchEvents(); }, []);

  const fetchEvents = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/eventos.php`);
      const data = await res.json();
      setEvents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Erro ao carregar eventos:', err);
    } finally {
      setLoading(false);
    }
  };

  // Separa por status/data (automático)
  const ativos     = events.filter(isEventoAtivo);
  const concluidos = events.filter(ev => !isEventoAtivo(ev));

  return (
    <div className="bg-[#f8f9fa] min-h-screen flex flex-col font-sans overflow-x-hidden selection:bg-[#007a3d] selection:text-white">
      <Navbar />

      <EditablePageHero pageKey="eventos" defaults={HERO_DEFAULTS} scrollTargetId="eventos-content" />

      <main id="eventos-content" className="flex-grow">

        {/* ── CARD DESTAQUE EINCOL (some quando desativado no admin) ── */}
        {eincolActive && (
          <section className="pt-24 pb-12 bg-[#f8f9fa] scroll-mt-24">
            <div className="container mx-auto px-6 max-w-4xl">
              <Link
                to="/eincol"
                className="group block relative overflow-hidden rounded-[40px] bg-gradient-to-br from-[#0f1f11] via-[#1a3d20] to-[#007a3d] p-10 md:p-14 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-500"
              >
                <div className="absolute top-0 right-0 w-72 h-72 bg-[#7FBA00]/20 rounded-full blur-[80px] translate-x-1/3 -translate-y-1/3 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-56 h-56 bg-[#007a3d]/40 rounded-full blur-[80px] -translate-x-1/3 translate-y-1/3 pointer-events-none" />

                <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="flex-1 text-center md:text-left">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-4">
                      <Sparkles size={12} className="text-[#7FBA00]" />
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Evento Especial</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold font-heading uppercase text-white tracking-tighter leading-[0.95] mb-3">
                      EINCOL
                    </h2>
                    <p className="text-sm md:text-base text-white/80 leading-relaxed max-w-xl font-medium">
                      Encontro Internacional de Ciência Florestal — conheça a programação completa, palestrantes e como participar.
                    </p>
                  </div>
                  <div className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-white text-[#0f1f11] font-black uppercase tracking-widest text-[10px] shadow-lg group-hover:bg-[#7FBA00] group-hover:text-[#0f1f11] transition-colors flex-shrink-0">
                    Acessar Página
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            </div>
          </section>
        )}

        {/* ── EVENTOS EM ANDAMENTO / PRÓXIMOS ── */}
        <section className={`${eincolActive ? 'pt-12 pb-24' : 'py-24'} bg-[#f8f9fa] scroll-mt-24`}>
          <div className="container mx-auto px-6 max-w-7xl">
            <SectionTitle title="Eventos em" accent="Andamento" />

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {Array(6).fill(0).map((_, i) => (
                  <div key={i} className="bg-white h-80 rounded-[40px] animate-pulse" />
                ))}
              </div>
            ) : ativos.length === 0 ? (
              <div className="py-16 text-center text-gray-400 font-bold uppercase tracking-widest italic">
                Nenhum evento agendado no momento.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {ativos.map(ev => <EventoCard key={ev.id} ev={ev} />)}
              </div>
            )}
          </div>
        </section>

        {/* ── EVENTOS CONCLUÍDOS ── */}
        {!loading && concluidos.length > 0 && (
          <section className="py-24 pb-32 bg-white border-t border-gray-100">
            <div className="container mx-auto px-6 max-w-7xl">
              <SectionTitle title="Eventos" accent="Concluídos" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {concluidos.map(ev => <EventoCard key={ev.id} ev={ev} faded />)}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
