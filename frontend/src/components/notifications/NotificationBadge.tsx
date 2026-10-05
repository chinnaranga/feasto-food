import React from 'react';
import { Badge } from '@/components/ui/Badge';
import { useNotificationStore } from '@/store/notificationStore';

interface NotificationBadgeProps {
  className?: string;
}

export const NotificationBadge: React.FC<NotificationBadgeProps> = ({ className = '' }) => {
  const unread = useNotificationStore((state) => state.unreadCount());

  if (unread === 0) return null;

  return (
    <Badge
      variant="primary"
      className={`absolute -top-1 -right-1 px-1.5 py-0.5 text-[9px] font-extrabold min-w-5 h-5 flex items-center justify-center rounded-full shadow-soft animate-pulse ${className}`}
    >
      {unread}
    </Badge>
  );
};
