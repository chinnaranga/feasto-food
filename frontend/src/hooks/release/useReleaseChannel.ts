import { useReleaseStore } from '../../store/release/releaseStore';

export const useReleaseChannel = () => {
  const channel = useReleaseStore((state) => state.metadata.buildChannel);
  
  return {
    channel,
    isProduction: channel === 'production',
    isStaging: channel === 'staging',
    isPreview: channel === 'preview',
    isDevelopment: channel === 'development',
  };
};
export default useReleaseChannel;
