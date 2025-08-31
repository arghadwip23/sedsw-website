'use client'; // needed if you're using usePathname in App Router

import { usePathname } from 'next/navigation';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';


export default function SecondNav() {
  const pathname = usePathname();

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
    <nav className='fixed top-4 left-1/2 transform -translate-x-1/2 w-[calc(100%-10rem)] hidden lg:flex items-center justify-between px-8 py-4 bg-black/10 backdrop-blur-xl rounded-2xl z-[4000]'>
      <Image src={`/logo.svg`} width={45} height={45} alt="logo" />
      <div>
        <ul className='flex gap-7 font-semibold'>
          {elements.map((element, index) => (
            <li key={index} className='text-[20px]'>
              <Link
                href={element.href}
                className={`hover:text-gray-300 text-white pb-1 border-b-2 transition-all ${
                  pathname === element.href ? 'border-white hover:border-gray-500' : 'border-transparent'
                }`}
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
