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

      {/* The Unexpected Value Proposition Section (Von Restorff Effect) */}
      <section className="py-24 bg-gray-900 text-white relative overflow-hidden">
        {/* Abstract animated background elements */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mb-16">
            <h2 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight leading-none">
              Not <i className="font-serif italic text-primary-400">just another</i><br/> travel agency.
            </h2>
            <p className="text-xl text-gray-400">
              We don't do cookie-cutter vacations. We design visceral experiences that you'll remember for a lifetime. Here is why we are completely different.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             {/* Bento Card 1: Large */}
             <div className="md:col-span-2 group relative bg-gray-800 rounded-3xl p-8 md:p-12 overflow-hidden transition-transform duration-500 hover:scale-[1.02] shadow-2xl">
               <div className="absolute inset-0 bg-gradient-to-br from-primary-600 to-purple-800 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
               <div className="relative z-10">
                 <h3 className="text-3xl font-bold mb-4 group-hover:text-white transition-colors">Radically Customized</h3>
                 <p className="text-gray-400 group-hover:text-primary-100 text-lg max-w-md transition-colors">
                   We obsess over your itinerary. Down to the side of the train you should sit on for the best sunset view. No two trips are ever the same.
                 </p>
               </div>
               <div className="absolute bottom-0 right-0 w-64 h-64 bg-[url('https://images.pexels.com/photos/2387418/pexels-photo-2387418.jpeg')] bg-cover bg-center rounded-tl-full opacity-50 group-hover:scale-110 group-hover:opacity-100 transition-all duration-700"></div>
             </div>

             {/* Bento Card 2: Small */}
             <div className="group relative bg-[#1c1c1c] rounded-3xl p-8 overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(99,197,223,0.3)] border border-gray-800 hover:border-primary-500/50">
               <div className="text-primary-400 mb-6 font-serif italic text-6xl">02</div>
               <h3 className="text-2xl font-bold mb-3">Zero Hidden Fees</h3>
               <p className="text-gray-400">We hate surprise charges as much as you do. The price you see is the final price. Period.</p>
             </div>

             {/* Bento Card 3: Small */}
             <div className="group relative bg-white text-gray-900 rounded-3xl p-8 overflow-hidden transition-all duration-500 hover:rotate-1 shadow-xl">
               <h3 className="text-2xl font-bold mb-3">Local Secrets</h3>
               <p className="text-gray-600 mb-8">We skip the tourist traps and take you to the hidden gems only the locals know about.</p>
               <div className="inline-flex py-2 px-4 bg-gray-900 text-white rounded-full text-sm font-bold uppercase tracking-wider group-hover:bg-primary-500 transition-colors">Explore</div>
             </div>

             {/* Bento Card 4: Large */}
             <div className="md:col-span-2 group relative bg-primary-500 rounded-3xl p-8 md:p-12 overflow-hidden transition-transform duration-500 hover:scale-[1.02] shadow-xl">
                <div className="relative z-10 h-full flex flex-col justify-between">
                  <div>
                    <h3 className="text-3xl font-bold mb-4 text-white">24/7 Concierge</h3>
                    <p className="text-primary-100 text-lg max-w-sm">
                      Flight delayed? Lost passport? Middle of the night in a foreign country? We are one call away, always awake, and ready to fix it.
                    </p>
                  </div>
                  <div className="mt-8">
                    <a href="tel:+917869147222" className="inline-block bg-white text-primary-600 font-bold py-3 px-8 rounded-full hover:bg-gray-100 transition-transform hover:scale-105">Call us now</a>
                  </div>
                </div>
                <div className="absolute -bottom-20 -right-20 w-96 h-96 border-[40px] border-white/20 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
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
            <Link to="/reviews" className="btn bg-primary-500 hover:bg-primary-600 text-white px-8 py-3 rounded-full">
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
                    <ChevronUp className="text-primary-500 flex-shrink-0" size={20} />
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