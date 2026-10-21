import React, { useState } from 'react';
import { Plus, ArrowLeftRight } from 'lucide-react';
import { ItemActions, moveItem, ImageField, useConfirm } from '../kit';
import { uploadImageNow, toastError } from '../../../utils/adminApi';
import { BLOCK_ICONS } from '../../sections/SectionBlocks';
import QuillEditor from '../QuillEditor';
import { useUploadTracker, useLatest } from './uploadTracker';

// Editores dos blocos novos (cards, números, pessoas, galeria, vídeo,
// citação, chamada, texto + imagem). Os antigos (texto, abas, PDFs, logos)
// continuam no ContentSections.jsx.

const inputCls = 'w-full p-2.5 bg-white rounded-xl border border-gray-200 text-sm outline-none focus:border-[#007a3d]';
const labelCls = 'block text-[10px] font-bold uppercase text-gray-500 tracking-widest mb-1';

export function Field({ label, value, onChange, placeholder, textarea, rows = 3 }) {
  return (
    <div className="min-w-0">
      {label && <label className={labelCls}>{label}</label>}
      {textarea
        ? <textarea className={`${inputCls} resize-y`} rows={rows} value={value || ''} placeholder={placeholder} onChange={e => onChange(e.target.value)} />
        : <input className={inputCls} value={value || ''} placeholder={placeholder} onChange={e => onChange(e.target.value)} />}
    </div>
  );
}

// Lista genérica de itens com ↑↓ e excluir
function ItemList({ items, onChange, empty, render, addLabel, newItem, grid = false }) {
  const confirm = useConfirm();
  const list = items || [];
  const latest = useLatest(list);
  const set = (i, patch) => onChange(latest.current.map((it, j) => (j === i ? { ...it, ...patch } : it)));
  const remove = async (i) => {
    if (!(await confirm({ title: 'Remover este item?', confirmLabel: 'Remover', danger: true }))) return;
    onChange(list.filter((_, j) => j !== i));
  };
  return (
    <div className="space-y-3">
      {list.length === 0 && <p className="text-sm text-gray-400 italic">{empty}</p>}
      <div className={grid ? 'grid grid-cols-1 md:grid-cols-2 gap-3' : 'space-y-3'}>
        {list.map((it, i) => (
          <div key={i} className="p-4 bg-gray-50 border border-gray-200 rounded-xl">
            <div className="flex justify-between items-center mb-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Item {i + 1}</span>
              <ItemActions size={14} onMove={(d) => onChange(moveItem(list, i, d))} isFirst={i === 0} isLast={i === list.length - 1} onDelete={() => remove(i)} />
            </div>
            {render(it, (patch) => set(i, patch), i)}
          </div>
        ))}
      </div>
      <button type="button" onClick={() => onChange([...list, newItem()])}
        className="w-full p-3 border-2 border-dashed border-gray-200 rounded-xl text-gray-500 hover:border-[#007a3d] hover:text-[#007a3d] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2">
        <Plus size={16} /> {addLabel}
      </button>
    </div>
  );
}

// Envia a imagem e chama done(url); o ContentSections trava o Salvar enquanto isso
const newItemId = () => `i-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
const upload = (track, file, done) => track(uploadImageNow(file)).then(url => url && done(url)).catch(toastError);

export function TextImageEditor({ sec, onUpdate }) {
  const track = useUploadTracker();
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-5">
      <QuillEditor value={sec.content || ''} onChange={(v) => onUpdate({ content: v })} height="h-[300px]" />
      <div className="space-y-3">
        <ImageField label="Imagem" value={sec.image} onFile={(f) => upload(track, f, (url) => onUpdate({ image: url }))} onRemove={() => onUpdate({ image: '' })} aspect="h-44" hint="Envia na hora; Salvar publica." />
        <button type="button" onClick={() => onUpdate({ image_side: sec.image_side === 'left' ? 'right' : 'left' })}
          className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl border border-gray-200 bg-white text-xs font-bold text-gray-600 hover:border-[#007a3d] hover:text-[#007a3d]">
          <ArrowLeftRight size={14} /> Imagem à {sec.image_side === 'left' ? 'esquerda' : 'direita'}
        </button>
      </div>
    </div>
  );
}

function IconPicker({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const Icon = BLOCK_ICONS[value] || BLOCK_ICONS.Target;
  return (
    <div className="relative">
      <label className={labelCls}>Ícone</label>
      <button type="button" onClick={() => setOpen(o => !o)} className="w-12 h-11 rounded-xl border border-gray-200 bg-white flex items-center justify-center text-[#007a3d] hover:border-[#007a3d]" aria-label="Escolher ícone">
        <Icon size={20} />
      </button>
      {open && (
        <div className="absolute z-30 mt-2 p-2 bg-white border border-gray-200 rounded-xl shadow-xl grid grid-cols-6 gap-1 w-[280px]">
          {Object.entries(BLOCK_ICONS).map(([name, I]) => (
            <button key={name} type="button" title={name} onClick={() => { onChange(name); setOpen(false); }}
              className={`w-10 h-10 rounded-lg flex items-center justify-center ${name === value ? 'bg-[#007a3d] text-white' : 'text-gray-600 hover:bg-emerald-50 hover:text-[#007a3d]'}`}>
              <I size={18} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function CardsEditor({ sec, onUpdate }) {
  return (
    <ItemList items={sec.items} onChange={(items) => onUpdate({ items })} grid addLabel="Adicionar card"
      empty="Nenhum card." newItem={() => ({ icon: 'Target', title: '', text: '' })}
      render={(it, set) => (
        <div className="space-y-3">
          <div className="flex gap-3 items-end">
            <IconPicker value={it.icon} onChange={(icon) => set({ icon })} />
            <div className="flex-1"><Field label="Título" value={it.title} onChange={(title) => set({ title })} /></div>
          </div>
          <Field label="Texto" textarea rows={3} value={it.text} onChange={(text) => set({ text })} />
        </div>
      )} />
  );
}

export function StatsEditor({ sec, onUpdate }) {
  return (
    <ItemList items={sec.items} onChange={(items) => onUpdate({ items })} grid addLabel="Adicionar número"
      empty="Nenhum número." newItem={() => ({ value: '', label: '' })}
      render={(it, set) => (
        <div className="grid grid-cols-2 gap-3">
          <Field label="Número (ex.: +120)" value={it.value} onChange={(value) => set({ value })} />
          <Field label="Legenda" value={it.label} onChange={(label) => set({ label })} />
        </div>
      )} />
  );
}

export function PeopleEditor({ sec, onUpdate }) {
  const track = useUploadTracker();
  return (
    <ItemList items={sec.items} onChange={(items) => onUpdate({ items })} grid addLabel="Adicionar pessoa"
      empty="Nenhuma pessoa." newItem={() => ({ _id: newItemId(), name: '', role: '', photo: '', link: '' })}
      render={(it, set) => (
        <div className="grid grid-cols-[110px_1fr] gap-3">
          <ImageField label="Foto" value={it.photo} onFile={(f) => {
            // id estável: a foto vai para esta pessoa mesmo se a lista mudar durante o envio
            const id = it._id || newItemId();
            if (!it._id) set({ _id: id });
            upload(track, f, (photo) => onUpdate(cur => ({ items: (cur.items || []).map(p => (p._id === id ? { ...p, photo } : p)) })));
          }} onRemove={() => set({ photo: '' })} aspect="h-28" />
          <div className="space-y-2">
            <Field label="Nome" value={it.name} onChange={(name) => set({ name })} />
            <Field label="Cargo / função" value={it.role} onChange={(role) => set({ role })} />
            <Field label="Link (Lattes, LinkedIn...)" value={it.link} onChange={(link) => set({ link })} placeholder="https://" />
          </div>
        </div>
      )} />
  );
}

export function GalleryEditor({ sec, onUpdate }) {
  const images = sec.images || [];
  const track = useUploadTracker();
  const [busy, setBusy] = useState(false);
  const add = async (files) => {
    setBusy(true);
    const urls = [];
    for (const f of files) { try { const u = await track(uploadImageNow(f)); if (u) urls.push(u); } catch (e) { toastError(e); } }
    // aplica sobre as fotos atuais do bloco (pode ter mudado durante o envio)
    if (urls.length) onUpdate(cur => ({ images: [...(cur.images || []), ...urls] }));
    setBusy(false);
  };
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
        {images.map((src, i) => (
          <div key={i} className="relative group">
            <ImageField value={src} onFile={(f) => upload(track, f, (u) => onUpdate(cur => ({ images: (cur.images || []).map((x) => (x === src ? u : x)) })))} onRemove={() => onUpdate({ images: images.filter((_, j) => j !== i) })} aspect="h-24" />
            <div className="flex justify-center gap-1 mt-1">
              <button type="button" disabled={i === 0} onClick={() => onUpdate({ images: moveItem(images, i, -1) })} className="text-xs px-2 rounded bg-white border border-gray-200 disabled:opacity-30">←</button>
              <button type="button" disabled={i === images.length - 1} onClick={() => onUpdate({ images: moveItem(images, i, 1) })} className="text-xs px-2 rounded bg-white border border-gray-200 disabled:opacity-30">→</button>
            </div>
          </div>
        ))}
      </div>
      <label className={`flex items-center justify-center gap-2 p-3 border-2 border-dashed rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer ${busy ? 'opacity-50 pointer-events-none border-gray-200' : 'border-gray-200 text-gray-500 hover:border-[#007a3d] hover:text-[#007a3d]'}`}>
        <Plus size={16} /> {busy ? 'Enviando fotos...' : 'Adicionar fotos (pode escolher várias)'}
        <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => { const fs = [...(e.target.files || [])]; e.target.value = ''; if (fs.length) add(fs); }} />
      </label>
    </div>
  );
}

export function VideoEditor({ sec, onUpdate }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Field label="Link do vídeo (YouTube, Vimeo ou MP4)" value={sec.url} onChange={(url) => onUpdate({ url })} placeholder="https://www.youtube.com/watch?v=..." />
      <Field label="Legenda (opcional)" value={sec.caption} onChange={(caption) => onUpdate({ caption })} />
    </div>
  );
}

export function QuoteEditor({ sec, onUpdate }) {
  return (
    <div className="space-y-3">
      <Field label="Frase" textarea rows={3} value={sec.text} onChange={(text) => onUpdate({ text })} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Field label="Autor" value={sec.author} onChange={(author) => onUpdate({ author })} />
        <Field label="Cargo do autor" value={sec.role} onChange={(role) => onUpdate({ role })} />
      </div>
    </div>
  );
}

export function CtaEditor({ sec, onUpdate }) {
  return (
    <div className="space-y-3">
      <Field label="Texto" textarea rows={2} value={sec.text} onChange={(text) => onUpdate({ text })} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Field label="Texto do botão" value={sec.btn_label} onChange={(btn_label) => onUpdate({ btn_label })} />
        <Field label="Link do botão" value={sec.btn_link} onChange={(btn_link) => onUpdate({ btn_link })} placeholder="/contato ou https://..." />
      </div>
    </div>
  );
}

export function SpecialNote({ children }) {
  return <p className="text-sm text-gray-500 bg-emerald-50/60 border border-emerald-100 rounded-xl p-3">{children}</p>;
}
