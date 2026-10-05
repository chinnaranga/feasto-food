import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bike, ShieldCheck, CheckCircle2 } from 'lucide-react';
import useRiderAuthStore from '../../store/useRiderAuthStore';
import { RiderButton, RiderInput, RiderPageHeader } from '../../components/RiderUIComponents';
import { VerificationStepper } from '../../components/auth/RiderAuthComponents';

export const RiderVehicleVerifyPage: React.FC = () => {
  const navigate = useNavigate();
  const { vehicleData, updateVehicleData, submitForAccountReview } = useRiderAuthStore();

  const [vehicleType, setVehicleType] = useState<'motorbike' | 'scooter_ev' | 'bicycle' | 'car'>(vehicleData.vehicleType || 'scooter_ev');
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
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col text-left py-4 sm:py-8 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto w-full space-y-6 my-auto">
        <VerificationStepper currentStep="vehicle" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left Panel */}
          <div className="hidden lg:flex lg:col-span-5 bg-neutral-900 text-white rounded-3xl p-8 flex-col justify-between space-y-8 shadow-xl">
            <div className="space-y-4">
              <span className="text-[10px] font-mono font-bold tracking-widest text-emerald-400 uppercase bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
                Vehicle Onboarding & Fleet
              </span>
              <h2 className="text-2xl font-black font-heading leading-tight">
                Vehicle Specifications & Registration
              </h2>
              <p className="text-xs text-neutral-300 leading-relaxed">
                Feasto supports electric scooters, petrol motorbikes, bicycles, and commercial four-wheelers with zero emission bonuses.
              </p>
            </div>

            <div className="space-y-3 font-mono text-xs text-neutral-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                <span>EV Green Fleet Bonus Eligibility (+₹15/trip)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                <span>Automated RC Plate Verification</span>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-neutral-400">
              <span>Fleet Operations</span>
              <span>Fast Track Approval</span>
            </div>
          </div>

          {/* Right Form Card */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200 shadow-modal space-y-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <RiderPageHeader
                title="Vehicle Specification & RC"
                subtitle="Step 5 of 5: Register vehicle category, plate number, and commercial details."
              />

              <div className="space-y-1 text-xs">
                <label className="font-bold text-neutral-700 block">Vehicle Category *</label>
                <select
                  value={vehicleType}
                  onChange={(e) => setVehicleType(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl font-bold text-neutral-900 focus:outline-none focus:border-neutral-400"
                >
                  <option value="scooter_ev">EV Scooter / Electric Vehicle (+Green Bonus)</option>
                  <option value="motorbike">Petrol Motorbike</option>
                  <option value="bicycle">Bicycle (Hyper-local 1-2 km)</option>
                  <option value="car">Four-Wheeler Car / Delivery Van</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <RiderInput
                  label="Make & Model Name *"
                  required
                  value={brandModel}
                  onChange={(e) => setBrandModel(e.target.value)}
                  placeholder="e.g. Ather 450X Apex / Hero Splendor"
                />

                <RiderInput
                  label="Registration License Plate Number *"
                  required
                  value={plateNumber}
                  onChange={(e) => setPlateNumber(e.target.value)}
                  placeholder="MH 02 EV 4821"
                />
              </div>

              <div className="pt-2">
                <RiderButton variant="primary" size="lg" fullWidth type="submit">
                  Submit Application for Onboarding Review →
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
