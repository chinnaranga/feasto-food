import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bike, ShieldCheck, CheckCircle2, Zap } from 'lucide-react';
import useRiderAuthStore from '../../store/useRiderAuthStore';
import { RiderButton, RiderInput, RiderPageHeader } from '../../components/RiderUIComponents';
import { VerificationStepper } from '../../components/auth/RiderAuthComponents';

export const RiderVehicleVerifyPage: React.FC = () => {
  const navigate = useNavigate();
  const { vehicleData, updateVehicleData, submitForAccountReview } = useRiderAuthStore();

  const [vehicleType, setVehicleType] = useState<'motorbike' | 'scooter_ev' | 'bicycle' | 'car'>(
    vehicleData.vehicleType || 'scooter_ev'
  );
  const [brandModel, setBrandModel] = useState(vehicleData.brandModel || '');
  const [plateNumber, setPlateNumber] = useState(vehicleData.plateNumber || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!plateNumber) return;

    updateVehicleData({ vehicleType, brandModel, plateNumber });
    submitForAccountReview();
    navigate('/rider/account-review');
  };

  return (
    <div className="min-h-screen bg-[#F3F0E8] flex flex-col text-left py-4 sm:py-8 px-4 sm:px-6 selection:bg-[#D7F04A] selection:text-[#141518]">
      <div className="max-w-6xl mx-auto w-full space-y-6 my-auto">
        <VerificationStepper currentStep="vehicle" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left Panel */}
          <div className="hidden lg:flex lg:col-span-5 bg-[#141518] text-[#FAF8F5] border border-[#141518] shadow-[6px_6px_0px_#141518] p-8 flex-col justify-between space-y-8">
            <div className="space-y-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#D7F04A] text-[#141518] border border-[#141518] text-[10px] font-mono font-black uppercase tracking-widest shadow-[2px_2px_0px_#D7F04A]">
                <Zap size={11} className="fill-[#141518]" /> FLEET ONBOARDING & RC
              </span>
              <h2 className="text-3xl font-heading font-black leading-tight uppercase tracking-tight text-white">
                VESSEL SPECIFICATION & GREEN INCENTIVES
              </h2>
              <p className="text-xs text-[#B0B1B6] leading-relaxed font-sans">
                Feasto welcomes electric two-wheelers, fuel motorcycles, cargo bicycles, and four-wheelers. EV partners
                automatically unlock the Green Delivery Surge Tier (+₹15 extra on every completed drop).
              </p>
            </div>

            <div className="space-y-2.5 font-mono text-xs text-[#FAF8F5]">
              <div className="p-3 bg-[#1E2025] border border-[#2B2E36] flex items-center gap-2.5">
                <span className="text-[#D7F04A] font-black">⚡</span>
                <span>EV Green Fleet Bonus: Extra ₹15 / Trip Automatic Credit</span>
              </div>
              <div className="p-3 bg-[#1E2025] border border-[#2B2E36] flex items-center gap-2.5">
                <span className="text-[#D7F04A] font-black">✓</span>
                <span>Automated Parivahan Registration Certificate (RC) Check</span>
              </div>
            </div>

            <div className="pt-4 border-t border-[#2B2E36] flex items-center justify-between text-[11px] font-mono text-[#8E929C]">
              <span>FLEET CODE: FEASTO-IND</span>
              <span>FAST-TRACK DISPATCH</span>
            </div>
          </div>

          {/* Right Form Card */}
          <div className="lg:col-span-7 bg-[#FAF8F5] p-6 sm:p-8 border border-[#141518] shadow-[6px_6px_0px_#141518] space-y-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <RiderPageHeader
                title="Vehicle Specifications & RC Plate"
                subtitle="Step 5 of 6: Register your delivery vehicle class, model, and registration plate."
              />

              <div className="space-y-1.5 text-xs">
                <label className="text-[11px] font-mono font-bold tracking-wider uppercase text-[#141518] block">
                  Vehicle Category *
                </label>
                <select
                  value={vehicleType}
                  onChange={(e) => setVehicleType(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#141518] text-xs font-mono font-bold text-[#141518] focus:outline-none focus:ring-1 focus:ring-[#141518] shadow-[2px_2px_0px_#141518]"
                >
                  <option value="scooter_ev">EV Scooter / Electric Vehicle (+₹15 Green Surge Tier)</option>
                  <option value="motorbike">Petrol Motorcycle / Standard Commuter</option>
                  <option value="bicycle">Bicycle (Hyper-local 1-2 km Deliveries)</option>
                  <option value="car">Delivery Van / Four-Wheeler Cargo</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <RiderInput
                  label="Make & Model Name *"
                  required
                  value={brandModel}
                  onChange={(e) => setBrandModel(e.target.value)}
                  placeholder="e.g. Ather 450X / Hero Splendor"
                />

                <RiderInput
                  label="Registration RC Plate Number *"
                  required
                  value={plateNumber}
                  onChange={(e) => setPlateNumber(e.target.value)}
                  placeholder="MH 02 EV 4821"
                />
              </div>

              <div className="pt-2">
                <RiderButton variant="primary" size="lg" fullWidth type="submit">
                  SUBMIT DOSSIER FOR ONBOARDING REVIEW →
                </RiderButton>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiderVehicleVerifyPage;
