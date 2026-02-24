// frontend/src/components/RestaurantsSection.js

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../context/AppContext';
import { getRestaurants } from '../services/apiService'; // ✅ Import your new API service
import RestaurantCard from './RestaurantCard';
import FilterBar from './FilterBar';

const RestaurantsSection = () => {
  const { state } = useAppContext();
  const { search, activeFilter, sortBy } = state;
  
  // State to hold restaurants and loading status
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  // useEffect hook to fetch data when the component first loads
  useEffect(() => {
    const loadRestaurants = async () => {
      setLoading(true);
      const data = await getRestaurants();
      setRestaurants(data);
      setLoading(false);
    };

    loadRestaurants();
  }, []); // The empty array ensures this runs only once

  // (Your existing filtering and sorting logic can remain the same)
  const filteredAndSortedRestaurants = useMemo(() => {
    // ... your filtering logic ...
    return restaurants; // Make sure to filter the 'restaurants' state variable
  }, [restaurants, search, activeFilter, sortBy]);

  return (
    <section id="restaurants" className="py-24 px-6 md:px-20 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Popular <span className="text-teal-600">Restaurants</span></h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">Discover amazing restaurants in your area.</p>
        </div>
        <FilterBar />

        {loading ? (
          <div className="text-center py-16 text-xl font-semibold">Loading restaurants...</div>
        ) : (
          <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" layout>
            <AnimatePresence>
              {filteredAndSortedRestaurants.map((r) => (
                <RestaurantCard key={r.id} r={r} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default RestaurantsSection;