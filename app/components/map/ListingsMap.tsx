'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Maximize2, Minimize2 } from 'lucide-react'
import type { MapRef } from 'react-map-gl/maplibre'
import dynamic from 'next/dynamic'

// Dynamically import Map with no SSR
const Map = dynamic(
  async () => {
    const mod = await import('react-map-gl/maplibre')
    return mod.Map
  },
  { ssr: false }
)

// Dynamically import Marker with no SSR
const MarkerComponent = dynamic(
  async () => {
    const mod = await import('react-map-gl/maplibre')
    return mod.Marker
  },
  { ssr: false }
)

// Dynamically import NavigationControl with no SSR
const NavigationControl = dynamic(
  async () => {
    const mod = await import('react-map-gl/maplibre')
    return mod.NavigationControl
  },
  { ssr: false }
)

export interface Location {
  id: number
  title: string
  price: number
  rating: number
  latitude: number
  longitude: number
  image: string
}

interface ListingsMapProps {
  locations: Location[]
  onMarkerClick: (location: Location) => void
}

// Client-side marker component
const MapMarker = ({ location, onClick }: { location: Location; onClick: () => void }) => (
  <motion.button
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className="relative group"
  >
    <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg p-2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-10">
      ${location.price}/night
    </div>
    <div className="relative">
      <MapPin className="w-6 h-6 text-rose-500" />
      <motion.div
        className="absolute -inset-2 rounded-full bg-rose-500"
        initial={{ scale: 0, opacity: 0 }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.1, 0],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
        }}
      />
    </div>
  </motion.button>
)

// Client-side map content component
const MapContent = ({ 
  locations, 
  onMarkerClick, 
  selectedLocation, 
  onClosePopup 
}: { 
  locations: Location[]
  onMarkerClick: (location: Location) => void
  selectedLocation: Location | null
  onClosePopup: () => void
}) => {
  return (
    <>
      {locations.map((location) => (
        <MarkerComponent
          key={location.id}
          latitude={location.latitude}
          longitude={location.longitude}
          anchor="bottom"
        >
          <MapMarker 
            location={location} 
            onClick={() => onMarkerClick(location)}
          />
        </MarkerComponent>
      ))}

      <AnimatePresence>
        {selectedLocation && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white rounded-xl shadow-lg p-4 max-w-sm w-full mx-4 z-20"
          >
            <div className="flex gap-4">
              <img
                src={selectedLocation.image}
                alt={selectedLocation.title}
                className="w-24 h-24 object-cover rounded-lg"
              />
              <div>
                <h3 className="font-medium">{selectedLocation.title}</h3>
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <span>★</span>
                  <span>{selectedLocation.rating}</span>
                </div>
                <p className="text-lg font-medium mt-1">
                  ${selectedLocation.price}
                  <span className="text-sm font-normal">/night</span>
                </p>
              </div>
            </div>
            <button
              onClick={onClosePopup}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// Main component
const ListingsMap = ({ locations, onMarkerClick }: ListingsMapProps) => {
  const mapRef = useRef<MapRef>(null)
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)
  const [mapError, setMapError] = useState<string | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)

  // Calculate bounds from locations
  const bounds = locations.reduce(
    (acc, location) => {
      return {
        minLng: Math.min(acc.minLng, location.longitude),
        maxLng: Math.max(acc.maxLng, location.longitude),
        minLat: Math.min(acc.minLat, location.latitude),
        maxLat: Math.max(acc.maxLat, location.latitude),
      }
    },
    {
      minLng: locations[0]?.longitude ?? 0,
      maxLng: locations[0]?.longitude ?? 0,
      minLat: locations[0]?.latitude ?? 0,
      maxLat: locations[0]?.latitude ?? 0,
    }
  )

  // Add padding to bounds
  const padding = 0.5 // degrees
  const viewportBounds = {
    minLng: bounds.minLng - padding,
    maxLng: bounds.maxLng + padding,
    minLat: bounds.minLat - padding,
    maxLat: bounds.maxLat + padding,
  }

  // Calculate center point
  const center = {
    longitude: (viewportBounds.minLng + viewportBounds.maxLng) / 2,
    latitude: (viewportBounds.minLat + viewportBounds.maxLat) / 2,
  }

  // Calculate zoom level based on bounds
  const latDiff = Math.abs(viewportBounds.maxLat - viewportBounds.minLat)
  const lngDiff = Math.abs(viewportBounds.maxLng - viewportBounds.minLng)
  const maxDiff = Math.max(latDiff, lngDiff)
  const zoom = Math.floor(8 - Math.log2(maxDiff))

  const initialViewState = {
    ...center,
    zoom: Math.min(Math.max(zoom, 3), 14), // Clamp zoom between 3 and 14
    bearing: 0,
    pitch: 0
  }

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_MAPBOX_TOKEN) {
      setMapError('Mapbox token is not configured. Please add NEXT_PUBLIC_MAPBOX_TOKEN to your .env.local file.')
    }
  }, [])

  const handleMarkerClick = useCallback((location: Location) => {
    setSelectedLocation(location)
    onMarkerClick(location)

    // Fly to the location
    mapRef.current?.flyTo({
      center: [location.longitude, location.latitude],
      zoom: 14,
      duration: 2000
    })
  }, [onMarkerClick])

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  if (mapError) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-600 px-4 text-center">
        <p>{mapError}</p>
      </div>
    )
  }

  return (
    <div className={`relative ${isFullscreen ? 'fixed inset-0 z-50' : 'w-full h-[calc(100vh-5rem)]'}`}>
      <Map
        ref={mapRef}
        reuseMaps
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        initialViewState={initialViewState}
        style={{ width: '100%', height: '100%' }}
        mapStyle="https://demotiles.maplibre.org/style.json"
        onError={(evt) => {
          console.error('Map error:', evt)
          setMapError('Failed to load map. Please try again later.')
        }}
      >
        <MapContent
          locations={locations}
          onMarkerClick={handleMarkerClick}
          selectedLocation={selectedLocation}
          onClosePopup={() => setSelectedLocation(null)}
        />
        <NavigationControl position="top-right" />
      </Map>

      {/* Fullscreen toggle button */}
      <button
        onClick={toggleFullscreen}
        className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors z-10"
      >
        {isFullscreen ? (
          <Minimize2 className="w-5 h-5" />
        ) : (
          <Maximize2 className="w-5 h-5" />
        )}
      </button>
    </div>
  )
}

export default ListingsMap 