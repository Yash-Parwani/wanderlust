'use client'

import { useEffect } from 'react'

export default function ScrollRestoration() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Disable browser's scroll restoration
      if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'manual'
      }
      // Force scroll to top
      window.scrollTo(0, 0)
    }
  }, [])

  return null
} 