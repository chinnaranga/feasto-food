import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Check, 
  Clock, 
  MapPin, 
  Phone, 
  ShieldCheck, 
  Sparkles, 
  Bike, 
  Flame, 
  ChefHat, 
  Navigation
} from 'lucide-react';

interface TimelineStep {
  step: string;
  title: string;
  description: string;
  statusLabel: string;
  eta: string;
  icon: React.ReactNode;
}

const TIMELINE_STEPS: TimelineStep[] = [
  {
    step: '01',
    title: 'You describe the craving',
    description: 'Natural language input captures spice tolerance, calorie needs, and exact budget.',
    statusLabel: 'Intent Decoded',
    eta: '00:00',
    icon: <Sparkles size={18} />,
  },
  {
    step: '02',
    title: 'Feasto finds the right food',
    description: 'Vector scoring matches real kitchen prep times, table availability, and distance.',
    statusLabel: 'Kitchen Selected',
    eta: '01:10',
    icon: <Navigation size={18} />,
  },
  {
    step: '03',
    title: 'Kitchen starts cooking',
    description: 'Order hits chef terminal directly. Temperature-controlled prep begins fresh.',
    statusLabel: 'In the Wok / Oven',
    eta: '08:40',
    icon: <ChefHat size={18} />,
  },
  {
    step: '04',
    title: 'Rider picks it up',
    description: 'Courier stationed nearby arrives at the counter with insulated thermal pack.',
    statusLabel: 'Dispatched on Bike',
    eta: '16:20',
    icon: <Bike size={18} />,
  },
  {
    step: '05',
    title: 'You track it live',
    description: 'Sub-second GPS telemetry and contactless doorstep arrival notifications.',
    statusLabel: 'Arriving at Doorstep',
    eta: '22:15',
    icon: <MapPin size={18} />,
  },
];

export const DeliveryExperience: React.FC = () => {
  const [activeStepIndex, setActiveStepIndex] = useState(3);
  const activeStep = TIMELINE_STEPS[activeStepIndex];

  return (
    <section className="py-20 md:py-32 bg-[#08090D] border-t border-[#1F2232] select-none text-[#F4F5F7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-[#4FD1E8] mb-2 block">
            End-to-End Precision
          </span>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-[#F4F5F7] tracking-tight leading-[1.08] mb-4">
            From craving to doorstep.
          </h2>
          <p className="text-base sm:text-xl text-[#A7ACB8] font-normal leading-relaxed">
            Eliminating kitchen bottlenecks and blind courier waiting. Every handoff is timed down to the second.
          </p>
        </div>

        {/* 2-Column Layout: Timeline Steps & Interactive Live-Order Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left: 5-Step Timeline */}
          <div className="lg:col-span-6 space-y-3">
            {TIMELINE_STEPS.map((s, idx) => {
              const isActive = activeStepIndex === idx;
              return (
                <button
                  key={s.step}
                  type="button"
                  onClick={() => setActiveStepIndex(idx)}
                  className={`w-full text-left p-5 rounded-3xl border transition-all flex items-start gap-4 ${
                    isActive
                      ? 'bg-[#141720] border-[#6D5EF5] shadow-lg shadow-[#6D5EF5]/15 ring-1 ring-[#6D5EF5]'
                      : 'bg-[#101218]/80 border-[#1F2232] hover:bg-[#141720] hover:border-[#25293A]'
                  }`}
                >
                  <span
                    className={`font-black text-sm px-2.5 py-1 rounded-xl shrink-0 ${
                      isActive ? 'bg-[#6D5EF5] text-white' : 'bg-[#171923] text-[#A7ACB8] border border-[#25293A]'
                    }`}
                  >
                    {s.step}
                  </span>

                  <div className="flex-grow">
                    <div className="flex items-center justify-between">
                      <h3
                        className={`text-base font-bold ${
                          isActive ? 'text-[#F4F5F7] font-black' : 'text-[#A7ACB8]'
                        }`}
                      >
                        {s.title}
                      </h3>
                      {isActive && (
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#4FD1E8]">
                          Active Preview
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#A7ACB8] mt-1 leading-relaxed">
                      {s.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right: Realistic Miniature Live Order Interface Preview */}
          <div className="lg:col-span-6">
            <div className="bg-[#101218] border border-[#1F2232] rounded-3xl p-6 sm:p-8 shadow-2xl max-w-md mx-auto relative overflow-hidden">
              
              {/* Product Preview Notice Badge */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#1F2232]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#2DD4BF] animate-ping" />
                  <span className="text-xs font-bold text-[#F4F5F7]">Live Order Simulator</span>
                </div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#4FD1E8] bg-[#171923] border border-[#25293A] px-2 py-0.5 rounded-md">
                  Interactive Preview
                </span>
              </div>

              {/* Order Status Header */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-[11px] font-bold text-[#6F7480] uppercase tracking-wider">Estimated Doorstep Time</p>
                  <p className="text-3xl font-black text-[#F4F5F7] mt-0.5">18 - 22 mins</p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-[#171923] text-[#4FD1E8] border border-[#25293A] flex items-center justify-center font-bold">
                  {activeStep.icon}
                </div>
              </div>

              {/* Step Progress Bar */}
              <div className="w-full bg-[#171923] h-2 rounded-full overflow-hidden mb-6">
                <div
                  className="bg-gradient-to-r from-[#6D5EF5] to-[#4FD1E8] h-full transition-all duration-500"
                  style={{ width: `${((activeStepIndex + 1) / TIMELINE_STEPS.length) * 100}%` }}
                />
              </div>

              {/* Current Status Box */}
              <div className="bg-[#141720] rounded-2xl p-4 border border-[#1F2232] mb-6">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-[#6F7480]">Current Phase:</span>
                  <span className="font-extrabold text-[#4FD1E8]">{activeStep.statusLabel}</span>
                </div>
                <p className="text-xs text-[#A7ACB8] font-medium">
                  {activeStep.description}
                </p>
              </div>

              {/* Kitchen & Courier Details */}
              <div className="space-y-3 text-xs border-t border-[#1F2232] pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-[#6F7480] font-semibold">Kitchen:</span>
                  <span className="font-bold text-[#F4F5F7]">Spice Route (Banjara Hills)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#6F7480] font-semibold">Order Item:</span>
                  <span className="font-bold text-[#F4F5F7]">Hyderabadi Dum Biryani (x2)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#6F7480] font-semibold">Courier Partner:</span>
                  <span className="font-bold text-[#F4F5F7] flex items-center gap-1.5">
                    <Bike size={13} className="text-[#4FD1E8]" />
                    Suresh K. (4.95★, Thermal Bag #14)
                  </span>
                </div>
              </div>

              {/* Security & Temperature Verification */}
              <div className="mt-6 pt-4 border-t border-[#1F2232] flex items-center justify-between text-[11px] text-[#A7ACB8]">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck size={13} className="text-[#2DD4BF]" /> Tamper-evident seal
                </span>
                <span className="font-semibold text-[#F4F5F7]">Hyderabad Metro Zone</span>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
