'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import ReactMapGL, { Marker, Popup, MapRef } from 'react-map-gl'
import { ClientMapProps } from '../../types'
import 'mapbox-gl/dist/mapbox-gl.css'

export default function ClientMap({ listings }: ClientMapProps) {
  const mapRef = useRef<MapRef>(null)
  const [mapboxToken, setMapboxToken] = useState<string>('')
  const [error, setError] = useState<string>('')
  
  // Debug logs

  // Default view state for empty listings
  const defaultViewState = {
    longitude: 115.188919, // Bali coordinates as default
    latitude: -8.409518,
    zoom: 10
  }

  // Calculate bounds from listings
  const bounds = useMemo(() => {
    if (!listings?.length) {
      return null
    }

    return listings.reduce(
      (acc, listing) => ({
        minLng: Math.min(acc.minLng, listing.longitude),
        maxLng: Math.max(acc.maxLng, listing.longitude),
        minLat: Math.min(acc.minLat, listing.latitude),
        maxLat: Math.max(acc.maxLat, listing.latitude),
      }),
      {
        minLng: listings[0].longitude,
        maxLng: listings[0].longitude,
        minLat: listings[0].latitude,
        maxLat: listings[0].latitude,
      }
    )
  }, [listings])

  // Update map bounds when listings change
  useEffect(() => {
    if (mapRef.current && bounds) {
      mapRef.current.fitBounds(
        [
          [bounds.minLng, bounds.minLat],
          [bounds.maxLng, bounds.maxLat],
        ],
        {
          padding: 50,
          duration: 2000,
        }
      )
    }
  }, [bounds])

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await fetch('/api/map/token')
        const data = await response.json()
        setMapboxToken(data.token)
      } catch (err) {
        setError('Failed to load map configuration')
        console.error('Error fetching map token:', err)
      }
    }
    fetchToken()
  }, [])

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-xl">
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  if (!mapboxToken) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-xl">
        <p className="text-gray-500">Loading map...</p>
      </div>
    )
  }

  if (!listings?.length) {
    return (
      <ReactMapGL
        mapboxAccessToken={mapboxToken}
        initialViewState={defaultViewState}
        style={{ width: '100%', height: '100%', borderRadius: '0.75rem' }}
        mapStyle="mapbox://styles/mapbox/light-v11"
        reuseMaps
        attributionControl={true}
      >
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-lg shadow-sm">
            <p className="text-gray-500">No listings in this area</p>
          </div>
        </div>
      </ReactMapGL>
    )
  }

  return (
    <ReactMapGL
      ref={mapRef}
      mapboxAccessToken={mapboxToken}
      initialViewState={{
        longitude: listings[0].longitude,
        latitude: listings[0].latitude,
        zoom: 12
      }}
      style={{ width: '100%', height: '100%', borderRadius: '0.75rem' }}
      mapStyle="mapbox://styles/mapbox/light-v11"
      reuseMaps
      attributionControl={true}
    >
      {listings.map((listing) => (
        <Marker
          key={listing.id}
          longitude={listing.longitude}
          latitude={listing.latitude}
        >
          <div className="bg-white rounded-full p-2 shadow-md cursor-pointer hover:scale-110 transition-transform">
            <div className="text-sm font-semibold">${listing.price}</div>
          </div>
        </Marker>
      ))}
    </ReactMapGL>
  )
} 