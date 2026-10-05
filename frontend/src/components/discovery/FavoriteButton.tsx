import React from 'react';
import { Heart } from 'lucide-react';
import { useDiscoveryStore } from '@/store/discoveryStore';
import { useTrackEvent } from '@/hooks/analytics/useTrackEvent';

interface FavoriteButtonProps {
  restaurantId: string;
  className?: string;
}

export const FavoriteButton: React.FC<FavoriteButtonProps> = ({ restaurantId, className = '' }) => {
  const trackEvent = useTrackEvent();
  const { favorites, toggleFavorite } = useDiscoveryStore();
  const isFavorited = favorites.includes(restaurantId);

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite(restaurantId);
        trackEvent('settings_updated', {
          section: 'privacy',
          settingKey: 'favorite_restaurant',
          newValue: { restaurantId, isFavorited: !isFavorited }
        });
      }}
      aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
      className={`w-8 h-8 rounded-full flex items-center justify-center transition-main cursor-pointer
        ${isFavorited
          ? 'bg-red-50 text-red-500 border border-red-100'
          : 'bg-white/80 text-text-muted border border-border-main hover:text-red-400'
        } ${className}`}
    >
      <Heart size={14} className={isFavorited ? 'fill-red-500' : ''} />
    </button>
  );
};

export default FavoriteButton;
