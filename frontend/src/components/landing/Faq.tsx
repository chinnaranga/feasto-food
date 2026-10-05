import React from 'react';
import { Container } from '../layout/Container';
import { Accordion } from '../ui/Accordion';

export const Faq: React.FC = () => {
  const faqItems = [
    {
      title: 'How accurate is the AI flavor profile matching?',
      content:
        'Our context-aware AI models analyze ingredient layers, historical ratings, and dish notes rather than generic categories. The system averages a 95%+ precision rate, which refines continuously as you rate ordered items.',
    },
    {
      title: 'How does the strict allergen filtering work?',
      content:
        'Feasto maintains a multi-stage ingredient verification layer. When you add allergen exemptions to your taste profile, the engine dynamically screens recipes from kitchen inventory and auto-filters dish prompts, highlighting safe selections.',
    },
    {
      title: 'Can I cancel my Feasto Gold subscription anytime?',
      content:
        'Absolutely. There are no contracts or cancellation penalties. You can manage or cancel your Feasto Gold membership directly from your profile settings page with a single click.',
    },
    {
      title: 'What local delivery range does Feasto cover?',
      content:
        'Feasto is partnered with couriers across major municipal culinary hubs. We generally serve a 6 km radial distance around our partner kitchens to guarantee optimal travel temperature.',
    },
  ];

  return (
    <section className="bg-primary-bg py-20 md:py-24 select-none text-left">
      <Container className="max-w-4xl">
        <div className="flex flex-col items-center text-center mb-16">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-text-muted">
            Got Questions?
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-text-primary tracking-tight mt-2">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-text-secondary max-w-sm mt-3 leading-relaxed">
            Quick responses to common questions about our taste intelligence platforms.
          </p>
        </div>

        {/* Accordion list */}
        <Accordion items={faqItems} allowMultiple={false} />
      </Container>
    </section>
  );
};
