import { useEffect, useState } from 'react'
import { Listing } from '@/app/types'
import ListingCard from './ListingCard'
import { getRecommendedListings } from '@/app/utils/recommendations'

interface RecommendedListingsProps {
  allListings: Listing[]
  currentListingId?: number
}

export default function RecommendedListings({ allListings, currentListingId }: RecommendedListingsProps) {
  const [recommendations, setRecommendations] = useState<Listing[]>([])

  useEffect(() => {
    const recommendedListings = getRecommendedListings(allListings, currentListingId)
    setRecommendations(recommendedListings)
  }, [allListings, currentListingId])

  if (recommendations.length === 0) return null

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-gray-900">
        {currentListingId ? 'Similar listings you might like' : 'Recommended for you'}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {recommendations.map((listing) => (
          <ListingCard key={listing.id} listing={listing} />
        ))}
      </div>
    </div>
  )
} 