import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, FileCheck, Bike, CheckCircle2 } from 'lucide-react';
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
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col text-left py-4 sm:py-8 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto w-full space-y-6 my-auto">
        <VerificationStepper currentStep="documents" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left Panel */}
          <div className="hidden lg:flex lg:col-span-5 bg-neutral-900 text-white rounded-3xl p-8 flex-col justify-between space-y-8 shadow-xl">
            <div className="space-y-4">
              <span className="text-[10px] font-mono font-bold tracking-widest text-emerald-400 uppercase bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
                Commercial Driving Permit
              </span>
              <h2 className="text-2xl font-black font-heading leading-tight">
                Driving License & Road Compliance
              </h2>
              <p className="text-xs text-neutral-300 leading-relaxed">
                Feasto verifies valid commercial/private driving permits with Regional Transport Offices (RTO) to ensure safety on the road.
              </p>
            </div>

            <div className="space-y-3 font-mono text-xs text-neutral-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                <span>RTO Database Verification</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                <span>Supports LMV, MCWG & EV Categories</span>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-neutral-400">
              <span>Road Safety Standard</span>
              <span>RTO Verified</span>
            </div>
          </div>

          {/* Right Form Card */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200 shadow-modal space-y-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <RiderPageHeader
                title="Driving License & Address Proof"
                subtitle="Step 4 of 5: Upload your active commercial or private driving permit."
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
                title="Driving License Photo (Original)"
                subtitle="Capture front photo of driving license."
                status={licenseDoc.status || 'pending'}
                onUpload={() => {}}
              />

              <div className="pt-2">
                <RiderButton variant="primary" size="lg" fullWidth type="submit">
                  Continue to Vehicle Information →
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
