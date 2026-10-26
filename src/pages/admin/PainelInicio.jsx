import React, { useEffect, useState } from 'react';
import { ArrowRight, Inbox } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../../apiConfig';
import { useAdminUser } from '../../contexts/AdminUserContext';
import { ALL_ITEMS, TAB_PATHS } from '../../utils/adminModules';
import { toDate } from '../../apiConfig';

// Início do painel: números rápidos, últimas mensagens e atalhos —
// cada pessoa vê só o que tem permissão de abrir.
const getJson = (url) => fetch(url, { credentials: 'include' }).then(r => (r.ok ? r.json() : [])).then(d => (Array.isArray(d) ? d : [])).catch(() => []);

export default function PainelInicio() {
  const { user, can } = useAdminUser();
  const navigate = useNavigate();
  const [data, setData] = useState({});

  useEffect(() => {
    if (!user) return;
    const jobs = [];
    const add = (key, tab, url) => { if (can(tab)) jobs.push(getJson(url).then(v => [key, v])); };
    add('leads', 'leads', `${API_BASE_URL}/leads.php`);
    add('candidates', 'candidates', `${API_BASE_URL}/candidates.php`);
    add('jobs', 'jobs', `${API_BASE_URL}/jobs.php?admin=1`);
    add('blog', 'blog', `${API_BASE_URL}/blog.php?admin=1`);
    add('eventos', 'eventos', `${API_BASE_URL}/eventos.php?admin=1`);
    add('treinamentos', 'treinamentos', `${API_BASE_URL}/treinamentos.php?admin=1`);
    add('gt', 'gt', `${API_BASE_URL}/gt.php?admin=1`);
    Promise.all(jobs).then(list => setData(Object.fromEntries(list)));
  }, [user, can]);

  const isNew = (s) => !s || ['new', 'novo', 'unread', 'pending', 'pendente'].includes(String(s).toLowerCase());
  const cards = [
    { tab: 'leads', label: 'Mensagens novas', value: (data.leads || []).filter(l => isNew(l.status)).length, total: (data.leads || []).length, totalLabel: 'no total' },
    { tab: 'candidates', label: 'Candidaturas novas', value: (data.candidates || []).filter(c => isNew(c.status)).length, total: (data.candidates || []).length, totalLabel: 'no total' },
    { tab: 'jobs', label: 'Vagas abertas', value: (data.jobs || []).filter(j => j.active == 1).length },
    { tab: 'blog', label: 'Posts publicados', value: (data.blog || []).filter(p => p.active == 1).length },
    { tab: 'eventos', label: 'Eventos no site', value: (data.eventos || []).filter(e => e.active == 1).length },
    { tab: 'treinamentos', label: 'Treinamentos no site', value: (data.treinamentos || []).filter(e => e.active == 1).length },
    { tab: 'gt', label: 'Grupos temáticos', value: (data.gt || []).filter(e => e.active == 1).length },
  ].filter(c => can(c.tab) && data[c.tab] !== undefined);

  const recentLeads = (data.leads || []).slice(0, 5);
  const shortcuts = ALL_ITEMS.filter(i => i.tab !== 'inicio' && can(i.tab)).slice(0, 12);
  const hour = new Date().getHours();
  const hello = hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite';
  const firstName = (user?.name || '').split(' ')[0];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">{hello}{firstName ? `, ${firstName}` : ''}!</h2>
        <p className="text-gray-500 mt-1">Resumo do site e atalhos para o que você pode alterar.</p>
      </div>

      {cards.length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map((c, i) => {
            return (
              <button key={c.tab} type="button" onClick={() => navigate(TAB_PATHS[c.tab])}
                className={`text-left bg-white rounded-2xl border border-gray-200/80 p-4 md:p-5 shadow-sm hover:shadow-md hover:border-[#007a3d]/40 transition-all ${cards.length % 2 === 1 && i === cards.length - 1 ? 'col-span-2 lg:col-span-1' : ''}`}>
                <p className="text-2xl md:text-3xl font-semibold text-gray-900 tabular-nums">{c.value}</p>
                <p className="text-sm text-gray-500 mt-1">{c.label}{c.total !== undefined && c.total !== c.value ? <span className="text-gray-400"> · {c.total} {c.totalLabel}</span> : null}</p>
              </button>
            );
          })}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-6">
        {can('leads') && (
          <section className="bg-white rounded-2xl border border-gray-200/80 shadow-sm">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900">Últimas mensagens de contato</h3>
              <button type="button" onClick={() => navigate(TAB_PATHS.leads)} className="text-sm font-semibold text-[#007a3d] hover:underline inline-flex items-center gap-1">Ver todas <ArrowRight size={14} /></button>
            </div>
            {recentLeads.length === 0 ? (
              <div className="p-10 text-center text-gray-400 text-sm"><Inbox className="mx-auto mb-2" size={28} />Nenhuma mensagem ainda.</div>
            ) : (
              <ul className="divide-y divide-gray-100">
                {recentLeads.map(l => (
                  <li key={l.id} className="px-6 py-4 flex items-start gap-4">
                    <span className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${isNew(l.status) ? 'bg-[#007a3d]' : 'bg-gray-200'}`} />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-gray-900 truncate">{l.name} <span className="font-normal text-gray-400">· {l.subject || 'Contato'}</span></p>
                      <p className="text-sm text-gray-500 truncate">{l.message}</p>
                    </div>
                    <span className="text-xs text-gray-400 shrink-0">{toDate(l.created_at)?.toLocaleDateString('pt-BR') || ''}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}

        <section className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Atalhos</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {shortcuts.map(s => (
              <button key={s.tab} type="button" onClick={() => navigate(s.path)}
                className="text-left px-4 py-3 rounded-xl border border-gray-100 hover:border-[#007a3d]/40 hover:bg-emerald-50/40 transition-colors">
                <span className="block text-sm font-semibold text-gray-800">{s.label}</span>
                <span className="block text-xs text-gray-400">{s.group}</span>
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
