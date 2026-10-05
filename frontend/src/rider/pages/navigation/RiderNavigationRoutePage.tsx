import React from 'react';
import { MapPin, Navigation, CheckCircle2 } from 'lucide-react';
import useRiderNavigationStore from '../../store/useRiderNavigationStore';
import { TurnIcon } from '../../components/navigation/RiderNavigationComponents';
import { RiderPageHeader } from '../../components/RiderUIComponents';

export const RiderNavigationRoutePage: React.FC = () => {
  const { instructions, currentInstructionIndex } = useRiderNavigationStore();

  return (
    <div className="space-y-4 text-left">
      <RiderPageHeader title="Route Waypoints & Turn List" subtitle="Turn-by-turn instruction sequence for current trip." />

      <div className="p-5 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs space-y-3 text-xs">
        <h4 className="text-xs font-black uppercase text-neutral-900 font-heading">Complete Turn Sequence</h4>
        <div className="space-y-2">
          {instructions.map((inst, idx) => {
            const isCurrent = idx === currentInstructionIndex;
            const isDone = idx < currentInstructionIndex;

            return (
              <div
                key={inst.id}
                className={`p-3 rounded-xl border flex items-start gap-3 transition-colors ${
                  isCurrent
                    ? 'bg-emerald-50 border-emerald-300 font-bold text-neutral-900 shadow-3xs'
                    : isDone
                    ? 'bg-neutral-50 border-neutral-200 text-neutral-400'
                    : 'bg-white border-neutral-200 text-neutral-800'
                }`}
              >
                <div className="p-2 rounded-lg bg-white border border-neutral-200 shrink-0">
                  <TurnIcon direction={inst.direction} size={16} />
                </div>

                <div className="space-y-0.5 flex-1">
                  <div className="flex items-center justify-between">
                    <strong className="block">{inst.streetName}</strong>
                    <span className="text-[10px] font-mono text-neutral-400">{inst.distanceMeters}m</span>
                  </div>
                  {inst.landmarkNote && <p className="text-[11px] text-neutral-500 font-normal">{inst.landmarkNote}</p>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RiderNavigationRoutePage;
