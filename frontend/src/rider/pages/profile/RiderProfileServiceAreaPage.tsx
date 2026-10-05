import React, { useState } from 'react';
import useRiderProfileStore from '../../store/useRiderProfileStore';
import { RiderButton, RiderPageHeader } from '../../components/RiderUIComponents';

export const RiderProfileServiceAreaPage: React.FC = () => {
  const { serviceArea, updateServiceArea } = useRiderProfileStore();

  const [primaryZone, setPrimaryZone] = useState(serviceArea.primaryZone);
  const [preferNearHome, setPreferNearHome] = useState(serviceArea.preferNearHome);
  const [radiusKm, setRadiusKm] = useState(serviceArea.maxDeliveryRadiusKm);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateServiceArea({
      primaryZone,
      preferNearHome,
      maxDeliveryRadiusKm: Number(radiusKm),
    });
  };

  return (
    <div className="space-y-4 text-left">
      <RiderPageHeader title="Service Area Preferences" subtitle="Select delivery operational zones and trip distance limits." />

      <form onSubmit={handleSubmit} className="p-5 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs space-y-4">
        <div className="space-y-1 text-xs">
          <label className="font-bold text-neutral-700 block">Primary Delivery Operational Zone</label>
          <select
            value={primaryZone}
            onChange={(e) => setPrimaryZone(e.target.value)}
            className="w-full px-3 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl font-bold text-neutral-900 focus:outline-none"
          >
            <option value="Bandra West & Khar Zone">Bandra West & Khar Zone (Mumbai)</option>
            <option value="Juhu & Vile Parle">Juhu & Vile Parle (Mumbai)</option>
            <option value="Indiranagar & Koramangala">Indiranagar & Koramangala (Bengaluru)</option>
            <option value="Connaught Place & CP">Connaught Place & CP (New Delhi)</option>
          </select>
        </div>

        <div className="flex items-center justify-between py-2 border-y border-neutral-100 text-xs">
          <div>
            <strong className="font-bold text-neutral-800 block">Prefer Near-Home Deliveries</strong>
            <span className="text-[11px] text-neutral-500 block">Prioritize trip offers that end close to your residential area.</span>
          </div>
          <input
            type="checkbox"
            checked={preferNearHome}
            onChange={(e) => setPreferNearHome(e.target.checked)}
            className="w-4 h-4 text-[#e35205] cursor-pointer"
          />
        </div>

        <div className="space-y-1 text-xs">
          <label className="font-bold text-neutral-700 block">Max Delivery Radius (Km)</label>
          <input
            type="number"
            value={radiusKm}
            onChange={(e) => setRadiusKm(Number(e.target.value))}
            className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-900 font-mono font-bold focus:outline-none"
          />
        </div>

        <RiderButton variant="primary" type="submit" fullWidth>
          Save Service Area Preferences
        </RiderButton>
      </form>
    </div>
  );
};

export default RiderProfileServiceAreaPage;
