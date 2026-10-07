import React from 'react';

/**
 * FEASTO UNIFIED TYPOGRAPHY
 * Shared typographic DNA across Customer, Restaurant, Rider, and Admin experiences.
 */

interface EditorialHeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: 'h1' | 'h2' | 'h3';
  children: React.ReactNode;
  className?: string;
}

export const FeastoEditorialHeading: React.FC<EditorialHeadingProps> = ({
  as: Component = 'h1',
  children,
  className = '',
  ...props
}) => {
  return (
    <Component
      className={`font-display font-black tracking-tight leading-[0.92] text-current ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
};

interface OperationalStatementProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: 'h1' | 'h2' | 'h3' | 'h4';
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'giant';
}

export const FeastoOperationalStatement: React.FC<OperationalStatementProps> = ({
  as: Component = 'h2',
  children,
  className = '',
  size = 'lg',
  ...props
}) => {
  const sizeMap = {
    sm: 'text-lg sm:text-xl',
    md: 'text-xl sm:text-2xl',
    lg: 'text-2xl sm:text-3xl tracking-tight',
    xl: 'text-3xl sm:text-4xl tracking-tight',
    giant: 'text-4xl sm:text-6xl tracking-tighter leading-none',
  };

  return (
    <Component
      className={`font-heading font-black uppercase text-current ${sizeMap[size]} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
};

interface SectionHeaderProps {
  index?: string;
  title: string;
  subtitle?: string;
  rightElement?: React.ReactNode;
  className?: string;
  dark?: boolean;
}

export const FeastoSectionHeader: React.FC<SectionHeaderProps> = ({
  index,
  title,
  subtitle,
  rightElement,
  className = '',
  dark = false,
}) => {
  return (
    <div
      className={`pb-4 border-b flex flex-col sm:flex-row sm:items-end justify-between gap-3 text-left ${
        dark ? 'border-white/10 text-[#F3F0E8]' : 'border-[#141518]/15 text-[#141518]'
      } ${className}`}
    >
      <div>
        <div className="flex items-center gap-2 font-mono text-[10px] sm:text-xs uppercase tracking-widest text-[#52555F]">
          {index && <span className="font-bold text-[#1B3BFF]">{index}</span>}
          <span>{title}</span>
        </div>
        {subtitle && (
          <p
            className={`font-sans text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed ${
              dark ? 'text-[#8A8D98]' : 'text-[#52555F]'
            }`}
          >
            {subtitle}
          </p>
        )}
      </div>
      {rightElement && <div className="shrink-0">{rightElement}</div>}
    </div>
  );
};

export const FeastoMetadata: React.FC<{
  label: string;
  value: React.ReactNode;
  className?: string;
}> = ({ label, value, className = '' }) => {
  return (
    <div className={`space-y-0.5 text-left ${className}`}>
      <span className="font-mono text-[9px] uppercase tracking-wider text-[#8A8D98] block">
        {label}
      </span>
      <div className="font-mono text-xs font-bold text-current">{value}</div>
    </div>
  );
};

export const FeastoMonoTag: React.FC<{
  children: React.ReactNode;
  variant?: 'default' | 'accent' | 'acid' | 'muted' | 'danger' | 'success';
  className?: string;
}> = ({ children, variant = 'default', className = '' }) => {
  const variantMap = {
    default: 'bg-[#141518] text-[#F3F0E8] border-[#141518]',
    accent: 'bg-[#1B3BFF] text-white border-[#1B3BFF]',
    acid: 'bg-[#D7F04A] text-[#141518] border-[#D7F04A]',
    muted: 'bg-[#FAF8F5] text-[#52555F] border-[#E2DED4]',
    danger: 'bg-[#991B1B]/10 text-[#991B1B] border-[#991B1B]/30',
    success: 'bg-[#15803D]/10 text-[#15803D] border-[#15803D]/30',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider border ${variantMap[variant]} ${className}`}
    >
      {children}
    </span>
  );
};
