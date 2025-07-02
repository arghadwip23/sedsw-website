"use client";

import Link from "next/link";
import Noise from "../../Animations/Noise/Noise";
import React from "react";

export default function Home() {
  return (
    <div className="w-full h-screen flex flex-col justify-center">
      <div className="w-full h-screen fixed top-0 left-0 -z-[9999]">
        <video
          src="/videos/Earthlow.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        />
      </div>
      <div className="w-full h-full z-0 flex flex-col justify-around pt-48">
        <div className="pl-10">
          <p className="text-2xl">Welcome to</p>
          <h1 className="text-5xl font-extrabold">SEDS ANTARIKSH</h1>
        </div>
        <div className="pl-10 flex items-center align-middle">
          <Link
            href={"/about"}
            className="group relative p-4 border-2 border-white flex justify-center items-center bg-transparent text-white transition-all duration-300 hover:px-6 hover:bg-white hover:text-black overflow-hidden w-40"
          >
            <div className="flex items-center justify-center relative w-full">
              <span className="transition-all duration-300 group-hover:translate-x-[-8px]">
                Learn More
              </span>
              <span className="absolute left-full opacity-0 group-hover:opacity-100 group-hover:translate-x-[-10px] translate-x-[-20px] transition-all duration-300">
                &#8599;
              </span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}