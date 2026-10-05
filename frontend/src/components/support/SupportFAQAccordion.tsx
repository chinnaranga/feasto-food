import React from 'react';
import { Accordion, AccordionItem } from '@/components/ui/Accordion';
import { useSupportStore } from '@/store/supportStore';
import { MessageSquareText } from 'lucide-react';

interface FAQ {
  question: string;
  answer: string;
  category: string;
}

const FAQ_ITEMS: FAQ[] = [
  {
    question: 'Where is my active order?',
    answer: 'You can track your active order in real-time by going to the Orders tab in your profile, selecting the active order, and clicking "Track Order". This will show the live status of preparation and rider location on a map.',
    category: 'Order Issues',
  },
  {
    question: 'How do I cancel my order?',
    answer: 'Orders can only be cancelled within 60 seconds of placement. To cancel, go to "My Orders", click on the active order, and select the "Cancel Order" option. After 60 seconds, the kitchen begins preparation and cancellations are no longer accepted to prevent waste.',
    category: 'Refunds & Cancellations',
  },
  {
    question: 'Why was I charged twice for an order?',
    answer: 'If your payment failed but funds were deducted, this is usually a temporary hold by your bank. The duplicate charge is automatically reversed within 3-5 business days. If you still see the double charge after 5 days, please submit a Contact Support form with your bank statement screenshot.',
    category: 'Payments & Billing',
  },
  {
    question: 'How do I update my delivery address?',
    answer: 'You can update your address by going to Profile -> Saved Addresses. If you have an active order and need to change the address, please contact support immediately using the Contact Support ticket form referencing your order number, or click "Contact Support" on the Order Tracking page.',
    category: 'Account & Security',
  },
  {
    question: 'How long do refunds take to process?',
    answer: 'Once approved, refunds for card or UPI payments typically take 2-5 business days to reflect in your bank account, depending on your financial institution.',
    category: 'Refunds & Cancellations',
  },
  {
    question: 'How do I change my dietary preferences?',
    answer: 'You can update your dietary preferences (like Vegan, Keto, Vegetarian) by navigating to Settings -> Preferences (or under Profile Settings). Feasto\'s recommendation engine will immediately update to highlight items that match your profile.',
    category: 'Account & Security',
  },
];

export const SupportFAQAccordion: React.FC = () => {
  const { searchQuery, selectedCategory } = useSupportStore();

  const filteredFAQs = FAQ_ITEMS.filter((faq) => {
    // Category match
    const categoryMatch = !selectedCategory || faq.category === selectedCategory;

    // Search query match
    const queryMatch =
      !searchQuery ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());

    return categoryMatch && queryMatch;
  });

  if (filteredFAQs.length === 0) {
    return (
      <div className="text-center py-10 bg-primary-bg rounded-2xl border border-border-main p-6 shadow-soft">
        <p className="text-xs text-text-secondary">No FAQs match your search. Try searching for other keywords or categories.</p>
      </div>
    );
  }

  const accordionItems: AccordionItem[] = filteredFAQs.map((faq) => ({
    title: faq.question,
    content: (
      <div className="flex flex-col gap-2">
        <p>{faq.answer}</p>
        <div className="flex items-center gap-1.5 mt-2 text-[10px] font-extrabold text-brand-orange uppercase tracking-wider">
          <MessageSquareText size={10} />
          <span>Category: {faq.category}</span>
        </div>
      </div>
    ),
  }));

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-xs font-extrabold text-text-primary uppercase tracking-wider mb-1 text-left">Frequently Asked Questions</h3>
      <Accordion items={accordionItems} className="shadow-soft" />
    </div>
  );
};
