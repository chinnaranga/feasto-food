import { MANDATORY_ENV_KEYS, OPTIONAL_ENV_KEYS } from '../../constants/release';

export const deploymentSchema = {
  getMandatoryKeys: () => MANDATORY_ENV_KEYS,
  getOptionalKeys: () => OPTIONAL_ENV_KEYS,
};
export default deploymentSchema;
