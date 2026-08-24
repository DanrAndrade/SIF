import React from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { useQuillImageHandler } from '../../hooks/useQuillImageHandler';

export default function QuillEditor({ value, onChange, height = 'h-[550px]', className = '' }) {
  const { quillRef, modules } = useQuillImageHandler();

  return (
    <div className={`bg-white rounded-lg border border-gray-200 flex flex-col overflow-hidden ${height} ${className}`}>
      {/* useSemanticHTML={false}: serializa pelo DOM real do editor
          (root.innerHTML). O padrão (getSemanticHTML) convertia o vídeo em
          link <a> e bagunçava os parágrafos. Assim o vídeo é salvo como
          <iframe class="ql-video">. */}
      <ReactQuill
        ref={quillRef}
        theme="snow"
        modules={modules}
        value={value}
        onChange={onChange}
        useSemanticHTML={false}
        className="flex-1 min-h-0 flex flex-col"
      />
    </div>
  );
}
