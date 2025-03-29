import { Sparkles } from 'lucide-react'
import Link from 'next/link'

export default function WorkInProgress() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-900 via-purple-900 to-rose-900">
      <div className="text-center text-white space-y-8 p-8">
        <div className="flex items-center justify-center gap-3 mb-8">
          <Sparkles className="w-12 h-12 text-yellow-400 animate-pulse" />
          <h1 className="text-4xl md:text-6xl font-bold">Coming Soon!</h1>
          <Sparkles className="w-12 h-12 text-yellow-400 animate-pulse" />
        </div>
        
        <p className="text-xl md:text-2xl text-gray-200 max-w-2xl">
          This feature is currently under development and will be available once we win the hackathon! 🏆
        </p>
        
        <div className="mt-12">
          <Link 
            href="/"
            className="px-8 py-4 bg-white text-purple-900 rounded-full text-lg font-semibold hover:shadow-lg transition-all hover:scale-105"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
} 