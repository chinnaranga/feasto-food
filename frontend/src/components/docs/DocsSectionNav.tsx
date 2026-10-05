import React, { useMemo } from 'react';
import { generatePageAnchors } from '../../utils/docs/generateAnchors';

interface DocsSectionNavProps {
  content: string;
}

export const DocsSectionNav: React.FC<DocsSectionNavProps> = ({ content }) => {
  const anchors = useMemo(() => {
    return generatePageAnchors(content);
  }, [content]);

  if (anchors.length === 0) return null;

  const scrollToAnchor = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="hidden xl:flex flex-col gap-3 w-44 shrink-0 text-left sticky top-24 self-start border-l border-border-main/50 pl-4 py-1">
      <span className="text-[10px] font-black uppercase tracking-wider text-text-muted">
        On this page
      </span>
      <ul className="flex flex-col gap-2 font-medium text-xs list-none pl-0">
        {anchors.map((anchor) => (
          <li
            key={anchor.id}
            style={{ paddingLeft: anchor.level === 3 ? '12px' : '0px' }}
          >
            <button
              onClick={() => scrollToAnchor(anchor.id)}
              className="text-text-secondary hover:text-brand-orange text-left transition-main cursor-pointer"
            >
              {anchor.text}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default DocsSectionNav;
