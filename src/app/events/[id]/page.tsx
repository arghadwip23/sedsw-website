/* eslint-disable @next/next/no-img-element */
"use client"
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { MapPinIcon, ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react';

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
    const { id } = useParams();
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
                    setGalleryImages(galleryRes.data.map((img: { url: string }) => img.url));
                }

            } catch (err) {
                console.error("Error fetching event data:", err);
                setEventData(null);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    // Close gallery on Escape key press
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsGalleryOpen(false);
            }
        };

        if (isGalleryOpen) {
            document.addEventListener('keydown', handleKeyDown);
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isGalleryOpen]);

    const nextImage = () => {
        setCurrentImageIndex((prev: number) => (prev + 1) % galleryImages.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev: number) => (prev - 1 + galleryImages.length) % galleryImages.length);
    };

    const closeGallery = () => {
        setIsGalleryOpen(false);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-white text-xl">Loading event...</div>
            </div>
        );
    }

    if (!eventData) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-white text-xl">Event not found</div>
            </div>
        );
    }

    return (
        <section className="nh">
          {/* Header */}
          <div className="header grid grid-cols-1 md:grid-cols-2 gap-2 md:px-20 px-4 mb-10">
            <div className="relative w-full h-64 md:h-96 p-4 rounded-md overflow-hidden">
              <img
                src={eventData.thumbnail}
                alt={eventData.eventName}
                className="object-cover h-full w-full rounded-md bg-yellow-500"
              />
            </div>
            <div className="text-left p-4 flex md:justify-center flex-col items-start">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-left">
                {eventData.eventName}
              </h2>
              <p className="text-left mt-4 text-gray-500 flex gap-2">
                <MapPinIcon />
                {eventData.location}
              </p>
              <p className="text-left mt-4 text-gray-500 flex gap-2">
                <CalendarDays />
                {eventData.date}
              </p>
              <p className="text-left mt-4">{eventData.description}</p>
            </div>
          </div>

          {/* Gallery */}
          <h2 className="px-4 text-center py-5 text-3xl font-bold">Glimpses of the event</h2>
          
          {/* Responsive Gallery Grid */}
          <div className="px-4 md:px-20 mb-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 auto-rows-[250px]">
              {galleryImages.map((img, index) => (
                <div 
                  key={index} 
                  className={`
                    relative overflow-hidden rounded-lg cursor-pointer
                    hover:shadow-xl transition-all duration-300 hover:scale-105
                    ${index % 7 === 0 ? 'sm:col-span-2 sm:row-span-2' : ''}
                    ${index % 11 === 0 ? 'lg:col-span-2' : ''}
                  `}
                  onClick={() => {
                    setCurrentImageIndex(index);
                    setIsGalleryOpen(true);
                  }}
                > 
                  <img 
                    src={img} 
                    alt={`Gallery image ${index + 1}`}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-all duration-300"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Gallery Modal */}
          {isGalleryOpen && (
            <div 
              className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
              onClick={closeGallery} // Click outside to close
            >
              <div className="relative w-full h-full max-w-7xl flex items-center justify-center">
                <div 
                  className="relative w-full h-full max-h-[80vh] flex items-center justify-center"
                  onClick={(e) => e.stopPropagation()} // Prevent closing when clicking on image area
                >
                  <img
                    src={galleryImages[currentImageIndex]}
                    alt={`Gallery ${currentImageIndex + 1}`}
                    className="max-w-full max-h-full object-contain rounded-lg border border-white/20"
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
                
                {/* Exit Button above indicators */}
                <button
                  onClick={closeGallery}
                  className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-10 px-4 py-2 bg-black/70 hover:bg-black/90 rounded-full transition-all duration-300 hover:scale-105 border border-white/30 hover:border-white/60 text-white text-sm font-medium"
                  aria-label="Exit gallery"
                >
                  Exit Gallery
                </button>
                
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex justify-center space-x-3">
                  {galleryImages.map((_: string, index: number) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-4 h-4 rounded-full transition-all duration-300 transform hover:scale-125 ${
                        index === currentImageIndex 
                          ? 'bg-white' 
                          : 'bg-gray-600 hover:bg-gray-500'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>
    );
};

export default EventDetailsPage;