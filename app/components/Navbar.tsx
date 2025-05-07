'use client';
import React from 'react';

const Navbar = () => {
    return (
        <header className="bg-emerald-700 border-b p-4 shadow-sm flex items-center justify-between">
            <div className="text-xl font-semibold text-white">Legacy LLM POC</div>
            <span className="text-sm text-emerald-100">Empowering clinicians with AI</span>
        </header>
    );
};

export default Navbar;
