'use client'

import { useState } from 'react'
import { Search as SearchIcon } from 'lucide-react'
import EnhancedSearch from '../search/EnhancedSearch'

interface SearchProps {
  onSearch: (query: string) => void
  searchQuery: string
  onSearchQueryChange: (query: string) => void
}

export default function Search({ onSearch, searchQuery, onSearchQueryChange }: SearchProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(true)}
        data-search-trigger
        className="flex items-center gap-2 px-4 py-2 rounded-full border hover:shadow-md transition-shadow"
      >
        <SearchIcon className="w-4 h-4" />
        {searchQuery ? (
          <span className="text-sm">{searchQuery}</span>
        ) : (
          <>
            <span className="text-sm">Anywhere</span>
            <span className="text-sm border-l pl-2">Any week</span>
            <span className="text-sm border-l pl-2">Add guests</span>
          </>
        )}
      </button>

      <EnhancedSearch
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSearch={onSearch}
        searchQuery={searchQuery}
        onSearchQueryChange={onSearchQueryChange}
      />
    </div>
  )
} 