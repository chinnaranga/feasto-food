import { IRiderCandidateScore } from '../dispatch.types.js';

export class RankingService {
  rankRiders(
    candidates: Array<{ rider: any; distanceKm: number }>,
    priority: string = 'NORMAL'
  ): IRiderCandidateScore[] {
    const scored: IRiderCandidateScore[] = candidates.map(({ rider, distanceKm }) => {
      const proximityScore = Math.max(0, 50 - distanceKm * 5);
      const availabilityScore = rider.availabilityStatus === 'online' ? 20 : 0;
      const freshnessScore = 15;
      const ratingScore = Math.round((rider.rating || 5) * 3);
      const priorityScore = priority === 'URGENT' ? 20 : priority === 'HIGH' ? 10 : 0;

      const totalScore = Math.round(
        proximityScore + availabilityScore + freshnessScore + ratingScore + priorityScore
      );

      return {
        riderId: rider._id.toString(),
        score: totalScore,
        distanceKm,
        breakdown: {
          proximityScore,
          availabilityScore,
          zoneScore: 10,
          workloadScore: 10,
          freshnessScore,
          priorityScore,
        },
      };
    });

    return scored.sort((a, b) => b.score - a.score);
  }
}

export const rankingService = new RankingService();
