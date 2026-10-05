import { useState, useEffect } from 'react';
import { usePersonalizationStore } from '@/store/personalization/personalizationStore';
import { useUserStore } from '@/store/userStore';
import { personalizationClient } from '@/services/personalization/personalizationClient';
import { PersonalizedRestaurant } from '@/types/personalization';

export function useRecommendedRestaurants(limit = 10) {
  const { explicitPreferences, inferredCuisineAffinities, dismissedRecommendationIds, averageOrderValue } = usePersonalizationStore();
  const { favorites } = useUserStore();
  const [data, setData] = useState<PersonalizedRestaurant[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      const recommendations = personalizationClient.getRecommendedRestaurants({
        explicitPreferences,
        inferredCuisineAffinities,
        favorites,
        dismissedRecommendationIds,
        averageOrderValue,
      }, limit);
      setData(recommendations);
      setIsLoading(false);
    }, 600); // simulated quick AI calculation delay

    return () => clearTimeout(timer);
  }, [explicitPreferences, inferredCuisineAffinities, favorites, dismissedRecommendationIds, averageOrderValue, limit]);

  return { data, isLoading };
}
