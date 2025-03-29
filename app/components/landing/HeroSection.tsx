'use client'

import { motion } from 'framer-motion'
import { Search, Sparkles, Globe, Clock } from 'lucide-react'
import { useEffect, useState } from 'react'

interface HeroSectionProps {
  onStartSearch: () => void
}

export default function HeroSection({ onStartSearch }: HeroSectionProps) {
  const [mounted, setMounted] = useState(false)
  const [particles, setParticles] = useState<Array<{ x: number, y: number }>>([])

  // Set up window dimensions and particles
  useEffect(() => {
    const updateParticles = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      const newParticles = Array.from({ length: 20 }, () => ({
        x: Math.random() * width,
        y: Math.random() * height
      }))
      setParticles(newParticles)
    }

    updateParticles()
    setMounted(true)

    window.addEventListener('resize', updateParticles)
    return () => window.removeEventListener('resize', updateParticles)
  }, [])

  if (!mounted) {
    return null // Prevent flash of incorrect content
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900 via-purple-900 to-rose-900" />
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {particles.map((particle, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/10 rounded-full"
            initial={{ x: particle.x, y: particle.y, opacity: 0.5 }}
            animate={{
              y: [particle.y - 20, particle.y + 20],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              y: {
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                repeatType: "reverse"
              },
              opacity: {
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                repeatType: "reverse"
              }
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center text-white space-y-12"
        >
          <motion.h1 
            className="text-5xl md:text-7xl font-bold leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Find your perfect stay
            <br />
            <span className="bg-gradient-to-r from-rose-400 to-purple-400 bg-clip-text text-transparent inline-flex items-center gap-2">
              AI-Powered
              <Sparkles className="w-8 h-8 text-yellow-400 inline animate-pulse" />
            </span>
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Experience travel like never before with personalized recommendations
            powered by advanced AI technology
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button
              onClick={() => {
                onStartSearch();
                const listingsSection = document.getElementById('listings')
                if (listingsSection) {
                  listingsSection.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                  })
                }
              }}
              className="px-8 py-4 bg-white text-gray-900 rounded-full font-semibold hover:bg-gray-100 transition-colors flex items-center gap-2"
            >
              <Search className="w-5 h-5" />
              Start Searching
            </button>
            <button
              onClick={() => {
                const howItWorksSection = document.getElementById('how-it-works')
                if (howItWorksSection) {
                  window.scrollTo({
                    top: howItWorksSection.offsetTop - 100,
                    behavior: 'smooth'
                  })
                }
              }}
              className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-full font-semibold hover:bg-white/20 transition-colors"
            >
              Learn More
            </button>
          </motion.div>

          {/* Feature Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
          >
            {/* Global Coverage */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Global Coverage</h3>
              <p className="text-gray-200 text-sm">Access to over 100k stays across major cities</p>
            </div>

            {/* AI-Powered Matching */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-6 h-6 text-yellow-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">AI-Powered Matching</h3>
              <p className="text-gray-200 text-sm">Smart recommendations based on your preferences</p>
            </div>

            {/* 24/7 Support */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">24/7 Support</h3>
              <p className="text-gray-200 text-sm">Round-the-clock assistance whenever you need it</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
} 