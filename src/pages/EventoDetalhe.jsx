import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CalendarDays, Clock, MapPin, Flag } from 'lucide-react';
import { usePageTitle } from '../hooks/usePageTitle';
import { useSeo } from '../hooks/useSeo';
import { API_BASE_URL, getImageUrl, heroW } from '../apiConfig';
import { htmlExcerpt } from '../components/sections/sectionTypes';
import DetailPage, { DetailLoading, DetailNotFound } from '../components/detail/DetailPage';
import { parseExtra, isoDate, longDate, weekday, eventSituation, ctaFrom, eventLegacySections } from '../components/detail/detailData';

// Página de um Evento: mesmo modelo estruturado do Grupo Temático
// (topo, informações rápidas, menu da página e blocos montados no painel).
// O campo "Descrição" do painel vira o bloco "Sobre o evento".
export default function EventoDetalhe() {
  const { slug } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    fetch(`${API_BASE_URL}/eventos.php?slug=${encodeURIComponent(slug)}`)
      .then(r => r.json())
      .then(d => setEvent(d && d.title ? d : null))
      .catch(() => setEvent(null))
      .finally(() => setLoading(false));
  }, [slug]);

  const extra = useMemo(() => parseExtra(event), [event]);
  const sections = useMemo(() => eventLegacySections(extra), [extra]);
  const summary = extra.summary || htmlExcerpt(event?.description || '', 200);

  usePageTitle(event?.title);
  useSeo({ description: summary, image: event?.image_url ? getImageUrl(event.image_url) : undefined });

  if (loading) return <DetailLoading />;
  if (!event) return <DetailNotFound title="Evento não encontrado" backHref="/eventos" backLabel="Ver todos os eventos" />;

  const day = isoDate(event.event_date);
  const dateText = day ? longDate(day) : (event.date || '');
  const time = extra.time || event.time || '';
  const situation = eventSituation(event);
  const cover = event.image_url ? getImageUrl(event.image_url, heroW()) : '';

  return (
    <DetailPage
      cover={cover}
      crumbs={[{ label: 'Eventos', to: '/eventos' }]}
      eyebrow="Evento"
      title={event.title}
      summary={extra.summary || ""}
      chips={[{ icon: CalendarDays, text: dateText }, { icon: MapPin, text: event.location }]}
      facts={[
        { icon: CalendarDays, label: 'Data', value: dateText || 'A confirmar', sub: day ? weekday(day) : '' },
        { icon: Clock, label: 'Horário', value: time },
        { icon: MapPin, label: 'Local', value: event.location || 'A definir' },
        { icon: Flag, label: 'Situação', value: situation },
      ]}
      about={{ title: extra.about_title || 'Sobre o evento', html: event.description || '' }}
      sections={sections}
      videoUrl={event.video_url}
      cta={ctaFrom(extra, 'Fazer inscrição')}
      pageKey="eventos"
      bandPhotos={event.image_url ? [getImageUrl(event.image_url, 1280)] : []}
    />
  );
}
