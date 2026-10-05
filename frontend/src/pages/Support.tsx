import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Container } from '@/components/layout/Container';
import { SupportSearchBar } from '@/components/support/SupportSearchBar';
import { SupportCategoryCard, SupportCategory } from '@/components/support/SupportCategoryCard';
import { SupportFAQAccordion } from '@/components/support/SupportFAQAccordion';
import { HelpArticleCard, HelpArticle } from '@/components/support/HelpArticleCard';
import { ContactSupportCard } from '@/components/support/ContactSupportCard';
import { useSupportStore } from '@/store/supportStore';
import { useUserStore } from '@/store/userStore';
import { Sparkles, MessageSquare, ArrowRight, CornerDownRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SupportContextPanel } from '@/components/observability/SupportContextPanel';

const CATEGORIES: SupportCategory[] = [
  {
    id: 'cat-1',
    name: 'Order Issues',
    description: 'Track orders, reports of missing items or late deliveries.',
    iconName: 'ShoppingBag',
  },
  {
    id: 'cat-2',
    name: 'Payments & Billing',
    description: 'Double charges, payment failures, receipt issues.',
    iconName: 'CreditCard',
  },
  {
    id: 'cat-3',
    name: 'Refunds & Cancellations',
    description: 'Cancellation policy limits and refund status checks.',
    iconName: 'RotateCcw',
  },
  {
    id: 'cat-4',
    name: 'Account & Security',
    description: 'Password resets, 2FA, data removal, security logs.',
    iconName: 'Shield',
  },
];

const RECOMMENDED_ARTICLES: HelpArticle[] = [
  {
    id: 'art-1',
    title: 'Understanding Feasto\'s AI Dietary Personalization',
    excerpt: 'Learn how our machine learning algorithms use your dietary filters (Keto, Vegan) and order histories to automatically rank menu recommendations.',
    category: 'Account & Security',
    readTime: '3 min read',
    tag: 'AI Assistant',
  },
  {
    id: 'art-2',
    title: 'Securing your account with Two-Factor Authentication',
    excerpt: 'Step-by-step instructions on securing your Feasto checkout transactions using authenticator apps and SMS backup keys.',
    category: 'Account & Security',
    readTime: '2 min read',
    tag: 'Security',
  },
  {
    id: 'art-3',
    title: 'Contactless delivery guide and coordinates',
    excerpt: 'How to configure gate instructions, contactless drop-offs, and rider notification settings for safe delivery routing.',
    category: 'Order Issues',
    readTime: '4 min read',
    tag: 'Delivery',
  },
];

export const Support: React.FC = () => {
  const navigate = useNavigate();
  const { searchQuery, selectedCategory, setSelectedCategory } = useSupportStore();
  const { activeOrders } = useUserStore();

  const [activeArticle, setActiveArticle] = useState<HelpArticle | null>(null);

  // Simple Smart AI reasoning based on search queries
  const getSmartAIResponse = () => {
    const query = searchQuery.toLowerCase();
    if (query.includes('cancel')) {
      return {
        answer: 'You can cancel any Feasto order within 60 seconds of placement. After 60 seconds, the kitchen accepts the ticket and begins cooking. If your order was placed under a minute ago, you can trigger cancellation under active orders below.',
        actionLabel: 'Check Active Orders',
        action: () => {
          const activeSec = document.getElementById('active-orders-lookup');
          if (activeSec) activeSec.scrollIntoView({ behavior: 'smooth' });
        },
      };
    }
    if (query.includes('refund') || query.includes('charge') || query.includes('twice')) {
      return {
        answer: 'Refund approvals are processed immediately by Feasto. However, your banking merchant may take 2-5 business days to clear funds back to your original payment. Double charges are automatically held by banks and released within 3-5 days.',
        actionLabel: 'Submit Refund Claim',
        action: () => navigate('/support/contact'),
      };
    }
    if (query.includes('address') || query.includes('location')) {
      return {
        answer: 'To update your default location, navigate to Profile -> Saved Addresses. If you have an active delivery and need to change the destination path, please submit a high-priority ticket referencing the order immediately.',
        actionLabel: 'Change Active Delivery Address',
        action: () => navigate('/support/contact'),
      };
    }
    return null;
  };

  const smartAI = getSmartAIResponse();

  return (
    <div className="bg-secondary-bg min-h-screen pb-20 pt-8 text-left">
      <Container className="max-w-5xl flex flex-col gap-8">
        
        {/* Banner Section */}
        <div className="bg-primary-bg border border-border-main rounded-3xl p-8 sm:p-10 shadow-soft text-center flex flex-col items-center max-w-4xl mx-auto w-full">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-orange/5 border border-brand-orange/15 rounded-full text-xs font-bold text-brand-orange uppercase tracking-wide mb-4">
            <Sparkles size={13} className="animate-pulse" />
            <span>Feasto Help Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-heading tracking-tight text-text-primary mb-2 max-w-lg">
            How can we help you today?
          </h1>
          <p className="text-sm text-text-secondary max-w-md mb-8 leading-relaxed">
            Search our knowledge base or submit a support case directly to our engineering team.
          </p>

          <SupportSearchBar />
        </div>

        {/* AI Assisted Smart Answer Section */}
        <AnimatePresence>
          {smartAI && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="bg-brand-orange/[0.02] border border-brand-orange/20 rounded-3xl p-6 max-w-4xl mx-auto w-full flex items-start gap-4 shadow-soft text-left"
            >
              <div className="p-3 bg-brand-orange text-white rounded-2xl shrink-0">
                <Sparkles size={20} className="animate-bounce" />
              </div>
              <div className="flex-1">
                <h3 className="font-extrabold text-sm text-text-primary mb-1 tracking-tight flex items-center gap-1.5">
                  <span>Smart Instant AI Answer</span>
                  <span className="text-[9px] font-bold bg-brand-orange/10 text-brand-orange px-1.5 py-0.5 rounded">Beta</span>
                </h3>
                <p className="text-xs text-text-secondary leading-relaxed mb-3">
                  {smartAI.answer}
                </p>
                <button
                  onClick={smartAI.action}
                  className="flex items-center gap-1 text-[10px] font-extrabold text-brand-orange uppercase tracking-wider hover:underline cursor-pointer"
                >
                  <span>{smartAI.actionLabel}</span>
                  <ArrowRight size={11} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Categories Grid */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-extrabold text-text-primary uppercase tracking-wider">Browse by Category</h3>
            {selectedCategory && (
              <button
                onClick={() => setSelectedCategory(null)}
                className="text-xs font-bold text-brand-orange hover:underline cursor-pointer"
              >
                Clear selection
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {CATEGORIES.map((cat) => (
              <SupportCategoryCard key={cat.id} category={cat} />
            ))}
          </div>
        </div>

        {/* Active Order Lookup Area */}
        {activeOrders.length > 0 && (
          <div id="active-orders-lookup" className="bg-primary-bg border border-border-main rounded-3xl p-6 text-left shadow-soft flex flex-col gap-4">
            <div className="flex items-center gap-2 pb-2 border-b border-border-main/50">
              <MessageSquare size={16} className="text-brand-orange" />
              <h3 className="text-xs font-extrabold text-text-primary uppercase tracking-wider">
                Troubleshoot Active Orders
              </h3>
            </div>
            <div className="flex flex-col gap-3">
              {activeOrders.map((order) => (
                <div
                  key={order.id}
                  className="p-4 bg-secondary-bg hover:bg-brand-orange/[0.01] border border-border-main hover:border-brand-orange/20 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-main"
                >
                  <div>
                    <p className="text-xs font-extrabold text-text-primary">
                      Order #{order.id} — {order.restaurantName}
                    </p>
                    <p className="text-[10px] text-text-muted mt-0.5">
                      Status: <span className="text-brand-orange font-bold capitalize">{order.status}</span> &middot; ETA: {order.eta} mins
                    </p>
                  </div>
                  <button
                    onClick={() => navigate(`/support/contact?orderId=${order.id}`)}
                    className="text-[10px] font-extrabold text-brand-orange uppercase tracking-wider flex items-center gap-1 hover:underline cursor-pointer bg-white px-3 py-1.5 rounded-lg border border-border-main shadow-xs"
                  >
                    <span>Get Help with Order</span>
                    <ArrowRight size={10} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* FAQ Accordion */}
          <div className="lg:col-span-7">
            <SupportFAQAccordion />
          </div>

          {/* Recommended Help Articles */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <h3 className="text-xs font-extrabold text-text-primary uppercase tracking-wider text-left">Recommended Articles</h3>
            <div className="flex flex-col gap-4">
              {RECOMMENDED_ARTICLES.map((article) => (
                <HelpArticleCard
                  key={article.id}
                  article={article}
                  onClick={() => setActiveArticle(article)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Anonymized Client Telemetry Support Context Panel */}
        <SupportContextPanel />

        {/* Contact Support Section Card */}
        <ContactSupportCard />

        {/* Article Reader Modal */}
        <AnimatePresence>
          {activeArticle && (
            <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setActiveArticle(null)}
                className="fixed inset-0 bg-black/40 backdrop-blur-xs cursor-pointer"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                className="relative w-full max-w-xl bg-primary-bg rounded-3xl border border-border-main shadow-modal overflow-hidden flex flex-col z-10 p-6 sm:p-8 text-left"
              >
                <div className="flex items-center justify-between mb-4 border-b border-border-main/50 pb-4">
                  <div>
                    <span className="px-2 py-0.5 bg-brand-orange/5 border border-brand-orange/15 rounded text-[9px] font-extrabold text-brand-orange uppercase tracking-wide">
                      {activeArticle.tag}
                    </span>
                    <h2 className="font-extrabold text-base text-text-primary mt-2 font-heading tracking-tight">
                      {activeArticle.title}
                    </h2>
                  </div>
                  <button
                    onClick={() => setActiveArticle(null)}
                    className="p-1.5 text-text-muted hover:text-text-primary rounded-xl hover:bg-secondary-bg cursor-pointer border border-border-main/50"
                  >
                    &times;
                  </button>
                </div>
                <div className="text-xs text-text-secondary leading-relaxed flex flex-col gap-3 py-2 max-h-[350px] overflow-y-auto">
                  <p className="font-semibold text-text-primary italic">
                    "{activeArticle.excerpt}"
                  </p>
                  <p>
                    Feasto utilizes a state-of-the-art recommendation engine designed to align with user dietary restrictions. Whether you specify preferences for vegetarian dining or a low-carb diet, these settings are translated into metadata profiles.
                  </p>
                  <p>
                    Whenever menus are loaded, they are automatically cross-referenced against your profile criteria to ensure that dishes matching your preferences are ranked higher. This means fewer taps to discover meals that align with your lifestyle.
                  </p>
                  <div className="bg-secondary-bg border border-border-main rounded-xl p-3 flex items-start gap-2 mt-2">
                    <CornerDownRight size={14} className="text-brand-orange shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-text-primary text-[10px] uppercase tracking-wide">Pro Tip</p>
                      <p className="text-[10px] text-text-secondary mt-0.5 leading-normal">
                        You can update these preferences anytime under Settings to change what our system highlights.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="border-t border-border-main/50 pt-4 mt-6 flex justify-end">
                  <button
                    onClick={() => setActiveArticle(null)}
                    className="px-5 py-2 bg-secondary-bg hover:bg-surface-bg border border-border-main rounded-xl text-xs font-bold text-text-secondary transition-main cursor-pointer"
                  >
                    Done Reading
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </Container>
    </div>
  );
};
