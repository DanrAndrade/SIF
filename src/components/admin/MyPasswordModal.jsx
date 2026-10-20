import React, { useState } from 'react';
import { X, KeyRound } from 'lucide-react';
import { API_BASE_URL } from '../../apiConfig';
import { apiRequest, toastError } from '../../utils/adminApi';

// Janela "Minha senha" — qualquer usuário do painel troca a própria senha.
export default function MyPasswordModal({ onClose }) {
  const [cur, setCur] = useState('');
  const [nova, setNova] = useState('');
  const [conf, setConf] = useState('');
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    if (nova.length < 8) return setErr('A nova senha precisa ter pelo menos 8 caracteres.');
    if (nova !== conf) return setErr('A confirmação não confere com a nova senha.');
    setSaving(true);
    try {
      await apiRequest(`${API_BASE_URL}/users.php`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'my_password', current: cur, new: nova }),
      });
      window.showToast?.('Senha alterada.');
      onClose();
    } catch (error) { setErr(error.message); toastError(error); }
    finally { setSaving(false); }
  };

  const input = 'w-full p-2.5 bg-white rounded-xl border border-gray-200 text-sm outline-none focus:border-emerald-600';
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <form onSubmit={submit} onClick={e => e.stopPropagation()} className="bg-white w-full max-w-sm rounded-2xl shadow-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-gray-800 flex items-center gap-2"><KeyRound size={18} className="text-[#007a3d]" /> Minha senha</h3>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-700" aria-label="Fechar"><X size={18} /></button>
        </div>
        <input className={input} type="password" autoComplete="current-password" placeholder="Senha atual" value={cur} onChange={e => setCur(e.target.value)} />
        <input className={input} type="password" autoComplete="new-password" placeholder="Nova senha (mín. 8 caracteres)" value={nova} onChange={e => setNova(e.target.value)} />
        <input className={input} type="password" autoComplete="new-password" placeholder="Repita a nova senha" value={conf} onChange={e => setConf(e.target.value)} />
        {err && <p className="text-xs text-red-600">{err}</p>}
        <button type="submit" disabled={saving} className="w-full py-2.5 bg-[#007a3d] text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-[#1B5E20] disabled:opacity-50">
          {saving ? 'Salvando...' : 'Trocar senha'}
        </button>
      </form>
    </div>
  );
}
