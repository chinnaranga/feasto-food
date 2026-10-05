import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Key } from 'lucide-react';
import { RiderButton, RiderInput, RiderPageHeader } from '../../components/RiderUIComponents';

export const RiderForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) return;
    setSent(true);
    setTimeout(() => navigate('/rider/reset-password'), 1500);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center p-4 text-left">
      <div className="w-full max-w-sm bg-white p-6 rounded-3xl border border-neutral-200 shadow-modal space-y-4">
        <RiderPageHeader title="Forgot Account Password" subtitle="Enter your registered mobile number to receive a password reset link." />

        <form onSubmit={handleSubmit} className="space-y-4">
          <RiderInput
            label="Registered Mobile Phone"
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+91 98765 43210"
          />

          <RiderButton variant="primary" size="lg" fullWidth type="submit">
            Send Password Reset Link
          </RiderButton>

          {sent && <span className="text-xs text-emerald-600 font-bold block text-center">✓ Reset link dispatched! Redirecting...</span>}
        </form>
      </div>
    </div>
  );
};

export default RiderForgotPasswordPage;
