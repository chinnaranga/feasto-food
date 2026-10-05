import React from 'react';

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const PageContainer: React.FC<PageContainerProps> = ({ children, className = '' }) => {
  return (
    <div className={`w-full max-w-[1200px] mx-auto px-6 py-8 ${className}`}>
      {children}
    </div>
  );
};
export default PageContainer;
