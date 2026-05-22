import React, { useState, useEffect } from 'react';
import { Save, Check, Loader2 } from 'lucide-react';
import Button from '../../components/ui/Button';
import PageHeaderForm from '../../components/admin/PageHeaderForm';
import { API_BASE_URL } from '../../apiConfig';

const PAGE_URL = `${API_BASE_URL}/page_content.php`;
const PAGE_KEY = 'contato';

const HERO_DEFAULTS = {
  hero_image: 'https://images.unsplash.com/photo-1557426272-fc759fbb7a8d?q=80&w=2070',
  hero_badge: 'Conecte-se Conosco',
  hero_title_line1: 'Fale com',
  hero_title_highlight: 'Nossa Equipe',
  hero_subtitle: 'Transparência e proximidade são nossos pilares. Envie sua mensagem para iniciar uma parceria técnica ou tirar dúvidas.',
  hero_scroll_label: '',
};

const CONTENT_DEFAULTS = {
  canais_title: 'Canais Diretos',
  phone_label: 'Telefone Centex',
  phone_value: '+55 (31) 3612-3950',
  email_label: 'E-mail Corporativo',
  email_value: 'contato@sif.org.br',
  address_label: 'Sede Administrativa',
  address_value: 'DEP de Engenharia Florestal\nAv. P.H. Rolfs, s/n – Campus da UFV\nViçosa - MG | CEP: 36570-900',
  form_tag: 'Mensagem',
  form_title_line1: 'Atendimento',
  form_title_line2: 'Técnico',
};

export default function ContatoAdmin() {
  const [cfg, setCfg] = useState(CONTENT_DEFAULTS);
  const [otherKeys, setOtherKeys] = useState({}); // preserva o restante do config_json (hero, etc.)
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState(null);

  useEffect(() => {
    fetch(`${PAGE_URL}?page=${PAGE_KEY}`)
      .then(r => r.json())
      .then(data => {
        const incoming = data && typeof data === 'object' && !Array.isArray(data) ? data : {};
        const next = { ...CONTENT_DEFAULTS };
        const others = {};
        for (const [k, v] of Object.entries(incoming)) {
          if (k in CONTENT_DEFAULTS) next[k] = v;
          else others[k] = v;
        }
        setCfg(next);
        setOtherKeys(others);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const set = (k, v) => setCfg(p => ({ ...p, [k]: v }));

  const handleSave = async () => {
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('page', PAGE_KEY);
      fd.append('content_json', JSON.stringify({ ...otherKeys, ...cfg }));
      await fetch(PAGE_URL, { method: 'POST', body: fd });
      setSavedAt(Date.now());
      setTimeout(() => setSavedAt(null), 3000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      <div>
        <h2 className="text-3xl font-bold uppercase text-[#007a3d] tracking-tighter">Página Contato</h2>
        <p className="text-gray-500 text-sm mt-1">Configure o cabeçalho, dados de contato exibidos e textos do formulário.</p>
      </div>

      <PageHeaderForm pageKey={PAGE_KEY} defaults={HERO_DEFAULTS} title="Cabeçalho da página /contato" />

      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-bold text-gray-800">Dados de contato exibidos na página</h3>
          <div className="flex items-center gap-3">
            {savedAt && <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1.5 rounded-full flex items-center gap-1.5"><Check size={14} /> Salvo</span>}
            <Button onClick={handleSave} disabled={saving || loading} isLoading={saving} variant="primary">
              <Save size={16} /> {saving ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </div>

        {loading ? <div className="text-center py-6"><Loader2 className="w-6 h-6 animate-spin text-emerald-600 mx-auto" /></div> : (
          <div className="space-y-5">
            <Field label="Título da seção lateral" value={cfg.canais_title} onChange={v => set('canais_title', v)} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl">
              <Field label="Rótulo Telefone" value={cfg.phone_label} onChange={v => set('phone_label', v)} />
              <Field label="Telefone exibido" value={cfg.phone_value} onChange={v => set('phone_value', v)} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl">
              <Field label="Rótulo E-mail" value={cfg.email_label} onChange={v => set('email_label', v)} />
              <Field label="E-mail exibido" value={cfg.email_value} onChange={v => set('email_value', v)} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-xl">
              <Field label="Rótulo Endereço" value={cfg.address_label} onChange={v => set('address_label', v)} />
              <div className="md:col-span-2">
                <Field label="Endereço (use Enter para quebra de linha)" type="textarea" rows={3} value={cfg.address_value} onChange={v => set('address_value', v)} />
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4">
              <p className="text-xs font-bold uppercase text-gray-500 tracking-widest mb-3">Cabeçalho do formulário</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Field label="Tag (verde)" value={cfg.form_tag} onChange={v => set('form_tag', v)} />
                <Field label="Título — linha 1" value={cfg.form_title_line1} onChange={v => set('form_title_line1', v)} />
                <Field label="Título — linha 2" value={cfg.form_title_line2} onChange={v => set('form_title_line2', v)} />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
        <p className="text-xs text-amber-800">
          <strong>📌 Sobre o formulário:</strong> O formulário em si não é editável (campos fixos: Nome, E-mail, Telefone, Assunto, Mensagem). As mensagens recebidas aparecem na aba <strong>"Leads / Contato"</strong>.
        </p>
      </div>
    </div>
  );
}

function Field({ label, type = 'text', value, onChange, rows = 2 }) {
  const cls = "w-full p-2.5 bg-white rounded-xl border border-gray-200 text-sm outline-none focus:border-emerald-600";
  return (
    <div>
      <label className="block text-[10px] font-bold uppercase text-gray-500 tracking-widest mb-1">{label}</label>
      {type === 'textarea'
        ? <textarea className={`${cls} resize-y`} rows={rows} value={value || ''} onChange={e => onChange(e.target.value)} />
        : <input className={cls} type="text" value={value || ''} onChange={e => onChange(e.target.value)} />
      }
    </div>
  );
}
