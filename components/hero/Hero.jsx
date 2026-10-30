"use client";
import React from "react";
import { SparklesCore } from "../ui/sparkles";
import Link from "next/link";
import { Typewriter } from 'react-simple-typewriter';
import { Space_Grotesk } from 'next/font/google';

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'] });

export default function Hero() {
    return (
        <div className="h-screen relative w-full bg-black flex flex-col items-center justify-center overflow-hidden rounded-md">
            <div className="w-full absolute inset-0 h-screen">
                <SparklesCore
                    id="tsparticlesfullpage"
                    background="transparent"
                    minSize={0.6}
                    maxSize={1.4}
                    particleDensity={100}
                    className="w-full h-full"
                    particleColor="#FFFFFF"
                />
            </div>
            
            <h1 className={`${spaceGrotesk.className} md:text-8xl text-4xl lg:text-7xl font-bold text-center text-white relative z-20 tracking-tighter`}>
                Free Resume Maker
            </h1>

            <div className={`${spaceGrotesk.className} text-center text-slate-500 text-xl mt-4 relative z-20`}>
                <Typewriter
                    words={['ATS Friendly', 'Smart Suggestions', 'Professional & Perfect']}
                    loop={0}
                    cursor
                    cursorStyle='|'
                    typeSpeed={10}
                    deleteSpeed={10}
                    delaySpeed={800}
                />
            </div>

            {/* Beam and additional sparkles container */}
            <div className="w-[40rem] h-40 relative">
                {/* Beam gradients */}
                <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-[2px] w-3/4 blur-sm" />
                <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-px w-3/4" />
                <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-[5px] w-1/4 blur-sm" />
                <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px w-1/4" />

                {/* Additional sparkles under text */}
                <SparklesCore
                    background="transparent"
                    minSize={0.4}
                    maxSize={1}
                    particleDensity={1200}
                    className="w-full h-full"
                    particleColor="#FFFFFF"
                />

                {/* Radial gradient mask */}
                <div className="absolute inset-0 w-full h-full bg-black [mask-image:radial-gradient(350px_200px_at_top,transparent_20%,white)]"></div>
            </div>

            <Link
                href="/builder"
                className="relative z-20 -mt-20 inline-flex h-12 animate-shimmer items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
            >
                Create Resume
            </Link>
        </div>
    );
}
