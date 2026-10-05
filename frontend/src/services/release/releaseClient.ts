import { buildMetadata } from './buildMetadata';
import { validateEnvironment } from '../../utils/release/validateEnvironment';
import { verifyDeployment } from '../../utils/release/verifyDeployment';

export const releaseClient = {
  getBuildMetadata: () => buildMetadata,
  validateEnvironment: () => validateEnvironment(),
  verifyDeployment: () => verifyDeployment(),
};
export default releaseClient;
