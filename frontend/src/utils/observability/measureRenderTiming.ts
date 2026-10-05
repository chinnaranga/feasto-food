export const measureRenderTiming = (
  _componentName: string,
  onMeasure: (durationMs: number) => void
) => {
  const start = window.performance ? performance.now() : Date.now();

  return () => {
    const end = window.performance ? performance.now() : Date.now();
    const duration = parseFloat((end - start).toFixed(2));
    onMeasure(duration);
  };
};
export default measureRenderTiming;
