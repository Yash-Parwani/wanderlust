import { Listing } from '../types'

// Debounce function
export const debounce = <T extends (...args: any[]) => void>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// Calculate search score for a listing based on keyword matches
const calculateSearchScore = (listing: Listing, keywords: string[]): number => {
  let score = 0
  const searchFields = {
    title: 3, // Higher weight for title matches
    location: 2.5, // High weight for location matches
    category: 2, // Medium weight for category
    description: 1, // Lower weight for description
    amenities: 1.5 // Medium weight for amenities
  }

  // Normalize text for comparison
  const normalize = (text: string) => text.toLowerCase().trim()

  // Check each keyword against each field
  keywords.forEach(keyword => {
    const normalizedKeyword = normalize(keyword)
    
    // Title matches
    if (normalize(listing.title).includes(normalizedKeyword)) {
      score += searchFields.title
      // Bonus for exact word matches in title
      if (normalize(listing.title).split(/\s+/).includes(normalizedKeyword)) {
        score += 1
      }
    }
    
    // Location matches
    if (normalize(listing.location).includes(normalizedKeyword)) {
      score += searchFields.location
      // Bonus for exact location match
      if (normalize(listing.location).split(/\s+/).includes(normalizedKeyword)) {
        score += 0.5
      }
    }
    
    // Category matches
    if (normalize(listing.category).includes(normalizedKeyword)) {
      score += searchFields.category
    }
    
    // Description matches
    if (normalize(listing.description).includes(normalizedKeyword)) {
      score += searchFields.description
    }
    
    // Amenities matches
    listing.amenities.forEach(amenity => {
      if (normalize(amenity).includes(normalizedKeyword)) {
        score += searchFields.amenities
      }
    })
  })

  return score
}

// Search listings with ranking
export const searchListings = (
  listings: Listing[],
  searchQuery: string,
  minScore: number = 0.5 // Minimum score threshold
): Listing[] => {
  if (!searchQuery.trim()) return listings

  // Split search query into keywords
  const keywords = searchQuery
    .toLowerCase()
    .split(/\s+/)
    .filter(keyword => keyword.length > 1) // Filter out single-character keywords

  // Special handling for common combinations
  const commonPhrases = [
    // Beach related
    { words: ['beach', 'house'], category: 'Beach' },
    { words: ['beach', 'front'], category: 'Beach' },
    { words: ['beachfront'], category: 'Beach' },
    { words: ['oceanfront'], category: 'Beach' },
    { words: ['ocean', 'view'], category: 'Beach' },
    { words: ['ocean', 'front'], category: 'Beach' },
    { words: ['seaside'], category: 'Beach' },
    { words: ['sea', 'view'], category: 'Beach' },
    { words: ['waterfront'], category: 'Beach' },
    { words: ['coastal'], category: 'Beach' },

    // Mountain related
    { words: ['mountain', 'view'], category: 'Mountain' },
    { words: ['mountain', 'house'], category: 'Mountain' },
    { words: ['mountain', 'cabin'], category: 'Mountain' },
    { words: ['ski', 'chalet'], category: 'Mountain' },
    { words: ['hiking', 'cabin'], category: 'Mountain' },
    { words: ['alpine'], category: 'Mountain' },
    { words: ['hillside'], category: 'Mountain' },
    { words: ['mountain', 'retreat'], category: 'Mountain' },

    // City related
    { words: ['city', 'center'], category: 'City' },
    { words: ['downtown'], category: 'City' },
    { words: ['central'], category: 'City' },
    { words: ['urban'], category: 'City' },
    { words: ['city', 'apartment'], category: 'City' },
    { words: ['metropolitan'], category: 'City' },
    { words: ['penthouse'], category: 'City' },
    { words: ['loft'], category: 'City' },

    // Countryside related
    { words: ['countryside'], category: 'Countryside' },
    { words: ['rural'], category: 'Countryside' },
    { words: ['farm', 'house'], category: 'Countryside' },
    { words: ['farmhouse'], category: 'Countryside' },
    { words: ['cottage'], category: 'Countryside' },
    { words: ['ranch'], category: 'Countryside' },
    { words: ['village'], category: 'Countryside' },
    { words: ['barn'], category: 'Countryside' },

    // Luxury related
    { words: ['luxury', 'villa'], category: 'Luxury' },
    { words: ['luxury', 'resort'], category: 'Luxury' },
    { words: ['luxury', 'suite'], category: 'Luxury' },
    { words: ['premium'], category: 'Luxury' },
    { words: ['exclusive'], category: 'Luxury' },
    { words: ['high', 'end'], category: 'Luxury' },
    { words: ['upscale'], category: 'Luxury' },
    { words: ['elegant'], category: 'Luxury' },
    { words: ['mansion'], category: 'Luxury' },
    { words: ['estate'], category: 'Luxury' },

    // Property types (can match multiple categories)
    { words: ['private', 'pool'], category: 'Luxury' },
    { words: ['infinity', 'pool'], category: 'Luxury' },
    { words: ['villa'], category: 'Luxury' },
    { words: ['modern'], category: 'City' },
    { words: ['traditional'], category: 'Countryside' },
    { words: ['cozy'], category: 'Countryside' },
    { words: ['spacious'], category: 'Luxury' },

    // Location specific
    { words: ['beach', 'bali'], category: 'Beach' },
    { words: ['tropical'], category: 'Beach' },
    { words: ['island'], category: 'Beach' },
    { words: ['resort'], category: 'Luxury' }
  ]

  // Check if search query matches any common phrases
  const matchedPhrases = commonPhrases.filter(phrase =>
    phrase.words.every(word => keywords.includes(word))
  )

  // Calculate scores for each listing
  const scoredListings = listings.map(listing => {
    let score = calculateSearchScore(listing, keywords)

    // Boost score for matched phrases
    matchedPhrases.forEach(phrase => {
      if (listing.category === phrase.category) {
        score += 2 // Significant boost for matching phrases
      }
    })

    return { listing, score }
  })

  // Filter and sort listings by score
  return scoredListings
    .filter(({ score }) => score >= minScore)
    .sort((a, b) => b.score - a.score)
    .map(({ listing }) => listing)
} 