import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/layout/Container';

export const NotFound: React.FC = () => {
  return (
    <div className="bg-secondary-bg min-h-[70vh] flex items-center justify-center py-20 text-center">
      <Container className="flex flex-col items-center">
        <div className="w-16 h-16 bg-brand-orange/5 border border-brand-orange/10 rounded-2xl flex items-center justify-center text-brand-orange text-xl mb-6 font-extrabold shadow-soft">
          404
        </div>
        <h1 className="text-3xl font-extrabold font-heading text-text-primary mb-4 tracking-tight">
          Page Not Found
        </h1>
        <p className="text-text-secondary max-w-md mb-8 text-sm leading-relaxed">
          The culinary coordinates you entered do not exist on our map. Let's get you back to discover something delicious.
        </p>
        <Link to="/">
          <Button variant="primary" size="md" className="rounded-xl font-bold shadow-soft">
            Return to Dashboard
          </Button>
        </Link>
      </Container>
    </div>
  );
};

export default NotFound;
