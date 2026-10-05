import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, CheckCircle2 } from 'lucide-react';
import useRiderAuthStore from '../../store/useRiderAuthStore';
import { RiderButton, RiderPageHeader } from '../../components/RiderUIComponents';

export const RiderEmailVerifyPage: React.FC = () => {
  const navigate = useNavigate();
  const { registrationData, verifyEmail, setCurrentStep } = useRiderAuthStore();

  const handleContinue = () => {
    verifyEmail();
    setCurrentStep('identity');
    navigate('/rider/identity');
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center p-4 text-left">
      <div className="w-full max-w-sm bg-white p-6 rounded-3xl border border-neutral-200 shadow-modal space-y-4 text-center">
        <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
          <Mail size={24} />
        </div>
        <h3 className="text-base font-black text-neutral-900 font-heading">Verify Your Email Address</h3>
        <p className="text-xs text-neutral-500 max-w-xs mx-auto leading-relaxed">
          We have sent a verification link to <strong className="text-neutral-900">{registrationData.email || 'arjun@feasto.food'}</strong>.
        </p>

        <RiderButton variant="primary" size="lg" fullWidth onClick={handleContinue}>
          Email Verified • Continue →
        </RiderButton>
      </div>
    </div>
  );
};

export default RiderEmailVerifyPage;
