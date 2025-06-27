"use client"

import Link from 'next/link';
import React, { useState } from 'react';

export function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <nav className="fixed top-0 left-0 w-full z-50">
            <div className="flex justify-between items-center w-full px-6 md:px-36 py-4 mx-auto">
                <Link href="/">
                    <h1 className="font-bold text-xl text-white">Antariksh</h1>
                </Link>
                {/* Desktop menu */}
                <div className="hidden md:flex gap-6">
                    <Link href="/about" className="text-white hover:underline">About</Link>
                    <Link href="/events" className="text-white hover:underline">Events</Link>
                    <Link href="/projects" className="text-white hover:underline">Projects</Link>
                    <Link href="/gallery" className="text-white hover:underline">Gallery</Link>
                    <Link href="/join" className="text-white hover:underline">Join / Contact Us</Link>
                </div>
                {/* Hamburger */}
                <button
                    className="md:hidden flex flex-col justify-center items-center w-8 h-8 relative z-30"
                    aria-label="Toggle menu"
                    onClick={() => setMenuOpen((open) => !open)}
                >
                    <span
                        className={`block h-0.5 w-6 bg-white transition-all duration-300 rounded-sm ${menuOpen ? 'rotate-45 translate-y-2' : ''}`}
                    />
                    <span
                        className={`block h-0.5 w-6 bg-white transition-all duration-300 rounded-sm my-1 ${menuOpen ? 'opacity-0' : ''}`}
                    />
                    <span
                        className={`block h-0.5 w-6 bg-white transition-all duration-300 rounded-sm ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`}
                    />
                </button>
                {/* Mobile menu */}
                <div
                    className={`fixed inset-0 bg-black/30 backdrop-blur transition-transform duration-300 z-20 flex flex-col items-center justify-center gap-8 md:hidden ${menuOpen ? 'translate-x-0' : 'translate-x-full'
                        }`}
                >
                    <Link href="/about" className="text-2xl" onClick={() => setMenuOpen(false)}>About</Link>
                    <Link href="/events" className="text-2xl" onClick={() => setMenuOpen(false)}>Events</Link>
                    <Link href="/projects" className="text-2xl" onClick={() => setMenuOpen(false)}>Projects</Link>
                    <Link href="/gallery" className="text-2xl" onClick={() => setMenuOpen(false)}>Gallery</Link>
                    <Link href="/join" className="text-2xl" onClick={() => setMenuOpen(false)}>Join / Contact Us</Link>
                </div>
                {/* Overlay when menu is open */}
                {menuOpen && (
                    <div
                        className="fixed inset-0 z-10 md:hidden"
                        onClick={() => setMenuOpen(false)}
                        aria-hidden="true"
                    />
                )}
            </div>
        </nav>
    );
}