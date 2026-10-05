import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Star, Clock, ShoppingBag, Heart, Check, ArrowRight } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';

interface EditorialDish {
  id: string;
  name: string;
  restaurantId: string;
  restaurantName: string;
  price: number;
  rating: number;
  deliveryTime: number;
  tags: string[];
  tasteNotes: string;
  image: string;
}

const EDITORIAL_DISHES: EditorialDish[] = [
  {
    id: 'sr1',
    name: 'Hyderabadi Dum Biryani',
    restaurantId: 'spice-route',
    restaurantName: 'Spice Route',
    price: 280,
    rating: 4.8,
    deliveryTime: 25,
    tags: ['Aged Basmati', 'Dum Cooked'],
    tasteNotes: 'Rich • Saffron • Warm Spice',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=900&auto=format&fit=crop&q=80',
  },
  {
    id: 'at1',
    name: 'Avocado Protein Power Bowl',
    restaurantId: 'artisan-table',
    restaurantName: 'The Artisan Table',
    price: 340,
    rating: 4.9,
    deliveryTime: 18,
    tags: ['High Protein', 'Vegan'],
    tasteNotes: 'Fresh • Citrus Tahini • Clean Macros',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=900&auto=format&fit=crop&q=80',
  },
  {
    id: 'lc1',
    name: 'Wood-Fired Margherita DOC',
    restaurantId: 'la-cucina',
    restaurantName: 'La Cucina',
    price: 380,
    rating: 4.8,
    deliveryTime: 24,
    tags: ['San Marzano', 'Fior di Latte'],
    tasteNotes: 'Charred Crust • Sweet Basil • Melted Curd',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=900&auto=format&fit=crop&q=80',
  },
];

export const EditorialDishes: React.FC = () => {
  const addItem = useCartStore((state) => state.addItem);
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleOrder = (dish: EditorialDish) => {
    addItem({
      cartItemId: `${dish.restaurantId}-${dish.id}-${Date.now()}`,
      restaurantId: dish.restaurantId,
      restaurantName: dish.restaurantName,
      item: {
        id: dish.id,
        name: dish.name,
        description: dish.tasteNotes,
        price: dish.price,
        tags: [],
      },
      quantity: 1,
      selectedAddons: [],
      spiceLevel: 'medium',
      specialInstructions: '',
      unitPrice: dish.price,
      totalPrice: dish.price,
    });

    setAddedIds((prev) => ({ ...prev, [dish.id]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [dish.id]: false }));
    }, 2400);
  };

  return (
    <section className="py-20 md:py-32 bg-[#08090D] border-t border-[#1F2232] select-none text-[#F4F5F7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div className="max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-widest text-[#4FD1E8] mb-2 block">
              Curated Craft
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-[#F4F5F7] tracking-tight leading-[1.08] mb-3">
              Crafted for your palate today.
            </h2>
            <p className="text-base text-[#A7ACB8] font-normal">
              No generic food templates. High-definition dining crafted by artisanal partner kitchens with authentic cooking styles.
            </p>
          </div>

          <Link
            to="/discover"
            className="inline-flex items-center gap-2 text-xs font-bold text-[#4FD1E8] hover:text-[#6D5EF5] transition-colors pb-1"
          >
            <span>Explore all dishes</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* 3 Large Editorial Dish Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {EDITORIAL_DISHES.map((dish) => {
            const isFav = !!favorites[dish.id];
            const isAdded = !!addedIds[dish.id];

            return (
              <div
                key={dish.id}
                className="group bg-[#101218] border border-[#1F2232] rounded-3xl overflow-hidden hover:border-[#6D5EF5]/60 hover:shadow-2xl hover:shadow-[#6D5EF5]/10 transition-all duration-300 flex flex-col"
              >
                {/* Large Food Photography */}
                <div className="relative h-72 sm:h-80 w-full overflow-hidden bg-[#171923]">
                  <img
                    src={dish.image}
                    alt={dish.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#101218] via-transparent to-transparent opacity-80" />
                  
                  {/* Heart Favorite Button */}
                  <button
                    type="button"
                    onClick={() => toggleFavorite(dish.id)}
                    aria-label="Add to favorites"
                    className="absolute top-4 right-4 w-10 h-10 rounded-full bg-[#101218]/80 backdrop-blur-md border border-[#25293A] flex items-center justify-center text-[#A7ACB8] hover:text-red-400 shadow-md transition-colors"
                  >
                    <Heart size={18} className={isFav ? 'fill-red-500 text-red-500' : ''} />
                  </button>

                  {/* Culinary Tags */}
                  <div className="absolute bottom-4 left-4 flex flex-wrap gap-1.5">
                    {dish.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 rounded-md bg-[#101218]/90 backdrop-blur-md border border-[#25293A] text-[10px] font-bold text-[#4FD1E8] uppercase tracking-wider"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Editorial Typography Body */}
                <div className="p-6 sm:p-7 flex flex-col flex-grow justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs text-[#6F7480] mb-1">
                      <Link
                        to={`/restaurants/${dish.restaurantId}`}
                        className="font-bold text-[#A7ACB8] hover:text-[#F4F5F7] transition-colors uppercase tracking-wider text-[11px]"
                      >
                        {dish.restaurantName}
                      </Link>
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1 font-bold text-[#F4F5F7]">
                          <Star size={12} className="text-amber-400 fill-amber-400" />
                          {dish.rating}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-[#A7ACB8]">
                          <Clock size={12} className="text-[#6F7480]" />
                          {dish.deliveryTime} min
                        </span>
                      </div>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-black text-[#F4F5F7] tracking-tight mb-2 group-hover:text-[#4FD1E8] transition-colors">
                      {dish.name}
                    </h3>

                    <p className="text-xs font-semibold text-[#A7ACB8] mb-6">
                      {dish.tasteNotes}
                    </p>
                  </div>

                  {/* Footer Row: Price + Add to Order */}
                  <div className="flex items-center justify-between pt-4 border-t border-[#1F2232]">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#6F7480] block">
                        Direct Price
                      </span>
                      <span className="text-2xl font-black text-[#F4F5F7]">₹{dish.price}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleOrder(dish)}
                      className={`px-5 py-3 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all shadow-md ${
                        isAdded
                          ? 'bg-[#2DD4BF] text-[#08090D] font-black'
                          : 'bg-[#6D5EF5] hover:bg-[#5B4BE8] text-white shadow-[#6D5EF5]/20'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check size={14} />
                          <span>Added to Cart</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag size={14} />
                          <span>Add to Order</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
