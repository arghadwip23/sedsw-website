'use client';

import { usePathname } from 'next/navigation';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function SecondNav() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(pathname === '/');
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleVisibility = useCallback((shouldShow: boolean) => {
    // Clear any existing timeout
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }

    if (shouldShow) {
      setIsVisible(true);
    } else {
      // Set a new timeout to hide the navbar after 2 seconds
      hideTimeoutRef.current = setTimeout(() => {
        setIsVisible(false);
      }, 250);
    }
  }, []);

  useEffect(() => {
    // Always show on homepage
    if (pathname === '/') {
      setIsVisible(true);
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      handleVisibility(e.clientY <= 100);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      // Clear timeout on cleanup
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    };
  }, [pathname, handleVisibility]);

  type Navlink = {
    label: string;
    href: string;
    icon?: string;
  };

  const elements: Navlink[] = [
    { label: 'Home', href: '/' },
    { label: 'About us', href: '/about' },
    { label: 'Event', href: '/events' },
    //{ label: 'Project', href: '/projects' },
    { label: 'Our Team', href: '/team' },
    { label: 'Join Us', href: '/join' },
  ];

  return (
    <nav
      className={`fixed top-4 left-1/2 transform -translate-x-1/2 w-[calc(100%-10rem)]
        border-2 border-white/10 hidden lg:flex items-center justify-between px-8 py-4
        bg-black/10 backdrop-blur-xl rounded-2xl z-[4000] transition-all duration-300
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full'}`}
    >
      <Link href="/">
        <Image src={`/logo.svg`} width={45} height={45} alt="logo" className="hover:opacity-80 transition-opacity" />
      </Link>
      <div>
        <ul className='flex gap-7 font-semibold'>
          {elements.map((element, index) => (
            <li key={index} className='text-[20px]'>
              <Link
                href={element.href}
                className={`hover:text-gray-300 text-white pb-1 border-b-2 transition-all
                  ${pathname === element.href ? 'border-white hover:border-gray-500' : 'border-transparent'}`}
              >
                {element.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
