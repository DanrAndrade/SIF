import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Clock, MapPin, Layers, Building2, MonitorSmartphone } from 'lucide-react';
import { usePageTitle } from '../hooks/usePageTitle';
import { useSeo } from '../hooks/useSeo';
import { API_BASE_URL, getImageUrl, heroW } from '../apiConfig';
import { htmlExcerpt } from '../components/sections/sectionTypes';
import DetailPage, { DetailLoading, DetailNotFound } from '../components/detail/DetailPage';
import { parseExtra, hoursText, ctaFrom, trainingLegacy } from '../components/detail/detailData';

// Página de um Treinamento In-Company: mesmo modelo estruturado do Grupo Temático.
// O 1º bloco de Texto montado no painel vira o "Sobre" (duas colunas).
export default function TreinamentoInCompanyDetalhe() {
  const { slug } = useParams();
  const [training, setTraining] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    fetch(`${API_BASE_URL}/treinamentos_in_company.php?slug=${encodeURIComponent(slug)}`)
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
  if (!training) return <DetailNotFound title="Treinamento não encontrado" backHref="/treinamentos-in-company" backLabel="Ver treinamentos in-company" />;

  const hours = hoursText(training.hours);
  const cover = training.image_url ? getImageUrl(training.image_url, heroW()) : '';

  return (
    <DetailPage
      cover={cover}
      crumbs={[{ label: 'Treinamentos In-Company', to: '/treinamentos-in-company' }]}
      eyebrow="Treinamento In-Company"
      title={training.title}
      summary={extra.summary || ""}
      chips={[{ icon: Clock, text: hours }, { icon: Layers, text: training.segment }]}
      facts={[
        { icon: Layers, label: 'Área', value: training.segment },
        // In-company é sempre uma turma fechada, montada para a empresa
        { icon: Building2, label: 'Turma', value: 'Exclusiva para a sua empresa' },
        { icon: MonitorSmartphone, label: 'Formato', value: extra.modality },
        { icon: Clock, label: 'Carga horária', value: hours },
        { icon: MapPin, label: 'Local', value: training.location },
      ]}
      about={{ title: 'Sobre o treinamento', html: legacy.aboutHtml }}
      sections={legacy.sections}
      videoUrl={training.video_url}
      cta={ctaFrom(extra, 'Solicitar proposta')}
      pageKey="treinamentos_in_company"
      bandPhotos={training.image_url ? [getImageUrl(training.image_url, 1280)] : []}
    />
  );
}
