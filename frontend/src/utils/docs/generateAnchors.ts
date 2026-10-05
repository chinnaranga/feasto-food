export interface DocAnchor {
  id: string;
  text: string;
  level: number;
}

export const generatePageAnchors = (markdownText: string): DocAnchor[] => {
  const lines = markdownText.split('\n');
  const anchors: DocAnchor[] = [];

  lines.forEach((line) => {
    const headingMatch = line.match(/^(#{2,3})\s+(.+)$/);
    if (headingMatch) {
      const hashes = headingMatch[1];
      const titleText = headingMatch[2].trim();
      // Generate standard URL slug
      const id = titleText
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-');

      anchors.push({
        id,
        text: titleText,
        level: hashes.length, // 2 for h2, 3 for h3
      });
    }
  });

  return anchors;
};
export default generatePageAnchors;
