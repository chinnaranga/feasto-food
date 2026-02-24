import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../config/firebase";
import {
    doc,
    getDoc,
    collection,
    getDocs
} from "firebase/firestore";
import { motion } from "framer-motion";
import {
    Star,
    BadgeCheck,
    ShieldCheck,
    Award,
    ChefHat
} from "lucide-react";

export default function ChefProfilePage() {
    const { id } = useParams(); // changed from chefId to id to match App.jsx route
    const [chef, setChef] = useState(null);
    const [dishes, setDishes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchChef() {
            try {
                const chefRef = doc(db, "chefs", id);
                const chefSnap = await getDoc(chefRef);

                if (!chefSnap.exists()) {
                    setLoading(false);
                    return;
                }

                setChef(chefSnap.data());

                const dishesRef = collection(db, "chefs", id, "dishes");
                const dishesSnap = await getDocs(dishesRef);

                setDishes(dishesSnap.docs.map(d => d.data()));
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        if (id) {
            fetchChef();
        }
    }, [id]);

    if (loading)
        return <div className="flex items-center justify-center min-h-screen bg-black text-white">Loading Chef...</div>;

    if (!chef)
        return <div className="flex items-center justify-center min-h-screen bg-black text-white">Chef not found</div>;

    return (
        <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white px-6 py-16">

            {/* Hero */}
            <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
                <img
                    src={chef.image}
                    alt={chef.name}
                    className="rounded-3xl shadow-2xl w-full h-96 object-cover"
                />

                <div>
                    <h1 className="text-4xl font-bold">{chef.name}</h1>
                    <p className="text-yellow-400 flex items-center gap-2 mt-2">
                        <ChefHat size={18} /> {chef.title}
                    </p>
                    <p className="text-gray-400 mt-2">{chef.cuisine}</p>

                    <div className="flex items-center gap-4 mt-4">
                        <span className="flex items-center gap-1">
                            <Star className="text-yellow-400 w-4 h-4" />
                            {chef.rating}
                        </span>
                        <span className="text-sm">{chef.experience}</span>
                    </div>

                    <button className="mt-6 bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-3 rounded-xl font-semibold transition-colors">
                        Order from this Chef
                    </button>
                </div>
            </div>

            {/* About */}
            <section className="max-w-4xl mx-auto mt-16">
                <h2 className="text-2xl font-semibold mb-4">About the Chef</h2>
                <p className="text-gray-300 leading-relaxed">{chef.bio}</p>
            </section>

            {/* Certifications */}
            <section className="max-w-4xl mx-auto mt-12 grid md:grid-cols-3 gap-6">
                {chef.certifications?.map((item, i) => (
                    <div key={i} className="bg-gray-800 p-6 rounded-xl flex items-center gap-3">
                        <BadgeCheck className="text-yellow-400" />
                        <span>{item}</span>
                    </div>
                ))}
            </section>

            {/* Dishes */}
            <section className="max-w-6xl mx-auto mt-20">
                <h2 className="text-2xl font-semibold mb-8">Signature Dishes</h2>

                {dishes.length > 0 ? (
                    <div className="grid md:grid-cols-3 gap-8">
                        {dishes.map((dish, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ scale: 1.05 }}
                                className="bg-gray-800 rounded-2xl overflow-hidden shadow-lg"
                            >
                                <img
                                    src={dish.image}
                                    alt={dish.name}
                                    className="h-48 w-full object-cover"
                                />
                                <div className="p-5">
                                    <h3 className="font-semibold">{dish.name}</h3>
                                    <p className="text-yellow-400 mt-1">₹{dish.price}</p>
                                    <button className="mt-4 w-full bg-yellow-500 hover:bg-yellow-600 text-black py-2 rounded-lg font-medium transition-colors">
                                        Add to Cart
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-400">No signature dishes listed yet.</p>
                )}
            </section>

            {/* Trust */}
            <section className="max-w-4xl mx-auto mt-20 grid md:grid-cols-3 gap-6 text-center">
                <Trust icon={<ShieldCheck />} text="Hygiene Verified" />
                <Trust icon={<Award />} text="Award Winning" />
                <Trust icon={<Star />} text="Top Rated" />
            </section>
        </div>
    );
}

function Trust({ icon, text }) {
    return (
        <div className="bg-gray-800 p-6 rounded-xl flex flex-col items-center gap-3">
            <div className="text-yellow-400">{icon}</div>
            <p className="text-sm">{text}</p>
        </div>
    );
}
