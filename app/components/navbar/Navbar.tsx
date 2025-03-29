'use client'

import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import SearchInput from '../landing/SearchInput'
import Link from 'next/link'

interface NavbarProps {
  onSearch: (query: string) => void
  searchQuery: string
  onSearchQueryChange: (query: string) => void
}

export default function Navbar({
  onSearch,
  searchQuery,
  onSearchQueryChange
}: NavbarProps) {
  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <a 
            href="#"
            onClick={handleLogoClick}
            className="flex items-center space-x-2 cursor-pointer"
          >
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Wanderlust
            </span>
          </a>

          {/* Search */}
          <div className="hidden md:block flex-1 max-w-2xl mx-8">
            <SearchInput
              onSearch={onSearch}
              searchQuery={searchQuery}
              onSearchQueryChange={onSearchQueryChange}
            />
          </div>

          {/* Navigation */}
          <div className="flex items-center space-x-4">
            <Link href="/work-in-progress">
              <Button variant="ghost" className="hidden md:flex">
                Become a Host
              </Button>
            </Link>
            <Link href="/work-in-progress">
              <Button variant="outline" className="rounded-full">
                Sign in
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
} 