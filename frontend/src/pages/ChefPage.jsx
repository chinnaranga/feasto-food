import { motion } from "framer-motion";
import { Star, Award, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { db } from "../config/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function ChefPage() {
    const [chefs, setChefs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchChefs() {
            try {
                const chefsRef = collection(db, "chefs");
                const snapshot = await getDocs(chefsRef);
                const chefsData = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setChefs(chefsData);
            } catch (error) {
                console.error("Error fetching chefs:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchChefs();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white px-6 py-16">

            {/* Hero */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-16"
            >
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                    Meet Our Chefs 👨‍🍳
                </h1>
                <p className="text-gray-400 max-w-xl mx-auto">
                    Passionate experts crafting every dish with love, hygiene, and perfection.
                </p>
            </motion.div>

            {/* Chef Grid */}
            {chefs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {chefs.map((chef) => (
                        <motion.div
                            key={chef.id}
                            whileHover={{ scale: 1.05 }}
                            className="bg-gray-800 rounded-2xl overflow-hidden shadow-lg"
                        >
                            <img
                                src={chef.image}
                                alt={chef.name}
                                className="h-56 w-full object-cover"
                            />
                            <div className="p-6">
                                <h3 className="text-xl font-semibold">{chef.name}</h3>
                                <p className="text-sm text-gray-400">{chef.specialty}</p>
                                <p className="text-sm mt-2">{chef.experience}</p>

                                <div className="flex items-center gap-2 mt-3">
                                    <Star className="text-yellow-400 w-4 h-4" />
                                    <span>{chef.rating}</span>
                                </div>

                                <Link to={`/chef/${chef.id}`}>
                                    <button className="mt-4 w-full bg-yellow-500 hover:bg-yellow-600 text-black font-medium py-2 rounded-lg transition-colors">
                                        View Profile
                                    </button>
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="text-center text-gray-500 py-10">
                    <p>No chefs found. Please check back later.</p>
                </div>
            )}

            {/* Trust Section */}
            <div className="mt-20 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <TrustCard icon={<ShieldCheck />} text="Hygiene Certified" />
                <TrustCard icon={<Award />} text="Award Winning Chefs" />
                <TrustCard icon={<Star />} text="Rated 4.8+ by Customers" />
            </div>
        </div>
    );
}

function TrustCard({ icon, text }) {
    return (
        <div className="bg-gray-800 rounded-xl p-6 flex flex-col items-center gap-3">
            <div className="text-yellow-400">{icon}</div>
            <p className="text-sm">{text}</p>
        </div>
    );
}
