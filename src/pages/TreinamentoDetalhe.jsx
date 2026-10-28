import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CalendarDays, Clock, MapPin, Layers, MonitorSmartphone } from 'lucide-react';
import { usePageTitle } from '../hooks/usePageTitle';
import { useSeo } from '../hooks/useSeo';
import { API_BASE_URL, getImageUrl, heroW } from '../apiConfig';
import { htmlExcerpt } from '../components/sections/sectionTypes';
import DetailPage, { DetailLoading, DetailNotFound } from '../components/detail/DetailPage';
import { parseExtra, isoDate, dateRange, hoursText, ctaFrom, trainingLegacy } from '../components/detail/detailData';

// Página de um Treinamento: mesmo modelo estruturado do Grupo Temático.
// O 1º bloco de Texto montado no painel vira o "Sobre" (duas colunas).
export default function TreinamentoDetalhe() {
  const { slug } = useParams();
  const [training, setTraining] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    fetch(`${API_BASE_URL}/treinamentos.php?slug=${encodeURIComponent(slug)}`)
      .then(r => r.json())
      .then(d => setTraining(d && d.title ? d : null))
      .catch(() => setTraining(null))
      .finally(() => setLoading(false));
  }, [slug]);

  const extra = useMemo(() => parseExtra(training), [training]);
  const legacy = useMemo(() => trainingLegacy(training, extra), [training, extra]);
  const firstText = legacy.aboutHtml || (legacy.sections.find(s => s.type === 'editor' && s.visible !== false)?.content || '');
  const summary = extra.summary || htmlExcerpt(firstText, 200);

  usePageTitle(training?.title);
  useSeo({ description: summary, image: training?.image_url ? getImageUrl(training.image_url) : undefined });

  if (loading) return <DetailLoading />;
  if (!training) return <DetailNotFound title="Treinamento não encontrado" backHref="/treinamentos" backLabel="Ver todos os treinamentos" />;

  const period = dateRange(isoDate(training.start_date), isoDate(training.end_date)) || training.date || '';
  const hours = hoursText(training.hours);
  const cover = training.image_url ? getImageUrl(training.image_url, heroW()) : '';

  return (
    <DetailPage
      cover={cover}
      crumbs={[{ label: 'Treinamentos', to: '/treinamentos' }]}
      eyebrow="Treinamento"
      title={training.title}
      summary={extra.summary || ""}
      chips={[{ icon: CalendarDays, text: period }, { icon: MapPin, text: training.location }, { icon: Clock, text: hours }]}
      facts={[
        { icon: Layers, label: 'Área', value: training.segment },
        { icon: MonitorSmartphone, label: 'Formato', value: extra.modality },
        { icon: Clock, label: 'Carga horária', value: hours },
        { icon: CalendarDays, label: 'Período', value: period },
        { icon: MapPin, label: 'Local', value: training.location },
      ]}
      about={{ title: 'Sobre o treinamento', html: legacy.aboutHtml }}
      sections={legacy.sections}
      videoUrl={training.video_url}
      cta={ctaFrom(extra, 'Quero me inscrever')}
      pageKey="treinamentos"
      bandPhotos={training.image_url ? [getImageUrl(training.image_url, 1280)] : []}
    />
  );
}
