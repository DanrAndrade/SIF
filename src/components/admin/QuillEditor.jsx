import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useQuillImageHandler } from '../../hooks/useQuillImageHandler';

export default function QuillEditor({ value, onChange, height = 'h-96', className = '' }) {
  const { quillRef, modules } = useQuillImageHandler();

  return (
    <div className={`bg-white rounded-[24px] border border-gray-200 overflow-hidden ${className}`}>
      <ReactQuill
        ref={quillRef}
        theme="snow"
        modules={modules}
        value={value}
        onChange={onChange}
        className={height}
      />
    </div>
  );
}
