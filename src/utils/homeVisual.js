// Fundo do topo da Home (degradê + textura) — editável em Painel › Home › Topo.
// Só tons de verde (identidade visual SIF). "Atual" é o visual de antes da
// 2ª etapa; os demais são opções para a equipe escolher.

export const GRADIENT_PRESETS = {
  atual:     { label: 'Atual (verde SIF)',         from: '#007a3d', to: '#1B5E20' },
  floresta:  { label: 'Floresta profunda',         from: '#0f5132', to: '#06281a' },
  folha:     { label: 'Folha (mais claro)',        from: '#2e8b3e', to: '#14532d' },
  esmeralda: { label: 'Esmeralda',                 from: '#059669', to: '#064e3b' },
  oliva:     { label: 'Verde-oliva',               from: '#5b7f1f', to: '#1f3a12' },
};

// Texturas desenhadas só com CSS (sem arquivo/serviço externo)
export const TEXTURES = {
  ruido:  { label: 'Granulado (atual)' },
  pontos: { label: 'Pontilhado',
            style: { backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.22) 1px, transparent 0)', backgroundSize: '14px 14px' } },
  linhas: { label: 'Linhas diagonais',
            style: { backgroundImage: 'repeating-linear-gradient(135deg, rgba(255,255,255,0.07) 0 1px, transparent 1px 14px)' } },
  curvas: { label: 'Curvas de nível',
            style: { backgroundImage: 'repeating-radial-gradient(circle at 80% 20%, rgba(255,255,255,0.08) 0 1px, transparent 1px 28px)' } },
  nenhuma: { label: 'Sem textura' },
};

export const DEFAULT_VISUAL = { gradient: 'atual', from: '', to: '', texture: 'ruido' };

// Cores efetivas (preset ou personalizadas)
export function resolveGradient(visual = {}) {
  const v = { ...DEFAULT_VISUAL, ...visual };
  if (v.gradient === 'custom' && /^#[0-9a-f]{6}$/i.test(v.from) && /^#[0-9a-f]{6}$/i.test(v.to)) {
    return { from: v.from, to: v.to };
  }
  return GRADIENT_PRESETS[v.gradient] || GRADIENT_PRESETS.atual;
}
