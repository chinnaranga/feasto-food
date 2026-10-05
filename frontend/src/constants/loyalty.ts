import { MembershipTier, LoyaltyPerk, Achievement } from '@/types/loyalty';

export const MEMBERSHIP_PRICING: Record<MembershipTier, { name: string; price: number; billing: string }> = {
  free: { name: 'Feasto Basic', price: 0, billing: 'Forever Free' },
  plus: { name: 'Feasto Plus', price: 149, billing: 'per month' },
  elite: { name: 'Feasto Elite VIP', price: 349, billing: 'per month' },
};

export const TIER_PERKS: Record<MembershipTier, string[]> = {
  free: [
    'Earn 1x Rewards Points on all orders',
    'Standard delivery fees apply',
    'Standard customer support queue',
  ],
  plus: [
    'Earn 1.5x Rewards Points on all orders',
    'Unlimited Free Delivery on orders above ₹199',
    'Access to exclusive member-only weekly offers',
    'Priority customer support queue (under 5 mins)',
  ],
  elite: [
    'Earn 2x Rewards Points on all orders',
    'Unlimited Free Delivery with no minimum order value',
    'VIP access to premium/highly-rated kitchens',
    '24/7 dedicated personal support agent Concierge',
    'Complementary secret menu dishes from selected kitchens',
    'Guaranteed on-time delivery or 100% cashback',
  ],
};

export const REWARDS_CONSTANTS = {
  POINTS_PER_INR_SPENT: 0.1, // 1 point for every ₹10 spent
  POINTS_CONVERSION_RATE: 0.1, // 10 points = ₹1 credit
  MIN_POINTS_TO_REDEEM: 100, // minimum 100 points
};

export const MOCK_ACHIEVEMENTS: Achievement[] = [
  { id: 'first_bite', title: 'First Bite', description: 'Placed your first order on Feasto', emoji: '🎉' },
  { id: 'streak_3', title: 'Feast Master', description: 'Maintained a 3-day ordering streak', emoji: '🔥' },
  { id: 'green_eater', title: 'Eco Diner', description: 'Ordered 5 vegan/veg items in a row', emoji: '🥗' },
  { id: 'big_spender', title: 'Gourmet Patron', description: 'Placed an order above ₹1,000', emoji: '👑' },
  { id: 'friendly_sharer', title: 'Super Ambassador', description: 'Successful referral of a friend', emoji: '🤝' },
];

export const MOCK_PERKS: LoyaltyPerk[] = [
  { id: 'free_delivery', name: 'Free Delivery', description: 'Waived delivery charges on all items', icon: '🚚' },
  { id: 'priority_support', name: 'Priority Support', description: 'Speedy queue for support desk queries', icon: '⚡' },
  { id: 'vip_access', name: 'VIP Dining Access', description: 'Early table booking & chef handshakes', icon: '⭐' },
  { id: 'cashback_elite', name: 'Double Cashback', description: '2x cash reward points on final checkout', icon: '💰' },
];
