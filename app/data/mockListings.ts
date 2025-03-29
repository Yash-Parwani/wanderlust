import { Listing } from '../types'

// Seeded random number generator
class SeededRandom {
  private seed: number;

  constructor(seed: number = 123456789) {
    this.seed = seed;
  }

  // Generate a random number between 0 and 1
  random(): number {
    const x = Math.sin(this.seed++) * 10000;
    return x - Math.floor(x);
  }

  // Generate a random number within a range
  range(min: number, max: number): number {
    return min + this.random() * (max - min);
  }

  // Get a random integer within a range
  intRange(min: number, max: number): number {
    return Math.floor(this.range(min, max + 1));
  }
}

const random = new SeededRandom();

// Helper function to generate random number within a range
const randomInRange = (min: number, max: number) => random.range(min, max)

// Helper function to slightly vary coordinates around a base location
const varyCoordinates = (baseLat: number, baseLng: number, variance = 0.1) => ({
  latitude: baseLat + randomInRange(-variance, variance),
  longitude: baseLng + randomInRange(-variance, variance)
})

// Base coordinates for different regions
const locations = {
  bali: { lat: -8.409518, lng: 115.188919, name: "Bali, Indonesia" },
  phuket: { lat: 7.8804, lng: 98.3923, name: "Phuket, Thailand" },
  maldives: { lat: 3.2028, lng: 73.2207, name: "Maldives" },
  dubai: { lat: 25.2048, lng: 55.2708, name: "Dubai, UAE" },
  aspen: { lat: 39.1911, lng: -106.8175, name: "Aspen, Colorado" },
  alps: { lat: 46.8182, lng: 8.2275, name: "Swiss Alps" },
  nyc: { lat: 40.7128, lng: -74.0060, name: "New York City" },
  london: { lat: 51.5074, lng: -0.1278, name: "London, UK" },
  paris: { lat: 48.8566, lng: 2.3522, name: "Paris, France" },
  tokyo: { lat: 35.6762, lng: 139.6503, name: "Tokyo, Japan" },
  sydney: { lat: -33.8688, lng: 151.2093, name: "Sydney, Australia" },
  santorini: { lat: 36.3932, lng: 25.4615, name: "Santorini, Greece" },
  hawaii: { lat: 21.3069, lng: -157.8583, name: "Hawaii, USA" },
}

// Generate listings
export const mockListings: Listing[] = [
  // Beach Properties (25 listings)
  ...Array(25).fill(null).map((_, index) => {
    const location = index % 2 === 0 ? locations.maldives : locations.hawaii
    const coords = varyCoordinates(location.lat, location.lng)
    return {
      id: index + 1,
      title: [
        "Oceanfront Paradise",
        "Beachside Villa",
        "Tropical Beach House",
        "Seaside Retreat",
        "Beach Bungalow"
      ][index % 5] + ` in ${location.name}`,
      description: "Stunning beachfront property with direct access to pristine white sand beaches.",
      location: location.name,
      price: Math.floor(randomInRange(300, 1000)),
      category: "Beach",
      maxGuests: random.intRange(2, 8),
      images: [
        `/images/beach/beach${(index % 4) + 1}.jpg`,
        `/images/beach/beach${((index + 1) % 4) + 1}.jpg`,
      ],
      rating: Number((4 + random.range(0, 1)).toFixed(1)),
      latitude: coords.latitude,
      longitude: coords.longitude,
      amenities: ["Beach Access", "Pool", "WiFi", "Kitchen", "Air Conditioning"],
      host: {
        name: ["Michael", "Sarah", "James", "Emma", "William"][index % 5],
        rating: Number((4.5 + random.range(0, 0.5)).toFixed(1))
      }
    }
  }),

  // Mountain Properties (20 listings)
  ...Array(20).fill(null).map((_, index) => {
    const location = index % 2 === 0 ? locations.aspen : locations.alps
    const coords = varyCoordinates(location.lat, location.lng)
    return {
      id: index + 26,
      title: [
        "Mountain View Cabin",
        "Ski-in Ski-out Chalet",
        "Luxury Mountain Lodge",
        "Alpine Retreat",
        "Mountain Paradise"
      ][index % 5] + ` in ${location.name}`,
      description: "Cozy mountain retreat with breathtaking views, perfect for skiing and hiking adventures.",
      location: location.name,
      price: Math.floor(randomInRange(200, 800)),
      category: "Mountain",
      maxGuests: random.intRange(2, 8),
      images: [
        `/images/mountain/mountain${(index % 3) + 1}.jpg`,
        `/images/mountain/mountain${((index + 1) % 3) + 1}.jpg`,
      ],
      rating: Number((4 + random.range(0, 1)).toFixed(1)),
      latitude: coords.latitude,
      longitude: coords.longitude,
      amenities: ["Hot Tub", "Fireplace", "WiFi", "Kitchen", "Parking"],
      host: {
        name: ["John", "Anna", "Peter", "Maria", "Thomas"][index % 5],
        rating: Number((4.5 + random.range(0, 0.5)).toFixed(1))
      }
    }
  }),

  // City Properties (20 listings)
  ...Array(20).fill(null).map((_, index) => {
    const location = index % 5 === 0 ? locations.nyc :
                    index % 5 === 1 ? locations.london :
                    index % 5 === 2 ? locations.paris :
                    index % 5 === 3 ? locations.tokyo :
                    locations.sydney
    const coords = varyCoordinates(location.lat, location.lng, 0.05)
    return {
      id: index + 46,
      title: [
        "Luxury City Apartment",
        "Modern Downtown Loft",
        "Urban Penthouse Suite",
        "City Center Studio",
        "Metropolitan Haven"
      ][index % 5] + ` in ${location.name}`,
      description: "Stylish urban retreat in the heart of the city, walking distance to major attractions.",
      location: location.name,
      price: Math.floor(randomInRange(150, 600)),
      category: "City",
      maxGuests: random.intRange(2, 6),
      images: Array(2).fill('/images/city/city1.jpg'),
      rating: Number((4 + random.range(0, 1)).toFixed(1)),
      latitude: coords.latitude,
      longitude: coords.longitude,
      amenities: ["WiFi", "Kitchen", "Air Conditioning", "Gym Access", "Doorman"],
      host: {
        name: ["Emily", "David", "Lisa", "Alex", "Julia"][index % 5],
        rating: Number((4.5 + random.range(0, 0.5)).toFixed(1))
      }
    }
  }),

  // Countryside Properties (15 listings)
  ...Array(15).fill(null).map((_, index) => {
    const baseCoords = {
      lat: randomInRange(35, 45),
      lng: randomInRange(-5, 15)
    }
    return {
      id: index + 66,
      title: [
        "Rustic Farmhouse",
        "Country Villa",
        "Rural Retreat",
        "Vineyard Estate",
        "Pastoral Paradise"
      ][index % 5],
      description: "Peaceful countryside escape with rolling hills and authentic rural charm.",
      location: "Tuscany, Italy",
      price: Math.floor(randomInRange(100, 400)),
      category: "Countryside",
      maxGuests: random.intRange(2, 8),
      images: [
        `/images/mountain/mountain${(index % 3) + 1}.jpg`,
        `/images/mountain/mountain${((index + 1) % 3) + 1}.jpg`,
      ],
      rating: Number((4 + random.range(0, 1)).toFixed(1)),
      latitude: baseCoords.lat,
      longitude: baseCoords.lng,
      amenities: ["Garden", "Parking", "WiFi", "Kitchen", "Fireplace"],
      host: {
        name: ["Marco", "Isabella", "Giuseppe", "Sofia", "Antonio"][index % 5],
        rating: Number((4.5 + random.range(0, 0.5)).toFixed(1))
      }
    }
  }),

  // Luxury Properties (20 listings)
  ...Array(20).fill(null).map((_, index) => {
    const location = index % 3 === 0 ? locations.dubai :
                    index % 3 === 1 ? locations.santorini :
                    locations.maldives
    const coords = varyCoordinates(location.lat, location.lng)
    return {
      id: index + 81,
      title: [
        "Ultra-Luxury Villa",
        "Premium Resort Suite",
        "Exclusive Private Estate",
        "Luxury Island Retreat",
        "Presidential Suite"
      ][index % 5] + ` in ${location.name}`,
      description: "Ultimate luxury experience with private butler, infinity pool, and spectacular views.",
      location: location.name,
      price: Math.floor(randomInRange(800, 2000)),
      category: "Luxury",
      maxGuests: random.intRange(2, 12),
      images: [
        `/images/luxury/luxury${(index % 3) + 1}.jpg`,
        `/images/luxury/luxury${((index + 1) % 3) + 1}.jpg`,
      ],
      rating: Number((4.5 + random.range(0, 0.5)).toFixed(1)),
      latitude: coords.latitude,
      longitude: coords.longitude,
      amenities: ["Private Pool", "Butler Service", "Spa", "Helipad", "Private Chef"],
      host: {
        name: ["Richard", "Victoria", "William", "Elizabeth", "Charles"][index % 5],
        rating: Number((4.8 + random.range(0, 0.2)).toFixed(1))
      }
    }
  })
] 