import React from 'react';
import { useNotificationStore, NotificationType } from '@/store/notificationStore';

interface FilterItem {
  id: 'all' | NotificationType;
  label: string;
}

export const NotificationFilterTabs: React.FC = () => {
  const { activeFilter, setActiveFilter, notifications } = useNotificationStore();

  const filters: FilterItem[] = [
    { id: 'all', label: 'All' },
    { id: 'order_update', label: 'Orders' },
    { id: 'promotion', label: 'Offers' },
    { id: 'suggestion', label: 'Suggestions' },
    { id: 'support', label: 'Support' },
    { id: 'system', label: 'System' },
  ];

  const getCount = (filterId: 'all' | NotificationType) => {
    if (filterId === 'all') return notifications.length;
    return notifications.filter((n) => n.type === filterId).length;
  };

  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 w-full no-scrollbar select-none">
      {filters.map((filter) => {
        const isSelected = activeFilter === filter.id;
        const count = getCount(filter.id);

        return (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-main cursor-pointer whitespace-nowrap flex items-center gap-1.5 border
              ${
                isSelected
                  ? 'bg-brand-orange border-brand-orange text-white shadow-soft'
                  : 'bg-primary-bg border-border-main text-text-secondary hover:border-brand-orange/30 hover:text-text-primary'
              }`}
          >
            <span>{filter.label}</span>
            <span
              className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-md transition-main
                ${isSelected ? 'bg-white/20 text-white' : 'bg-secondary-bg text-text-muted'}`}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
};
