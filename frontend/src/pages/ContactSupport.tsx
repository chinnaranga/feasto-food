import React from 'react';
import { Container } from '@/components/layout/Container';
import { ContactSupportForm } from '@/components/support/ContactSupportForm';

export const ContactSupport: React.FC = () => {
  return (
    <div className="bg-secondary-bg min-h-screen pb-20 pt-8 text-left">
      <Container>
        <ContactSupportForm />
      </Container>
    </div>
  );
};
