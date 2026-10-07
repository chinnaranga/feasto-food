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
    <div className="min-h-screen bg-[#F3F0E8] flex items-center justify-center p-4 sm:p-6 text-left selection:bg-[#D7F04A] selection:text-[#141518]">
      <div className="w-full max-w-md bg-[#FAF8F5] p-6 sm:p-8 border border-[#141518] shadow-[6px_6px_0px_#141518] space-y-5">
        <RiderPageHeader
          title="Account Security Recovery"
          subtitle="Provide your registered courier phone number to generate an emergency reset authorization code."
        />

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
            DISPATCH PASSWORD RESET LINK →
          </RiderButton>

          {sent && (
            <div className="p-3 bg-[#D7F04A]/20 border border-[#141518] text-xs font-mono font-bold text-[#141518] text-center">
              ✓ RECOVERY LINK DISPATCHED VIA SMS. REDIRECTING...
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default RiderForgotPasswordPage;
