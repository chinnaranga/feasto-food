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
    <div className="space-y-4 text-left font-mono">
      <RiderPageHeader
        title="DISPATCH ORDER PREFERENCES"
        subtitle="Configure accepted dispatch categories, cargo sizes, and priority matching."
      />

      <form
        onSubmit={handleSubmit}
        className="p-5 bg-[#FAF8F5] border border-[#141518] shadow-[4px_4px_0px_#141518] space-y-4 text-xs font-mono"
      >
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-[#F3F0E8] border border-[#141518]">
            <div>
              <strong className="font-bold text-[#141518] uppercase block">
                FOOD & BEVERAGE DISPATCH
              </strong>
              <span className="text-[11px] text-[#55565B] block font-sans">
                Standard gourmet restaurant to diner orders.
              </span>
            </div>
            <input
              type="checkbox"
              checked={food}
              onChange={(e) => setFood(e.target.checked)}
              className="w-4 h-4 accent-[#141518] cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-[#F3F0E8] border border-[#141518]">
            <div>
              <strong className="font-bold text-[#141518] uppercase block">
                MERCHANT PICKUP HANDOFF
              </strong>
              <span className="text-[11px] text-[#55565B] block font-sans">
                Store-to-courier hub transfer routes.
              </span>
            </div>
            <input
              type="checkbox"
              checked={pickup}
              onChange={(e) => setPickup(e.target.checked)}
              className="w-4 h-4 accent-[#141518] cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-[#F3F0E8] border border-[#141518]">
            <div>
              <strong className="font-bold text-[#141518] uppercase block">
                PRIORITY SURGE MISSIONS
              </strong>
              <span className="text-[11px] text-[#55565B] block font-sans">
                Express high-payout priority surge deliveries.
              </span>
            </div>
            <input
              type="checkbox"
              checked={priority}
              onChange={(e) => setPriority(e.target.checked)}
              className="w-4 h-4 accent-[#141518] cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-[#F3F0E8] border border-[#141518]">
            <div>
              <strong className="font-bold text-[#141518] uppercase block">
                BULK CATERING CARGO
              </strong>
              <span className="text-[11px] text-[#55565B] block font-sans">
                Large catering orders requiring max bag volume.
              </span>
            </div>
            <input
              type="checkbox"
              checked={large}
              onChange={(e) => setLarge(e.target.checked)}
              className="w-4 h-4 accent-[#141518] cursor-pointer"
            />
          </div>
        </div>

        <div className="pt-2">
          <RiderButton variant="primary" type="submit" fullWidth>
            SAVE DISPATCH PREFERENCES →
          </RiderButton>
        </div>
      </form>
    </div>
  );
};

export default RiderProfilePreferencesPage;
