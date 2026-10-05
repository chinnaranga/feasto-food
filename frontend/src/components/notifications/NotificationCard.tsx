import React from 'react';
import { useNavigate } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { Notification, useNotificationStore } from '@/store/notificationStore';

interface NotificationCardProps {
  notification: Notification;
}

export const NotificationCard: React.FC<NotificationCardProps> = ({ notification }) => {
  const navigate = useNavigate();
  const { markAsRead } = useNotificationStore();

  const handleCardClick = () => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
    }
  };

  // Icon mapping helper
  const getIcon = () => {
    switch (notification.type) {
      case 'order_update':
        return <Icons.Truck size={16} className="text-blue-500" />;
      case 'promotion':
        return <Icons.Tag size={16} className="text-green-500" />;
      case 'suggestion':
        return <Icons.Sparkles size={16} className="text-brand-orange" />;
      case 'support':
        return <Icons.MessageSquareText size={16} className="text-amber-500" />;
      case 'system':
        return <Icons.ShieldAlert size={16} className="text-red-500" />;
      default:
        return <Icons.Bell size={16} className="text-text-muted" />;
    }
  };

  const getBgClass = () => {
    switch (notification.type) {
      case 'order_update':
        return 'bg-blue-50/50 border-blue-100/50';
      case 'promotion':
        return 'bg-green-50/50 border-green-100/50';
      case 'suggestion':
        return 'bg-orange-50/40 border-orange-100/40';
      case 'support':
        return 'bg-amber-50/50 border-amber-100/50';
      case 'system':
        return 'bg-red-50/40 border-red-100/40';
      default:
        return 'bg-secondary-bg/50 border-border-main/50';
    }
  };

  // Format relative timestamp
  const formatTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      const diffMs = Date.now() - date.getTime();
      const diffMin = Math.floor(diffMs / 1000 / 60);

      if (diffMin < 1) return 'Just now';
      if (diffMin < 60) return `${diffMin}m ago`;
      
      const diffHrs = Math.floor(diffMin / 60);
      if (diffHrs < 24) return `${diffHrs}h ago`;

      const diffDays = Math.floor(diffHrs / 24);
      return `${diffDays}d ago`;
    } catch {
      return '';
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className={`border rounded-2xl p-4 sm:p-5 flex gap-4 transition-all duration-300 relative group cursor-pointer text-left shadow-soft
        ${
          notification.read
            ? 'bg-primary-bg border-border-main hover:border-[#cbd5e1]'
            : `${getBgClass()} hover:shadow-medium`
        }`}
    >
      {/* Icon badge */}
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border border-white/20
          ${
            notification.read
              ? 'bg-secondary-bg text-text-secondary'
              : 'bg-primary-bg shadow-sm'
          }`}
      >
        {getIcon()}
      </div>

      {/* Main message text details */}
      <div className="flex-1 min-w-0 flex flex-col gap-1 pr-6">
        <div className="flex items-center gap-2">
          <h4
            className={`text-sm truncate leading-tight tracking-tight
              ${notification.read ? 'font-bold text-text-primary' : 'font-extrabold text-text-primary'}`}
          >
            {notification.title}
          </h4>
          <span className="text-[10px] text-text-muted font-medium ml-auto shrink-0 select-none">
            {formatTime(notification.timestamp)}
          </span>
        </div>
        <p className="text-xs text-text-secondary leading-relaxed font-normal">
          {notification.message}
        </p>

        {/* Quick action button indicator */}
        {notification.actionUrl && (
          <div className="mt-2.5 flex items-center gap-1 text-[10px] font-extrabold text-brand-orange uppercase tracking-wide group-hover:underline">
            <span>View details</span>
            <Icons.ChevronRight size={10} className="group-hover:translate-x-0.5 transition-main" />
          </div>
        )}
      </div>

      {/* Unread circle badge */}
      {!notification.read && (
        <span
          className="absolute top-5 right-5 w-2 h-2 bg-brand-orange rounded-full shadow-sm animate-pulse"
          aria-label="Unread notification"
        />
      )}
    </div>
  );
};
