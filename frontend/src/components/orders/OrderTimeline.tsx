import React from 'react';
import { CheckCircle2, Clock, ShieldCheck, MapPin } from 'lucide-react';
import type { OrderStatus } from '@/store/userStore';

interface OrderTimelineProps {
  status: OrderStatus;
}

interface Step {
  key: OrderStatus;
  label: string;
  description: string;
  icon: React.ReactNode;
}

const STEPS: Step[] = [
  { key: 'placed', label: 'Order Placed', description: 'We have received your order', icon: <CheckCircle2 size={16} /> },
  { key: 'confirmed', label: 'Confirmed', description: 'Kitchen is confirming your items', icon: <ShieldCheck size={16} /> },
  { key: 'preparing', label: 'Preparing', description: 'Chef is crafting your fresh food', icon: <Clock size={16} /> },
  { key: 'dispatched', label: 'Out for Delivery', description: 'Delivery partner is on their way', icon: <MapPin size={16} /> },
];

export const OrderTimeline: React.FC<OrderTimelineProps> = ({ status }) => {
  const getStepIndex = (s: OrderStatus): number => {
    const keys: OrderStatus[] = ['placed', 'confirmed', 'preparing', 'dispatched', 'delivered'];
    return keys.indexOf(s);
  };

  const currentIndex = getStepIndex(status);

  return (
    <div className="flex flex-col gap-6">
      {STEPS.map((step, idx) => {
        const isCompleted = currentIndex > idx;
        const isActive = currentIndex === idx;
        const isFuture = currentIndex < idx;

        return (
          <div key={step.key} className="flex gap-4 relative">
            {/* Connector line */}
            {idx < STEPS.length - 1 && (
              <div
                className={`absolute left-[13px] top-[26px] bottom-[-22px] w-[2px] transition-main duration-500
                  ${isCompleted ? 'bg-brand-orange' : 'bg-border-main'}`}
              />
            )}

            {/* Icon node */}
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 border transition-all duration-500
                ${isCompleted
                  ? 'bg-brand-orange border-brand-orange text-white'
                  : isActive
                    ? 'bg-brand-orange/10 border-brand-orange text-brand-orange ring-4 ring-brand-orange/10 scale-105'
                    : 'bg-secondary-bg border-border-main text-text-muted'
                }`}
            >
              {step.icon}
            </div>

            {/* Text description */}
            <div className="flex-1 pb-2">
              <h4
                className={`text-xs font-bold transition-main
                  ${isActive ? 'text-brand-orange' : isFuture ? 'text-text-muted font-medium' : 'text-text-primary'}`}
              >
                {step.label}
              </h4>
              <p className="text-[11px] text-text-secondary mt-0.5 leading-relaxed">
                {step.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
