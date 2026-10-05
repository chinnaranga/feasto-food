import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, className = '' }) => {
  return (
    <nav aria-label="Breadcrumb" className={`flex text-sm text-text-secondary select-none ${className}`}>
      <ol className="flex items-center space-x-1.5 md:space-x-2">
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;

          return (
            <li key={idx} className="flex items-center">
              {idx > 0 && <ChevronRight size={14} className="text-text-muted mx-1.5 shrink-0" />}

              {item.icon && <span className="mr-1.5 text-text-muted flex items-center">{item.icon}</span>}

              {isLast || !item.href ? (
                <span className={`font-semibold ${isLast ? 'text-text-primary' : 'text-text-secondary'}`}>
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.href}
                  className="font-medium text-text-secondary hover:text-brand-orange transition-main cursor-pointer"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
