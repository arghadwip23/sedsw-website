"use client"
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { MapPinIcon, ChevronLeft, ChevronRight, X, CalendarDays } from 'lucide-react';
//import CosmicBackground from '@/components/StaryBackground';

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

    const nextImage = () => {
        setCurrentImageIndex((prev: number) => (prev + 1) % galleryImages.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev: number) => (prev - 1 + galleryImages.length) % galleryImages.length);
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
  {/* Breadcrumb */}
  <nav className="flex px-4 mb-4 text-sm text-gray-500">
    <ol className="inline-flex items-center space-x-1 md:space-x-3">
      <li className="inline-flex items-center">
        <Link href="/" className="inline-flex items-center text-gray-500 hover:text-gray-700">
          Home
        </Link>
      </li>
      <li>
        <span className="px-2">/</span>
      </li>
      <li className="inline-flex items-center">
        <Link href="/events" className="inline-flex items-center text-gray-500 hover:text-gray-700">
          Events
        </Link>
      </li>
      <li>
        <span className="px-2">/</span>
      </li>
      <li aria-current="page" className="text-gray-400">
        {eventData.eventName}
      </li>
    </ol>
  </nav>

  {/* Header */}
  <div className="header grid grid-cols-1 md:grid-cols-2 gap-2 px-4 mb-10">
    <div className="relative w-full h-64 md:h-full p-4 rounded-md overflow-hidden">
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
  <div className="grid-container">
    {galleryImages.map((img, index) => (
      <div className=' p-0 border-none hover:shadow-xl transition-all delay-200 hover:scale-105' key={index} onClick={() => {
                      setCurrentImageIndex(index);
                      setIsGalleryOpen(true);
                    }}> 
              <img className='grid-item grid-item-1' src={img} alt='' />
              
            </div>
    ))}
  </div>
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
              <div className="absolute -inset-1 bg-gradient-to-r bg-white rounded-lg blur opacity-50"></div>
              <img
                src={galleryImages[currentImageIndex]}
                alt={`Gallery ${currentImageIndex + 1}`}
                className="relative w-full h-96 object-contain rounded-lg border border-white/20"
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
                      ? 'bg-white  ' 
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