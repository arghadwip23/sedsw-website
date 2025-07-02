"use client";

export default function Home() {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-black">
      <video
        src="/videos/mars.webm"
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-full object-cover"
      />
    </div>
  );
}

