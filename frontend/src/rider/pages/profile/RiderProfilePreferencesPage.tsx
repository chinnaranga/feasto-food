import React, { useState } from 'react';
import useRiderProfileStore from '../../store/useRiderProfileStore';
import { RiderButton, RiderPageHeader } from '../../components/RiderUIComponents';

export const RiderProfilePreferencesPage: React.FC = () => {
  const { deliveryPreferences, updateDeliveryPreferences } = useRiderProfileStore();

  const [food, setFood] = useState(deliveryPreferences.acceptFoodDelivery);
  const [pickup, setPickup] = useState(deliveryPreferences.acceptPickupHandoff);
  const [priority, setPriority] = useState(deliveryPreferences.acceptPriorityOrders);
  const [large, setLarge] = useState(deliveryPreferences.acceptLargeOrders);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateDeliveryPreferences({
      acceptFoodDelivery: food,
      acceptPickupHandoff: pickup,
      acceptPriorityOrders: priority,
      acceptLargeOrders: large,
    });
  };

  return (
    <div className="space-y-4 text-left">
      <RiderPageHeader title="Delivery Order Preferences" subtitle="Configure order types and customer contact preferences." />

      <form onSubmit={handleSubmit} className="p-5 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs space-y-4 text-xs">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <strong className="font-bold text-neutral-800 block">Food & Beverage Deliveries</strong>
              <span className="text-[11px] text-neutral-500 block">Standard restaurant to diner orders.</span>
            </div>
            <input type="checkbox" checked={food} onChange={(e) => setFood(e.target.checked)} className="w-4 h-4 text-[#e35205] cursor-pointer" />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <strong className="font-bold text-neutral-800 block">Merchant Pickup Handoff</strong>
              <span className="text-[11px] text-neutral-500 block">Store-to-courier Hub transfers.</span>
            </div>
            <input type="checkbox" checked={pickup} onChange={(e) => setPickup(e.target.checked)} className="w-4 h-4 text-[#e35205] cursor-pointer" />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <strong className="font-bold text-neutral-800 block">Priority Surge Orders</strong>
              <span className="text-[11px] text-neutral-500 block">Express high-payout priority deliveries.</span>
            </div>
            <input type="checkbox" checked={priority} onChange={(e) => setPriority(e.target.checked)} className="w-4 h-4 text-[#e35205] cursor-pointer" />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <strong className="font-bold text-neutral-800 block">Catering & Large Catering Orders</strong>
              <span className="text-[11px] text-neutral-500 block">Bulk orders requiring larger thermal bag capacity.</span>
            </div>
            <input type="checkbox" checked={large} onChange={(e) => setLarge(e.target.checked)} className="w-4 h-4 text-[#e35205] cursor-pointer" />
          </div>
        </div>

        <RiderButton variant="primary" type="submit" fullWidth>
          Save Order Preferences
        </RiderButton>
      </form>
    </div>
  );
};

export default RiderProfilePreferencesPage;
