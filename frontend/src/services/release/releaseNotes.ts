import { buildMetadata } from './buildMetadata';

export const releaseNotes = {
  getLatest: () => buildMetadata.releaseNotes,
  getHistory: () => [buildMetadata.releaseNotes],
};
export default releaseNotes;
