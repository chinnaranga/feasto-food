import React, { useState } from 'react';
import useRiderProfileStore from '../../store/useRiderProfileStore';
import { RiderButton, RiderInput, RiderPageHeader } from '../../components/RiderUIComponents';

export const RiderProfilePayoutPage: React.FC = () => {
  const { payout, updatePayout } = useRiderProfileStore();

  const [bankName, setBankName] = useState(payout.bankName);
  const [accountNumber, setAccountNumber] = useState(payout.accountNumber);
  const [ifscCode, setIfscCode] = useState(payout.ifscCode);
  const [accountHolderName, setAccountHolderName] = useState(payout.accountHolderName);
  const [upiId, setUpiId] = useState(payout.upiId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updatePayout({
      bankName,
      accountNumber,
      ifscCode,
      accountHolderName,
      upiId,
    });
  };

  return (
    <div className="space-y-4 text-left">
      <RiderPageHeader title="Bank & Payout Setup" subtitle="Manage bank accounts, UPI IDs, and direct weekly payout readiness." />

      <form onSubmit={handleSubmit} className="p-5 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs space-y-4">
        <RiderInput label="Bank Name" value={bankName} onChange={(e) => setBankName(e.target.value)} />
        <RiderInput label="Account Number" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} />
        <div className="grid grid-cols-2 gap-2">
          <RiderInput label="IFSC Code" value={ifscCode} onChange={(e) => setIfscCode(e.target.value)} />
          <RiderInput label="Account Holder Name" value={accountHolderName} onChange={(e) => setAccountHolderName(e.target.value)} />
        </div>

        <RiderInput label="Instant Payout UPI ID (Optional)" value={upiId} onChange={(e) => setUpiId(e.target.value)} placeholder="arjun@upi" />

        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between">
          <span>Bank KYC Verification Status</span>
          <strong className="font-mono uppercase text-[10px] px-2 py-0.5 rounded bg-emerald-600 text-white">● Verified</strong>
        </div>

        <RiderButton variant="primary" type="submit" fullWidth>
          Save Payout Information
        </RiderButton>
      </form>
    </div>
  );
};

export default RiderProfilePayoutPage;
