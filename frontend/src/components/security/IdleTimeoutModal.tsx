import React from 'react';
import { useSecurityStore } from '../../store/security/securityStore';
import { securityClient } from '../../services/security/securityClient';
import { Button } from '../ui/Button';
import { Lock } from 'lucide-react';

export const IdleTimeoutModal: React.FC = () => {
  const { sessionStatus } = useSecurityStore();

  if (sessionStatus !== 'expired') return null;

  const handleReturn = () => {
    securityClient.terminateSession();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-modal flex items-center justify-center p-6 animate-fade-in">
      <div className="bg-primary-bg max-w-sm w-full border border-border-main p-8 rounded-3xl shadow-xl text-center flex flex-col items-center">
        
        {/* Lock Icon */}
        <div className="w-14 h-14 rounded-full bg-error-main/10 text-error-main flex items-center justify-center mb-6">
          <Lock size={26} />
        </div>

        <h3 className="text-base font-extrabold text-text-primary mb-2 font-heading tracking-tight">
          Session Expired
        </h3>
        <p className="text-xs text-text-secondary leading-relaxed mb-6">
          You have been signed out due to 15 minutes of user inactivity. Please sign in again to restore access.
        </p>

        <Button
          variant="primary"
          onClick={handleReturn}
          className="w-full text-xs font-bold py-2.5 rounded-xl"
        >
          Return to Login
        </Button>
      </div>
    </div>
  );
};
export default IdleTimeoutModal;
