import React from 'react';
import { useUserStore } from '@/store/userStore';
import { PreferenceGroup } from './PreferenceGroup';
import { PreferenceToggle } from './PreferenceToggle';
import { useToastStore } from '@/store/toastStore';
import { useTrackEvent } from '@/hooks/analytics/useTrackEvent';

export const NotificationPreferencesPanel: React.FC = () => {
  const trackEvent = useTrackEvent();
  const { addToast } = useToastStore();
  const { notificationPrefs, updateNotificationPrefs } = useUserStore();

  // Local/extended states for channels not stored in userStore (simulated)
  const [emailEnabled, setEmailEnabled] = React.useState(true);
  const [pushEnabled, setPushEnabled] = React.useState(true);
  const [smsEnabled, setSmsEnabled] = React.useState(false);

  const handleToggle = (key: keyof typeof notificationPrefs, checked: boolean) => {
    updateNotificationPrefs({ [key]: checked });
    trackEvent('settings_updated', {
      section: 'privacy',
      settingKey: 'notification_' + key,
      newValue: checked,
    });
    addToast({
      message: 'Notification preference saved.',
      type: 'success',
    });
  };

  const handleChannelToggle = (channel: string, checked: boolean) => {
    if (channel === 'email') setEmailEnabled(checked);
    if (channel === 'push') setPushEnabled(checked);
    if (channel === 'sms') setSmsEnabled(checked);
    trackEvent('settings_updated', {
      section: 'privacy',
      settingKey: 'notification_channel_' + channel,
      newValue: checked,
    });
    addToast({
      message: `${channel.charAt(0).toUpperCase() + channel.slice(1)} notifications ${checked ? 'enabled' : 'disabled'}.`,
      type: 'success',
    });
  };

  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto">
      {/* Category settings */}
      <PreferenceGroup
        title="Alert Categories"
        description="Choose which topics you want to stay updated on across active channels."
      >
        <PreferenceToggle
          label="Order Status Updates"
          description="Real-time delivery status, rider chat notifications, and order cancellations."
          checked={notificationPrefs.orderUpdates}
          onChange={(checked) => handleToggle('orderUpdates', checked)}
        />
        <PreferenceToggle
          label="Promotions & Offers"
          description="Coupons, seasonal discounts, and credit bonuses from Feasto kitchens."
          checked={notificationPrefs.promotions}
          onChange={(checked) => handleToggle('promotions', checked)}
        />
        <PreferenceToggle
          label="Dietary & Recommendations"
          description="Personalized dish recommendations matching your AI profile (e.g. Vegan, Keto matches)."
          checked={notificationPrefs.dietaryInsights}
          onChange={(checked) => handleToggle('dietaryInsights', checked)}
        />
        <PreferenceToggle
          label="Weekly Dietary Recaps"
          description="A recap of your eating habits and customized calorie intake recommendations."
          checked={notificationPrefs.weeklyRecaps}
          onChange={(checked) => handleToggle('weeklyRecaps', checked)}
        />
      </PreferenceGroup>

      {/* Channel settings */}
      <PreferenceGroup
        title="Delivery Channels"
        description="Choose where you want to receive notification triggers."
      >
        <PreferenceToggle
          label="Push Notifications"
          description="Instant alerts sent directly to your device desktop or mobile screen."
          checked={pushEnabled}
          onChange={(checked) => handleChannelToggle('push', checked)}
        />
        <PreferenceToggle
          label="Email Notifications"
          description="Weekly digests, receipts, and order histories sent to your registered inbox."
          checked={emailEnabled}
          onChange={(checked) => handleChannelToggle('email', checked)}
        />
        <PreferenceToggle
          label="SMS Notifications"
          description="Important updates regarding delivery coordinates sent directly via mobile carrier."
          checked={smsEnabled}
          onChange={(checked) => handleChannelToggle('sms', checked)}
        />
      </PreferenceGroup>
    </div>
  );
};
