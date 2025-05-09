"use client";

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SearchFeature from '@/features/Search';
import LLMFeature from '@/features/LLMFeature';
import { HomeIcon, SearchIcon, MessageSquareIcon } from 'lucide-react';
import {Button} from "@/components/ui/button";

const features = [
    { id: 'search', label: 'Search Examples', icon: SearchIcon },
    { id: 'llm', label: 'LLM Suggestion', icon: MessageSquareIcon },
];

export default function Page() {
    const [activeFeature, setActiveFeature] = useState('llm');

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />

            {/* Main Content */}
            <main className="flex-grow p-4">
                {activeFeature === 'search' && <SearchFeature />}
                {activeFeature === 'llm' && <LLMFeature />}
            </main>

            {/* Bottom Navigation */}
            <nav className="bg-emerald-700 text-white flex justify-around py-2 md:hidden">
                {features.map(({ id, icon: Icon }) => (
                    <Button
                        key={id}
                        variant={activeFeature === id ? 'default' : 'ghost'}
                        className="flex flex-col items-center justify-center text-xs p-2"
                        onClick={() => setActiveFeature(id)}
                    >
                        <Icon size={22} />
                    </Button>
                ))}
            </nav>

            {/* Desktop Nav (optional) */}
            <aside className="hidden md:flex justify-center gap-4 bg-emerald-50 p-4 border-t">
                {features.map(({ id, label }) => (
                    <Button
                        key={id}
                        variant={activeFeature === id ? 'default' : 'outline'}
                        onClick={() => setActiveFeature(id)}>
                        {label}
                    </Button>
                ))}
            </aside>

            <Footer />
        </div>
    );
}
