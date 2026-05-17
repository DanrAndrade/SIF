import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2, Edit, X, Save, ChevronUp, ChevronDown, ToggleLeft, ToggleRight, AlertTriangle, HelpCircle, Loader2 } from 'lucide-react';
import Button from '../ui/Button';
import { Input, TextArea } from '../ui/FormElements';
import { API_BASE_URL } from '../../apiConfig';

const API_URL = `${API_BASE_URL}/faqs.php`;

// Conteúdo atual hardcoded da Home — preenche o banco na primeira carga se vazio.
const DEFAULT_FAQS_HOME = [
  { question: 'Como me tornar um associado?', answer: 'Para se tornar um associado, entre em contato com nossa equipe administrativa através do formulário de contato ou e-mail institucional para receber os detalhes sobre o processo de filiação.' },
  { question: 'O que é o SIF?', answer: 'A Sociedade de Investigações Florestais (SIF) é uma instituição sem fins lucrativos que promove a integração entre universidades e empresas do setor florestal, fomentando pesquisa e inovação.' },
  { question: 'Onde o SIF está localizado?', answer: 'Nossa sede está localizada no campus da Universidade Federal de Viçosa (UFV), em Viçosa - MG, polo de referência em Ciência Florestal no Brasil.' },
  { question: 'Quais são as principais áreas de atuação?', answer: 'Atuamos em cinco pilares fundamentais: Silvicultura, Manejo de Recursos Florestais, Ambiência, Proteção Florestal e Tecnologia de Produtos Florestais.' },
];

export default function AdminFAQ({ pageKey = 'home' }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [toDelete, setToDelete] = useState(null);
  const [seeded, setSeeded] = useState(false);

  const fetchItems = async () => {
    try {
      const res = await axios.get(`${API_URL}?page_key=${pageKey}`);
      const data = Array.isArray(res.data) ? res.data : [];
      setItems(data);
      return data;
    } catch (err) {
      console.error(err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Primeira carga: se backend está vazio e há defaults conhecidos, pré-popula.
  useEffect(() => {
    (async () => {
      const data = await fetchItems();
      if (data.length === 0 && !seeded && pageKey === 'home') {
        setSeeded(true);
        try {
          for (const item of DEFAULT_FAQS_HOME) {
            const fd = new FormData();
            fd.append('page_key', pageKey);
            fd.append('question', item.question);
            fd.append('answer', item.answer);
            await axios.post(API_URL, fd);
          }
          fetchItems();
        } catch (err) {
          console.error('Falha ao popular FAQs iniciais:', err);
        }
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageKey]);

  const resetForm = () => {
    setEditingId(null);
    setQuestion('');
    setAnswer('');
    setIsActive(true);
    setError('');
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setQuestion(item.question);
    setAnswer(item.answer || '');
    setIsActive(item.active == 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSave = async () => {
    if (!question.trim()) { setError('Pergunta obrigatória.'); return; }
    setSaving(true);
    const fd = new FormData();
    fd.append('page_key', pageKey);
    fd.append('question', question.trim());
    fd.append('answer', answer.trim());

    try {
      if (editingId) {
        fd.append('id', editingId);
        fd.append('active', isActive ? '1' : '0');
        fd.append('_method', 'PUT');
      }
      await axios.post(API_URL, fd);
      resetForm();
      fetchItems();
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao salvar.');
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!toDelete) return;
    try {
      await axios.delete(`${API_URL}?id=${toDelete.id}`);
      setItems(items.filter(i => i.id !== toDelete.id));
      if (editingId === toDelete.id) resetForm();
      setToDelete(null);
    } catch {
      alert('Erro ao excluir.');
    }
  };

  const toggleActive = async (item) => {
    const prev = [...items];
    setItems(items.map(i => i.id === item.id ? { ...i, active: item.active == 1 ? 0 : 1 } : i));
    try {
      const fd = new FormData();
      fd.append('id', item.id);
      fd.append('active', item.active == 1 ? '0' : '1');
      fd.append('_method', 'PUT');
      await axios.post(API_URL, fd);
    } catch {
      setItems(prev);
    }
  };

  const move = async (item, direction) => {
    const idx = items.findIndex(i => i.id === item.id);
    const newIdx = idx + direction;
    if (newIdx < 0 || newIdx >= items.length) return;
    const other = items[newIdx];
    const newList = [...items];
    [newList[idx], newList[newIdx]] = [newList[newIdx], newList[idx]];
    setItems(newList);
    try {
      await Promise.all([
        (() => { const fd = new FormData(); fd.append('id', item.id); fd.append('sort_order', other.sort_order); fd.append('_method', 'PUT'); return axios.post(API_URL, fd); })(),
        (() => { const fd = new FormData(); fd.append('id', other.id); fd.append('sort_order', item.sort_order); fd.append('_method', 'PUT'); return axios.post(API_URL, fd); })(),
      ]);
      fetchItems();
    } catch {
      fetchItems();
    }
  };

  if (loading) {
    return <div className="p-6 text-center"><Loader2 className="w-6 h-6 animate-spin text-emerald-600 mx-auto" /></div>;
  }

  return (
    <div className="relative">
      {toDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl p-6 text-center">
            <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4"><AlertTriangle className="text-red-600" size={24} /></div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Excluir pergunta?</h3>
            <p className="text-sm text-gray-500 mb-6 line-clamp-3">{toDelete.question}</p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setToDelete(null)} className="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 text-sm font-bold hover:bg-gray-50">Cancelar</button>
              <button onClick={confirmDelete} className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-bold hover:bg-red-700 flex items-center gap-2"><Trash2 size={16} /> Excluir</button>
            </div>
          </div>
        </div>
      )}

      <div className={`p-6 rounded-xl mb-8 border ${editingId ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'}`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className={`text-sm font-bold uppercase flex items-center gap-2 ${editingId ? 'text-blue-600' : 'text-gray-500'}`}>
            {editingId ? <Edit size={16} /> : <Plus size={16} />} {editingId ? 'Editando pergunta' : 'Nova pergunta'}
          </h3>
          {editingId && (
            <button onClick={resetForm} className="text-xs font-bold text-gray-500 hover:text-red-500 flex items-center gap-1"><X size={14} /> Cancelar</button>
          )}
        </div>

        <div className="space-y-4">
          <Input label="Pergunta" placeholder="Qual é a missão da SIF?" value={question} onChange={(e) => setQuestion(e.target.value)} />
          <TextArea label="Resposta" placeholder="A SIF tem como missão..." value={answer} onChange={(e) => setAnswer(e.target.value)} />

          {editingId && (
            <div className="flex items-center justify-between bg-white p-3 rounded border border-gray-200">
              <span className="text-sm font-medium text-gray-700">Status:</span>
              <button onClick={() => setIsActive(!isActive)} className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold ${isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-200 text-gray-500'}`}>
                {isActive ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                {isActive ? 'Visível' : 'Oculta'}
              </button>
            </div>
          )}

          {error && <p className="text-xs text-red-500 font-bold text-center">{error}</p>}
          <Button onClick={handleSave} disabled={saving} isLoading={saving} variant="primary" className="w-full">
            <Save size={16} /> {saving ? 'Salvando...' : (editingId ? 'Atualizar pergunta' : 'Adicionar pergunta')}
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        {items.map((item, idx) => (
          <div key={item.id} className={`group flex items-start gap-4 p-4 border rounded-lg bg-white ${editingId === item.id ? 'border-blue-400 ring-1 ring-blue-400' : 'border-gray-100 hover:border-gray-300'}`}>
            <div className="flex flex-col pt-1">
              <button onClick={() => move(item, -1)} disabled={idx === 0} className="p-1 text-gray-400 hover:text-emerald-600 disabled:opacity-20"><ChevronUp size={16} /></button>
              <button onClick={() => move(item, 1)} disabled={idx === items.length - 1} className="p-1 text-gray-400 hover:text-emerald-600 disabled:opacity-20"><ChevronDown size={16} /></button>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-800 mb-1">{item.question}</p>
              <p className="text-xs text-gray-500 line-clamp-2">{item.answer || <span className="italic">Sem resposta cadastrada</span>}</p>
              {item.active == 0 && <span className="inline-block mt-2 text-[9px] font-bold uppercase tracking-widest text-gray-400 bg-gray-100 px-2 py-1 rounded">Oculta</span>}
            </div>
            <div className="flex items-center gap-1 pl-2 border-l border-gray-100">
              <button onClick={() => toggleActive(item)} className={`p-2 rounded-full ${item.active == 1 ? 'text-emerald-600 bg-emerald-50' : 'text-gray-400 bg-gray-100'}`}>{item.active == 1 ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}</button>
              <button onClick={() => handleEdit(item)} className="p-2 rounded-full text-blue-500 bg-blue-50"><Edit size={18} /></button>
              <button onClick={() => setToDelete(item)} className="p-2 rounded-full text-gray-400 hover:text-red-600 hover:bg-red-50"><Trash2 size={18} /></button>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="text-center py-10 border-2 border-dashed border-gray-100 rounded-xl">
            <HelpCircle className="w-10 h-10 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-400 text-sm">Nenhuma pergunta cadastrada.</p>
          </div>
        )}
      </div>
    </div>
  );
}
