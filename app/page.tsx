'use client'

import { useState, useMemo, useCallback, useEffect } from 'react'
import { Suspense } from 'react'
import Navbar from './components/navbar'
import HeroSection from './components/landing/HeroSection'
import FilterBar from './components/filters/FilterBar'
import ListingCard from './components/listings/ListingCard'
import RecommendedListings from './components/listings/RecommendedListings'
import ClientMap from './components/map/ClientMap'
import { mockListings } from './data/mockListings'
import { Filters, Listing } from './types'
import { debounce, searchListings } from './utils/search'
import HowItWorks from './components/landing/HowItWorks'
import ScrollRestoration from './components/ScrollRestoration'

export default function Home() {
  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('')
  const [filters, setFilters] = useState<Filters>({
    category: '',
    priceRange: [0, 1000],
    guestCount: 1,
    startDate: null,
    endDate: null,
  })

  // Reset scroll position on mount
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // Setup debounced search
  useEffect(() => {
    const debouncedUpdate = debounce((value: string) => {
      setDebouncedSearchQuery(value)
    }, 300)

    debouncedUpdate(searchQuery)

    return () => {
      // TypeScript doesn't know about the timeout in the debounced function
      // so we can't clear it here, but it's handled in the debounce function
    }
  }, [searchQuery])

  // Filter listings based on search query and filters
  const filteredListings = useMemo(() => {

    
    // First apply search ranking
    let filtered = searchListings(mockListings, debouncedSearchQuery)

    // Then apply additional filters
    filtered = filtered.filter(listing => {
      // Category matching - only filter if a category is selected
      const matchesCategory = !filters.category || filters.category === 'all' || listing.category.toLowerCase() === filters.category.toLowerCase()

      // Price matching
      const matchesPrice = listing.price >= filters.priceRange[0] && listing.price <= filters.priceRange[1]

      // Guest matching - only filter if guest count is greater than 1
      const matchesGuests = filters.guestCount <= 1 || listing.maxGuests >= filters.guestCount

      // Date matching (simplified for now)
      const matchesDates = true

      return matchesCategory && matchesPrice && matchesGuests && matchesDates
    })

    return filtered
  }, [debouncedSearchQuery, filters])

  // Handlers
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query)
    // Scroll to listings section after search
    const listingsSection = document.getElementById('listings')
    if (listingsSection) {
      listingsSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      })
    }
  }, [])

  const handleFiltersChange = useCallback((newFilters: Filters) => {
    setFilters(newFilters)
  }, [])

  return (
    <main className="min-h-screen">
      <ScrollRestoration />
      {/* Navbar */}
      <Suspense fallback={<div className="h-20 bg-white" />}>
        <Navbar 
          onSearch={handleSearch}
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
        />
      </Suspense>

      {/* Hero Section */}
      <HeroSection 
        onStartSearch={() => {
          // First try to find the search trigger button
          const navbarSearch = document.querySelector('[data-search-trigger]');
          if (navbarSearch && navbarSearch instanceof HTMLElement) {
            navbarSearch.click();
          }
        }}
      />

      {/* Filters */}
      <Suspense fallback={<div className="h-20 bg-white" />}>
        <FilterBar 
          filters={filters}
          onFiltersChange={handleFiltersChange}
        />
      </Suspense>

      {/* Listings Section */}
      <section 
        id="listings" 
        className="container mx-auto px-4 py-12 scroll-mt-32"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Listings */}
          <div className="space-y-8">
            {/* Initial Recommendations */}
            {!searchQuery && !filters.category && filters.priceRange[0] === 0 && filters.priceRange[1] === 1000 && (
              <RecommendedListings allListings={mockListings} />
            )}

            {/* Filtered Listings */}
            <div>
              {filteredListings.length > 0 ? (
                <>
                  {(searchQuery || filters.category) && (
                    <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                      {searchQuery ? 'Search Results' : 'Featured Listings'}
                    </h2>
                  )}
                  <div className="space-y-6">
                    {filteredListings.map((listing) => (
                      <ListingCard key={listing.id} listing={listing} />
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-2xl font-semibold text-gray-900">No listings found</h3>
                  <p className="text-gray-600 mt-2">Try adjusting your search or filters</p>
                </div>
              )}
            </div>

            {/* Search-based Recommendations */}
            {(searchQuery || filters.category) && filteredListings.length > 0 && (
              <div className="mt-12">
                <RecommendedListings 
                  allListings={mockListings} 
                  currentListingId={filteredListings[0].id}
                />
              </div>
            )}
          </div>

          {/* Map */}
          <div className="hidden lg:block h-[calc(100vh-6rem)] w-full sticky top-24">
            <div className="w-full h-full">
              <ClientMap listings={filteredListings} />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <HowItWorks onStartSearch={() => {
        const navbarSearch = document.querySelector('[data-search-trigger]');
        if (navbarSearch && navbarSearch instanceof HTMLElement) {
          navbarSearch.click();
        }
      }} />
    </main>
  )
}
