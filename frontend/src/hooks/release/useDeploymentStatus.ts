import { useReleaseStore } from '../../store/release/releaseStore';
import { ChecklistSummary } from '../../types/release';

export const useDeploymentStatus = (): ChecklistSummary => {
  return useReleaseStore((state) => state.deploymentSummary);
};
export default useDeploymentStatus;
