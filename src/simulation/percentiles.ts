export function percentile(sorted: number[], p: number) {
  const index = Math.floor(p * sorted.length);
  return sorted[index];
}