import { useState } from 'react';
import { FileText } from 'lucide-react';
import { getImageUrl } from '../apiConfig';

function EditorSection({ section }) {
  if (!section.content || section.content === '<p><br></p>') return null;
  return (
    <div>
      {section.title && (
        <h3 className="text-xl font-bold uppercase tracking-tighter text-[#007a3d] mb-6">{section.title}</h3>
      )}
      <div
        className="prose prose-lg max-w-none text-gray-600 prose-headings:text-gray-900 prose-headings:uppercase prose-headings:tracking-tighter prose-strong:text-[#007a3d] prose-a:text-[#007a3d] prose-li:marker:text-[#007a3d] prose-img:rounded-3xl prose-img:shadow-sm"
        dangerouslySetInnerHTML={{ __html: section.content }}
      />
    </div>
  );
}

function TabsSection({ section, activeTabs, setActiveTab }) {
  const tabs = section.tabs || [];
  if (!tabs.length) return null;
  const key = section.id || section.title || 'tabs';
  const activeIdx = activeTabs[key] ?? 0;
  return (
    <div>
      {section.title && (
        <h3 className="text-xl font-bold uppercase tracking-tighter text-[#007a3d] mb-6">{section.title}</h3>
      )}
      <div className="flex flex-wrap gap-3 mb-6">
        {tabs.map((tab, i) => (
          <button key={i} onClick={() => setActiveTab(key, i)}
            className={`px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border ${
              activeIdx === i
                ? 'bg-[#1f2937] text-white border-[#1f2937] shadow-md'
                : 'bg-white text-gray-400 border-gray-200 hover:border-[#007a3d] hover:text-[#007a3d]'
            }`}>
            {tab.title}
          </button>
        ))}
      </div>
      {tabs[activeIdx] && (
        <div className="bg-gray-50 rounded-[24px] p-5 md:p-8 border border-gray-100">
          <h4 className="text-base font-bold uppercase tracking-tight text-[#007a3d] mb-6">
            {tabs[activeIdx].title}
          </h4>
          <div
            className="prose prose-sm max-w-none text-gray-700 prose-headings:text-[#1f2937] prose-headings:uppercase prose-strong:text-[#007a3d] prose-a:text-[#007a3d] prose-li:marker:text-[#007a3d] prose-img:rounded-2xl prose-img:shadow-lg"
            dangerouslySetInnerHTML={{ __html: tabs[activeIdx].content }}
          />
        </div>
      )}
    </div>
  );
}

function PdfsSection({ section }) {
  const pdfs = section.pdfs || [];
  if (!pdfs.length) return null;
  return (
    <div>
      {section.title && (
        <h3 className="text-xl font-bold uppercase tracking-tighter text-[#007a3d] mb-6 flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
            <FileText size={16} className="text-[#007a3d]" />
          </div>
          {section.title}
        </h3>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {pdfs.map((pdf, i) => (
          <a key={i} href={getImageUrl(pdf.url)} target="_blank" rel="noreferrer"
            className="flex items-center gap-4 p-4 rounded-2xl border border-gray-100 bg-gray-50 hover:bg-white hover:border-[#007a3d] hover:shadow-lg transition-all group">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-gray-400 group-hover:text-[#007a3d] shadow-sm flex-shrink-0">
              <FileText size={18}/>
            </div>
            <span className="font-bold text-sm text-gray-700 group-hover:text-[#007a3d] truncate">
              {pdf.title || `Documento ${i + 1}`}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}

export default function ContentSectionsRenderer({ sections }) {
  const [activeTabs, setActiveTabs] = useState({});
  const setActiveTab = (key, idx) => setActiveTabs(prev => ({ ...prev, [key]: idx }));

  if (!Array.isArray(sections) || !sections.length) return null;

  return (
    <div className="space-y-12">
      {sections.map((section, i) => {
        if (!section?.type) return null;
        if (section.type === 'editor') return <EditorSection key={section.id || i} section={section} />;
        if (section.type === 'tabs')   return <TabsSection   key={section.id || i} section={section} activeTabs={activeTabs} setActiveTab={setActiveTab} />;
        if (section.type === 'pdfs')   return <PdfsSection   key={section.id || i} section={section} />;
        return null;
      })}
    </div>
  );
}
