import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, FileCheck, CheckCircle2, Zap } from 'lucide-react';
import useRiderAuthStore from '../../store/useRiderAuthStore';
import { RiderButton, RiderInput, RiderPageHeader } from '../../components/RiderUIComponents';
import { DocumentUploader, VerificationStepper } from '../../components/auth/RiderAuthComponents';

export const RiderIdentityVerifyPage: React.FC = () => {
  const navigate = useNavigate();
  const { identityDoc, updateIdentityDoc, setCurrentStep } = useRiderAuthStore();

  const [docType, setDocType] = useState<'aadhaar' | 'pan' | 'tax_id' | 'passport'>(
    identityDoc.docType || 'aadhaar'
  );
  const [docNumber, setDocNumber] = useState(identityDoc.docNumber || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docNumber) return;
    updateIdentityDoc({ docType, docNumber });
    setCurrentStep('documents');
    navigate('/rider/documents');
  };

  return (
    <div className="min-h-screen bg-[#F3F0E8] flex flex-col text-left py-4 sm:py-8 px-4 sm:px-6 selection:bg-[#D7F04A] selection:text-[#141518]">
      <div className="max-w-6xl mx-auto w-full space-y-6 my-auto">
        <VerificationStepper currentStep="identity" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left Panel */}
          <div className="hidden lg:flex lg:col-span-5 bg-[#141518] text-[#FAF8F5] border border-[#141518] shadow-[6px_6px_0px_#141518] p-8 flex-col justify-between space-y-8">
            <div className="space-y-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#D7F04A] text-[#141518] border border-[#141518] text-[10px] font-mono font-black uppercase tracking-widest shadow-[2px_2px_0px_#D7F04A]">
                <ShieldCheck size={11} /> GOVERNMENT KYC REGISTRATION
              </span>
              <h2 className="text-3xl font-heading font-black leading-tight uppercase tracking-tight text-white">
                NATIONAL IDENTITY VERIFICATION
              </h2>
              <p className="text-xs text-[#B0B1B6] leading-relaxed font-sans">
                Feasto validates courier identity through official NSDL & UIDAI verification networks to ensure
                full compliance with India’s gig-worker legal frameworks.
              </p>
            </div>

            <div className="space-y-2.5 font-mono text-xs text-[#FAF8F5]">
              <div className="p-3 bg-[#1E2025] border border-[#2B2E36] flex items-center gap-2.5">
                <span className="text-[#D7F04A] font-black">✓</span>
                <span>Direct UIDAI / NSDL API Data Validation</span>
              </div>
              <div className="p-3 bg-[#1E2025] border border-[#2B2E36] flex items-center gap-2.5">
                <span className="text-[#D7F04A] font-black">✓</span>
                <span>256-Bit Encrypted Storage with Zero Third-Party Sharing</span>
              </div>
              <div className="p-3 bg-[#1E2025] border border-[#2B2E36] flex items-center gap-2.5">
                <span className="text-[#D7F04A] font-black">✓</span>
                <span>Immediate Verification Clearance (Under 10 Mins)</span>
              </div>
            </div>

            <div className="pt-4 border-t border-[#2B2E36] flex items-center justify-between text-[11px] font-mono text-[#8E929C]">
              <span>LEGAL KYC COMPLIANT</span>
              <span>100% CONFIDENTIAL</span>
            </div>
          </div>

          {/* Right Form Card */}
          <div className="lg:col-span-7 bg-[#FAF8F5] p-6 sm:p-8 border border-[#141518] shadow-[6px_6px_0px_#141518] space-y-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <RiderPageHeader
                title="Government Identity Proof"
                subtitle="Step 3 of 6: Provide your Aadhaar, PAN, or Passport number and clear document image."
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1 text-xs">
                  <label className="text-[11px] font-mono font-bold tracking-wider uppercase text-[#141518] block">
                    Document Category *
                  </label>
                  <select
                    value={docType}
                    onChange={(e) => setDocType(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#141518] text-xs font-mono font-bold text-[#141518] focus:outline-none focus:ring-1 focus:ring-[#141518] shadow-[2px_2px_0px_#141518]"
                  >
                    <option value="aadhaar">Aadhaar Card (12 Digits UIDAI)</option>
                    <option value="pan">PAN Card (10 Digits Income Tax)</option>
                    <option value="passport">Indian Passport</option>
                  </select>
                </div>

                <RiderInput
                  label="Document Identification Number *"
                  required
                  value={docNumber}
                  onChange={(e) => setDocNumber(e.target.value)}
                  placeholder="e.g. 5849 2014 9920"
                />
              </div>

              <DocumentUploader
                title="Front & Back Document Image"
                subtitle="Position ID inside clear lighting. Keep all four corners within frame."
                status={identityDoc.status || 'pending'}
                onUpload={() => {}}
              />

              <div className="pt-2">
                <RiderButton variant="primary" size="lg" fullWidth type="submit">
                  SAVE CREDENTIAL & PROCEED TO DRIVING PERMIT →
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
