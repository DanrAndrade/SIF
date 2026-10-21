import React, { useState, useEffect } from 'react';
import { AdminCard, SaveButton, SaveStatus, useDirty } from './kit';
import { Save, UploadCloud, Check, Loader2, User } from 'lucide-react';
import Button from '../ui/Button';
import { API_BASE_URL, getImageUrl } from '../../apiConfig';
import { savePageConfig, toastError } from '../../utils/adminApi';

const PAGE_URL = `${API_BASE_URL}/page_content.php`;

// Form admin para configurar o "contato padrão" de uma página de publicações.
// Esse contato é exibido em CADA postagem do tipo (ex: todo treinamento).
// pageKey -> eventos | treinamentos | gt | projetos
export default function PageContactForm({ pageKey, title = 'Contato responsável (aparece em cada postagem)' }) {
  const [cfg, setCfg] = useState({
    contact_name: '',
    contact_role: '',
    contact_email: '',
    contact_whatsapp: '',
  });
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false); // carregar falhou: Salvar travado
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [error, setError] = useState('');
  const { dirty, markClean } = useDirty(cfg, { ready: !loading, extra: !!photoFile });

  useEffect(() => {
    fetch(`${PAGE_URL}?page=${pageKey}`)
      .then(r => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
      .then(data => {
        const incoming = data && typeof data === 'object' && !Array.isArray(data) ? data : {};
        const { contact_name, contact_role, contact_email, contact_whatsapp, contact_photo } = incoming;
        setCfg({
          contact_name: contact_name || '',
          contact_role: contact_role || '',
          contact_email: contact_email || '',
          contact_whatsapp: contact_whatsapp || '',
          contact_photo: contact_photo || '',
        });
      })
      .catch(() => setLoadError(true))
      .finally(() => setLoading(false));
  }, [pageKey]);

  const set = (k, v) => setCfg(p => ({ ...p, [k]: v }));

  const handlePhoto = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    if (f.size > 10 * 1024 * 1024) { setError('Imagem muito pesada (máx 10MB).'); return; }
    setPhotoFile(f);
    setPhotoPreview(URL.createObjectURL(f));
    setError('');
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      // Envia só os campos do contato: o PHP mescla com o resto da página
      // (hero etc.), sem sobrescrever com a cópia antiga desta tela.
      const saved = await savePageConfig(pageKey, cfg, { contact_photo: photoFile });
      const { contact_name, contact_role, contact_email, contact_whatsapp, contact_photo } = saved;
      const next = { contact_name: contact_name || '', contact_role: contact_role || '', contact_email: contact_email || '', contact_whatsapp: contact_whatsapp || '', contact_photo: contact_photo || '' };
      setCfg(next);
      markClean(next);
      window.showToast?.('Contato salvo.');
      setPhotoFile(null);
      setPhotoPreview(null);
      setSavedAt(Date.now());
      setTimeout(() => setSavedAt(null), 3000);
    } catch (err) {
      setError(err.message || 'Erro ao salvar contato.');
      toastError(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-6 text-center"><Loader2 className="w-6 h-6 animate-spin text-emerald-600 mx-auto" /></div>;

  const photoUrl = photoPreview || (cfg.contact_photo ? (cfg.contact_photo.startsWith('http') ? cfg.contact_photo : getImageUrl(cfg.contact_photo)) : '');

  return (
    <AdminCard
      title={title}
      subtitle="Os dados aqui aparecem como contato em todas as postagens deste tipo."
      actions={<><SaveStatus dirty={dirty} savedAt={savedAt} /><SaveButton onSave={handleSave} saving={saving} disabled={loadError} label="Salvar contato" /></>}
    >

      {error && <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-[140px_1fr] gap-5">
        {/* Foto */}
        <div>
          <label className="block text-[10px] font-bold uppercase text-gray-500 tracking-widest mb-2">Foto (opcional)</label>
          <div className="relative w-32 h-32 bg-white border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center cursor-pointer overflow-hidden hover:border-emerald-500 transition-colors">
            {photoUrl ? (
              <img src={photoUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="text-center p-2">
                <UploadCloud className="mx-auto h-6 w-6 text-gray-400" />
                <p className="mt-1 text-[10px] text-gray-500">Foto</p>
              </div>
            )}
            <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handlePhoto} />
          </div>
          {photoUrl && (
            <button type="button" onClick={() => { setPhotoFile(null); setPhotoPreview(null); set('contact_photo', ''); }}
              className="mt-2 text-[11px] font-bold text-gray-400 hover:text-red-600">Remover foto</button>
          )}
        </div>

        {/* Campos */}
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Field label="Nome completo" value={cfg.contact_name} onChange={v => set('contact_name', v)} placeholder="Seu nome aqui" />
            <Field label="Cargo / função" value={cfg.contact_role} onChange={v => set('contact_role', v)} placeholder="Cargo aqui" />
            <Field label="E-mail" value={cfg.contact_email} onChange={v => set('contact_email', v)} placeholder="email@sif.org.br" />
            <Field label="WhatsApp (só números)" value={cfg.contact_whatsapp} onChange={v => set('contact_whatsapp', v)} placeholder="(DDD) 00000-0000" />
          </div>
        </div>
      </div>
    </AdminCard>
  );
}

function Field({ label, value, onChange, placeholder }) {
  return (
    <div>
      <label className="block text-[10px] font-bold uppercase text-gray-500 tracking-widest mb-1">{label}</label>
      <input
        type="text"
        className="w-full p-2.5 bg-gray-50 rounded-xl border border-gray-200 text-sm outline-none focus:border-emerald-600"
        value={value || ''}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}
