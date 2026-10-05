import React from 'react';
import { Container } from './Container';

export interface PageWrapperProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  className?: string;
}

export const PageWrapper: React.FC<PageWrapperProps> = ({
  children,
  title,
  description,
  className = '',
}) => {
  return (
    <div className={`min-h-[75vh] bg-secondary-bg py-8 md:py-12 ${className}`}>
      <Container>
        {(title || description) && (
          <div className="mb-8 text-left">
            {title && (
              <h1 className="text-3xl font-extrabold font-heading text-text-primary tracking-tight md:text-4xl">
                {title}
              </h1>
            )}
            {description && (
              <p className="mt-2 text-sm text-text-secondary max-w-2xl leading-relaxed">
                {description}
              </p>
            )}
          </div>
        )}
        {children}
      </Container>
    </div>
  );
};
