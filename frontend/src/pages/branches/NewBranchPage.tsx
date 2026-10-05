import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Store, MapPin, Users, CheckCircle2, ArrowRight } from 'lucide-react';
import usePortalBranchesStore from '../../store/portal/portalBranchesStore';

export const NewBranchPage: React.FC = () => {
  const navigate = useNavigate();
  const { addBranch } = usePortalBranchesStore();

  const [name, setName] = useState('');
  const [region, setRegion] = useState('Maharashtra West');
  const [city, setCity] = useState('Mumbai');
  const [address, setAddress] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [managerName, setManagerName] = useState('');
  const [managerEmail, setManagerEmail] = useState('');
  const [seatingCapacity, setSeatingCapacity] = useState('80');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !city || !address) return;

    addBranch({
      name,
      region,
      city,
      address,
      postalCode,
      phone: phone || '+91 98000 00000',
      email: email || `${name.toLowerCase().replace(/\s+/g, '')}@feasto.food`,
      managerName: managerName || 'Unassigned Manager',
      managerEmail: managerEmail || 'manager@feasto.food',
      timezone: 'Asia/Kolkata (IST)',
      currency: 'INR (₹)',
      status: 'launching',
      operationalStatus: 'closed',
      seatingCapacity: Number(seatingCapacity) || 60,
      hasKitchenDisplay: true,
      hasDeliveryDispatch: true,
      hasSelfOrderingKiosk: false,
    });

    navigate('/restaurant/branches/directory');
  };

  return (
    <div className="space-y-6 text-left max-w-2xl mx-auto">
      <div className="p-6 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs space-y-6">
        <div className="space-y-1 border-b border-neutral-100 pb-4">
          <h3 className="text-base font-black text-neutral-900 font-heading">
            Onboard New Restaurant Outlet Branch
          </h3>
          <p className="text-xs text-neutral-500 leading-relaxed">
            Register a new location identity, manager assignment, postal address, and seating capacity.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-bold text-neutral-800 block">Branch Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Powai Tech Park Outlet"
              className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl font-medium text-neutral-900 focus:outline-none focus:border-neutral-400"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-neutral-800 block">Region *</label>
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl font-bold text-neutral-800 focus:outline-none"
              >
                <option value="Maharashtra West">Maharashtra West</option>
                <option value="Delhi NCR">Delhi NCR</option>
                <option value="Karnataka South">Karnataka South</option>
                <option value="Telangana Central">Telangana Central</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-neutral-800 block">City *</label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Mumbai"
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl font-medium text-neutral-900 focus:outline-none focus:border-neutral-400"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-neutral-800 block">Physical Street Address *</label>
            <input
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Full street location address..."
              className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl font-medium text-neutral-900 focus:outline-none focus:border-neutral-400"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-neutral-800 block">Postal Pincode</label>
              <input
                type="text"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                placeholder="400076"
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl font-mono text-neutral-900 focus:outline-none focus:border-neutral-400"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-neutral-800 block">Seating Capacity</label>
              <input
                type="number"
                value={seatingCapacity}
                onChange={(e) => setSeatingCapacity(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl font-mono text-neutral-900 focus:outline-none focus:border-neutral-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="space-y-1">
              <label className="font-bold text-neutral-800 block">Branch Manager Name</label>
              <input
                type="text"
                value={managerName}
                onChange={(e) => setManagerName(e.target.value)}
                placeholder="e.g. Vikram Mehta"
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl font-medium text-neutral-900 focus:outline-none focus:border-neutral-400"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-neutral-800 block">Branch Contact Phone</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98000 11122"
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl font-mono text-neutral-900 focus:outline-none focus:border-neutral-400"
              />
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => navigate('/restaurant/branches/directory')}
              className="px-4 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold rounded-xl cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#e35205] hover:bg-[#c94804] text-white font-bold rounded-xl transition-colors cursor-pointer shadow-3xs flex items-center gap-1.5"
            >
              <span>Save & Register Branch</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewBranchPage;
