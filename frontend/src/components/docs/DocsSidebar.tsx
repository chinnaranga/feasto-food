import React from 'react';
import { Palette, Cpu, Compass, Eye, BookOpen, ChevronRight } from 'lucide-react';
import { useDocsStore } from '../../store/docs/docsStore';
import { DOCS_PAGES, COMPONENT_EXAMPLES } from '../../constants/docs';

export const DocsSidebar: React.FC = () => {
  const { activePageId, setActivePageId, sidebarCollapsed } = useDocsStore();

  const categories = [
    { id: 'overview', name: 'Overview', icon: <BookOpen size={13} /> },
    { id: 'tokens', name: 'Design Tokens', icon: <Palette size={13} /> },
    { id: 'accessibility', name: 'Accessibility', icon: <Eye size={13} /> },
    { id: 'onboarding', name: 'Developer Onboarding', icon: <Compass size={13} /> },
  ];

  if (sidebarCollapsed) return null;

  return (
    <aside className="w-64 border-r border-border-main bg-secondary-bg shrink-0 h-[calc(100vh-3.5rem)] overflow-y-auto sticky top-14 p-4 scrollbar-thin select-none flex flex-col gap-6 text-left">
      
      {/* Dynamic Navigation Sections */}
      {categories.map((cat) => {
        const pages = DOCS_PAGES.filter((p) => p.category === cat.id);
        if (pages.length === 0) return null;

        return (
          <div key={cat.id} className="flex flex-col gap-1.5">
            <h4 className="text-[10px] font-black text-text-muted uppercase tracking-wider flex items-center gap-1.5 px-2">
              {cat.icon}
              <span>{cat.name}</span>
            </h4>
            <div className="flex flex-col gap-0.5 font-semibold text-xs text-text-secondary pl-1.5">
              {pages.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setActivePageId(p.id)}
                  className={`w-full text-left px-2 py-1.5 rounded-lg transition-main cursor-pointer flex items-center justify-between ${
                    activePageId === p.id
                      ? 'bg-white text-brand-orange border border-border-main/60 shadow-xs'
                      : 'hover:text-text-primary'
                  }`}
                >
                  <span className="truncate">{p.title}</span>
                  {activePageId === p.id && <ChevronRight size={10} />}
                </button>
              ))}
            </div>
          </div>
        );
      })}

      {/* Showcase Components Section */}
      <div className="flex flex-col gap-1.5">
        <h4 className="text-[10px] font-black text-text-muted uppercase tracking-wider flex items-center gap-1.5 px-2">
          <Cpu size={13} />
          <span>Showcase Components</span>
        </h4>
        <div className="flex flex-col gap-0.5 font-semibold text-xs text-text-secondary pl-1.5">
          {COMPONENT_EXAMPLES.map((comp) => {
            const id = `comp-${comp.id}`;
            return (
              <button
                key={comp.id}
                onClick={() => setActivePageId(id)}
                className={`w-full text-left px-2 py-1.5 rounded-lg transition-main cursor-pointer flex items-center justify-between ${
                  activePageId === id
                    ? 'bg-white text-brand-orange border border-border-main/60 shadow-xs'
                    : 'hover:text-text-primary'
                }`}
              >
                <span>{comp.name}</span>
                {activePageId === id && <ChevronRight size={10} />}
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
};
export default DocsSidebar;
