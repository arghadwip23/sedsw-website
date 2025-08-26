"use client"
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
// import * as THREE from 'three';
import { Calendar, MapPin, Tag, Star, ChevronLeft, ChevronRight, X } from 'lucide-react';

interface EventData {
  eventName: string;
  date: string;
  location: string;
  description: string;
  tags: string[];
  images: string[];
  organizer: string;
  participants: number;
  thumbnail?: string;
  category?: string;
}

const EventDetailsPage = () => {
  const { id } = useParams(); // get [id] from URL

  
  const [eventData, setEventData] = useState<EventData | null>(null);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [loading, setLoading] = useState(true);


useEffect(() => {
  if (!id) return;

  const fetchData = async () => {
  try {
    setLoading(true);

    const [eventRes, galleryRes] = await Promise.all([
      fetch(`/api/events/getEvent?id=${id}`).then(res => res.json()),
      fetch(`/api/gallery/getImages?id=${id}`).then(res => res.json())
    ]);

    if (eventRes.success) {
      setEventData(eventRes.data);
    } else {
      setEventData(null);
    }

    if (galleryRes.success) {
      // If backend returns [{ url: "...", description: "..." }]
      setGalleryImages(galleryRes.data.map((img: { url: string }) => img.url));
    }

  } catch (err) {
    console.error("Error fetching event data:", err);
    setEventData(null);
  } finally {
    setLoading(false);  // ✅ always clear loading
  }
};

  fetchData();
}, [id]);


  const formatDate = (dateString: string) => {
    const [day, month, year] = dateString.split('-');
    const date = new Date(Number(year), Number(month) - 1, Number(day));
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getCategoryIcon = (category: string) => {
    const icons = {
      music: '🎵',
      art: '🎨',
      tech: '🚀',
      sports: '⚽',
      conference: '🎯',
      other: '✨'
    };
    return icons[category as keyof typeof icons] || '✨';
  };

  const nextImage = () => {
    setCurrentImageIndex((prev: number) => (prev + 1) % galleryImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev: number) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

 if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading event...
      </div>
    );
  }

  if (!eventData) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Event not found
      </div>
    );
  }


  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
    
      {/* <StarryBackground /> */}
      
      {/* Content Overlay */}
      <div className="relative z-10 min-h-screen bg-transparent">
        {/* Hero Section */}
        <div className="relative bg-transparent h-screen flex items-center justify-center pt-0 border border-white">
          <div className="absolute inset-0 " />
          
          {/* Thumbnail Image */}
          <div className="absolute top-20 right-20 hidden lg:block">
            <div className="relative group">
              <div className="absolute -inset-2 bg-white rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
              <img
                src={eventData.thumbnail}
                alt={eventData.eventName}
                className="relative w-32 h-32 object-cover rounded-full border-4 border-white/20 shadow-2xl transform group-hover:scale-110 transition-transform duration-300"
              />
            </div>
          </div>
          
          <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
            <div className="mb-8 animate-pulse">
              <div className="inline-flex items-center px-4 py-1 bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-sm rounded-full border border-purple-400/30 mb-6 shadow-lg">
                <span className="text-lg mr-1">{getCategoryIcon(eventData.category || 'general')}</span>
                <span className="text-purple-200 uppercase tracking-wider text-sm font-semibold">
                  {eventData.category || 'General'}
                </span>
                <div className="ml-4 w-2 h-2 bg-purple-400 rounded-full animate-ping"></div>
              </div>
            </div>
            
            <h1 className="text-7xl md:text-8xl lg:text-8xl font-bold mb-4 text-white">
              {eventData.eventName}
            </h1>
            
            <div className="flex flex-wrap justify-center gap-6 text-sm mb-4 ">
              <div className="flex items-center bg-black/40 backdrop-blur-sm px-6 py-3 rounded-full border border-cyan-400/30 shadow-lg hover:shadow-cyan-400/20 transition-all duration-300 transform hover:scale-105">
                <Calendar className="w-4 h-4 mr-3 text-cyan-400" />
                <span className="text-cyan-100">{formatDate(eventData.date)}</span>
                <div className="ml-3 w-1 h-1 bg-cyan-400 rounded-full animate-pulse"></div>
              </div>
              
              <div className="flex items-center bg-black/40 backdrop-blur-sm px-6 py-3 rounded-full border border-green-400/30 shadow-lg hover:shadow-green-400/20 transition-all duration-300 transform hover:scale-105">
                <MapPin className="w-6 h-6 mr-3 text-green-400" />
                <span className="text-green-100">{eventData.location}</span>
                <div className="ml-3 w-1 h-1 bg-green-400 rounded-full animate-pulse"></div>
              </div>
            </div>
            
            <div className="mb-16">
              
              <div className="relative group">
                
                <div className="relative  backdrop-blur-sm rounded-2xl p-8   shadow-2xl">
                  <p className="text-lg leading-relaxed text-gray-200">
                    {eventData.description}
                  </p>
                  <div className="absolute top-4 right-4 w-3 h-3 bg-purple-400 rounded-full animate-ping"></div>
                </div>
                </div></div>


            <div className="animate-bounce mt-12">
              <div className="w-8 h-12 border-2 border-white/40 rounded-full flex justify-center mx-auto">
                <div className="w-1 h-4 bg-gradient-to-b from-white/70 to-transparent rounded-full mt-2 animate-pulse" />
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="relative bg-gradient-to-b from-black/60 to-black/90 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto px-4 py-16">
            {/* Description */}
            {/* <div className="mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-8 text-center bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                About This Event
              </h2>
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
                <div className="relative bg-black/60 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/30 shadow-2xl">
                  <p className="text-lg leading-relaxed text-gray-200">
                    {eventData.description}
                  </p>
                  <div className="absolute top-4 right-4 w-3 h-3 bg-purple-400 rounded-full animate-ping"></div>
                </div>
              </div>
            </div> */}

            {/* Gallery Section */}
            <div className="mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-8 text-center bg-gradient-to-r from-pink-400 to-cyan-500 bg-clip-text text-transparent">
                Event Gallery
              </h2>
              
              {/* Gallery Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {galleryImages.map((image: string, index: number) => (
                  <div
                    key={index}
                    className="relative group cursor-pointer"
                    onClick={() => {
                      setCurrentImageIndex(index);
                      setIsGalleryOpen(true);
                    }}
                  >
                    <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg blur opacity-0 group-hover:opacity-50 transition duration-500"></div>
                    <div className="relative">
                      <img
                        src={image}
                        alt={`Gallery ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border border-purple-500/30 transform group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center">
                        <Star className="w-8 h-8 text-yellow-400 animate-pulse" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Event Details */}
            <div className="grid md:grid-cols-2 gap-8">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
                <div className="relative bg-black/60 backdrop-blur-sm rounded-2xl p-8 border border-cyan-500/30 shadow-2xl">
                  <h3 className="text-2xl font-bold mb-6 text-cyan-400 flex items-center">
                    <div className="w-4 h-4 bg-cyan-400 rounded-full mr-3 animate-pulse"></div>
                    Event Details
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center transform hover:translate-x-2 transition-transform duration-200">
                      <Calendar className="w-5 h-5 mr-3 text-cyan-400" />
                      <span>{formatDate(eventData.date)}</span>
                    </div>
                    <div className="flex items-center transform hover:translate-x-2 transition-transform duration-200">
                      <MapPin className="w-5 h-5 mr-3 text-cyan-400" />
                      <span>{eventData.location}</span>
                    </div>
                    <div className="flex items-center transform hover:translate-x-2 transition-transform duration-200">
                      <Tag className="w-5 h-5 mr-3 text-cyan-400" />
                      <span className="capitalize">{eventData.category}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
                <div className="relative bg-black/60 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/30 shadow-2xl">
                  <h3 className="text-2xl font-bold mb-6 text-purple-400 flex items-center">
                    <div className="w-4 h-4 bg-purple-400 rounded-full mr-3 animate-pulse"></div>
                    Quick Actions
                  </h3>
                  <div className="space-y-4">
                    <button className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25">
                      Register Now
                    </button>
                    <button className="w-full py-3 bg-transparent border border-cyan-500 text-cyan-400 hover:bg-cyan-500/10 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105">
                      Add to Calendar
                    </button>
                    <button className="w-full py-3 bg-transparent border border-green-500 text-green-400 hover:bg-green-500/10 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105">
                      Share Event
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Gallery Modal */}
      {isGalleryOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full">
            <button
              onClick={() => setIsGalleryOpen(false)}
              className="absolute top-4 right-4 z-10 p-3 bg-black/70 rounded-full hover:bg-black/90 transition-colors transform hover:scale-110 border border-white/20"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg blur opacity-50"></div>
              <img
                src={galleryImages[currentImageIndex]}
                alt={`Gallery ${currentImageIndex + 1}`}
                className="relative w-full h-96 object-cover rounded-lg border border-white/20"
              />
              
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 p-3 bg-black/70 rounded-full hover:bg-black/90 transition-all duration-300 hover:scale-110 border border-white/20"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 bg-black/70 rounded-full hover:bg-black/90 transition-all duration-300 hover:scale-110 border border-white/20"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex justify-center mt-6 space-x-3">
              {galleryImages.map((_: string, index: number) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-4 h-4 rounded-full transition-all duration-300 transform hover:scale-125 ${
                    index === currentImageIndex 
                      ? 'bg-purple-500 shadow-lg shadow-purple-500/50' 
                      : 'bg-gray-600 hover:bg-gray-500'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventDetailsPage;