import React, { useState } from 'react';
import { Sparkles, Send, Loader2, Check, Plus, AlertCircle } from 'lucide-react';
import { aiApi, AICartAction } from '@/services/api/aiApi';
import { useCartStore } from '@/store/cartStore';

interface AICartAssistantBarProps {
  restaurantId: string;
}

export const AICartAssistantBar: React.FC<AICartAssistantBarProps> = ({ restaurantId }) => {
  const { items, addItem, removeItem } = useCartStore();
  const [instruction, setInstruction] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [responseMsg, setResponseMsg] = useState<string | null>(null);
  const [suggestedActions, setSuggestedActions] = useState<AICartAction[]>([]);
  const [appliedActionIdx, setAppliedActionIdx] = useState<Record<number, boolean>>({});

  const quickPrompts = [
    'Add a refreshing beverage',
    'Suggest dessert under ₹200',
    'Make meal vegetarian',
    'Feed 2 people',
  ];

  const handleRunAssistant = async (promptText: string) => {
    if (!promptText.trim() || isProcessing || items.length === 0) return;
    setIsProcessing(true);
    setResponseMsg(null);
    setSuggestedActions([]);
    setAppliedActionIdx({});

    try {
      const cartPayload = items.map((i) => ({
        itemId: i.item.id,
        itemName: i.item.name,
        price: i.unitPrice,
        quantity: i.quantity,
        isVeg: i.item.tags?.includes('Vegetarian'),
      }));

      const res = await aiApi.cartAssist({
        instruction: promptText.trim(),
        restaurantId,
        cartItems: cartPayload,
      });

      setResponseMsg(res.message);
      if (res.suggestedActions && res.suggestedActions.length > 0) {
        setSuggestedActions(res.suggestedActions);
      }
    } catch {
      setResponseMsg(
        'Our cart copilot is verifying kitchen menus. You can browse more items from the menu page!'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApplyAction = (action: AICartAction, index: number) => {
    if (action.type === 'add') {
      addItem({
        cartItemId: `${restaurantId}-${action.itemId}-${Date.now()}`,
        restaurantId,
        restaurantName: items[0]?.restaurantName || 'Kitchen',
        item: {
          id: action.itemId,
          name: action.itemName,
          price: action.price,
          description: action.reason,
          tags: ['Healthy'],
          isPopular: true,
        },
        quantity: action.quantity || 1,
        selectedAddons: [],
        spiceLevel: 'medium',
        specialInstructions: '',
        unitPrice: action.price,
        totalPrice: action.price * (action.quantity || 1),
      });
    }

    setAppliedActionIdx((prev) => ({ ...prev, [index]: true }));
  };

  return (
    <div className="p-5 rounded-2xl bg-[#EBE7DC] border border-[#DCD6C8] shadow-xs flex flex-col gap-3 font-mono text-xs text-[#141518]">
      <div className="flex items-center justify-between border-b border-[#DCD6C8] pb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-[#141518] text-[#E07A5F] flex items-center justify-center">
            <Sparkles size={12} />
          </div>
          <span className="font-heading font-bold uppercase tracking-wider text-[11px]">
            AI Cart Copilot
          </span>
        </div>
        <span className="text-[10px] text-[#8A8D98] tracking-widest uppercase">
          NVIDIA Nemotron 3 Ultra
        </span>
      </div>

      <p className="text-[11px] text-[#52555F] leading-relaxed font-sans">
        Ask the AI to rebalance portions, suggest drink or dessert pairings, or adjust dietary constraints.
      </p>

      {/* Quick Prompts */}
      <div className="flex flex-wrap gap-1.5">
        {quickPrompts.map((p, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => {
              setInstruction(p);
              handleRunAssistant(p);
            }}
            className="px-2.5 py-1 rounded-lg bg-[#F3F0E8] hover:bg-[#141518] hover:text-[#F3F0E8] border border-[#DCD6C8] text-[10px] text-[#141518] transition-colors"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleRunAssistant(instruction);
        }}
        className="flex items-center gap-2 mt-1"
      >
        <input
          type="text"
          value={instruction}
          onChange={(e) => setInstruction(e.target.value)}
          placeholder="e.g. Add a beverage, or make it vegetarian..."
          className="flex-grow px-3 py-2 rounded-xl bg-[#F3F0E8] text-[#141518] placeholder-[#8A8D98] border border-[#DCD6C8] text-[11px] focus:outline-none focus:border-[#141518]"
        />
        <button
          type="submit"
          disabled={!instruction.trim() || isProcessing}
          className="px-3 py-2 rounded-xl bg-[#141518] hover:bg-[#2A2C32] disabled:opacity-40 text-[#F3F0E8] transition-colors flex items-center gap-1.5 text-[11px] font-bold"
        >
          {isProcessing ? (
            <Loader2 size={13} className="animate-spin" />
          ) : (
            <>
              <span>Ask AI</span>
              <Send size={11} />
            </>
          )}
        </button>
      </form>

      {/* AI Explanation */}
      {responseMsg && (
        <div className="p-3 rounded-xl bg-[#F3F0E8] border border-[#DCD6C8] text-[11px] text-[#141518] font-sans leading-relaxed animate-in fade-in duration-200">
          <p className="font-semibold font-mono text-[10px] text-[#E07A5F] uppercase mb-1">
            Copilot Recommendation:
          </p>
          {responseMsg}
        </div>
      )}

      {/* Proposed Structured Actions */}
      {suggestedActions.length > 0 && (
        <div className="flex flex-col gap-2 mt-1">
          {suggestedActions.map((action, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-[#F3F0E8] border border-[#DCD6C8] flex items-center justify-between gap-3 text-xs"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#141518] truncate">
                    {action.itemName}
                  </span>
                  <span className="font-mono text-[#E07A5F] font-bold">
                    ₹{action.price}
                  </span>
                </div>
                <p className="text-[10px] text-[#52555F] font-sans truncate">
                  {action.reason}
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleApplyAction(action, idx)}
                disabled={appliedActionIdx[idx]}
                className="px-2.5 py-1.5 rounded-lg bg-[#141518] hover:bg-[#2A2C32] disabled:bg-emerald-600 text-white font-bold text-[10px] transition-colors flex items-center gap-1 shrink-0"
              >
                {appliedActionIdx[idx] ? (
                  <>
                    <Check size={11} /> Applied
                  </>
                ) : (
                  <>
                    <Plus size={11} /> Add to Bag
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
