import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';
import { useSlideshow } from '../contexts/SlideshowContext';

const Slideshow: React.FC = () => {
  const { getActiveSlides } = useSlideshow();
  const slides = getActiveSlides();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  // Auto-advance slides
  useEffect(() => {
    if (!isPlaying || slides.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [isPlaying, slides.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const goToPrevious = () => {
    setCurrentSlide(prev => (prev - 1 + slides.length) % slides.length);
  };

  const goToNext = () => {
    setCurrentSlide(prev => (prev + 1) % slides.length);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  if (slides.length === 0) {
    return (
      <div className="relative h-[600px] bg-gray-200 flex items-center justify-center">
        <p className="text-gray-500">No active slides to display</p>
      </div>
    );
  }

  const currentSlideData = slides[currentSlide];

  return (
    <div className="relative h-[600px] overflow-hidden">
      {/* Slide Images */}
      <div className="relative h-full">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
          </div>
        ))}
      </div>

      {/* Slide Content */}
      <div className="absolute inset-0 flex items-center">
        <div className="container">
          <div className="max-w-2xl text-white">
            <div className="mb-4">
              {currentSlideData.type === 'offer' && (
                <span className="inline-block bg-red-500 text-white px-4 py-2 rounded-full text-sm font-bold mb-4">
                  {currentSlideData.offerDetails?.discountPercentage}% OFF - Limited Time!
                </span>
              )}
              <h2 className="text-sm md:text-base font-medium opacity-90 mb-2">
                {currentSlideData.subtitle}
              </h2>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                {currentSlideData.title}
              </h1>
              <p className="text-lg md:text-xl opacity-90 mb-8 max-w-xl leading-relaxed">
                {currentSlideData.description}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to={currentSlideData.buttonLink}
                className="btn btn-primary text-lg px-8 py-4"
              >
                {currentSlideData.buttonText}
              </Link>
              {currentSlideData.type === 'offer' && currentSlideData.offerDetails?.validUntil && (
                <div className="text-sm opacity-75">
                  Valid until: 31/12/2026
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      {/* {slides.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-all backdrop-blur-sm"
            aria-label="Previous slide"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-all backdrop-blur-sm"
            aria-label="Next slide"
          >
            <ChevronRight size={24} />
          </button>
        </>
      )} */}

      {/* Slide Indicators */}
      {slides.length > 1 && (
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${index === currentSlide
                ? 'bg-white scale-125'
                : 'bg-white/50 hover:bg-white/75'
                }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Play/Pause Button */}
      {/* {slides.length > 1 && (
        <button
          onClick={togglePlayPause}
          className="absolute top-6 right-6 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-all backdrop-blur-sm"
          aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
        >
          {isPlaying ? <Pause size={20} /> : <Play size={20} />}
        </button>
      )} */}

      {/* Slide Counter */}
      {/* {slides.length > 1 && (
        <div className="absolute top-6 left-6 bg-white/20 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
          {currentSlide + 1} / {slides.length}
        </div>
      )} */}
    </div>
  );
};

export default Slideshow;