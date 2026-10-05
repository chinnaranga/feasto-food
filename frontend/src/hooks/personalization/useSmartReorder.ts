import { useState, useEffect } from 'react';
import { useUserStore, Order } from '@/store/userStore';
import { getCurrentTimeCategory } from '@/services/personalization/rankingEngine';

export function useSmartReorder() {
  const { pastOrders } = useUserStore();
  const [recommendedOrder, setRecommendedOrder] = useState<Order | null>(null);
  const [reason, setReason] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      if (pastOrders.length === 0) {
        setRecommendedOrder(null);
        setReason('');
        setIsLoading(false);
        return;
      }

      const timeCat = getCurrentTimeCategory();

      // Scored candidate orders
      const scoredCandidates = pastOrders.map((order) => {
        let score = 50; // Base score
        let orderReason = 'Based on your previous orders';

        // Recency boost (more recent orders get a small boost)
        const orderDate = new Date(order.placedAt);
        const daysAgo = (Date.now() - orderDate.getTime()) / (1000 * 60 * 60 * 24);
        if (daysAgo < 3) {
          score += 25;
          orderReason = 'From your very recent orders';
        } else if (daysAgo < 7) {
          score += 15;
          orderReason = 'Ordered within the last week';
        }

        // Time Category Match (Did they order it around this time?)
        const orderHour = orderDate.getHours();
        let orderTimeCat: 'breakfast' | 'lunch' | 'dinner' | 'late_night' = 'lunch';
        if (orderHour >= 6 && orderHour < 11) orderTimeCat = 'breakfast';
        else if (orderHour >= 11 && orderHour < 16) orderTimeCat = 'lunch';
        else if (orderHour >= 16 && orderHour < 22) orderTimeCat = 'dinner';
        else orderTimeCat = 'late_night';

        if (orderTimeCat === timeCat) {
          score += 20;
          orderReason = `Perfect fit for your typical ${timeCat} preference`;
        }

        return { order, score, reason: orderReason };
      });

      // Sort descending by score
      scoredCandidates.sort((a, b) => b.score - a.score);

      if (scoredCandidates.length > 0) {
        setRecommendedOrder(scoredCandidates[0].order);
        setReason(scoredCandidates[0].reason);
      } else {
        setRecommendedOrder(null);
        setReason('');
      }
      setIsLoading(false);
    }, 450);

    return () => clearTimeout(timer);
  }, [pastOrders]);

  return { recommendedOrder, reason, isLoading };
}
