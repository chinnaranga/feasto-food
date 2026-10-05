import { usePersonalizationStore } from '@/store/personalization/personalizationStore';

export function useSearchSuggestions() {
  const { inferredCuisineAffinities, explicitPreferences } = usePersonalizationStore();

  // Get active affinities sorted descending
  const topAffinities = Object.entries(inferredCuisineAffinities)
    .filter(([_, score]) => score > 15)
    .sort((a, b) => b[1] - a[1])
    .map(([cuisine]) => cuisine);

  const defaultSuggestions = ['Sushi', 'Biryani', 'Salad', 'Burger', 'Pizza', 'South Indian'];

  // Combine top affinities with default fallback suggestions
  const suggestions = Array.from(new Set([...topAffinities, ...defaultSuggestions])).slice(0, 6);

  // Match suggestions category explanation
  const getSuggestionReason = (sug: string): string => {
    if (topAffinities.includes(sug)) {
      return `Matches your preferred taste in ${sug}`;
    }
    if (explicitPreferences.strictDietary && sug === 'Salad') {
      return 'Healthy option matching your diet filter';
    }
    return 'Popular choice near you';
  };

  return { suggestions, getSuggestionReason };
}
