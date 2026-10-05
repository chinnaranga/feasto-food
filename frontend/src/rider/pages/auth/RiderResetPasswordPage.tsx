import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RiderButton, RiderInput, RiderPageHeader } from '../../components/RiderUIComponents';
import { PasswordStrength } from '../../components/auth/RiderAuthComponents';

export const RiderResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;
    navigate('/rider/login');
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center p-4 text-left">
      <div className="w-full max-w-sm bg-white p-6 rounded-3xl border border-neutral-200 shadow-modal space-y-4">
        <RiderPageHeader title="Set New Password" subtitle="Choose a strong password for your Rider partner account." />

        <form onSubmit={handleSubmit} className="space-y-4">
          <RiderInput
            label="New Password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />

          <PasswordStrength password={password} />

          <RiderButton variant="primary" size="lg" fullWidth type="submit">
            Save New Password & Login →
          </RiderButton>
        </form>
      </div>
    </div>
  );
};

export default RiderResetPasswordPage;
