import React from 'react';
import { BookOpen, Clock, ArrowRight } from 'lucide-react';

export interface HelpArticle {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  tag: string;
}

interface HelpArticleCardProps {
  article: HelpArticle;
  onClick?: () => void;
}

export const HelpArticleCard: React.FC<HelpArticleCardProps> = ({ article, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="bg-primary-bg rounded-2xl border border-border-main p-5 hover:border-brand-orange/30 hover:shadow-medium transition-all duration-300 flex flex-col justify-between text-left group cursor-pointer shadow-soft h-full"
    >
      <div>
        <div className="flex items-center justify-between mb-3.5">
          <span className="px-2.5 py-0.5 bg-brand-orange/5 border border-brand-orange/15 rounded-full text-[9px] font-extrabold text-brand-orange uppercase tracking-wide">
            {article.tag}
          </span>
          <div className="flex items-center gap-1 text-[10px] text-text-muted font-semibold">
            <Clock size={11} />
            <span>{article.readTime}</span>
          </div>
        </div>
        <h4 className="font-bold text-sm text-text-primary mb-1.5 group-hover:text-brand-orange transition-main line-clamp-2">
          {article.title}
        </h4>
        <p className="text-xs text-text-secondary leading-relaxed line-clamp-3 mb-4">
          {article.excerpt}
        </p>
      </div>

      <div className="flex items-center gap-1.5 text-xs font-bold text-brand-orange border-t border-border-main/50 pt-3 mt-auto w-full group-hover:gap-2.5 transition-all">
        <BookOpen size={13} />
        <span>Read Article</span>
        <ArrowRight size={13} className="ml-auto" />
      </div>
    </div>
  );
};
