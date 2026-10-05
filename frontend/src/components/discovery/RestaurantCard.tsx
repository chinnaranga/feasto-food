import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, MapPin } from 'lucide-react';
import type { Restaurant } from '@/data/restaurants';
import { RatingBadge } from './RatingBadge';
import { DeliveryBadge } from './DeliveryBadge';
import { PriceBadge } from './PriceBadge';
import { FavoriteButton } from './FavoriteButton';
import { useTrackEvent } from '@/hooks/analytics/useTrackEvent';
import { RecommendationReason } from '@/types/personalization';
import { WhyRecommendedLabel } from '@/components/personalization/WhyRecommendedLabel';

interface RestaurantCardProps {
  restaurant: Restaurant;
  layout?: 'grid' | 'list';
  index?: number;
  matchScore?: number;
  reasons?: RecommendationReason[];
}

export const RestaurantCard: React.FC<RestaurantCardProps> = ({
  restaurant,
  layout = 'grid',
  index = 0,
  matchScore,
  reasons,
}) => {
  const isGrid = layout === 'grid';
  const trackEvent = useTrackEvent();

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
    >
      <Link
        to={`/restaurants/${restaurant.id}`}
        onClick={() => {
          trackEvent('restaurant_card_click', {
            restaurantId: restaurant.id,
            restaurantName: restaurant.name,
            index,
            tags: restaurant.cuisine,
          });
        }}
        className={`group block bg-primary-bg border border-border-main hover:border-[#cbd5e1] rounded-2xl overflow-hidden shadow-soft hover:shadow-medium transition-main ${
          isGrid ? '' : 'flex gap-0'
        }`}
      >
        {/* Cover visual */}
        <div
          className={`bg-gradient-to-br ${restaurant.coverGradient} relative flex items-center justify-center border-b border-border-main/40
            ${isGrid ? 'h-40 w-full' : 'h-full w-36 sm:w-48 shrink-0 border-b-0 border-r'}`}
        >
          {!restaurant.isOpen && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-xs flex items-center justify-center z-10">
              <span className="text-xs font-bold text-text-muted uppercase tracking-widest">Closed</span>
            </div>
          )}
          <span className="text-4xl group-hover:scale-110 transition-main duration-300 select-none">
            {restaurant.emoji}
          </span>
          {(matchScore !== undefined || restaurant.aiMatchScore) && (
            <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#101218]/90 border border-[#25293A] text-[10px] font-bold text-[#4FD1E8] backdrop-blur-md shadow-xs">
              <Sparkles size={11} className="text-[#6D5EF5]" />
              <span>Curated</span>
            </div>
          )}
          <div className="absolute top-3 right-3">
            <FavoriteButton restaurantId={restaurant.id} />
          </div>
          {restaurant.hasOffers && (
            <div className="absolute bottom-3 left-3 px-2.5 py-0.5 rounded-lg bg-[#6D5EF5] text-white text-[9px] font-bold uppercase tracking-wider shadow-xs">
              Special
            </div>
          )}
        </div>

        {/* Details */}
        <div className={`flex flex-col justify-between ${isGrid ? 'p-5' : 'p-4 flex-1'}`}>
          <div>
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className="text-sm font-bold text-text-primary tracking-tight group-hover:text-brand-orange transition-main leading-snug">
                {restaurant.name}
              </h3>
              <PriceBadge range={restaurant.priceRange} />
            </div>
            <p className="text-[11px] text-text-secondary mb-3 leading-snug">{restaurant.cuisine.join(' · ')}</p>

            {restaurant.hasOffers && restaurant.offerText && (
              <p className="text-[10px] font-bold text-brand-orange mb-2 leading-snug">
                🎁 {restaurant.offerText}
              </p>
            )}

            {reasons && reasons.length > 0 && (
              <div className="mb-2">
                <WhyRecommendedLabel category={reasons[0].category} text={reasons[0].text} className="max-w-full" />
              </div>
            )}
          </div>

          <div className="flex items-center justify-between gap-3 border-t border-border-main/40 pt-3 mt-auto flex-wrap gap-y-2">
            <RatingBadge rating={restaurant.rating} reviewCount={restaurant.reviewCount} />
            <DeliveryBadge
              minutes={restaurant.deliveryTime}
              free={restaurant.deliveryFee === 0}
              fee={restaurant.deliveryFee}
            />
            <span className="flex items-center gap-1 text-[11px] text-text-muted font-medium">
              <MapPin size={11} />
              {restaurant.distance}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default RestaurantCard;
