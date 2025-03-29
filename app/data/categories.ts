export interface Category {
  id: string
  label: string
  icon: string
}

export const categories: Category[] = [
  { id: 'all', label: 'All', icon: '🏠' },
  { id: 'beach', label: 'Beach', icon: '🏖️' },
  { id: 'mountain', label: 'Mountain', icon: '⛰️' },
  { id: 'city', label: 'City', icon: '🌆' },
  { id: 'countryside', label: 'Countryside', icon: '🌳' },
  { id: 'luxury', label: 'Luxury', icon: '✨' },
  { id: 'tropical', label: 'Tropical', icon: '🌴' },
  { id: 'historic', label: 'Historic', icon: '🏛️' },
  { id: 'skiing', label: 'Skiing', icon: '⛷️' },
  { id: 'desert', label: 'Desert', icon: '🏜️' },
  { id: 'islands', label: 'Islands', icon: '🏝️' },
  { id: 'lakefront', label: 'Lakefront', icon: '🌊' }
] 