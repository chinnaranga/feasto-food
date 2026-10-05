import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const paths = location.pathname.split('/').filter(Boolean);

  if (paths.length <= 1) return null;

  return (
    <nav className="flex items-center gap-1.5 text-[10px] font-bold text-neutral-400 select-none">
      <Link to="/restaurant-portal/dashboard" className="hover:text-neutral-600 transition-main">
        Merchant Portal
      </Link>
      {paths.slice(1).map((path, i) => {
        const routeTo = `/${paths.slice(0, i + 2).join('/')}`;
        const isLast = i === paths.length - 2;

        return (
          <React.Fragment key={path}>
            <ChevronRight size={10} className="shrink-0" />
            {isLast ? (
              <span className="text-neutral-500 font-extrabold capitalize truncate">
                {path}
              </span>
            ) : (
              <Link to={routeTo} className="hover:text-neutral-600 transition-main capitalize truncate">
                {path}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
export default Breadcrumbs;
