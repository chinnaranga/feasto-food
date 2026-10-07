import React, { useState } from 'react';
import { Settings, Navigation, Bell } from 'lucide-react';
import { RiderPageHeader, RiderButton } from '../components/RiderUIComponents';

export const RiderSettingsPage: React.FC = () => {
  const [navApp, setNavApp] = useState('google_maps');
  const [soundAlerts, setSoundAlerts] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-4 text-left font-mono">
      <RiderPageHeader
        title="VESSEL APPLICATION CONFIGURATION"
        subtitle="Configure turn-by-turn navigation engine, acoustic dispatch alerts, and telemetry."
      />

      <div className="p-5 bg-[#FAF8F5] border border-[#141518] shadow-[4px_4px_0px_#141518] space-y-4 font-mono">
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-bold uppercase tracking-wider text-[#141518] block text-[11px]">
              DEFAULT GPS TURN-BY-TURN ENGINE
            </label>
            <select
              value={navApp}
              onChange={(e) => setNavApp(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#141518] font-bold text-[#141518] text-xs focus:outline-none shadow-[2px_2px_0px_#141518]"
            >
              <option value="google_maps">Feasto Integrated Real OSM + Google Maps</option>
              <option value="waze">Waze Live Traffic Telemetry</option>
              <option value="apple_maps">Apple Maps Navigation</option>
            </select>
          </div>

          <div className="flex items-center justify-between py-3 border-y border-[#141518]/15">
            <div>
              <span className="font-bold uppercase text-[#141518] block">ACOUSTIC RADAR DISPATCH TONE</span>
              <span className="text-[11px] text-[#55565B] block font-sans">
                Emit high-gain alert chime when high-surge delivery offers enter your radial zone.
              </span>
            </div>
            <input
              type="checkbox"
              checked={soundAlerts}
              onChange={(e) => setSoundAlerts(e.target.checked)}
              className="w-4 h-4 accent-[#141518] cursor-pointer"
            />
          </div>

          <div className="pt-2 flex items-center gap-3">
            <RiderButton variant="primary" type="submit">
              COMMIT CONFIGURATION →
            </RiderButton>
            {saved && (
              <span className="text-xs font-mono font-bold px-2 py-1 bg-[#D7F04A] text-[#141518] border border-[#141518]">
                ✓ CONFIG COMMITTED
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default RiderSettingsPage;
