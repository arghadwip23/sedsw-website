"use client"

import Link from 'next/link';
import React, { useState, useRef, useEffect } from 'react';
import "./navbar.css";

import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import DecryptedText from '../../TextAnimations/DecryptedText/DecryptedText';

const menuLinks = [
    { path: "/", label: "Home" },
    { path: "/about", label: "About" },
    { path: "/events", label: "Events" },
    { path: "/projects", label: "Projects" },
    { path: "/gallery", label: "Gallery" },
    { path: "/join", label: "Join Us" },
];

export function Navbar() {
    const container = useRef<HTMLDivElement | null>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const tl = useRef<gsap.core.Timeline | null>(null);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    useGSAP(
        () => {
            gsap.set(".menu-link-item-holder", { y: 75 });

            tl.current = gsap.timeline({ paused: true })
                .to(".menu-overlay", {
                    duration: 1.25,
                    clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
                    ease: "power4.inOut",
                })
                .to(".menu-link-item-holder", {
                    y: 0,
                    duration: 1,
                    stagger: 0.1,
                    ease: "power4.inOut",
                    delay: -0.75,
                });
        },
        { scope: container }
    );

    useEffect(() => {
        if (tl.current) {
            if (isMenuOpen) {
                tl.current.play();
            } else {
                tl.current.reverse();
            }
        }
    }, [isMenuOpen]);

    // Close menu on Escape key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                if (isMenuOpen) {
                    setIsMenuOpen(false);
                } else {
                    setIsMenuOpen(true);
                }

            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isMenuOpen]);

    return (
        <div className="menu-container z-50" ref={container}>
            <div className="menu-bar">
                <div className="menu-logo">
                    <Link href={"/"}>Antariksh</Link>
                </div>
                <div className="menu-open" onClick={toggleMenu}>
                    <p>Menu</p>
                </div>
            </div>
            <div className="menu-overlay">
                <div className="menu-overlay-bar">
                    <Link href={"/"}>Antariksh</Link>
                    <div className="menu-logo"></div>
                    <div className="menu-close" onClick={toggleMenu}>
                        <p>Close</p>
                    </div>
                </div>
                <div className="menu-close-icon" onClick={toggleMenu}>
                    <p>&#x2715;</p>
                </div>
                <div className="menu-copy">
                    <div className="menu-links">
                        {menuLinks.map((link, index) => (
                            <div className="menu-link-item" key={index}>
                                <div className="menu-link-item-holder" onClick={toggleMenu}>
                                    <Link href={link.path} className="menu-link">
                                        <DecryptedText
                                            text={link.label}
                                            speed={50}
                                            maxIterations={10}
                                            revealDirection='start'
                                            useOriginalCharsOnly={true}
                                        />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="menu-info">
                        <div className="menu-info-col">
                            <a href='#'>Instagram &#8599;</a>
                            <a href='#'>Medium &#8599;</a>
                            <a href='#'>Twitter &#8599;</a>
                        </div>
                        <div className="menu-info-col">
                            <p>info@antariksh.com</p>
                            <p>VIT Chennai</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}