import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@/utils/zodResolver';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Shield,
  Eye,
  Smartphone,
  Loader2,
  HelpCircle,
  Bell,
} from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { useUserStore } from '@/store/userStore';
import { useSettingsStore, UserSession } from '@/store/settingsStore';
import { useToastStore } from '@/store/toastStore';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useTrackEvent } from '@/hooks/analytics/useTrackEvent';
import { SettingsSectionCard } from '@/components/settings/SettingsSectionCard';
import { SettingsToggleRow } from '@/components/settings/SettingsToggleRow';
import { SecurityActionCard } from '@/components/settings/SecurityActionCard';
import { PrivacyOptionRow } from '@/components/settings/PrivacyOptionRow';
import { ConfirmationDialog } from '@/components/settings/ConfirmationDialog';
import { SuccessState } from '@/components/settings/SuccessState';
import { NotificationPermissionCard } from '@/components/pwa/NotificationPermissionCard';
import { useI18nStore } from '@/store/i18n/i18nStore';
import { PrivacyPreferencesPanel } from '@/components/security/PrivacyPreferencesPanel';
import { DataExportRequestCard } from '@/components/security/DataExportRequestCard';
import { AccountDeletionCard } from '@/components/security/AccountDeletionCard';
import { SecurityNotice } from '@/components/security/SecurityNotice';

// Form Schemas
const accountDetailsSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Enter a valid email address'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number'),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(6, 'Current password must be at least 6 characters'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters'),
  confirmPassword: z.string().min(8, 'Please confirm your new password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type AccountDetailsFields = z.infer<typeof accountDetailsSchema>;
type PasswordFields = z.infer<typeof passwordSchema>;

export const Settings: React.FC = () => {
  const trackEvent = useTrackEvent();
  const location = useLocation();
  const navigate = useNavigate();
  const { addToast } = useToastStore();
  useDocumentTitle('Settings', 'Configure your localization, account security, and privacy preferences.');

  // Stores
  const { profile, updateProfile } = useUserStore();
  const {
    accessibility,
    privacy,
    sessions,
    twoFactorEnabled,
    updateAccessibility,
    updatePrivacy,
    terminateSession,
    changePassword,
    toggleTwoFactor,
    deleteAccount,
  } = useSettingsStore();

  const {
    language: i18nLang,
    region: i18nRegion,
    setLanguage: setI18nLang,
    setRegion: setI18nRegion,
  } = useI18nStore();

  // Active sub-tab routing
  const activeTab = location.pathname.endsWith('/security')
    ? 'security'
    : location.pathname.endsWith('/privacy')
      ? 'privacy'
      : location.pathname.endsWith('/notifications')
        ? 'notifications'
        : 'account';

  const handleTabChange = (tab: 'account' | 'security' | 'privacy' | 'notifications') => {
    if (tab === 'account') navigate('/settings');
    else navigate(`/settings/${tab}`);
  };

  // State flags
  const [isSavingAccount, setIsSavingAccount] = useState(false);
  const [isChangingPass, setIsChangingPass] = useState(false);
  const [showPassSuccess, setShowPassSuccess] = useState(false);
  const [sessionToTerminate, setSessionToTerminate] = useState<UserSession | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form Hooks
  const {
    register: registerAccount,
    handleSubmit: handleAccountSubmit,
    formState: { errors: accountErrors, isDirty: isAccountDirty },
    reset: resetAccount,
  } = useForm<AccountDetailsFields>({
    resolver: zodResolver(accountDetailsSchema),
    defaultValues: {
      name: profile.name,
      email: profile.email,
      phone: profile.phone,
    },
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
    reset: resetPassword,
  } = useForm<PasswordFields>({
    resolver: zodResolver(passwordSchema),
  });

  // Action Handlers
  const onSaveAccount = async (data: AccountDetailsFields) => {
    setIsSavingAccount(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    updateProfile(data);
    trackEvent('settings_updated', {
      section: 'account',
      settingKey: 'profile_updated',
      newValue: { name: data.name, email: data.email },
    });
    resetAccount(data); // reset dirtiness
    setIsSavingAccount(false);
    addToast({ message: 'Account details saved successfully.', type: 'success' });
  };

  const onPasswordChange = async (data: PasswordFields) => {
    setIsChangingPass(true);
    try {
      await changePassword(data.currentPassword, data.newPassword);
      trackEvent('settings_updated', {
        section: 'security',
        settingKey: 'password_updated',
        newValue: { success: true },
      });
      setShowPassSuccess(true);
      resetPassword();
    } catch {
      trackEvent('settings_updated', {
        section: 'security',
        settingKey: 'password_updated',
        newValue: { success: false, error: 'Failed to update password' },
      });
      addToast({ message: 'Failed to update password.', type: 'error' });
    } finally {
      setIsChangingPass(false);
    }
  };

  const handleConfirmTerminateSession = () => {
    if (sessionToTerminate) {
      terminateSession(sessionToTerminate.id);
      trackEvent('settings_updated', {
        section: 'security',
        settingKey: 'session_terminated',
        newValue: { sessionId: sessionToTerminate.id },
      });
      addToast({
        message: `Session on ${sessionToTerminate.device.split(' ')[0]} terminated.`,
        type: 'success',
      });
      setSessionToTerminate(null);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    await deleteAccount();
    trackEvent('settings_updated', {
      section: 'account',
      settingKey: 'account_deleted',
      newValue: { success: true },
    });
    setIsDeleting(false);
    setShowDeleteModal(false);
    addToast({ message: 'Account deleted. Redirecting...', type: 'success' });
    setTimeout(() => {
      navigate('/auth/signin');
    }, 1500);
  };

  return (
    <div className="bg-secondary-bg min-h-screen pb-20 pt-8 text-left">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Navigation Bar */}
          <aside className="lg:col-span-3 flex flex-col gap-1.5 select-none">
            <div className="px-4 py-2 text-[10px] font-extrabold text-text-muted uppercase tracking-wider">
              Settings
            </div>
            <button
              onClick={() => handleTabChange('account')}
              className={`flex items-center gap-3 w-full px-4 py-3 rounded-2xl text-xs font-bold transition-main cursor-pointer
                ${
                  activeTab === 'account'
                    ? 'bg-white border border-border-main text-brand-orange shadow-soft font-extrabold'
                    : 'text-text-secondary hover:bg-white/40 hover:text-text-primary'
                }`}
            >
              <User size={15} />
              <span>Account & Preferences</span>
            </button>
            <button
              onClick={() => handleTabChange('security')}
              className={`flex items-center gap-3 w-full px-4 py-3 rounded-2xl text-xs font-bold transition-main cursor-pointer
                ${
                  activeTab === 'security'
                    ? 'bg-white border border-border-main text-brand-orange shadow-soft font-extrabold'
                    : 'text-text-secondary hover:bg-white/40 hover:text-text-primary'
                }`}
            >
              <Shield size={15} />
              <span>Login & Security</span>
            </button>
            <button
              onClick={() => handleTabChange('privacy')}
              className={`flex items-center gap-3 w-full px-4 py-3 rounded-2xl text-xs font-bold transition-main cursor-pointer
                ${
                  activeTab === 'privacy'
                    ? 'bg-white border border-border-main text-brand-orange shadow-soft font-extrabold'
                    : 'text-text-secondary hover:bg-white/40 hover:text-text-primary'
                }`}
            >
              <Eye size={15} />
              <span>Privacy & Safety</span>
            </button>
            <button
              onClick={() => handleTabChange('notifications')}
              className={`flex items-center gap-3 w-full px-4 py-3 rounded-2xl text-xs font-bold transition-main cursor-pointer
                ${
                  activeTab === 'notifications'
                    ? 'bg-white border border-border-main text-brand-orange shadow-soft font-extrabold'
                    : 'text-text-secondary hover:bg-white/40 hover:text-text-primary'
                }`}
            >
              <Bell size={15} />
              <span>Notification Channels</span>
            </button>

            <div className="border-t border-border-main/50 mt-4 pt-4 flex flex-col gap-1.5">
              <button
                onClick={() => navigate('/support')}
                className="flex items-center gap-3 w-full px-4 py-3 rounded-2xl text-xs font-bold text-text-secondary hover:bg-white/40 hover:text-text-primary cursor-pointer transition-main"
              >
                <HelpCircle size={15} />
                <span>Help Center</span>
              </button>
            </div>
          </aside>

          {/* Sub-view Content Panel */}
          <main className="lg:col-span-9 flex flex-col gap-6">
            <AnimatePresence mode="wait">
              
              {/* ACCOUNT TAB */}
              {activeTab === 'account' && (
                <motion.div
                  key="account"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col gap-6"
                >
                  {/* Account Details Form */}
                  <form onSubmit={handleAccountSubmit(onSaveAccount)}>
                    <SettingsSectionCard
                      title="Personal Profile"
                      description="Update your personal details and contact numbers."
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Input
                          label="Full Name"
                          error={accountErrors.name?.message}
                          {...registerAccount('name')}
                        />
                        <Input
                          label="Email Address"
                          type="email"
                          error={accountErrors.email?.message}
                          {...registerAccount('email')}
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Input
                          label="Mobile Phone (India)"
                          error={accountErrors.phone?.message}
                          {...registerAccount('phone')}
                        />
                      </div>
                      
                      {/* Save panel */}
                      <div className="flex items-center justify-end gap-3 border-t border-border-main/40 pt-4 mt-2">
                        {isAccountDirty && (
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={() => resetAccount()}
                            className="rounded-xl text-xs font-bold px-5 border border-border-main"
                            disabled={isSavingAccount}
                          >
                            Reset
                          </Button>
                        )}
                        <Button
                          type="submit"
                          variant="primary"
                          disabled={!isAccountDirty || isSavingAccount}
                          className="rounded-xl text-xs font-bold px-6 py-2.5 flex items-center gap-2 min-w-[120px] justify-center"
                        >
                          {isSavingAccount ? (
                            <>
                              <Loader2 size={13} className="animate-spin" />
                              <span>Saving...</span>
                            </>
                          ) : (
                            <span>Save Changes</span>
                          )}
                        </Button>
                      </div>
                    </SettingsSectionCard>
                  </form>

                  {/* Region & Language Selector */}
                  <SettingsSectionCard
                    title="Region & Language"
                    description="Configure your localization options for display text."
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Select
                        label="Primary Language"
                        value={i18nLang}
                        onChange={(e) => {
                          setI18nLang(e.target.value as any);
                          trackEvent('settings_updated', {
                            section: 'account',
                            settingKey: 'language',
                            newValue: e.target.value,
                          });
                          addToast({ message: `Language updated to ${e.target.value.toUpperCase()}.`, type: 'success' });
                        }}
                        options={[
                          { value: 'en', label: '🇺🇸 English' },
                          { value: 'hi', label: '🇮🇳 Hindi (हिन्दी)' },
                          { value: 'es', label: '🇪🇸 Spanish (Español)' },
                          { value: 'ar', label: '🇦🇪 Arabic (العربية)' },
                          { value: 'fr', label: '🇫🇷 French (Français)' },
                        ]}
                      />
                      <Select
                        label="Operational Region"
                        value={i18nRegion}
                        onChange={(e) => {
                          setI18nRegion(e.target.value as any);
                          trackEvent('settings_updated', {
                            section: 'account',
                            settingKey: 'region',
                            newValue: e.target.value,
                          });
                          addToast({ message: `Region updated to ${e.target.value.toUpperCase()}.`, type: 'success' });
                        }}
                        options={[
                          { value: 'IN', label: '🇮🇳 India (INR)' },
                          { value: 'US', label: '🇺🇸 United States (USD)' },
                          { value: 'ES', label: '🇪🇸 Spain (EUR)' },
                          { value: 'AE', label: '🇦🇪 United Arab Emirates (AED)' },
                          { value: 'FR', label: '🇫🇷 France (EUR)' },
                        ]}
                      />
                    </div>
                  </SettingsSectionCard>

                  {/* Accessibility Preferences */}
                  <SettingsSectionCard
                    title="Accessibility Options"
                    description="Configure animations and visual layouts to suit your needs."
                  >
                    <div className="flex flex-col gap-1">
                      <SettingsToggleRow
                        label="Reduce Motion"
                        description="Minimizes sliding and scaling effects across transitions."
                        checked={accessibility.reducedMotion}
                        onChange={(checked) => {
                          updateAccessibility({ reducedMotion: checked });
                          trackEvent('settings_updated', {
                            section: 'account',
                            settingKey: 'accessibility_reducedMotion',
                            newValue: checked,
                          });
                          addToast({ message: `Reduced motion ${checked ? 'enabled' : 'disabled'}.`, type: 'success' });
                        }}
                      />
                      <div className="border-t border-border-main/30 my-2" />
                      <SettingsToggleRow
                        label="Larger Typography"
                        description="Scale settings content text for enhanced visual comfort."
                        checked={accessibility.largeText}
                        onChange={(checked) => {
                          updateAccessibility({ largeText: checked });
                          trackEvent('settings_updated', {
                            section: 'account',
                            settingKey: 'accessibility_largeText',
                            newValue: checked,
                          });
                          addToast({ message: `Larger text layout ${checked ? 'enabled' : 'disabled'}.`, type: 'success' });
                        }}
                      />
                      <div className="border-t border-border-main/30 my-2" />
                      <SettingsToggleRow
                        label="High Contrast Textures"
                        description="Boost lines and card contrast ratios."
                        checked={accessibility.highContrast}
                        onChange={(checked) => {
                          updateAccessibility({ highContrast: checked });
                          trackEvent('settings_updated', {
                            section: 'account',
                            settingKey: 'accessibility_highContrast',
                            newValue: checked,
                          });
                          addToast({ message: `High contrast ${checked ? 'enabled' : 'disabled'}.`, type: 'success' });
                        }}
                      />
                    </div>
                  </SettingsSectionCard>
                </motion.div>
              )}

              {/* SECURITY TAB */}
              {activeTab === 'security' && (
                <motion.div
                  key="security"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col gap-6"
                >
                  {/* Two-Factor Authentication */}
                  <SettingsSectionCard
                    title="Account Protection"
                    description="Enhance authorization barriers to guard checkout methods."
                  >
                    <SecurityActionCard
                      title="Two-Factor Authentication (2FA)"
                      description="Require a secure verification code from an authenticator app when logging in from new devices."
                      statusText={twoFactorEnabled ? 'Enabled' : 'Disabled'}
                      isStatusPositive={twoFactorEnabled}
                      actionLabel={twoFactorEnabled ? 'Configure' : 'Setup 2FA'}
                      onAction={() => {
                        toggleTwoFactor();
                        trackEvent('settings_updated', {
                          section: 'security',
                          settingKey: 'two_factor_auth',
                          newValue: !twoFactorEnabled,
                        });
                        addToast({
                          message: `Two-Factor authentication ${!twoFactorEnabled ? 'setup initiated' : 'disabled'}.`,
                          type: 'success',
                        });
                      }}
                    />
                  </SettingsSectionCard>

                  {/* Password Change Block */}
                  <SettingsSectionCard
                    title="Change Password"
                    description="Change password regularly to keep your credentials secure. Last updated: Check-in records."
                  >
                    <AnimatePresence mode="wait">
                      {showPassSuccess ? (
                        <SuccessState
                          title="Password Updated Successfully"
                          message="Your password credentials have been refreshed. Your other device active sessions remain authorized."
                          onClose={() => setShowPassSuccess(false)}
                        />
                      ) : (
                        <form onSubmit={handlePasswordSubmit(onPasswordChange)} className="flex flex-col gap-4">
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <Input
                              label="Current Password"
                              type="password"
                              error={passwordErrors.currentPassword?.message}
                              {...registerPassword('currentPassword')}
                            />
                            <Input
                              label="New Password"
                              type="password"
                              error={passwordErrors.newPassword?.message}
                              {...registerPassword('newPassword')}
                            />
                            <Input
                              label="Confirm New Password"
                              type="password"
                              error={passwordErrors.confirmPassword?.message}
                              {...registerPassword('confirmPassword')}
                            />
                          </div>
                          <div className="flex justify-end pt-2 border-t border-border-main/40 mt-2">
                            <Button
                              type="submit"
                              variant="primary"
                              disabled={isChangingPass}
                              className="rounded-xl text-xs font-bold px-6 py-2.5 flex items-center gap-2 min-w-[140px] justify-center"
                            >
                              {isChangingPass ? (
                                <>
                                  <Loader2 size={13} className="animate-spin" />
                                  <span>Updating...</span>
                                </>
                              ) : (
                                <span>Change Password</span>
                              )}
                            </Button>
                          </div>
                        </form>
                      )}
                    </AnimatePresence>
                  </SettingsSectionCard>

                  {/* Sessions logs */}
                  <SettingsSectionCard
                    title="Active Sessions"
                    description="Verify authorized hardware currently authenticated."
                  >
                    <div className="flex flex-col gap-3">
                      {sessions.map((sess) => (
                        <div
                          key={sess.id}
                          className="flex items-center justify-between gap-4 p-4 border border-border-main rounded-2xl bg-secondary-bg/30 text-xs"
                        >
                          <div className="flex items-center gap-3">
                            <Smartphone size={16} className="text-text-secondary" />
                            <div className="text-left">
                              <p className="font-bold text-text-primary">{sess.device}</p>
                              <p className="text-[10px] text-text-muted mt-0.5">
                                {sess.location} &middot; IP: {sess.ip}
                              </p>
                            </div>
                          </div>
                          {sess.isActive ? (
                            <span className="text-[9px] font-bold text-success-main bg-success-main/5 border border-success-main/15 px-2 py-0.5 rounded-full uppercase">
                              Active Now
                            </span>
                          ) : (
                            <button
                              onClick={() => setSessionToTerminate(sess)}
                              className="text-[10px] font-extrabold text-brand-orange hover:underline cursor-pointer bg-white px-2.5 py-1.5 rounded-lg border border-border-main shadow-xs"
                            >
                              Log Out
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </SettingsSectionCard>
                </motion.div>
              )}

              {/* PRIVACY TAB */}
              {activeTab === 'privacy' && (
                <motion.div
                  key="privacy"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col gap-6"
                >
                  {/* Privacy details */}
                  <SettingsSectionCard
                    title="Account Visibility & Tracking"
                    description="Decide what statistics are shared or logged by Feasto's recommendation nodes."
                  >
                    <div className="flex flex-col gap-1">
                      <PrivacyOptionRow
                        label="Profile Visibility"
                        description="Set whether your favorites and public lists are visible to friends."
                        control={
                          <Select
                            value={privacy.profileVisibility}
                            onChange={(e) => {
                              const val = e.target.value as 'public' | 'private';
                              updatePrivacy({ profileVisibility: val });
                              trackEvent('settings_updated', {
                                section: 'privacy',
                                settingKey: 'profileVisibility',
                                newValue: val,
                              });
                              addToast({ message: `Profile visibility set to ${e.target.value}.`, type: 'success' });
                            }}
                            options={[
                              { value: 'public', label: 'Public (Discoverable)' },
                              { value: 'private', label: 'Private (Hidden)' },
                            ]}
                            className="w-[180px] bg-primary-bg"
                          />
                        }
                      />
                      <div className="border-t border-border-main/30 my-2" />
                      <SettingsToggleRow
                        label="Usage & Crash Analytics"
                        description="Allow us to store interactions to debug performance lag."
                        checked={privacy.dataUsageAnalytics}
                        onChange={(checked) => {
                          updatePrivacy({ dataUsageAnalytics: checked });
                          trackEvent('settings_updated', {
                            section: 'privacy',
                            settingKey: 'dataUsageAnalytics',
                            newValue: checked,
                          });
                          addToast({ message: `Usage analytics data sharing ${checked ? 'enabled' : 'disabled'}.`, type: 'success' });
                        }}
                      />
                      <div className="border-t border-border-main/30 my-2" />
                      <SettingsToggleRow
                        label="Personalized Ads & Promotions"
                        description="Allow tracking patterns to deliver targeted restaurant discount offers."
                        checked={privacy.personalizedAds}
                        onChange={(checked) => {
                          updatePrivacy({ personalizedAds: checked });
                          trackEvent('settings_updated', {
                            section: 'privacy',
                            settingKey: 'personalizedAds',
                            newValue: checked,
                          });
                          addToast({ message: `Targeted personalization ${checked ? 'enabled' : 'disabled'}.`, type: 'success' });
                        }}
                      />
                    </div>
                  </SettingsSectionCard>

                  <PrivacyPreferencesPanel />
                  <DataExportRequestCard />
                  <SecurityNotice />
                  <AccountDeletionCard />
                </motion.div>
              )}

              {/* NOTIFICATIONS TAB */}
              {activeTab === 'notifications' && (
                <motion.div
                  key="notifications"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <NotificationPermissionCard />
                </motion.div>
              )}

            </AnimatePresence>
          </main>
        </div>
      </Container>

      {/* Confirmation Dialog: Session Termination */}
      <ConfirmationDialog
        isOpen={!!sessionToTerminate}
        onClose={() => setSessionToTerminate(null)}
        onConfirm={handleConfirmTerminateSession}
        title="Terminate Device Session"
        message={
          sessionToTerminate
            ? `Are you sure you want to log out of the session on ${sessionToTerminate.device}? You will need to re-authenticate if you access Feasto on that hardware.`
            : ''
        }
        confirmLabel="Log Out Device"
      />

      {/* Confirmation Dialog: Delete Account */}
      <ConfirmationDialog
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteAccount}
        title="Permanently Delete Account"
        message="Are you sure you want to delete your Feasto account? This will erase your personal details, all saved addresses, order history, credit logs, and dietary recommendation patterns. This cannot be undone."
        confirmLabel="Permanently Delete"
        isDestructive
        isLoading={isDeleting}
      />
    </div>
  );
};
