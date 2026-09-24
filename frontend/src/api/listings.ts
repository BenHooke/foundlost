import type { Feature, FeatureCollection, Point } from 'geojson'
import { API_URL } from './client'
import type { ListingCategory, ListingProperties } from '../types/listing'

interface LostItemRead {
  id: number
  name: string
  description: string
  category: ListingCategory
  last_had_location: Point
}

interface FoundItemRead {
  id: number
  name: string
  description: string
  category: ListingCategory
  found_location: Point
}

export async function fetchListings(): Promise<FeatureCollection<Point, ListingProperties>> {
  const [lostRes, foundRes] = await Promise.all([
    fetch(`${API_URL}/lost-items`),
    fetch(`${API_URL}/found-items`),
  ])

  if (!lostRes.ok || !foundRes.ok) {
    throw new Error('Failed to fetch listings')
  }

  const lostItems: LostItemRead[] = await lostRes.json()
  const foundItems: FoundItemRead[] = await foundRes.json()

  const lostFeatures: Feature<Point, ListingProperties>[] = lostItems.map((item) => ({
    type: 'Feature',
    geometry: item.last_had_location,
    properties: {
      id: `lost-${item.id}`,
      name: item.name,
      description: item.description,
      type: 'lost',
      category: item.category,
    },
  }))

  const foundFeatures: Feature<Point, ListingProperties>[] = foundItems.map((item) => ({
    type: 'Feature',
    geometry: item.found_location,
    properties: {
      id: `found-${item.id}`,
      name: item.name,
      description: item.description,
      type: 'found',
      category: item.category,
    },
  }))

  return {
    type: 'FeatureCollection',
    features: [...lostFeatures, ...foundFeatures],
  }
}
