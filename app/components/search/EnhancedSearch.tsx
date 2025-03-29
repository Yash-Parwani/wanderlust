import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Mic } from 'lucide-react';
import VoiceSearch from './VoiceSearch';
import { Button } from "@/components/ui/button"

interface EnhancedSearchProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (query: string) => void;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
}

const popularCategories = [
  'Beach Villas',
  'Mountain Retreats',
  'City Apartments',
  'Luxury Homes',
  'Countryside Cottages',
];

export default function EnhancedSearch({
  isOpen,
  onClose,
  onSearch,
  searchQuery,
  onSearchQueryChange,
}: EnhancedSearchProps) {
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [showVoiceSearch, setShowVoiceSearch] = useState(false);

  useEffect(() => {
    // Load recent searches from localStorage
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  const handleSearch = useCallback((query: string) => {
    onSearch(query);
    // Save to recent searches
    const updated = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
    onClose();
  }, [onSearch, recentSearches, onClose]);

  const handleVoiceSearchClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowVoiceSearch(true);
  }, []);

  const handleVoiceSearchResult = useCallback((transcript: string) => {
    onSearchQueryChange(transcript);
    setShowVoiceSearch(false);
  }, [onSearchQueryChange]);

  const handleVoiceSearchClose = useCallback(() => {
    setShowVoiceSearch(false);
  }, []);

  // Log state changes
  useEffect(() => {
  }, [isOpen, showVoiceSearch, searchQuery]);

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 bg-white z-50"
          >
            <div className="container mx-auto px-4 py-8">
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Search input */}
              <div className="max-w-3xl mx-auto mt-8">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => onSearchQueryChange(e.target.value)}
                    placeholder="Where would you like to stay?"
                    className="w-full px-12 py-6 text-2xl border-2 border-gray-300 rounded-full focus:outline-none focus:border-purple-500"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && searchQuery) {
                        handleSearch(searchQuery);
                      }
                    }}
                  />
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
                  <Button
                    onClick={handleVoiceSearchClick}
                    variant="ghost"
                    size="icon"
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 rounded-full hover:bg-gray-100"
                  >
                    <Mic className="w-6 h-6 text-purple-500" />
                  </Button>
                </div>

                {/* AI-powered suggestions */}
                {searchQuery && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 space-y-4"
                  >
                    <h3 className="text-lg font-semibold text-gray-700">Suggested searches</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        `${searchQuery} with pool`,
                        `Luxury ${searchQuery}`,
                        `${searchQuery} near beach`,
                        `${searchQuery} with mountain view`,
                      ].map((suggestion) => (
                        <button
                          key={suggestion}
                          onClick={() => handleSearch(suggestion)}
                          className="text-left p-4 bg-gray-50 hover:bg-gray-100 rounded-lg"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Popular categories */}
                <div className="mt-12">
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">Popular categories</h3>
                  <div className="flex flex-wrap gap-3">
                    {popularCategories.map((category) => (
                      <button
                        key={category}
                        onClick={() => handleSearch(category)}
                        className="px-4 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-full"
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Recent searches */}
                {recentSearches.length > 0 && (
                  <div className="mt-12">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Recent searches</h3>
                    <div className="space-y-3">
                      {recentSearches.map((search) => (
                        <button
                          key={search}
                          onClick={() => handleSearch(search)}
                          className="block w-full text-left px-4 py-3 hover:bg-gray-50 rounded-lg"
                        >
                          <Search className="inline w-4 h-4 mr-3 text-gray-400" />
                          {search}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Voice search overlay - Moved outside the AnimatePresence */}
      <VoiceSearch
        isOpen={showVoiceSearch}
        onClose={handleVoiceSearchClose}
        onResult={handleVoiceSearchResult}
      />
    </>
  );
} 