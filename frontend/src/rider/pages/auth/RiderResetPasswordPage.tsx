import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
    <div className="min-h-screen bg-[#F3F0E8] flex items-center justify-center p-4 sm:p-6 text-left selection:bg-[#D7F04A] selection:text-[#141518]">
      <div className="w-full max-w-md bg-[#FAF8F5] p-6 sm:p-8 border border-[#141518] shadow-[6px_6px_0px_#141518] space-y-5">
        <RiderPageHeader
          title="Set New Courier Password"
          subtitle="Define an alphanumeric password to protect your rider wallet and duty assignments."
        />

        <form onSubmit={handleSubmit} className="space-y-4">
          <RiderInput
            label="New Secret Password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••••••"
          />

          <PasswordStrength password={password} />

          <RiderButton variant="primary" size="lg" fullWidth type="submit">
            COMMIT CREDENTIAL & LOGIN →
          </RiderButton>

          <div className="pt-2 text-center">
            <Link
              to="/rider/login"
              className="text-xs font-mono font-black uppercase text-[#141518] hover:text-[#1B3BFF] underline underline-offset-4 decoration-[#D7F04A] decoration-2"
            >
              ← BACK TO COURIER LOGIN
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RiderResetPasswordPage;
