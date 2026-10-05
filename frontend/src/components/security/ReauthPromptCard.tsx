import React, { useState } from 'react';
import { useSessionSecurity } from '../../hooks/security/useSessionSecurity';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Lock, Loader2, XCircle } from 'lucide-react';

export const ReauthPromptCard: React.FC = () => {
  const { isReauthOpen, confirmReauth, cancelReauth } = useSessionSecurity();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isReauthOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.trim() === '') {
      setError('Password is required.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const isValid = await confirmReauth(password);
      if (!isValid) {
        setError('Incorrect password credentials. Please try again.');
      } else {
        setPassword('');
      }
    } catch (err) {
      setError('An error occurred during verification.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-modal flex items-center justify-center p-6 animate-fade-in select-none">
      <div className="bg-primary-bg max-w-sm w-full border border-border-main p-6 rounded-3xl shadow-xl text-left">
        
        {/* Header layout */}
        <div className="flex items-center justify-between gap-4 border-b border-border-main/50 pb-4 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-orange/10 text-brand-orange flex items-center justify-center shrink-0">
              <Lock size={15} />
            </div>
            <div>
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Access Verification</span>
              <h3 className="text-xs font-extrabold text-text-primary tracking-tight font-heading mt-0.5">
                Confirm Current Password
              </h3>
            </div>
          </div>
          <button
            onClick={cancelReauth}
            className="p-1 rounded-full text-text-muted hover:text-text-primary hover:bg-surface-bg cursor-pointer transition-main"
            aria-label="Cancel verification"
          >
            <XCircleIcon size={16} />
          </button>
        </div>

        {/* Warning copy */}
        <p className="text-[11px] text-text-secondary leading-relaxed mb-4">
          To perform this action, verify your identity. Type password <code className="px-1 py-0.5 rounded bg-surface-bg font-mono font-bold text-brand-orange">securepassword123</code>.
        </p>

        {/* Form controls */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="password"
              placeholder="Enter account password"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              className="text-xs font-mono"
            />
            {error && (
              <p className="text-[10px] text-error-main font-bold mt-2.5 flex items-center gap-1.5 animate-fade-in">
                <XCircle size={12} /> {error}
              </p>
            )}
          </div>

          <Button type="submit" variant="primary" disabled={loading} className="w-full text-xs font-bold py-2.5 rounded-xl">
            {loading ? (
              <>
                <Loader2 size={13} className="animate-spin" />
                <span>Checking...</span>
              </>
            ) : (
              <span>Verify Password</span>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

// Internal icon proxy
const XCircleIcon: React.FC<{ size: number }> = ({ size }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x-circle">
    <circle cx="12" cy="12" r="10" />
    <path d="m15 9-6 6" />
    <path d="m9 9 6 6" />
  </svg>
);
export default ReauthPromptCard;
