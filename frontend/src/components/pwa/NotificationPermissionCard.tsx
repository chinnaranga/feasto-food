import React, { useState } from 'react';
import { Bell, BellRing, Settings, Play, CheckCircle2, AlertCircle } from 'lucide-react';
import { useNotificationPermission } from '../../hooks/pwa/useNotificationPermission';
import { Switch } from '../ui/Switch';
import { Button } from '../ui/Button';
import { PWA_MESSAGES } from '../../constants/pwa';

export const NotificationPermissionCard: React.FC = () => {
  const {
    preferences,
    isGranted,
    isDenied,
    requestPermission,
    updatePreference,
    simulatePush,
  } = useNotificationPermission();

  const [testSending, setTestSending] = useState(false);
  const [testStatus, setTestStatus] = useState<'idle' | 'success' | 'failed'>('idle');

  const handleEnable = async () => {
    await requestPermission();
  };

  const handleTestNotification = async () => {
    setTestSending(true);
    setTestStatus('idle');
    try {
      const result = await simulatePush(
        'order_update',
        'Order Received! 🍕',
        'Your order #FST-123 has been accepted by Sora Sushi and is being prepared.',
        '/orders/FST-123/track'
      );
      setTestStatus(result ? 'success' : 'failed');
    } catch (e) {
      setTestStatus('failed');
    } finally {
      setTestSending(false);
      setTimeout(() => setTestStatus('idle'), 3000);
    }
  };

  return (
    <div className="bg-primary-bg border border-border-main rounded-2xl p-6 shadow-sm">
      {/* Header */}
      <div className="flex gap-4 items-start mb-6">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-brand-orange/10 text-brand-orange shrink-0">
          {isGranted ? <BellRing size={20} /> : <Bell size={20} />}
        </div>
        <div className="text-left">
          <h3 className="text-base font-extrabold text-text-primary font-heading tracking-tight">
            Order & Delivery Updates
          </h3>
          <p className="text-xs text-text-secondary mt-1 leading-relaxed">
            {PWA_MESSAGES.NOTIFICATIONS_EXPLAINER}
          </p>
        </div>
      </div>

      {/* Permission Prompter */}
      {!isGranted && (
        <div className="bg-surface-bg p-5 rounded-xl border border-border-main text-left mb-4">
          <div className="flex gap-3 mb-4">
            <Settings size={18} className="text-text-muted mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-text-primary">
                {isDenied ? 'Notifications Blocked' : 'Notifications Offline'}
              </h4>
              <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                {isDenied
                  ? 'Notifications are currently blocked in your browser settings. Please click the padlock icon in your URL bar and reset notification permissions.'
                  : 'Stay updated on riders, food preparation, and exclusive membership loyalty points.'}
              </p>
            </div>
          </div>
          {!isDenied && (
            <Button variant="primary" size="sm" onClick={handleEnable} className="w-full sm:w-auto">
              Enable Push Notifications
            </Button>
          )}
        </div>
      )}

      {/* Granular Preference Settings (Only shown if granted) */}
      {isGranted && (
        <div className="space-y-5 border-t border-border-main pt-6">
          <h4 className="text-xs font-bold text-text-secondary uppercase tracking-wider text-left">
            Granular Preferences
          </h4>

          <div className="grid gap-4 sm:grid-cols-2">
            <Switch
              checked={preferences.orderUpdates}
              onChange={(val) => updatePreference('orderUpdates', val)}
              label="Order Status Updates"
              description="Alerts when restaurants accept, prepare, or pack your items."
            />
            <Switch
              checked={preferences.deliveryStatus}
              onChange={(val) => updatePreference('deliveryStatus', val)}
              label="Rider GPS Tracking"
              description="Real-time alerts when riders pick up items and reach your gate."
            />
            <Switch
              checked={preferences.supportFollowups}
              onChange={(val) => updatePreference('supportFollowups', val)}
              label="Support Responses"
              description="Notifications when customer support answers your open tickets."
            />
            <Switch
              checked={preferences.offers}
              onChange={(val) => updatePreference('offers', val)}
              label="Personalized Offers"
              description="Alerts for seasonal coupons and custom menu recommendations."
            />
            <Switch
              checked={preferences.rewardsUpdates}
              onChange={(val) => updatePreference('rewardsUpdates', val)}
              label="Loyalty Point Balance"
              description="Notifies when membership status tiers upgrade or points change."
            />
            <Switch
              checked={preferences.membershipReminders}
              onChange={(val) => updatePreference('membershipReminders', val)}
              label="Membership Renewals"
              description="Subtle alerts before monthly subscriptions auto-renew."
            />
          </div>

          {/* Simulation / Verification Box */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-surface-bg rounded-xl border border-border-main mt-6">
            <div className="text-left">
              <h5 className="text-xs font-extrabold text-text-primary">Verification Console</h5>
              <p className="text-[10px] text-text-secondary mt-0.5 leading-relaxed">
                Test the notification pipeline by triggering a mock order update event.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleTestNotification}
              isLoading={testSending}
              disabled={testSending || !preferences.orderUpdates}
              className="w-full sm:w-auto shrink-0"
            >
              {testStatus === 'idle' && <Play size={12} />}
              {testStatus === 'success' && <CheckCircle2 size={12} className="text-success-main" />}
              {testStatus === 'failed' && <AlertCircle size={12} className="text-error-main" />}
              {testStatus === 'idle' ? 'Send Test Alert' : testStatus === 'success' ? 'Alert Sent!' : 'Send Failed'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
