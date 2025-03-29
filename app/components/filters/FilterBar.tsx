'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Calendar as CalendarIcon, Users, DollarSign } from 'lucide-react'
import { format } from 'date-fns'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { categories } from '../../data/categories'
import { cn } from '@/lib/utils'
import { FilterBarProps } from '../../types'

interface DateRange {
  from: Date | undefined
  to: Date | undefined
}

export default function FilterBar({ filters, onFiltersChange }: FilterBarProps) {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [date, setDate] = useState<DateRange>({
    from: undefined,
    to: undefined,
  })
  const [guests, setGuests] = useState(1)
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000])

  // Debounce filter changes
  useEffect(() => {
    const timer = setTimeout(() => {
      handleFilterChange()
    }, 300)

    return () => clearTimeout(timer)
  }, [selectedCategory, date, guests, priceRange])

  const handleFilterChange = () => {
    onFiltersChange({
      ...filters,
      category: selectedCategory,
      dates: date,
      guests,
      priceRange,
    })
  }

  const handleCategoryChange = useCallback((categoryId: string) => {
    onFiltersChange({
      ...filters,
      category: categoryId === 'all' ? '' : categoryId
    })
  }, [filters, onFiltersChange])

  return (
    <div className="sticky top-20 bg-white/80 backdrop-blur-sm z-40 border-b">
      <div className="container mx-auto px-4 py-4">
        {/* Categories */}
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {categories.map((category) => (
            <motion.button
              key={category.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleCategoryChange(category.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-colors
                ${filters.category === category.id || (category.id === 'all' && !filters.category)
                  ? 'bg-gray-900 text-white border-gray-900'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-gray-900'
                }`}
            >
              <span className="text-lg">{category.icon}</span>
              <span className="whitespace-nowrap">{category.label}</span>
            </motion.button>
          ))}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4 pt-4 border-t">
          {/* Date Range */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'justify-start text-left font-normal',
                  !date.from && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date.from ? (
                  date.to ? (
                    <>
                      {format(date.from, 'LLL dd')} - {format(date.to, 'LLL dd')}
                    </>
                  ) : (
                    format(date.from, 'LLL dd')
                  )
                ) : (
                  <span>Pick dates</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={date.from}
                selected={date}
                onSelect={(newDate: DateRange | undefined) => {
                  setDate(newDate ?? { from: undefined, to: undefined })
                }}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>

          {/* Guests */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="justify-start text-left font-normal">
                <Users className="mr-2 h-4 w-4" />
                {guests} {guests === 1 ? 'guest' : 'guests'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <h4 className="font-medium">Number of guests</h4>
                <div className="flex items-center justify-between">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setGuests(Math.max(1, guests - 1))}
                    disabled={guests <= 1}
                  >
                    -
                  </Button>
                  <span className="text-lg font-medium">{guests}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setGuests(guests + 1)}
                  >
                    +
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* Price Range */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="justify-start text-left font-normal">
                <DollarSign className="mr-2 h-4 w-4" />
                ${priceRange[0]} - ${priceRange[1]}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <h4 className="font-medium">Price range</h4>
                <Slider
                  defaultValue={[priceRange[0], priceRange[1]]}
                  max={1000}
                  step={50}
                  onValueChange={(value: number[]) => {
                    setPriceRange(value as [number, number])
                  }}
                />
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>${priceRange[0]}</span>
                  <span>${priceRange[1]}</span>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  )
} 