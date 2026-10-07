import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, FileCheck, Bike, CheckCircle2, Zap } from 'lucide-react';
import useRiderAuthStore from '../../store/useRiderAuthStore';
import { RiderButton, RiderInput, RiderPageHeader } from '../../components/RiderUIComponents';
import { DocumentUploader, VerificationStepper } from '../../components/auth/RiderAuthComponents';

export const RiderDocumentsUploadPage: React.FC = () => {
  const navigate = useNavigate();
  const { licenseDoc, updateLicenseDoc, setCurrentStep } = useRiderAuthStore();

  const [licenseNumber, setLicenseNumber] = useState(licenseDoc.licenseNumber || '');
  const [expiryDate, setExpiryDate] = useState(licenseDoc.expiryDate || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!licenseNumber) return;
    updateLicenseDoc({ licenseNumber, expiryDate });
    setCurrentStep('vehicle');
    navigate('/rider/vehicle');
  };

  return (
    <div className="min-h-screen bg-[#F3F0E8] flex flex-col text-left py-4 sm:py-8 px-4 sm:px-6 selection:bg-[#D7F04A] selection:text-[#141518]">
      <div className="max-w-6xl mx-auto w-full space-y-6 my-auto">
        <VerificationStepper currentStep="documents" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left Panel */}
          <div className="hidden lg:flex lg:col-span-5 bg-[#141518] text-[#FAF8F5] border border-[#141518] shadow-[6px_6px_0px_#141518] p-8 flex-col justify-between space-y-8">
            <div className="space-y-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#D7F04A] text-[#141518] border border-[#141518] text-[10px] font-mono font-black uppercase tracking-widest shadow-[2px_2px_0px_#D7F04A]">
                <FileCheck size={11} /> COMMERCIAL DRIVING PERMIT
              </span>
              <h2 className="text-3xl font-heading font-black leading-tight uppercase tracking-tight text-white">
                RTO ROAD SAFETY COMPLIANCE
              </h2>
              <p className="text-xs text-[#B0B1B6] leading-relaxed font-sans">
                Feasto interfaces directly with Regional Transport Office (RTO) databases to ensure valid driving
                permits across motorcycle, electric scooter, and commercial categories.
              </p>
            </div>

            <div className="space-y-2.5 font-mono text-xs text-[#FAF8F5]">
              <div className="p-3 bg-[#1E2025] border border-[#2B2E36] flex items-center gap-2.5">
                <span className="text-[#D7F04A] font-black">✓</span>
                <span>Supports MCWG, LMV & Commercial EV Driver Tiers</span>
              </div>
              <div className="p-3 bg-[#1E2025] border border-[#2B2E36] flex items-center gap-2.5">
                <span className="text-[#D7F04A] font-black">✓</span>
                <span>Validates Against Ministry of Road Transport & Highways (MoRTH)</span>
              </div>
            </div>

            <div className="pt-4 border-t border-[#2B2E36] flex items-center justify-between text-[11px] font-mono text-[#8E929C]">
              <span>ZERO PHYSICAL COPIES NEEDED</span>
              <span>PARIVAHAN SEWA SYNC</span>
            </div>
          </div>

          {/* Right Form Card */}
          <div className="lg:col-span-7 bg-[#FAF8F5] p-6 sm:p-8 border border-[#141518] shadow-[6px_6px_0px_#141518] space-y-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <RiderPageHeader
                title="Driving License & Address Proof"
                subtitle="Step 4 of 6: Provide your active DL license number and expiry details."
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <RiderInput
                  label="Driving License Number *"
                  required
                  value={licenseNumber}
                  onChange={(e) => setLicenseNumber(e.target.value)}
                  placeholder="e.g. MH02 20180094820"
                />

                <RiderInput
                  label="License Expiry Date"
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                />
              </div>

              <DocumentUploader
                title="Original Driving License Photo"
                subtitle="High-clarity photo of front of driving permit with visible photo & signature."
                status={licenseDoc.status || 'pending'}
                onUpload={() => {}}
              />

              <div className="pt-2">
                <RiderButton variant="primary" size="lg" fullWidth type="submit">
                  SAVE PERMIT & PROCEED TO VEHICLE REGISTRATION →
                </RiderButton>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiderDocumentsUploadPage;
