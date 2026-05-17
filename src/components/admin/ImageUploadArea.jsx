import React from 'react';
import { Image as ImageIcon, X } from 'lucide-react';
import { getImageUrl } from '../../apiConfig';

export default function ImageUploadArea({
  preview,
  onFileChange,
  onClear,
  accept = 'image/*',
  height = 'min-h-[280px]',
  label = 'Foto de Capa',
  hint = '',
}) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">
          {label}
        </label>
      )}
      <div
        className={`relative ${height} bg-gray-50 rounded-[32px] overflow-hidden border-2 border-dashed flex items-center justify-center group hover:bg-gray-100 transition-all cursor-pointer`}
      >
        {preview ? (
          <>
            <img
              src={preview.startsWith('blob:') || preview.startsWith('data:') ? preview : getImageUrl(preview)}
              className="w-full h-full object-cover"
              alt="preview"
            />
            {onClear && (
              <button
                type="button"
                onClick={e => { e.preventDefault(); e.stopPropagation(); onClear(); }}
                className="absolute top-3 right-3 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors z-10"
              >
                <X size={14} />
              </button>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center gap-3 text-gray-300 pointer-events-none">
            <ImageIcon size={48} />
            <span className="text-[10px] font-black uppercase tracking-widest">Clique para Upload</span>
            {hint && <span className="text-[10px] text-gray-400">{hint}</span>}
          </div>
        )}
        <input
          type="file"
          accept={accept}
          className="absolute inset-0 opacity-0 cursor-pointer"
          onChange={e => {
            const file = e.target.files[0];
            if (file) onFileChange(file);
          }}
        />
      </div>
    </div>
  );
}
