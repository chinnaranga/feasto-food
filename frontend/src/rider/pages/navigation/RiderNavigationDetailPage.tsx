import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import useRiderNavigationStore from '../../store/useRiderNavigationStore';
import { LiveMapCard, NextTurnCard } from '../../components/navigation/RiderNavigationComponents';
import { RiderPageHeader } from '../../components/RiderUIComponents';

export const RiderNavigationDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { routeSummary, instructions, currentInstructionIndex, advanceInstruction, recenterMap, triggerReroute } =
    useRiderNavigationStore();

  const currentInstruction = instructions[currentInstructionIndex] || instructions[0];

  return (
    <div className="space-y-4 text-left">
      <div className="flex items-center gap-2">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-neutral-100 text-neutral-600">
          <ArrowLeft size={18} />
        </button>
        <RiderPageHeader title={`Live Navigation ${routeSummary.orderNumber}`} subtitle={`Order ID: ${id || routeSummary.orderId}`} />
      </div>

      <LiveMapCard routeSummary={routeSummary} onRecenter={recenterMap} onReroute={triggerReroute} />
      <NextTurnCard instruction={currentInstruction} onAdvance={advanceInstruction} />
    </div>
  );
};

export default RiderNavigationDetailPage;
