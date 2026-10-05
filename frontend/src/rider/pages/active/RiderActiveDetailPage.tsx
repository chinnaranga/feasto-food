import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import useRiderActiveStore from '../../store/useRiderActiveStore';
import { DeliveryFocusCard } from '../../components/active/RiderActiveComponents';
import { RiderPageHeader } from '../../components/RiderUIComponents';

export const RiderActiveDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { activeTask, advanceStage } = useRiderActiveStore();

  if (!activeTask) {
    return <div className="p-8 text-center text-xs text-neutral-500">No active delivery task found for ID: {id}</div>;
  }

  return (
    <div className="space-y-4 text-left">
      <div className="flex items-center gap-2">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-neutral-100 text-neutral-600">
          <ArrowLeft size={18} />
        </button>
        <RiderPageHeader title={`Active Order Detail ${activeTask.orderNumber}`} subtitle={activeTask.restaurantName} />
      </div>

      <DeliveryFocusCard task={activeTask} onAdvance={advanceStage} />
    </div>
  );
};

export default RiderActiveDetailPage;
