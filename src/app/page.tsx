"use client";

import Link from "next/link";
import React, { useState, useRef, useEffect } from "react";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;

    if (!video) return;

    const handleProgress = () => {
      if (video.buffered.length > 0) {
        const bufferedEnd = video.buffered.end(video.buffered.length - 1);
        const duration = video.duration;
        if (duration > 0) {
          setProgress((bufferedEnd / duration) * 100);
        }
      }
    };

    const handleCanPlay = () => {
      // Small delay to ensure smooth transition
      setTimeout(() => setIsLoading(false), 500);
    };

    video.addEventListener('progress', handleProgress);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('loadeddata', handleCanPlay);

    // Check if video is already loaded
    if (video.readyState >= 3) {
      handleCanPlay();
    }

    return () => {
      video.removeEventListener('progress', handleProgress);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('loadeddata', handleCanPlay);
    };
  }, []);

  return (
    <div className="w-full h-screen flex flex-col justify-center relative">
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 z-50 bg-black flex flex-col items-center justify-center">
          <div className="w-64 h-1 bg-gray-700 rounded-full overflow-hidden mb-4">
            <div
              className="h-full bg-white transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-white text-lg">Loading...</p>
          <p className="text-gray-400 text-sm mt-2">{Math.round(progress)}%</p>
        </div>
      )}

      <div className="w-full h-screen fixed top-20 left-0 -z-[9999]">
        <video
          ref={videoRef}
          src="/videos/Earthlow.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        />
      </div>

      <div className={`w-full h-full z-0 flex flex-col justify-around pt-48 transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
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