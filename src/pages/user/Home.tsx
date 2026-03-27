import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';
import Slideshow from '../../components/Slideshow';
import SearchBar from '../../components/SearchBar';
import TrendingDestinations from '../../components/TrendingDestinations';
import TestimonialCard from '../../components/TestimonialCard';
import { testimonials } from '../../data/testimonials';

const faqs = [
  {
    question: "How do I book a tour package with Ali Tours & Travels?",
    answer: "You can book directly from our website by selecting your desired package and clicking 'Book Now', or you can contact our travel experts via phone or email for a customized booking experience."
  },
  {
    question: "Do you offer customized tour packages?",
    answer: "Yes, we specialize in creating personalized itineraries tailored to your preferences, budget, and travel style. Simply reach out to our team with your requirements."
  },
  {
    question: "What's included in your tour packages?",
    answer: "Our standard packages typically include accommodation, morning breakfast, sightseeing, and local transfers. However, inclusions vary by package, so please check the specific package details."
  },
  {
    question: "Are flights included in the package cost?",
    answer: "Flights are generally not included in standard packages to give you flexibility. However, we can assist you with flight bookings upon request."
  }
];

const Home: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="fade-in">
      {/* Slideshow Section with SearchBar overlapping */}
      <div className="relative">
        <Slideshow />
        <div className="absolute bottom-0 left-0 right-0 transform translate-y-1/2 z-20 px-4">
          <SearchBar compact />
        </div>
      </div>

      {/* Spacing for the overlapping SearchBar */}
      <div className="h-16 md:h-24 bg-white"></div>

      {/* Trending Destinations */}
      <TrendingDestinations />

      {/* Why Ali Tours & Travels? */}
      <section className="py-16 bg-white overflow-hidden">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 border-b-2 border-primary-600 inline-block pb-2">
            Why Ali Tours & Travels ?
          </h2>

          <div className="relative rounded-2xl overflow-hidden shadow-2xl mt-4">
            <img
              src="https://images.pexels.com/photos/33041/antelope-canyon-lower-canyon-arizona.jpg"
              alt="Why Ali Tours Background"
              className="w-full h-[500px] object-cover"
            />
            {/* Dark overlay for better contrast if needed */}
            <div className="absolute inset-0 bg-black/10"></div>

            {/* Cards container */}
            <div className="absolute bottom-6 left-0 right-0 px-6 overflow-x-auto hide-scrollbar">
              <div className="flex space-x-4 w-max">
                {/* Card 1 */}
                <div className="w-64 bg-white rounded-xl overflow-hidden shadow-lg flex flex-col items-center p-6 flex-shrink-0">
                  <h3 className="text-orange-500 font-bold text-lg mb-2">Trusted Advisor</h3>
                  <p className="text-gray-600 text-sm mb-4 text-center">Trusted Since 2010, Designed for Modern Journeys.</p>
                  {/* <div className="mt-auto h-24 bg-orange-100 w-full rounded-t-full"></div> Placeholder for illustration */}
                </div>

                {/* Card 2 */}
                <div className="w-64 bg-orange-500 text-white rounded-xl shadow-lg p-6 flex-shrink-0 relative overflow-hidden">
                  <h3 className="font-bold text-lg mb-2 relative z-10">Customized Holidays</h3>
                  <p className="text-orange-100 text-sm relative z-10">Offers the ability to personalize your holidays according to your needs.</p>
                </div>

                {/* Card 3 */}
                <div className="w-64 bg-blue-500 text-white rounded-xl shadow-lg p-6 flex-shrink-0 relative overflow-hidden">
                  <h3 className="font-bold text-lg mb-2 relative z-10">Wide Varieties of Holidays</h3>
                  <p className="text-blue-100 text-sm relative z-10">From adventure trips to romantic honeymoon getaways, we have your back.</p>
                </div>

                {/* Card 4 */}
                <div className="w-64 bg-white rounded-xl overflow-hidden shadow-lg flex flex-col p-6 flex-shrink-0">
                  <h3 className="text-blue-600 font-bold text-lg mb-2">Seamless Booking</h3>
                  <p className="text-gray-600 text-sm mb-4">Book from a wide selection of travel plans with easy online payments.</p>
                </div>

                {/* Card 5 */}
                <div className="w-64 bg-yellow-50 rounded-xl overflow-hidden shadow-lg p-6 flex-shrink-0">
                  <h3 className="text-yellow-600 font-bold text-lg mb-2">Convenient Holidays</h3>
                  <p className="text-gray-700 text-sm">All-in-one travel plans featuring accommodations, flights, activities, meals, and more.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold mb-4">What Our Customers Say</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Don't just take our word for it. Here's what travelers who have explored with us have to say.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/reviews" className="btn bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full">
              View All Reviews <ArrowRight size={18} className="inline ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-600">Find answers to common questions about our tours and services.</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg overflow-hidden transition-all duration-300"
              >
                <button
                  className="w-full flex justify-between items-center p-5 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                >
                  <span className="font-semibold text-gray-800">{faq.question}</span>
                  {openFaq === index ? (
                    <ChevronUp className="text-blue-600 flex-shrink-0" size={20} />
                  ) : (
                    <ChevronDown className="text-gray-400 flex-shrink-0" size={20} />
                  )}
                </button>
                <div
                  className={`px-5 py-4 bg-white text-gray-600 leading-relaxed transition-all duration-300 ${openFaq === index ? 'block' : 'hidden'}`}
                >
                  {faq.answer}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;