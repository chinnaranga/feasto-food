import { DiagnosticEvent, RouteHealthMetrics, ClientHealthStats } from '../../types/observability';

export const calculateHealthMetrics = (
  events: DiagnosticEvent[],
  isOnline: boolean
): ClientHealthStats => {
  let score = 100;
  let errorCount = 0;
  let warningCount = 0;
  const routeHealthMap: Record<string, { errors: number; warnings: number; score: number }> = {};

  // Factor in online status
  if (!isOnline) {
    score -= 15;
  }

  // Evaluate events
  events.forEach((event) => {
    const route = event.context.route || 'unknown';
    if (!routeHealthMap[route]) {
      routeHealthMap[route] = { errors: 0, warnings: 0, score: 100 };
    }

    if (event.severity === 'fatal') {
      score -= 25;
      errorCount++;
      routeHealthMap[route].errors++;
      routeHealthMap[route].score -= 25;
    } else if (event.severity === 'error') {
      score -= 10;
      errorCount++;
      routeHealthMap[route].errors++;
      routeHealthMap[route].score -= 15;
    } else if (event.severity === 'warn') {
      score -= 3;
      warningCount++;
      routeHealthMap[route].warnings++;
      routeHealthMap[route].score -= 5;
    }
  });

  // Clamp health scores between 0 and 100
  const finalScore = Math.max(0, Math.min(100, score));

  // Determine aggregate status
  let status: ClientHealthStats['status'] = 'optimal';
  if (finalScore < 50) {
    status = 'critical';
  } else if (finalScore < 80) {
    status = 'degraded';
  }

  // Convert route mapping to RouteHealthMetrics
  const routeHealth: Record<string, RouteHealthMetrics> = {};
  Object.keys(routeHealthMap).forEach((r) => {
    routeHealth[r] = {
      errors: routeHealthMap[r].errors,
      warnings: routeHealthMap[r].warnings,
      score: Math.max(0, Math.min(100, routeHealthMap[r].score)),
    };
  });

  return {
    errorCount,
    warningCount,
    healthScore: finalScore,
    status,
    routeHealth,
  };
};
export default calculateHealthMetrics;
