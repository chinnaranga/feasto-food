import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, FileCheck, CheckCircle2 } from 'lucide-react';
import useRiderAuthStore from '../../store/useRiderAuthStore';
import { RiderButton, RiderInput, RiderPageHeader } from '../../components/RiderUIComponents';
import { DocumentUploader, VerificationStepper } from '../../components/auth/RiderAuthComponents';

export const RiderIdentityVerifyPage: React.FC = () => {
  const navigate = useNavigate();
  const { identityDoc, updateIdentityDoc, setCurrentStep } = useRiderAuthStore();

  const [docType, setDocType] = useState<'aadhaar' | 'pan' | 'tax_id' | 'passport'>(identityDoc.docType || 'aadhaar');
  const [docNumber, setDocNumber] = useState(identityDoc.docNumber || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docNumber) return;
    updateIdentityDoc({ docType, docNumber });
    setCurrentStep('documents');
    navigate('/rider/documents');
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col text-left py-4 sm:py-8 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto w-full space-y-6 my-auto">
        <VerificationStepper currentStep="identity" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left Panel */}
          <div className="hidden lg:flex lg:col-span-5 bg-neutral-900 text-white rounded-3xl p-8 flex-col justify-between space-y-8 shadow-xl">
            <div className="space-y-4">
              <span className="text-[10px] font-mono font-bold tracking-widest text-emerald-400 uppercase bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
                Government KYC Verification
              </span>
              <h2 className="text-2xl font-black font-heading leading-tight">
                National Identity & KYC Compliance
              </h2>
              <p className="text-xs text-neutral-300 leading-relaxed">
                Feasto verifies courier identity via official NSDL / UIDAI API gateways to ensure full legal compliance and fast bank payouts.
              </p>
            </div>

            <div className="space-y-3 font-mono text-xs text-neutral-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                <span>Instant NSDL Aadhaar / PAN Verification</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                <span>256-Bit Encrypted Document Storage</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                <span>Zero Physical Paperwork Required</span>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-neutral-400">
              <span>Trusted Courier Protocol</span>
              <span>100% Confidential</span>
            </div>
          </div>

          {/* Right Form Card */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200 shadow-modal space-y-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <RiderPageHeader
                title="Government Identity Proof"
                subtitle="Step 3 of 5: Upload your Aadhaar, PAN, or Passport for identity verification."
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1 text-xs">
                  <label className="font-bold text-neutral-700 block">Select Document Type *</label>
                  <select
                    value={docType}
                    onChange={(e) => setDocType(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl font-bold text-neutral-900 focus:outline-none focus:border-neutral-400"
                  >
                    <option value="aadhaar">Aadhaar Card (12 Digits)</option>
                    <option value="pan">PAN Card (10 Digits)</option>
                    <option value="passport">Passport</option>
                  </select>
                </div>

                <RiderInput
                  label="Document ID Number *"
                  required
                  value={docNumber}
                  onChange={(e) => setDocNumber(e.target.value)}
                  placeholder="e.g. 5849 2014 9920"
                />
              </div>

              <DocumentUploader
                title="Front & Back Photo Upload"
                subtitle="Ensure document corners and text details are clear."
                status={identityDoc.status || 'pending'}
                onUpload={() => {}}
              />

              <div className="pt-2">
                <RiderButton variant="primary" size="lg" fullWidth type="submit">
                  Save & Continue to Vehicle License →
                </RiderButton>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiderIdentityVerifyPage;
