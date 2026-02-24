export function parseQuery(query) {
  const q = query.toLowerCase();

  return {
    spicy: q.includes("spicy"),
    cheap: q.match(/under\s*₹?\s*(\d+)/)?.[1],
    healthy: q.includes("healthy"),
  };
}
