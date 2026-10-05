import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotificationStore } from '@/store/notificationStore';
import { NotificationCard } from './NotificationCard';
import { NotificationEmptyState } from './NotificationEmptyState';

export const NotificationList: React.FC = () => {
  const { notifications, activeFilter, setActiveFilter } = useNotificationStore();

  const filteredNotifications = notifications.filter((n) => {
    if (activeFilter === 'all') return true;
    return n.type === activeFilter;
  });

  const handleClearFilter = () => {
    setActiveFilter('all');
  };

  if (filteredNotifications.length === 0) {
    return (
      <NotificationEmptyState
        filter={activeFilter}
        onClearFilter={handleClearFilter}
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <AnimatePresence initial={false}>
        {filteredNotifications.map((notif) => (
          <motion.div
            key={notif.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            layout
          >
            <NotificationCard notification={notif} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
