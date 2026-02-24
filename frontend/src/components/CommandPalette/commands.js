import {
    Home,
    ShoppingCart,
    CreditCard,
    Flame,
    Heart,
    ChefHat,
    Sparkles,
} from "lucide-react";

export const COMMANDS = [
    {
        id: "home",
        title: "Go to Home",
        subtitle: "Landing page",
        icon: Home,
        action: navigate => navigate("/"),
    },
    {
        id: "cart",
        title: "Open Cart",
        subtitle: "Review items & offers",
        icon: ShoppingCart,
        action: navigate => navigate("/cart"),
    },
    {
        id: "checkout",
        title: "Checkout",
        subtitle: "Complete your order",
        icon: CreditCard,
        action: navigate => navigate("/checkout"),
    },
    {
        id: "trending",
        title: "Trending near you",
        subtitle: "Popular right now",
        icon: Flame,
        intent: "food",
    },
    {
        id: "healthy",
        title: "Healthy meals",
        subtitle: "Low-cal, high protein",
        icon: Heart,
        intent: "food",
    },
    {
        id: "chef",
        title: "Chef’s specials",
        subtitle: "Handpicked dishes",
        icon: ChefHat,
        intent: "food",
    },
    {
        id: "surprise",
        title: "What should I eat?",
        subtitle: "AI picks for you",
        icon: Sparkles,
        intent: "ai",
    },
];
