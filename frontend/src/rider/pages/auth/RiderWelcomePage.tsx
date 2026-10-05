import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bike, ShieldCheck, ArrowRight, Globe } from 'lucide-react';
import useRiderAuthStore from '../../store/useRiderAuthStore';
import { RiderButton } from '../../components/RiderUIComponents';

export const RiderWelcomePage: React.FC = () => {
  const navigate = useNavigate();
  const { language, setLanguage, setCurrentStep } = useRiderAuthStore();

  const handleStartRegister = () => {
    setCurrentStep('register');
    navigate('/rider/register');
  };

  const handleSignIn = () => {
    setCurrentStep('otp');
    navigate('/rider/login');
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center p-4 text-left">
      <div className="w-full max-w-sm bg-white p-6 rounded-3xl border border-neutral-200 shadow-modal space-y-6">
        {/* Brand Banner */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-[#e35205] text-white flex items-center justify-center mx-auto shadow-3xs">
            <Bike size={28} />
          </div>
          <h1 className="text-xl font-black text-neutral-900 font-heading">
            Feasto<span className="text-[#e35205]">Rider</span>
          </h1>
          <p className="text-xs text-neutral-500 max-w-xs mx-auto leading-relaxed">
            Deliver food with India's fastest merchant network. Flexible shifts, daily payouts & accident coverage.
          </p>
        </div>

        {/* Language Selection */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-neutral-700 block flex items-center gap-1">
            <Globe size={13} />
            <span>Select Preferred Language</span>
          </label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full px-3 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-bold text-neutral-900 focus:outline-none cursor-pointer"
          >
            <option value="English">English (Default)</option>
            <option value="Hindi">हिंदी (Hindi)</option>
            <option value="Marathi">मराठी (Marathi)</option>
            <option value="Kannada">ಕನ್ನಡ (Kannada)</option>
            <option value="Telugu">తెలుగు (Telugu)</option>
          </select>
        </div>

        {/* Action CTAs */}
        <div className="space-y-2.5 pt-2">
          <RiderButton variant="primary" size="lg" fullWidth onClick={handleStartRegister}>
            Register as Delivery Partner
          </RiderButton>
          <RiderButton variant="outline" size="md" fullWidth onClick={handleSignIn}>
            Existing Partner Login
          </RiderButton>
        </div>
      </div>
    </div>
  );
};

export default RiderWelcomePage;
