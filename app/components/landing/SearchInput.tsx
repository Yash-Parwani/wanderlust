'use client'

import { useCallback } from 'react'
import { Search, Mic } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface SearchInputProps {
  onSearch: (query: string) => void
  searchQuery: string
  onSearchQueryChange: (query: string) => void
  onFocus?: () => void
}

export default function SearchInput({
  onSearch,
  searchQuery,
  onSearchQueryChange,
  onFocus
}: SearchInputProps) {
  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    onSearch(searchQuery)
  }, [onSearch, searchQuery])

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl">
      <div className="relative flex items-center">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchQueryChange(e.target.value)}
          onFocus={onFocus}
          placeholder="Try 'Find me a beachfront villa in Bali with a pool'"
          aria-label="Search for accommodations"
          role="searchbox"
          className="w-full px-6 py-4 text-lg rounded-full bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08)] 
                   border border-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent
                   pr-32 placeholder-gray-400 text-gray-900 transition-shadow
                   hover:shadow-[0_4px_12px_rgba(0,0,0,0.12)]
                   focus:shadow-[0_4px_16px_rgba(0,0,0,0.16)]"
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-gray-100"
            aria-label="Voice search"
          >
            <Mic className="w-5 h-5 text-gray-600" />
          </Button>
          <Button
            type="submit"
            size="icon"
            className="rounded-full bg-gradient-to-r from-purple-600 to-blue-600 
                     hover:from-purple-700 hover:to-blue-700"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </form>
  )
} 