"use client"
import React, { useState, useEffect } from 'react';
import { Home, ArrowLeft, Satellite, Zap } from 'lucide-react';

const Space404Page = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [stars, setStars] = useState<Array<{ id: number; x: number; y: number; size: number; opacity: number }>>([]);

  useEffect(() => {
    // Generate random stars
    const generateStars = () => {
      const newStars = [];
      for (let i = 0; i < 150; i++) {
        newStars.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 3 + 1,
          opacity: Math.random() * 0.8 + 0.2
        });
      }
      setStars(newStars);
    };

    generateStars();

    // Mouse tracking for parallax effect
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const goBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = '/';
    }
  };

  const goHome = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Starfield Background */}
      <div className="absolute inset-0">
        {stars.map(star => (
          <div
            key={star.id}
            className="absolute rounded-full bg-white animate-pulse"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              opacity: star.opacity,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      {/* Nebula/Galaxy Background Effects */}
      <div className="absolute inset-0">
        <div 
          className="absolute top-20 left-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"
          style={{
            transform: `translate(${mousePosition.x * 0.5}px, ${mousePosition.y * 0.5}px)`
          }}
        />
        <div 
          className="absolute bottom-32 right-20 w-80 h-80 bg-blue-500/15 rounded-full blur-3xl animate-pulse delay-1000"
          style={{
            transform: `translate(${mousePosition.x * -0.3}px, ${mousePosition.y * -0.3}px)`
          }}
        />
        <div 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-500"
          style={{
            transform: `translate(calc(-50% + ${mousePosition.x * 0.7}px), calc(-50% + ${mousePosition.y * 0.7}px))`
          }}
        />
      </div>

      {/* Floating Planets */}
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute top-1/4 right-1/4 w-20 h-20 bg-gradient-to-br from-orange-400 to-red-500 rounded-full opacity-60 animate-bounce"
          style={{
            transform: `translate(${mousePosition.x * -0.8}px, ${mousePosition.y * -0.8}px)`,
            animationDuration: '6s'
          }}
        />
        <div 
          className="absolute bottom-1/3 left-1/5 w-16 h-16 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full opacity-50 animate-bounce"
          style={{
            transform: `translate(${mousePosition.x * 1.2}px, ${mousePosition.y * 1.2}px)`,
            animationDuration: '4s',
            animationDelay: '1s'
          }}
        />
        <div 
          className="absolute top-3/4 right-1/3 w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full opacity-40 animate-bounce"
          style={{
            transform: `translate(${mousePosition.x * -0.6}px, ${mousePosition.y * -0.6}px)`,
            animationDuration: '8s',
            animationDelay: '2s'
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
        
        {/* Floating Astronaut */}
        <div 
          className="absolute top-20 right-20 hidden lg:block animate-bounce"
          style={{
            transform: `translate(${mousePosition.x * -1}px, ${mousePosition.y * -1}px)`,
            animationDuration: '3s'
          }}
        >
          {/* <div className="text-6xl">🧑‍🚀</div> */}
        </div>

        {/* Satellite */}
        <div 
          className="absolute bottom-20 left-20 hidden lg:block"
          style={{
            transform: `translate(${mousePosition.x * 0.8}px, ${mousePosition.y * 0.8}px) rotate(${mousePosition.x * 0.1}deg)`
          }}
        >
          <Satellite size={48} className="text-gray-400 animate-spin" style={{ animationDuration: '10s' }} />
        </div>

        {/* 404 Display */}
        <div className="text-center mb-12">
          <div className="relative">
            {/* Glowing 404 */}
            <h1 
              className="text-8xl md:text-9xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-4 select-none"
              style={{
                filter: 'drop-shadow(0 0 20px rgba(168, 85, 247, 0.5))',
                transform: `translate(${mousePosition.x * 0.1}px, ${mousePosition.y * 0.1}px)`
              }}
            >
              404
            </h1>
            
            {/* Lightning/Energy Effects */}
            <div className="absolute inset-0 flex items-center justify-center">
              <Zap className="text-yellow-400 animate-pulse absolute -top-4 -left-4" size={24} />
              <Zap className="text-blue-400 animate-pulse absolute -bottom-4 -right-4" size={20} />
              <Zap className="text-pink-400 animate-pulse absolute top-1/2 -right-8" size={16} />
            </div>
          </div>
        </div>

        {/* SEDS Branding */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            {/* <Rocket className="text-purple-400 mr-3 animate-pulse" size={32} /> */}
            <h2 className="text-3xl md:text-4xl font-bold text-white">SEDS Antariksh</h2>
            {/* <Rocket className="text-blue-400 ml-3 animate-pulse" size={32} style={{ transform: 'scaleX(-1)' }} /> */}
          </div>
          <p className="text-lg md:text-xl text-gray-300 mb-2">Students for the Exploration and Development of Space</p>
        </div>

        {/* Lost in Space Message */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h3 className="text-2xl md:text-3xl font-semibold text-white mb-4">
             Houston, We Have a Problem! 
          </h3>
          <p className="text-gray-400 text-lg mb-6">
            It looks like you&apos;ve drifted into the cosmic void! The page you&apos;re looking for has been 
            launched into deep space or consumed by a black hole.
          </p>
          <div className="bg-gray-900/50 backdrop-blur-md border border-gray-700 rounded-2xl p-6 mb-8">
            <p className="text-purple-300 font-mono text-sm">
              🛰️ MISSION STATUS: Page Not Found<br/>
              📡 SIGNAL STRENGTH: 0%<br/>
              🌌 CURRENT LOCATION: Unknown Galaxy<br/>
              ⭐ RECOMMENDATION: Return to Base
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={goHome}
            className="group px-8 py-4 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:via-pink-600 hover:to-blue-600 focus:ring-4 focus:ring-purple-500/50 transition-all duration-300 transform hover:scale-105 shadow-2xl"
          >
            <div className="flex items-center">
              <Home className="mr-2 group-hover:animate-bounce" size={20} />
              Return to Base
              
            </div>
          </button>
          
          <button
            onClick={goBack}
            className="group px-8 py-4 bg-gray-800/50 backdrop-blur-md border border-gray-600 text-white font-semibold rounded-xl hover:bg-gray-700/50 hover:border-gray-500 focus:ring-4 focus:ring-gray-500/50 transition-all duration-300 transform hover:scale-105"
          >
            <div className="flex items-center">
              <ArrowLeft className="mr-2 group-hover:animate-pulse" size={20} />
              Go Back
              
            </div>
          </button>
        </div>

        {/* Fun Space Facts */}
        <div className="mt-12 text-center">
          <div className="bg-black/30 backdrop-blur-sm border border-gray-800 rounded-xl p-4 max-w-lg mx-auto">
            <p className="text-sm text-gray-400">
              💫 <span className="text-cyan-400">Fun Fact:</span> There are more possible games of chess than atoms in the observable universe!
            </p>
          </div>
        </div>

        {/* Floating Animation Elements */}
        {/* <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 text-2xl animate-bounce" style={{ animationDelay: '0s', animationDuration: '4s' }}>🛰️</div>
          <div className="absolute top-3/4 right-1/4 text-2xl animate-bounce" style={{ animationDelay: '1s', animationDuration: '5s' }}>🌟</div>
          <div className="absolute bottom-1/4 left-1/3 text-2xl animate-bounce" style={{ animationDelay: '2s', animationDuration: '6s' }}>🚀</div>
          <div className="absolute top-1/2 right-1/3 text-xl animate-bounce" style={{ animationDelay: '3s', animationDuration: '4s' }}>🌌</div>
          <div className="absolute bottom-1/3 right-1/5 text-xl animate-bounce" style={{ animationDelay: '1.5s', animationDuration: '5s' }}>⭐</div>
        </div> */}

        {/* Meteor Shower Effect */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="meteor meteor-1"></div>
          <div className="meteor meteor-2"></div>
          <div className="meteor meteor-3"></div>
        </div>
      </div>

    <style>{`
        .meteor {
          position: absolute;
          width: 2px;
          height: 2px;
          background: linear-gradient(45deg, #ffffff, #ffffff00);
          border-radius: 50%;
          box-shadow: 0 0 10px #ffffff;
          transform: rotate(80deg);
        }

        .meteor-1 {
          top: 10%;
          left: -5%;
          animation: meteor 8s linear infinite;
        }

        .meteor-2 {
          top: 30%;
          left: -5%;
          animation: meteor 12s linear infinite 2s;
        }

        .meteor-3 {
          top: 50%;
          left: -5%;
          animation: meteor 10s linear infinite 4s;
        }

        @keyframes meteor {
          0% {
            transform: translate(0, 0) rotate(-50deg);
            opacity: 1;
            width: 2px;
            height: 100px;
          }
          50% {
            opacity: 1;
            width: 2px;
            height: 100px;
          }
          100% {
            transform: translate(120vw, 80vh) rotate(-90deg);
            opacity: 0;
            width: 2px;
            height: 100px;
          }
        }
    `}</style>
    </div>
  );
};

export default Space404Page;