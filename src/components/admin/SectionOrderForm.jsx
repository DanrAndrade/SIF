import React, { useEffect, useState } from 'react';
import { Loader2, RotateCcw, Lock } from 'lucide-react';
import { AdminCard, SaveButton, SaveStatus, SecondaryButton, ItemActions, moveItem, useDirty } from './kit';
import { API_BASE_URL } from '../../apiConfig';
import { apiRequest, toastError } from '../../utils/adminApi';
import { resolveSectionOrder, sameOrder, SECTION_ORDER_FIELD } from '../../utils/sectionOrder';

// Cartão "Ordem das seções" do painel (reutilizável em qualquer página).
//
// Mostra as seções da página na ordem atual, com setas para subir/descer e o
// botão "Restaurar ordem padrão". Ao salvar, grava SÓ o campo section_order
// (um array de chaves) na mesma página: o PHP mescla com o resto, então os
// outros formulários da tela não são afetados.
//
// Props:
//   pageKey   → chave da página em page_configs (ex.: 'home')
//   sections  → [{ key, label, hint? }] na ORDEM PADRÃO (a de hoje no site)
//   fixedTop / fixedBottom → textos das partes que não se movem (topo, rodapé)
//   endpoint  → endereço próprio da página, quando ela não usa o
//               page_content.php (ex.: Institucional usa institucional.php)
export default function SectionOrderForm({ pageKey, sections, fixedTop = 'Topo da página', fixedBottom = 'Rodapé', endpoint, title = 'Ordem das seções' }) {
  const defaultKeys = sections.map(s => s.key);
  const url = endpoint || `${API_BASE_URL}/page_content.php?page=${pageKey}`;
  const [order, setOrder] = useState(defaultKeys);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false); // carregar falhou: Salvar travado
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState(null);
  const { dirty, markClean } = useDirty(order, { ready: !loading });

  useEffect(() => {
    fetch(url)
      .then(r => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
      .then(data => {
        const saved = data && typeof data === 'object' ? data[SECTION_ORDER_FIELD] : null;
        setOrder(resolveSectionOrder(saved, defaultKeys));
      })
      .catch(() => setLoadError(true))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  const handleSave = async () => {
    setSaving(true);
    try {
      // Igual à ordem padrão: grava vazio (o site volta a usar a ordem de fábrica,
      // e seções novas no futuro entram no lugar certo sozinhas)
      const value = sameOrder(order, defaultKeys) ? [] : order;
      const fd = new FormData();
      fd.append('page', pageKey);
      fd.append('content_json', JSON.stringify({ [SECTION_ORDER_FIELD]: value }));
      const postUrl = endpoint || `${API_BASE_URL}/page_content.php`;
      await apiRequest(postUrl, { method: 'POST', body: fd });
      markClean(order);
      window.showToast?.('Ordem das seções salva.');
      setSavedAt(Date.now());
      setTimeout(() => setSavedAt(null), 3000);
    } catch (err) {
      toastError(err);
    } finally {
      setSaving(false);
    }
  };

  const byKey = Object.fromEntries(sections.map(s => [s.key, s]));
  const isDefault = sameOrder(order, defaultKeys);

  return (
    <AdminCard
      title={title}
      subtitle="Use as setas para mudar a posição de cada seção no site. Depois clique em Salvar, aqui neste quadro."
      actions={<><SaveStatus dirty={dirty} savedAt={savedAt} /><SaveButton onSave={handleSave} saving={saving} disabled={loading || loadError} label="Salvar" /></>}
    >
      {loading ? (
        <div className="text-center py-6"><Loader2 className="w-6 h-6 animate-spin text-emerald-600 mx-auto" /></div>
      ) : (
        <div className="space-y-2" data-section-order={pageKey}>
          <FixedRow label={fixedTop} />
          {order.map((k, i) => (
            <div key={k} data-order-key={k} className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-xl">
              <span className="w-7 h-7 shrink-0 rounded-full bg-white border border-gray-200 text-xs font-bold text-gray-500 flex items-center justify-center">{i + 1}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800">{byKey[k]?.label || k}</p>
                {byKey[k]?.hint && <p className="text-xs text-gray-500 mt-0.5">{byKey[k].hint}</p>}
              </div>
              <ItemActions onMove={d => setOrder(o => moveItem(o, i, d))} isFirst={i === 0} isLast={i === order.length - 1} />
            </div>
          ))}
          <FixedRow label={fixedBottom} />
          <div className="pt-3 flex flex-wrap items-center gap-3">
            <SecondaryButton icon={RotateCcw} onClick={() => setOrder(defaultKeys)} disabled={isDefault} className="disabled:opacity-50 disabled:cursor-not-allowed">Restaurar ordem padrão</SecondaryButton>
            <span className="text-xs text-gray-500">{isDefault ? 'Usando a ordem padrão do site.' : 'Ordem personalizada.'}</span>
          </div>
        </div>
      )}
    </AdminCard>
  );
}

// Parte da página que não muda de lugar (topo e rodapé)
function FixedRow({ label }) {
  return (
    <div className="flex items-center gap-3 px-3 py-2 rounded-xl border border-dashed border-gray-200 text-gray-400">
      <Lock size={14} className="shrink-0" />
      <span className="text-xs font-semibold">{label} (fica sempre no mesmo lugar)</span>
    </div>
  );
}
