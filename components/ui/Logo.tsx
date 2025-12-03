"use client";

import React from "react";
import { motion } from "framer-motion";

export const Logo = ({ size = "sm" }: { size?: "sm" | "md" | "lg" }) => {
    const iconSize = size === "lg" ? 80 : size === "md" ? 60 : 40;
    const textSize = size === "lg" ? "text-6xl" : size === "md" ? "text-4xl" : "text-2xl";
    const gap = size === "lg" ? "gap-4" : size === "md" ? "gap-3" : "gap-2";

    return (
        <div className={`flex items-center ${gap}`}>
            <motion.div
                className={`relative flex items-center justify-center`}
                style={{ width: iconSize, height: iconSize }}
                initial="hidden"
                animate="visible"
            >
                {/* Clipboard Base */}
                <motion.svg
                    width={iconSize}
                    height={iconSize}
                    viewBox="0 0 40 40"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="drop-shadow-md"
                >
                    {/* Main Board */}
                    <motion.rect
                        x="8"
                        y="4"
                        width="24"
                        height="32"
                        rx="4"
                        fill="#94a3b8" // Slate-400
                        initial={{ scaleY: 0, opacity: 0 }}
                        animate={{ scaleY: 1, opacity: 1 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                    />

                    {/* Top Clip */}
                    <motion.path
                        d="M14 2H26V6C26 7.10457 25.1046 8 24 8H16C14.8954 8 14 7.10457 14 6V2Z"
                        fill="#64748b" // Slate-500
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.3 }}
                    />

                    {/* Medical Cross Background */}
                    <motion.circle
                        cx="20"
                        cy="14"
                        r="5"
                        fill="white"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                    />

                    {/* Red Cross */}
                    <motion.path
                        d="M20 11V17M17 14H23"
                        stroke="#ef4444" // Red-500
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ delay: 0.7, duration: 0.4 }}
                    />

                    {/* Bottom Lines (Abstract Text) */}
                    <motion.rect
                        x="12"
                        y="22"
                        width="16"
                        height="2"
                        rx="1"
                        fill="#e2e8f0"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ delay: 0.9, duration: 0.3 }}
                    />
                    <motion.rect
                        x="12"
                        y="26"
                        width="10"
                        height="2"
                        rx="1"
                        fill="#e2e8f0"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ delay: 1.0, duration: 0.3 }}
                    />
                    <motion.rect
                        x="12"
                        y="30"
                        width="14"
                        height="2"
                        rx="1"
                        fill="#e2e8f0"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ delay: 1.1, duration: 0.3 }}
                    />
                </motion.svg>
            </motion.div>

            {/* Text Animation */}
            <div className={`flex ${textSize} font-bold tracking-tight`}>
                <motion.span
                    className="text-blue-600"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                >
                    Med
                </motion.span>
                <motion.span
                    className="text-cyan-500"
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                >
                    Scan
                </motion.span>
                <motion.span
                    className="text-teal-500"
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
                >
                    X
                </motion.span>
            </div>
        </div>
    );
};
