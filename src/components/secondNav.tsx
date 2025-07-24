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
    { label: 'Project', href: '/projects' },
    { label: 'Gallery', href: '/gallery' },
    { label: 'Join Us', href: '/join' },
  ];

  return (
    <nav className='justify-between px-10 p-3 hidden lg:flex items-center fixed w-full bg-transparent z-[2000]'>
      <Image src={`/logo.svg`} width={65} height={65} alt="logo" />
      <div>
        <ul className='flex gap-7 font-semibold'>
          {elements.map((element, index) => (
            <li key={index} className='text-[20px]'>
              <Link
                href={element.href}
                className={`hover:text-gray-500 pb-1 border-b-2 transition-all ${
                  pathname === element.href ? 'border-white hover:border-gray-500' : 'border-transparent'
                }`}
              >
                {element.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      {/* <div className='relative'>
      
        <input
          type="text"
          placeholder='search here'
          className='border rounded-md p-2 pr-10'
        />
        <button className='absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer'>
          <Search />
        </button>
      </div> */}
    </nav>
  );
}
