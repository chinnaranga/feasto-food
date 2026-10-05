import { BuildMetadata } from '../../types/release';

export const formatReleaseNotes = (notes: BuildMetadata['releaseNotes']): string => {
  let md = `### Feasto v${notes.version} (${notes.date})\n\n`;
  md += `*${notes.summary}*\n\n`;
  md += `#### Key Improvements\n`;
  notes.changes.forEach((change) => {
    md += `- ${change}\n`;
  });
  if (notes.security && notes.security.length > 0) {
    md += `\n#### Security & Compliance Enhancements\n`;
    notes.security.forEach((sec) => {
      md += `- ${sec}\n`;
    });
  }
  return md;
};
export default formatReleaseNotes;
