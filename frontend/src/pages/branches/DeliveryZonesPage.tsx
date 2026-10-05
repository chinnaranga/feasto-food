import React, { useState } from 'react';
import { Compass, Plus } from 'lucide-react';
import usePortalBranchesStore from '../../store/portal/portalBranchesStore';
import { DeliveryZoneCard, BranchEmptyState } from './BranchComponents';

export const DeliveryZonesPage: React.FC = () => {
  const { branches, selectedBranchId, deliveryZones, addDeliveryZone, toggleZoneStatus, deleteDeliveryZone } =
    usePortalBranchesStore();

  const [showAddZoneModal, setShowAddZoneModal] = useState(false);
  const [zoneName, setZoneName] = useState('');
  const [radiusKm, setRadiusKm] = useState('4.0');
  const [pinCodesText, setPinCodesText] = useState('');
  const [minOrder, setMinOrder] = useState('250');
  const [deliveryFee, setDeliveryFee] = useState('35');

  const activeBranchId = selectedBranchId !== 'all' ? selectedBranchId : branches[0].id;
  const activeBranch = branches.find((b) => b.id === activeBranchId) || branches[0];

  const zones = deliveryZones.filter((z) => z.branchId === activeBranch.id);

  const handleAddZone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!zoneName) return;
    const pinCodes = pinCodesText
      ? pinCodesText.split(',').map((c) => c.trim())
      : [activeBranch.postalCode];

    addDeliveryZone({
      branchId: activeBranch.id,
      name: zoneName,
      radiusKm: Number(radiusKm) || 4.0,
      serviceablePinCodes: pinCodes,
      status: 'active',
      minOrderAmount: Number(minOrder) || 200,
      deliveryFee: Number(deliveryFee) || 30,
      estimatedDeliveryMins: Math.round((Number(radiusKm) || 4) * 6 + 10),
    });

    setZoneName('');
    setPinCodesText('');
    setShowAddZoneModal(false);
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header Bar */}
      <div className="p-6 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              🛵 Hyper-Local Delivery Radius Management
            </span>
          </div>
          <h3 className="text-base font-black text-neutral-900 font-heading">
            Delivery Zones for {activeBranch.name}
          </h3>
          <p className="text-xs text-neutral-500 max-w-xl leading-relaxed">
            Define Serviceable pincodes, maximum delivery kilometer radius, minimum order thresholds, and zone delivery fees.
          </p>
        </div>

        <button
          onClick={() => setShowAddZoneModal(true)}
          className="px-4 py-2 rounded-xl text-xs font-bold bg-[#e35205] hover:bg-[#c94804] text-white cursor-pointer flex items-center gap-1.5 transition-colors shadow-3xs shrink-0"
        >
          <Plus size={13} />
          <span>Add Delivery Zone</span>
        </button>
      </div>

      {/* Zones Grid */}
      {zones.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {zones.map((z) => (
            <DeliveryZoneCard
              key={z.id}
              zone={z}
              onToggleStatus={toggleZoneStatus}
              onDelete={deleteDeliveryZone}
            />
          ))}
        </div>
      ) : (
        <BranchEmptyState
          title="No Delivery Zones Configured"
          description="Create your first hyper-local delivery zone radius for this branch."
          actionLabel="Add Delivery Zone"
          onAction={() => setShowAddZoneModal(true)}
        />
      )}

      {/* Add Zone Modal */}
      {showAddZoneModal && (
        <div className="fixed inset-0 z-[1000] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleAddZone}
            className="bg-white border border-neutral-200 p-6 rounded-2xl shadow-modal max-w-md w-full text-left space-y-4"
          >
            <h3 className="text-base font-black text-neutral-900 font-heading">Create New Delivery Zone</h3>

            <div className="space-y-1">
              <label className="text-xs font-bold text-neutral-700 block">Zone Name Label</label>
              <input
                type="text"
                required
                value={zoneName}
                onChange={(e) => setZoneName(e.target.value)}
                placeholder="e.g. Bandra West & Pali Hill Zone"
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs focus:outline-none focus:border-neutral-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-neutral-700 block">Max Radius (km)</label>
                <input
                  type="number"
                  step="0.5"
                  value={radiusKm}
                  onChange={(e) => setRadiusKm(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl font-mono focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-neutral-700 block">Min Order (₹)</label>
                <input
                  type="number"
                  value={minOrder}
                  onChange={(e) => setMinOrder(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl font-mono focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1 text-xs">
              <label className="font-bold text-neutral-700 block">Serviceable Pincodes (Comma Separated)</label>
              <input
                type="text"
                value={pinCodesText}
                onChange={(e) => setPinCodesText(e.target.value)}
                placeholder="400050, 400052, 400054"
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl font-mono focus:outline-none"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2 text-xs font-bold">
              <button
                type="button"
                onClick={() => setShowAddZoneModal(false)}
                className="px-4 py-2 bg-neutral-100 text-neutral-600 rounded-xl hover:bg-neutral-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#e35205] text-white rounded-xl hover:bg-[#c94804] cursor-pointer shadow-3xs"
              >
                Save Delivery Zone
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default DeliveryZonesPage;
