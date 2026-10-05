import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Bike } from 'lucide-react';
import { RiderButton } from '../../components/RiderUIComponents';

export const RiderAccountApprovedPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center p-4 text-left">
      <div className="w-full max-w-sm bg-white p-6 rounded-3xl border border-neutral-200 shadow-modal space-y-6 text-center">
        <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-3xs">
          <CheckCircle2 size={32} />
        </div>

        <div className="space-y-1">
          <h2 className="text-xl font-black text-neutral-900 font-heading">Account Approved!</h2>
          <p className="text-xs text-neutral-500 max-w-xs mx-auto leading-relaxed">
            Congratulations! Your courier partner account is approved. You can now turn On Duty and start receiving delivery orders.
          </p>
        </div>

        <RiderButton variant="primary" size="lg" fullWidth onClick={() => navigate('/rider/dashboard')}>
          Go to Rider Dashboard →
        </RiderButton>
      </div>
    </div>
  );
};

export default RiderAccountApprovedPage;
