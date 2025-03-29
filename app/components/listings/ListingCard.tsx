'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Star, ChevronLeft, ChevronRight } from 'lucide-react'
import { ListingCardProps } from '../../types'
import { storeViewedListing } from '@/app/utils/recommendations'

export default function ListingCard({ listing }: ListingCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [imageError, setImageError] = useState(false)
  const {
    id,
    title,
    location,
    images,
    price,
    rating,
    category,
    host
  } = listing

  // Store listing in viewed history when component mounts
  useEffect(() => {
    storeViewedListing(id)
  }, [id])

  // Reset error state when image source changes
  useEffect(() => {
    setImageError(false)
  }, [currentImageIndex])

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const previousImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  // Get the fallback image based on category
  const getFallbackImage = () => {
    switch (category.toLowerCase()) {
      case 'beach':
        return '/images/beach/beach1.jpg'
      case 'mountain':
        return '/images/mountain/mountain1.jpg'
      case 'city':
        return '/images/city/city1.jpg'
      case 'luxury':
        return '/images/luxury/luxury1.jpg'
      case 'countryside':
        return '/images/mountain/mountain1.jpg'
      default:
        return '/images/mountain/mountain1.jpg'
    }
  }

  // Check if all images in the array are the same
  const allImagesAreSame = images.every(img => img === images[0])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm overflow-hidden border hover:shadow-md transition-shadow"
    >
      {/* Image Carousel */}
      <div className="relative aspect-[4/3] overflow-hidden group">
        <div className="absolute inset-0">
          <Image
            src={imageError ? getFallbackImage() : images[currentImageIndex]}
            alt={title}
            fill
            className="object-cover transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={false}
            quality={85}
            onError={() => setImageError(true)}
          />
        </div>

        {/* Navigation Arrows - Only show if we have different images and no errors */}
        {images.length > 1 && !imageError && !allImagesAreSame && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation()
                previousImage()
              }}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-1 rounded-full bg-white/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                nextImage()
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full bg-white/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}

        {/* Image Indicators - Only show if we have different images and no errors */}
        {images.length > 1 && !imageError && !allImagesAreSame && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation()
                  setCurrentImageIndex(index)
                }}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  currentImageIndex === index
                    ? 'bg-white scale-110'
                    : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-semibold text-lg text-gray-900">{title}</h3>
            <p className="text-gray-500">{location}</p>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="font-medium">{rating}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <span className="px-2 py-1 bg-gray-100 rounded-full text-sm text-gray-600">
            {category}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">{host.name}</p>
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              <span className="text-xs text-gray-500">{host.rating}</span>
            </div>
          </div>
          <p className="text-lg font-semibold">
            ${price} <span className="text-sm font-normal text-gray-500">/ night</span>
          </p>
        </div>
      </div>
    </motion.div>
  )
} 