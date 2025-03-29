import { Listing } from '../types'

// Store viewed listings in localStorage
export const storeViewedListing = (listingId: number) => {
  if (typeof window === 'undefined') return
  
  const viewedListings = JSON.parse(localStorage.getItem('viewedListings') || '[]')
  if (!viewedListings.includes(listingId)) {
    viewedListings.unshift(listingId)
    // Keep only last 10 viewed listings
    if (viewedListings.length > 10) {
      viewedListings.pop()
    }
    localStorage.setItem('viewedListings', JSON.stringify(viewedListings))
  }
}

// Calculate similarity score between two listings
const calculateSimilarity = (listing1: Listing, listing2: Listing): number => {
  let score = 0
  
  // Category match
  if (listing1.category === listing2.category) {
    score += 0.3
  }
  
  // Price range similarity (within 20% range)
  const priceDiff = Math.abs(listing1.price - listing2.price)
  const priceRange = Math.max(listing1.price, listing2.price) * 0.2
  if (priceDiff <= priceRange) {
    score += 0.2
  }
  
  // Location proximity (rough calculation using latitude/longitude)
  const distance = Math.sqrt(
    Math.pow(listing1.latitude - listing2.latitude, 2) +
    Math.pow(listing1.longitude - listing2.longitude, 2)
  )
  if (distance < 1) { // Within roughly 111km
    score += 0.2
  }
  
  // Rating similarity
  if (Math.abs(listing1.rating - listing2.rating) <= 0.5) {
    score += 0.15
  }
  
  // Host rating similarity
  if (Math.abs(listing1.host.rating - listing2.host.rating) <= 0.5) {
    score += 0.15
  }
  
  return score
}

// Get recommended listings based on viewing history
export const getRecommendedListings = (
  allListings: Listing[],
  currentListingId?: number,
  limit: number = 4
): Listing[] => {
  if (typeof window === 'undefined') return []
  
  // Get viewed listings from localStorage
  const viewedListingIds = JSON.parse(localStorage.getItem('viewedListings') || '[]')
  
  // If no viewing history and no current listing, return highest rated listings
  if (viewedListingIds.length === 0 && !currentListingId) {
    return allListings
      .sort((a, b) => b.rating - a.rating)
      .slice(0, limit)
  }
  
  // Calculate scores for all listings based on viewing history
  const scores = new Map<number, number>()
  
  allListings.forEach(listing => {
    if (listing.id === currentListingId) return // Skip current listing
    
    let totalScore = 0
    let weightSum = 0
    
    // Consider current listing if available
    if (currentListingId) {
      const currentListing = allListings.find(l => l.id === currentListingId)
      if (currentListing) {
        const similarity = calculateSimilarity(currentListing, listing)
        totalScore += similarity * 2 // Give more weight to current listing
        weightSum += 2
      }
    }
    
    // Consider viewing history
    viewedListingIds.forEach((viewedId: number, index: number) => {
      const viewedListing = allListings.find(l => l.id === viewedId)
      if (viewedListing) {
        const weight = 1 / (index + 1) // More recent = higher weight
        const similarity = calculateSimilarity(viewedListing, listing)
        totalScore += similarity * weight
        weightSum += weight
      }
    })
    
    // Calculate final weighted score
    const finalScore = weightSum > 0 ? totalScore / weightSum : 0
    scores.set(listing.id, finalScore)
  })
  
  // Sort listings by score and return top recommendations
  return allListings
    .filter(listing => listing.id !== currentListingId)
    .sort((a, b) => (scores.get(b.id) || 0) - (scores.get(a.id) || 0))
    .slice(0, limit)
} 