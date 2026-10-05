import { useState, useEffect } from 'react';
import { usePersonalizationStore } from '@/store/personalization/personalizationStore';
import { useUserStore } from '@/store/userStore';
import { personalizationClient } from '@/services/personalization/personalizationClient';
import { PersonalizedMenuItem } from '@/types/personalization';

export function usePersonalizedCollections(
  theme: 'healthy' | 'budget' | 'spicy' | 'favorites' | 'popular',
  limit = 6
) {
  const { explicitPreferences, inferredCuisineAffinities, dismissedRecommendationIds, averageOrderValue } = usePersonalizationStore();
  const { favorites } = useUserStore();
  const [data, setData] = useState<PersonalizedMenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      const recommendations = personalizationClient.getThematicCollections(
        theme,
        {
          explicitPreferences,
          inferredCuisineAffinities,
          favorites,
          dismissedRecommendationIds,
          averageOrderValue,
        },
        limit
      );
      setData(recommendations);
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [theme, explicitPreferences, inferredCuisineAffinities, favorites, dismissedRecommendationIds, averageOrderValue, limit]);

  return { data, isLoading };
}
