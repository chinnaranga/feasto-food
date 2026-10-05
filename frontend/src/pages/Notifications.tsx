import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Container } from '@/components/layout/Container';
import { NotificationsHeader } from '@/components/notifications/NotificationsHeader';
import { NotificationFilterTabs } from '@/components/notifications/NotificationFilterTabs';
import { NotificationList } from '@/components/notifications/NotificationList';
import { NotificationPreferencesPanel } from '@/components/notifications/NotificationPreferencesPanel';
import { Bell, Settings2 } from 'lucide-react';

export const Notifications: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Route-based active tab
  const activeTab = location.pathname.endsWith('/settings') ? 'preferences' : 'feed';

  const handleTabChange = (tab: 'feed' | 'preferences') => {
    if (tab === 'feed') {
      navigate('/notifications');
    } else {
      navigate('/notifications/settings');
    }
  };

  return (
    <div className="bg-secondary-bg min-h-screen pb-20 pt-8 text-left">
      <Container className="max-w-4xl">
        {/* Main Notifications Card shell */}
        <div className="bg-primary-bg border border-border-main rounded-3xl p-6 sm:p-8 shadow-soft flex flex-col gap-6">
          {/* Header */}
          <NotificationsHeader />

          {/* Segmented Controls for Sub-views */}
          <div className="flex border-b border-border-main/50 select-none">
            <button
              onClick={() => handleTabChange('feed')}
              className={`flex items-center gap-2 px-5 py-3 text-xs font-bold transition-main border-b-2 cursor-pointer
                ${
                  activeTab === 'feed'
                    ? 'border-brand-orange text-brand-orange'
                    : 'border-transparent text-text-secondary hover:text-text-primary'
                }`}
            >
              <Bell size={14} />
              <span>Inbox Feed</span>
            </button>
            <button
              onClick={() => handleTabChange('preferences')}
              className={`flex items-center gap-2 px-5 py-3 text-xs font-bold transition-main border-b-2 cursor-pointer
                ${
                  activeTab === 'preferences'
                    ? 'border-brand-orange text-brand-orange'
                    : 'border-transparent text-text-secondary hover:text-text-primary'
                }`}
            >
              <Settings2 size={14} />
              <span>Channel Preferences</span>
            </button>
          </div>

          {/* Body Content */}
          <div className="min-h-[300px] mt-2">
            <AnimatePresence mode="wait">
              {activeTab === 'feed' ? (
                <motion.div
                  key="feed"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col gap-5"
                >
                  <NotificationFilterTabs />
                  <NotificationList />
                </motion.div>
              ) : (
                <motion.div
                  key="preferences"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <NotificationPreferencesPanel />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </Container>
    </div>
  );
};
