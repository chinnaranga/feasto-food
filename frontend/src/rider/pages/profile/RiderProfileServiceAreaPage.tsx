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
    <div className="space-y-4 text-left font-mono">
      <RiderPageHeader
        title="SERVICE AREA & DISPATCH RADIUS"
        subtitle="Configure primary operational sectors and radial limit preferences."
      />

      <form
        onSubmit={handleSubmit}
        className="p-5 bg-[#FAF8F5] border border-[#141518] shadow-[4px_4px_0px_#141518] space-y-4 font-mono"
      >
        <div className="space-y-1.5 text-xs">
          <label className="font-bold uppercase tracking-wider text-[#141518] block text-[11px]">
            PRIMARY DISPATCH SECTOR
          </label>
          <select
            value={primaryZone}
            onChange={(e) => setPrimaryZone(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#141518] text-xs font-mono font-bold text-[#141518] focus:outline-none shadow-[2px_2px_0px_#141518]"
          >
            <option value="Bandra West & Khar Zone">Bandra West & Khar Zone (Mumbai Metro)</option>
            <option value="Juhu & Vile Parle">Juhu & Vile Parle (Mumbai Metro)</option>
            <option value="Indiranagar & Koramangala">Indiranagar & Koramangala (Bengaluru Metro)</option>
            <option value="Connaught Place & CP">Connaught Place & CP (New Delhi Metro)</option>
          </select>
        </div>

        <div className="flex items-center justify-between py-3 border-y border-[#141518]/15 text-xs">
          <div>
            <strong className="font-bold text-[#141518] uppercase block">PREFER HOMEWARD TRIPS</strong>
            <span className="text-[11px] text-[#55565B] block font-sans">
              Prioritize final shift dispatches ending near your base residence.
            </span>
          </div>
          <input
            type="checkbox"
            checked={preferNearHome}
            onChange={(e) => setPreferNearHome(e.target.checked)}
            className="w-4 h-4 accent-[#141518] cursor-pointer"
          />
        </div>

        <div className="space-y-1.5 text-xs">
          <label className="font-bold uppercase tracking-wider text-[#141518] block text-[11px]">
            MAX RADIAL DELIVERY DISTANCE (KM)
          </label>
          <input
            type="number"
            value={radiusKm}
            onChange={(e) => setRadiusKm(Number(e.target.value))}
            className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#141518] text-xs font-mono font-bold text-[#141518] focus:outline-none shadow-[2px_2px_0px_#141518]"
          />
        </div>

        <div className="pt-2">
          <RiderButton variant="primary" type="submit" fullWidth>
            COMMIT SERVICE AREA CONFIGURATION →
          </RiderButton>
        </div>
      </form>
    </div>
  );
};

export default RiderProfileServiceAreaPage;
