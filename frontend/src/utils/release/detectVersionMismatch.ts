import { VERSION_KEY } from '../../constants/release';

export const detectVersionMismatch = (currentBuildVersion: string): boolean => {
  const cached = localStorage.getItem(VERSION_KEY);
  if (!cached) {
    // Initial launch registration
    localStorage.setItem(VERSION_KEY, currentBuildVersion);
    return false;
  }
  return cached !== currentBuildVersion;
};
export default detectVersionMismatch;
