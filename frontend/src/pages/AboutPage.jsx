import React from "react";
import { motion } from "framer-motion";
import {
    Heart,
    Zap,
    Shield,
    Users,
    Award,
    Sparkles,
    Github,
    Linkedin,
    Mail,
    MapPin,
    Code,
    Rocket,
} from "lucide-react";

// Liquid Components
import LiquidContainer from "../components/liquid/LiquidContainer";
import LiquidCard from "../components/liquid/LiquidCard";
import LiquidButton from "../components/liquid/LiquidButton";

const stats = [
    { label: "Happy Customers", value: "50K+", icon: Users },
    { label: "Restaurants", value: "1,200+", icon: Award },
    { label: "Cities", value: "25+", icon: MapPin },
    { label: "Orders Delivered", value: "2M+", icon: Rocket },
];

const values = [
    {
        icon: Zap,
        title: "Speed",
        description: "Lightning-fast delivery powered by smart logistics and real-time tracking.",
        color: "orange",
    },
    {
        icon: Heart,
        title: "Quality",
        description: "Hand-picked restaurant partners who meet our premium quality standards.",
        color: "red",
    },
    {
        icon: Shield,
        title: "Trust",
        description: "Secure payments, verified reviews, and guaranteed satisfaction.",
        color: "green",
    },
    {
        icon: Sparkles,
        title: "Innovation",
        description: "AI-powered recommendations that learn your taste preferences.",
        color: "purple",
    },
];

const team = [
    {
        name: "Ravi Pati Chinnaranga",
        role: "Full Stack Developer",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200",
    },
];

export default function AboutPage() {
    return (
        <LiquidContainer>
            <div className="relative min-h-screen pt-24 pb-16 px-6">
                <div className="relative z-10 max-w-5xl mx-auto">
                    {/* Hero */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-16"
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", delay: 0.2 }}
                            className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-5xl font-bold shadow-lg shadow-orange-500/30 liquid-glass-high text-white"
                        >
                            F
                        </motion.div>
                        <h1 className="text-5xl md:text-6xl font-extrabold mb-6 text-white drop-shadow-md">
                            About <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-400">AeroBite</span>
                        </h1>
                        <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
                            Premium food discovery and delivery platform, powered by AI and designed for food lovers.
                        </p>
                    </motion.div>

                    {/* Stats */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20"
                    >
                        {stats.map((stat, index) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 * index }}
                            >
                                <LiquidCard className="p-6 text-center h-full flex flex-col items-center justify-center hover:bg-white/5 transition-colors">
                                    <stat.icon className="w-8 h-8 mx-auto mb-3 text-orange-400" />
                                    <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
                                    <p className="text-sm text-gray-400">{stat.label}</p>
                                </LiquidCard>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Mission */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="mb-20"
                    >
                        <LiquidCard className="bg-gradient-to-r from-orange-500/10 to-transparent p-8 md:p-10">
                            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3 text-white">
                                <Rocket className="text-orange-400 w-8 h-8" />
                                Our Mission
                            </h2>
                            <p className="text-gray-300 leading-relaxed text-lg lg:text-xl">
                                At AeroBite, we believe ordering food should be effortless, delightful, and personalized.
                                We're building the future of food discovery — where AI understands your cravings,
                                premium restaurants are just a tap away, and every meal is an experience worth remembering.
                            </p>
                        </LiquidCard>
                    </motion.div>

                    {/* Values */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="mb-20"
                    >
                        <h2 className="text-3xl font-bold mb-10 text-center text-white">What We Stand For</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            {values.map((value, index) => (
                                <motion.div
                                    key={value.title}
                                    initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.1 * index }}
                                >
                                    <LiquidCard className="p-8 h-full hover:border-orange-500/30 transition-all group">
                                        <div className={`w-14 h-14 rounded-2xl bg-${value.color}-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                            <value.icon className={`w-7 h-7 text-${value.color}-400`} />
                                        </div>
                                        <h3 className="text-2xl font-bold text-white mb-3">{value.title}</h3>
                                        <p className="text-gray-400 text-lg leading-relaxed">{value.description}</p>
                                    </LiquidCard>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Tech Stack */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="mb-20"
                    >
                        <LiquidCard className="p-10 text-center">
                            <h2 className="text-2xl font-bold mb-8 flex items-center justify-center gap-3 text-white">
                                <Code className="text-blue-400 w-7 h-7" />
                                Built With Modern Tech
                            </h2>
                            <div className="flex flex-wrap justify-center gap-3">
                                {["React", "Vite", "Tailwind CSS", "Framer Motion", "Node.js", "MongoDB", "Firebase", "Express"].map((tech) => (
                                    <span
                                        key={tech}
                                        className="px-5 py-2.5 bg-white/5 border border-white/10 rounded-full text-sm font-medium text-gray-300 hover:bg-white/10 hover:border-white/20 transition-all cursor-default"
                                    >
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </LiquidCard>
                    </motion.div>

                    {/* Team */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="text-center mb-20"
                    >
                        <h2 className="text-3xl font-bold mb-10 text-white">The Creator</h2>
                        {team.map((member) => (
                            <motion.div
                                key={member.name}
                                whileHover={{ y: -5 }}
                                className="inline-block"
                            >
                                <LiquidCard className="p-8 hover:border-orange-500/30 transition-all">
                                    <img
                                        src={member.image}
                                        alt={member.name}
                                        className="w-32 h-32 rounded-full mx-auto mb-6 object-cover ring-4 ring-orange-500/20 shadow-xl"
                                    />
                                    <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
                                    <p className="text-base text-gray-400">{member.role}</p>

                                    <div className="flex justify-center gap-4 mt-6">
                                        <a href="#" className="p-2 bg-white/5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all">
                                            <Github size={20} />
                                        </a>
                                        <a href="#" className="p-2 bg-white/5 rounded-lg text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 transition-all">
                                            <Linkedin size={20} />
                                        </a>
                                        <a href="#" className="p-2 bg-white/5 rounded-lg text-gray-400 hover:text-orange-400 hover:bg-orange-500/10 transition-all">
                                            <Mail size={20} />
                                        </a>
                                    </div>
                                </LiquidCard>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* CTA */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="text-center"
                    >
                        <p className="text-xl text-gray-300 mb-8 font-light">
                            Ready to experience the future of food delivery?
                        </p>
                        <LiquidButton
                            className="text-lg px-10 py-4 h-auto shadow-xl shadow-orange-500/20"
                        >
                            Get Started Free
                        </LiquidButton>
                    </motion.div>
                </div>
            </div>
        </LiquidContainer>
    );
}
