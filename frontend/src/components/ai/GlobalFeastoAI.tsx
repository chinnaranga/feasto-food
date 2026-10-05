import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  X, 
  ArrowRight, 
  Send, 
  Compass, 
  Bot, 
  Flame, 
  MapPin, 
  ShoppingBag,
  Clock,
  ShieldCheck,
  Check
} from 'lucide-react';
import { aiFoodDiscoveryService } from '@/services/ai/aiFoodDiscoveryService';

export const GlobalFeastoAI: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'feasto'; text: string; actionText?: string; actionPath?: string }>>([]);
  const [isThinking, setIsThinking] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Determine context based on current pathname
  const isPortal = location.pathname.startsWith('/portal') || location.pathname.startsWith('/restaurant');
  const isRider = location.pathname.startsWith('/rider');
  const isAdmin = location.pathname.startsWith('/admin');

  const contextTitle = isAdmin 
    ? 'Feasto Ops Intelligence' 
    : isRider 
    ? 'Feasto Route Telemetry' 
    : isPortal 
    ? 'Feasto Kitchen Copilot' 
    : 'Feasto Dining Companion';

  const defaultPromptExamples = isAdmin
    ? ['Where are today’s delivery bottlenecks?', 'Peak order volume forecasts for Hyderabad', 'Fleet delay anomalies']
    : isRider
    ? ['What’s the fastest route to Jubilee Hills?', 'Peak order clusters right now', 'Battery saving thermal routing']
    : isPortal
    ? ['What should I promote tonight?', 'Ingredient stock forecast for biryani rice', 'Average kitchen prep time vs peers']
    : ['I want something spicy and filling under ₹500', 'Best Hyderabadi biryani nearby', 'Light healthy dinner for two'];

  // Global hotkey: Cmd + K or Ctrl + K, and custom 'open-feasto-ai' event
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };

    const handleCustomOpen = (e: Event) => {
      const customEvent = e as CustomEvent<{ prompt?: string }>;
      setIsOpen(true);
      if (customEvent.detail?.prompt) {
        setPrompt(customEvent.detail.prompt);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('open-feasto-ai', handleCustomOpen);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('open-feasto-ai', handleCustomOpen);
    };
  }, []);

  const handleSend = async (queryText: string) => {
    if (!queryText.trim()) return;
    const userMsg = queryText.trim();
    setPrompt('');
    setMessages((prev) => [...prev, { sender: 'user', text: userMsg }]);
    setIsThinking(true);

    try {
      if (isAdmin) {
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            { 
              sender: 'feasto', 
              text: 'Hyderabad fleet operations normal. 312 active deliveries across Banjara & Hitech hubs. 4 minor route delays detected in Madhapur due to monsoon rain; auto-rerouted via ORR.',
              actionText: 'View Dispatch Monitor',
              actionPath: '/admin/delivery'
            }
          ]);
          setIsThinking(false);
        }, 400);
      } else if (isRider) {
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            { 
              sender: 'feasto', 
              text: 'Optimal route to Spice Route (Banjara Hills) via Road No. 12 bypass saves 6 minutes. Live courier queue at kitchen counter: 1 rider ahead.',
              actionText: 'Open Navigation Hub',
              actionPath: '/rider'
            }
          ]);
          setIsThinking(false);
        }, 350);
      } else if (isPortal) {
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            { 
              sender: 'feasto', 
              text: 'Consumer demand for Hyderabadi Dum Biryani and Cacio e Pepe is spiking +38% this evening. Recommend enabling "Chef Evening Special" badge.',
              actionText: 'Open Menu Editor',
              actionPath: '/portal/menu'
            }
          ]);
          setIsThinking(false);
        }, 400);
      } else {
        const res = await aiFoodDiscoveryService.parseCraving(userMsg);
        const topDish = res.recommendations[0];
        setMessages((prev) => [
          ...prev,
          { 
            sender: 'feasto', 
            text: `Decoded craving: ${res.intent.detectedTags.join(' • ')}. Found top match: ${topDish ? `${topDish.name} (₹${topDish.price}) from ${topDish.restaurantName}` : 'several local kitchen options'}.`,
            actionText: topDish ? `View ${topDish.name}` : 'Explore Dishes',
            actionPath: topDish ? `/restaurants/${topDish.restaurantId}` : '/discover'
          }
        ]);
        setIsThinking(false);
      }
    } catch {
      setIsThinking(false);
    }
  };

  return (
    <>
      {/* Floating Global AI Trigger Button */}
      <motion.button
        type="button"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        aria-label="Open Feasto AI Companion"
        className="fixed bottom-6 right-6 z-[600] flex items-center gap-2 px-4 py-3 rounded-2xl bg-gradient-to-r from-[#6D5EF5] to-[#4FD1E8] text-white font-bold text-xs shadow-xl shadow-[#6D5EF5]/30 hover:shadow-[#6D5EF5]/50 transition-all border border-white/20 select-none group"
      >
        <Sparkles size={16} className="animate-pulse" />
        <span className="hidden sm:inline">Ask Feasto</span>
        <kbd className="hidden md:inline-block ml-1 px-1.5 py-0.5 text-[10px] font-mono rounded-md bg-black/25 text-white/90 border border-white/20">
          ⌘K
        </kbd>
      </motion.button>

      {/* Spatial Drawer / Assistant Surface */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[1000] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.98 }}
              transition={{ duration: 0.25 }}
              className="w-full sm:max-w-xl bg-[#101218] border border-white/10 rounded-t-3xl sm:rounded-3xl shadow-2xl shadow-black overflow-hidden flex flex-col max-h-[85vh] text-left"
            >
              {/* Header */}
              <div className="p-4 sm:p-5 border-b border-white/8 flex items-center justify-between bg-[#171923]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#6D5EF5] to-[#4FD1E8] flex items-center justify-center text-white">
                    <Sparkles size={15} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#F4F5F7]">{contextTitle}</h3>
                    <p className="text-[10px] text-[#A7ACB8] font-mono">Autonomous Context Engine</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close"
                  className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 text-[#A7ACB8] hover:text-white flex items-center justify-center transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Message Transcript & Suggestions */}
              <div className="p-5 overflow-y-auto space-y-4 flex-grow min-h-[220px]">
                {messages.length === 0 ? (
                  <div className="py-6 text-center">
                    <p className="text-xs text-[#A7ACB8] mb-4">
                      Type natural language or choose an intent prompt:
                    </p>
                    <div className="flex flex-col gap-2">
                      {defaultPromptExamples.map((ex, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => handleSend(ex)}
                          className="w-full p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 text-xs text-[#F4F5F7] font-medium text-left transition-colors flex items-center justify-between group"
                        >
                          <span>"{ex}"</span>
                          <ArrowRight size={13} className="text-[#6D5EF5] opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  messages.map((m, idx) => (
                    <div
                      key={idx}
                      className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`p-3.5 rounded-2xl text-xs max-w-[85%] leading-relaxed ${
                          m.sender === 'user'
                            ? 'bg-[#6D5EF5] text-white rounded-br-xs'
                            : 'bg-[#171923] text-[#F4F5F7] border border-white/8 rounded-bl-xs'
                        }`}
                      >
                        {m.text}
                      </div>
                      {m.actionText && m.actionPath && (
                        <button
                          type="button"
                          onClick={() => {
                            setIsOpen(false);
                            navigate(m.actionPath!);
                          }}
                          className="mt-2 text-[11px] font-bold text-[#4FD1E8] hover:underline flex items-center gap-1"
                        >
                          <span>{m.actionText}</span>
                          <ArrowRight size={12} />
                        </button>
                      )}
                    </div>
                  ))
                )}

                {isThinking && (
                  <div className="flex items-center gap-2 text-xs text-[#A78BFA] p-3 rounded-2xl bg-[#171923] border border-white/8 w-fit">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#6D5EF5] animate-ping" />
                    <span>Analyzing culinary vector...</span>
                  </div>
                )}
              </div>

              {/* Input Surface */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend(prompt);
                }}
                className="p-3 bg-[#08090D] border-t border-white/8 flex items-center gap-2"
              >
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Ask Feasto anything..."
                  className="flex-grow px-3.5 py-2.5 rounded-xl bg-[#171923] text-xs text-[#F4F5F7] placeholder-[#6F7480] border border-white/5 focus:outline-none focus:border-[#6D5EF5]"
                />
                <button
                  type="submit"
                  disabled={!prompt.trim()}
                  className="p-2.5 rounded-xl bg-[#6D5EF5] hover:bg-[#5C4DE3] disabled:opacity-40 text-white transition-colors"
                >
                  <Send size={15} />
                </button>
              </form>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
