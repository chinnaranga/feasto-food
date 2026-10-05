import { useReleaseStore } from '../../store/release/releaseStore';
import { EnvValidationResult } from '../../types/release';

export const useEnvironmentReadiness = (): EnvValidationResult => {
  return useReleaseStore((state) => state.envValidation);
};
export default useEnvironmentReadiness;
