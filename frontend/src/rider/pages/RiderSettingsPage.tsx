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
    <div className="space-y-4 text-left">
      <RiderPageHeader title="App Preferences" subtitle="Configure navigation map app, audio alert alerts, and auto-accept options." />

      <div className="p-5 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs space-y-4">
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-bold text-neutral-800 block">Default Navigation Map App</label>
            <select
              value={navApp}
              onChange={(e) => setNavApp(e.target.value)}
              className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl font-bold text-neutral-800 focus:outline-none"
            >
              <option value="google_maps">Google Maps Navigation</option>
              <option value="waze">Waze Live Traffic</option>
              <option value="apple_maps">Apple Maps</option>
            </select>
          </div>

          <div className="flex items-center justify-between py-2 border-y border-neutral-100">
            <div>
              <span className="font-bold text-neutral-800 block">Loud Audio Alert Notifications</span>
              <span className="text-[11px] text-neutral-500 block">Play loud alert tone when receiving new delivery offers.</span>
            </div>
            <input
              type="checkbox"
              checked={soundAlerts}
              onChange={(e) => setSoundAlerts(e.target.checked)}
              className="w-4 h-4 text-[#e35205] cursor-pointer"
            />
          </div>

          <div className="pt-2 flex items-center gap-3">
            <RiderButton variant="primary" type="submit">
              Save Preferences
            </RiderButton>
            {saved && <span className="text-xs font-bold text-emerald-600">✓ Saved</span>}
          </div>
        </form>
      </div>
    </div>
  );
};

export default RiderSettingsPage;
