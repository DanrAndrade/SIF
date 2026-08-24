import React from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { useQuillImageHandler } from '../../hooks/useQuillImageHandler';

export default function QuillEditor({ value, onChange, height = 'h-[550px]', className = '' }) {
  const { quillRef, modules } = useQuillImageHandler();

  return (
    <div className={`bg-white rounded-lg border border-gray-200 flex flex-col overflow-hidden ${height} ${className}`}>
      <ReactQuill
        ref={quillRef}
        theme="snow"
        modules={modules}
        value={value}
        onChange={onChange}
        className="flex-1 min-h-0 flex flex-col"
      />
    </div>
  );
}
