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
    <div className="min-h-screen bg-[#F3F0E8] flex items-center justify-center p-4 sm:p-6 text-left selection:bg-[#D7F04A] selection:text-[#141518]">
      <div className="w-full max-w-md bg-[#FAF8F5] p-6 sm:p-8 border border-[#141518] shadow-[6px_6px_0px_#141518] space-y-5 text-center">
        <div className="w-12 h-12 bg-[#D7F04A] border border-[#141518] shadow-[2px_2px_0px_#141518] text-[#141518] flex items-center justify-center mx-auto">
          <Mail size={24} />
        </div>
        <div className="space-y-1">
          <h3 className="text-xl font-heading font-black text-[#141518] uppercase tracking-tight">
            VERIFY INVOICE EMAIL
          </h3>
          <p className="text-xs text-[#55565B] max-w-xs mx-auto leading-relaxed font-sans">
            We have transmitted an activation key to{' '}
            <strong className="text-[#141518] font-mono">{registrationData.email || 'arjun@feasto.food'}</strong>.
          </p>
        </div>

        <div className="pt-2">
          <RiderButton variant="primary" size="lg" fullWidth onClick={handleContinue}>
            EMAIL CONFIRMED · PROCEED TO KYC →
          </RiderButton>
        </div>
      </div>
    </div>
  );
};

export default RiderEmailVerifyPage;
