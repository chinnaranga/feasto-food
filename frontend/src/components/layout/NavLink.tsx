import React from 'react';
import { NavLink as RouterNavLink } from 'react-router-dom';

export interface NavLinkProps {
  to: string;
  children: React.ReactNode;
  end?: boolean;
  onClick?: () => void;
  className?: string;
}

export const NavLink: React.FC<NavLinkProps> = ({
  to,
  children,
  end = false,
  onClick,
  className = '',
}) => {
  return (
    <RouterNavLink
      to={to}
      end={end}
      onClick={onClick}
      className={({ isActive }) =>
        `inline-flex items-center text-sm font-semibold transition-main px-3.5 py-2 rounded-xl focus-ring
        ${
          isActive
            ? 'text-brand-orange bg-brand-orange/5'
            : 'text-text-secondary hover:text-text-primary hover:bg-[#eef1f6]/40'
        } ${className}`
      }
    >
      {children}
    </RouterNavLink>
  );
};
