import { useReleaseStore } from '../../store/release/releaseStore';
import { BuildMetadata } from '../../types/release';

export const useBuildMetadata = (): BuildMetadata => {
  return useReleaseStore((state) => state.metadata);
};
export default useBuildMetadata;
