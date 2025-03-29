'use client'

import { motion } from 'framer-motion'
import { Search, Wand2, MessageSquareText, Brain } from 'lucide-react'

interface HowItWorksProps {
  onStartSearch: () => void
}

export default function HowItWorks({ onStartSearch }: HowItWorksProps) {
  return (
    <section 
      id="how-it-works" 
      className="relative bg-gray-50 py-32 scroll-mt-24"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-100/50" />
      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-20">
          <motion.h2 
            className="text-4xl font-bold text-gray-900 mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-150px" }}
          >
            How It Works
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Our AI understands natural language, so you can search exactly how you'd describe your perfect stay
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Natural Language Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
              <Wand2 className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Natural Language Search</h3>
            <p className="text-gray-600 mb-6">Just type like you're talking to a friend. Our AI understands context and preferences.</p>
            <div className="space-y-3 text-sm text-gray-500">
              <p>"Find me a beachfront villa in Bali with a pool"</p>
              <p>"Modern apartment in Paris near the Eiffel Tower"</p>
              <p>"Pet-friendly cabin in the mountains"</p>
            </div>
          </motion.div>

          {/* Smart Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="bg-rose-100 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
              <Brain className="w-6 h-6 text-rose-600" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Smart Filters</h3>
            <p className="text-gray-600 mb-6">Include specific requirements in your search for perfect matches.</p>
            <div className="space-y-3 text-sm text-gray-500">
              <p>"Luxury villa under $300 per night"</p>
              <p>"Family-friendly house with 3+ bedrooms"</p>
              <p>"Quiet retreat with mountain views"</p>
            </div>
          </motion.div>

          {/* Personalized Recommendations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="bg-yellow-100 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
              <MessageSquareText className="w-6 h-6 text-yellow-600" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Special Requirements</h3>
            <p className="text-gray-600 mb-6">Get specific about amenities and special features you need.</p>
            <div className="space-y-3 text-sm text-gray-500">
              <p>"Place with a chef's kitchen and ocean view"</p>
              <p>"Accessible apartment with elevator access"</p>
              <p>"Villa with private gym and yoga space"</p>
            </div>
          </motion.div>
        </div>

        <div className="text-center mt-16">
          <motion.button
            onClick={() => {
              onStartSearch();
              // First try to find the search trigger button
              const navbarSearch = document.querySelector('[data-search-trigger]');
              if (navbarSearch && navbarSearch instanceof HTMLElement) {
                navbarSearch.click();
              }
              
              // Scroll to the listings section
              const listingsSection = document.getElementById('listings');
              if (listingsSection) {
                window.scrollTo({
                  top: listingsSection.offsetTop - 32,
                  behavior: "smooth"
                });
              }
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 px-8 py-4 bg-purple-600 text-white rounded-full text-lg font-semibold hover:bg-purple-700 transition-colors"
          >
            <Search className="w-5 h-5" />
            Try It Now
          </motion.button>
        </div>
      </div>
    </section>
  )
} 