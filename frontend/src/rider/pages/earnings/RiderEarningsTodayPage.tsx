import React from 'react';
import {
  Wallet,
  TrendingUp,
  CreditCard,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  DollarSign,
  ArrowUpRight,
} from 'lucide-react';
import useRiderEarningsStore from '../../store/useRiderEarningsStore';
import {
  FeastoEditorialHeading,
  FeastoOperationalStatement,
  FeastoSectionHeader,
  FeastoMetric,
  FeastoButton,
} from '@/components/design-system';

export const RiderEarningsTodayPage: React.FC = () => {
  const { summary, wallet, trips, setTransferModalOpen } = useRiderEarningsStore();

  const weeklyTotal = summary.weeklyTotal || 4280;

  return (
    <div className="w-full space-y-8 text-left select-none text-[#F3F0E8]">
      {/* ── 01. SECTION HEADER ── */}
      <FeastoSectionHeader
        index="03"
        title="FEASTO COURIER SETTLEMENTS"
        subtitle="Transparent delivery compensation: base trip rates, 100% direct guest tips, and surge peak incentives."
        dark
        rightElement={
          <FeastoButton
            variant="acid"
            size="md"
            icon={<CreditCard size={13} />}
            onClick={() => setTransferModalOpen(true)}
          >
            SETTLE TO BANK (₹{wallet.availableBalance.toFixed(0)}) →
          </FeastoButton>
        }
      />

      {/* ── 02. "YOUR WEEK" MASSIVE EDITORIAL STATEMENT ── */}
      <div className="p-6 sm:p-8 bg-[#14161B] border border-white/10 space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/10">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-widest text-[#D7F04A] block">
              YOUR WEEK AT A GLANCE
            </span>
            <div className="font-heading font-black text-4xl sm:text-6xl text-white tracking-tight leading-none mt-2">
              ₹{weeklyTotal.toLocaleString('en-IN')}
            </div>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs">
            <span className="px-2.5 py-1 bg-[#15803D]/20 text-[#D7F04A] border border-[#D7F04A]/30 font-bold">
              ↑ +18.4% VS LAST WEEK
            </span>
            <span className="text-[#8E929C]">{summary.completedTripsCount || 34} drops completed</span>
          </div>
        </div>

        {/* Breakdown Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          <FeastoMetric
            index="01"
            label="TODAY'S SHIFT"
            value={`₹${summary.todayTotal.toFixed(0)}`}
            subtitle="7 completed trips"
            dark
            highlight
          />

          <FeastoMetric
            index="02"
            label="BASE TRIP DISTANCE"
            value={`₹${summary.basePayTotal}`}
            subtitle="Fixed per-km telemetry"
            dark
          />

          <FeastoMetric
            index="03"
            label="CUSTOMER TIPS"
            value={`₹${summary.customerTipsTotal}`}
            delta={{ value: '100% DIRECT', positive: true }}
            subtitle="Zero platform cut"
            dark
          />

          <FeastoMetric
            index="04"
            label="PEAK SURGE BONUSES"
            value={`₹${summary.surgeBonusTotal}`}
            delta={{ value: 'BANDRA ZONE', neutral: true }}
            subtitle="1.4x dinner surge"
            dark
          />
        </div>
      </div>

      {/* ── 03. COMPLETED DELIVERIES ARCHIVE STREAM ── */}
      <div className="p-6 bg-[#14161B] border border-white/10 space-y-4">
        <div className="pb-3 border-b border-white/10 flex items-center justify-between">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-widest text-[#8E929C] block">
              ITEMIZED DISPATCHES
            </span>
            <h3 className="font-heading font-black text-lg uppercase text-white">
              Shift Trip History
            </h3>
          </div>
          <span className="font-mono text-xs text-[#8E929C]">Direct bank credit ready</span>
        </div>

        <div className="divide-y divide-white/5 font-mono text-xs">
          {trips.length > 0 ? (
            trips.map((trip) => (
              <div key={trip.id} className="py-3.5 flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">#{trip.orderNumber}</span>
                    <span className="text-[#8E929C]">·</span>
                    <span className="text-white font-heading font-bold">{trip.restaurantName}</span>
                  </div>
                  <div className="text-[11px] text-[#8E929C] flex items-center gap-3">
                    {trip.distanceKm ? <span>{trip.distanceKm} km</span> : <span>₹{trip.distancePay} dist</span>}
                    {trip.durationMinutes ? <span>{trip.durationMinutes} mins</span> : <span>{trip.timestamp}</span>}
                    {trip.customerArea && <span>Drop: {trip.customerArea}</span>}
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-black text-sm text-[#D7F04A] block">
                    +₹{trip.netPay ?? ((trip.payoutAmount ?? (trip.basePay + trip.distancePay)) + trip.tipAmount)}
                  </span>
                  <span className="text-[10px] text-[#8E929C]">
                    Base ₹{trip.basePay + trip.distancePay} + Tip ₹{trip.tipAmount}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="py-8 text-center text-[#8E929C] font-mono text-xs">
              No trips logged in current shift.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RiderEarningsTodayPage;
