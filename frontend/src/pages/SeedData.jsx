import { useState } from "react";
import { db } from "../config/firebase";
import { doc, writeBatch, collection } from "firebase/firestore";

const chefsData = [
    {
        id: "arjun-rao",
        name: "Chef Arjun Rao",
        title: "Executive Chef",
        cuisine: "Indian & Fusion Cuisine",
        experience: "12+ Years Experience",
        rating: 4.9,
        image: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092",
        bio: "Chef Arjun brings over a decade of culinary mastery, blending traditional Indian flavors with modern techniques. Every dish is crafted with precision, hygiene, and passion.",
        certifications: [
            "Hygiene Certified",
            "Culinary Arts Degree",
            "5-Star Kitchen Rating"
        ],
        dishes: [
            { id: "biryani", name: "Hyderabadi Biryani", price: 349, image: "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a" },
            { id: "butter-chicken", name: "Butter Chicken", price: 299, image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398" },
            { id: "paneer-tikka", name: "Paneer Tikka", price: 249, image: "https://images.unsplash.com/photo-1626776876623-92b7a81c5b10" }
        ]
    },
    {
        id: "maria-rossi",
        name: "Chef Maria Rossi",
        title: "Head Chef",
        cuisine: "Italian Cuisine",
        experience: "10+ Years Experience",
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1541544741938-0af808871cc0",
        bio: "Chef Maria specializes in authentic Italian recipes passed down through generations. She believes in fresh ingredients and simple, robust flavors.",
        certifications: [
            "Master Italian Chef",
            "Hygiene Certified"
        ],
        dishes: [
            { id: "pizza", name: "Margherita Pizza", price: 399, image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002" },
            { id: "pasta", name: "Pasta Carbonara", price: 349, image: "https://images.unsplash.com/photo-1612874742237-6526221588e3" },
            { id: "tiramisu", name: "Classic Tiramisu", price: 299, image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9" }
        ]
    },
    {
        id: "ayaan-khan",
        name: "Chef Ayaan Khan",
        title: "Pastry Chef",
        cuisine: "Desserts & Baking",
        experience: "8+ Years Experience",
        rating: 4.7,
        image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f",
        bio: "Chef Ayaan is a wizard with desserts, creating sweet masterpieces that look as good as they taste. His attention to detail is unmatched.",
        certifications: [
            "Patisserie Expert",
            "Best Dessert Chef 2024"
        ],
        dishes: [
            { id: "lava-cake", name: "Choco Lava Cake", price: 199, image: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51" },
            { id: "cheesecake", name: "Blueberry Cheesecake", price: 249, image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad" },
            { id: "macarons", name: "Assorted Macarons", price: 299, image: "https://images.unsplash.com/photo-1569864358642-9d1684040f43" }
        ]
    }
];

export default function SeedData() {
    const [status, setStatus] = useState("Idle");

    const seedDatabase = async () => {
        setStatus("Seeding...");
        try {
            const batch = writeBatch(db);

            for (const chef of chefsData) {
                // Chef Doc
                const chefRef = doc(db, "chefs", chef.id);
                const { dishes, id, ...chefData } = chef; // Exclude dishes array and id from main doc
                batch.set(chefRef, chefData);

                // Dishes Subcollection
                for (const dish of chef.dishes) {
                    const dishRef = doc(db, "chefs", chef.id, "dishes", dish.id);
                    const { id, ...dishData } = dish; // Exclude id from doc data
                    batch.set(dishRef, dishData);
                }
            }

            await batch.commit();
            setStatus("Success! Database seeded.");
        } catch (error) {
            console.error(error);
            setStatus("Error: " + error.message);
        }
    };

    const createRestaurantAdmin = async () => {
        setStatus("Creating Admin...");
        try {
            // Create Restaurant Doc
            await doc(db, "restaurants", "rest_001").set({
                name: "Spice Hub",
                ownerEmail: "restaurant@aerobite.food",
                isOpen: true,
                rating: 4.6
            });

            // Note: We cannot create the Auth user here dynamically without Admin SDK,
            // but we can set the Firestore role document if the user signs up manually.
            // For now, let's just create the Firestore doc assuming the user will sign up 
            // with email: restaurant@aerobite.food

            // Actually, we can prompt for UID if we want, but let's just instruct user.
            setStatus("Info: Please sign up with 'restaurant@aerobite.food' first, then click this to assign role.");

            // Hypothetically, if we knew the UID, we could do:
            // await doc(db, "users", THE_UID).set({...}, {merge: true})

            // Since we don't have the UID of a fresh user here easily, 
            // maybe we just create the restaurant doc which is the hard part manually.

            setStatus("Success! Restaurant 'rest_001' created. Now manually sign up 'restaurant@aerobite.food' and update their user doc with role: 'restaurant_admin'.");

        } catch (error) {
            console.error(error);
            setStatus("Error: " + error.message);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-6">
            <h1 className="text-3xl font-bold">Seed Database</h1>
            <p className="max-w-md text-center text-gray-400">
                This will overwrite data in the 'chefs' collection with the sample data.
            </p>

            <div className="flex gap-4">
                <button
                    onClick={seedDatabase}
                    disabled={status.includes("...")}
                    className="bg-yellow-500 text-black px-6 py-3 rounded-lg font-bold hover:bg-yellow-400 disabled:opacity-50"
                >
                    {status === "Seeding..." ? "Seeding..." : "Seed Chefs"}
                </button>

                <button
                    onClick={createRestaurantAdmin}
                    disabled={status.includes("...")}
                    className="bg-orange-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-orange-500 disabled:opacity-50"
                >
                    Create Test Restaurant
                </button>
            </div>

            <p className={`text-lg max-w-lg text-center ${status.includes("Error") ? "text-red-500" : "text-green-500"}`}>
                {status !== "Idle" && status}
            </p>
        </div>
    );
}
