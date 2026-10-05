import React from 'react';
import { CheckCheck, Trash2 } from 'lucide-react';
import { useNotificationStore } from '@/store/notificationStore';
import { Button } from '@/components/ui/Button';

export const NotificationsHeader: React.FC = () => {
  const { notifications, unreadCount, markAllAsRead, clearAll } = useNotificationStore();
  const unread = unreadCount();
  const hasNotifications = notifications.length > 0;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-main/50 pb-5 text-left">
      <div>
        <div className="flex items-center gap-2.5">
          <h1 className="text-xl font-black font-heading text-text-primary tracking-tight">
            Notification Center
          </h1>
          {unread > 0 && (
            <span className="px-2 py-0.5 bg-brand-orange/10 border border-brand-orange/15 rounded-full text-[10px] font-extrabold text-brand-orange">
              {unread} unread
            </span>
          )}
        </div>
        <p className="text-xs text-text-secondary mt-1">
          Stay updated with your orders, custom AI food suggestions, and account alerts.
        </p>
      </div>

      {hasNotifications && (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={markAllAsRead}
            disabled={unread === 0}
            className="rounded-xl text-xs font-bold px-3 py-1.5 flex items-center gap-1.5 border border-border-main"
          >
            <CheckCheck size={14} />
            <span>Mark all as read</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAll}
            className="rounded-xl text-xs font-bold px-3 py-1.5 text-text-secondary hover:text-red-500 flex items-center gap-1.5 border border-border-main/40"
          >
            <Trash2 size={14} />
            <span>Clear all</span>
          </Button>
        </div>
      )}
    </div>
  );
};
