import type { Feature, FeatureCollection, Point } from 'geojson'
import { API_URL } from './client'
import type { ListingCategory, ListingProperties } from '../types/listing'

interface LostItemRead {
  id: number
  name: string
  description: string
  category: ListingCategory
  contact_info: string
  last_had_location: Point
}

interface FoundItemRead {
  id: number
  name: string
  description: string
  category: ListingCategory
  contact_info: string
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
      contactInfo: item.contact_info,
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
      contactInfo: item.contact_info,
      type: 'found',
      category: item.category,
    },
  }))

  return {
    type: 'FeatureCollection',
    features: [...lostFeatures, ...foundFeatures],
  }
}

export interface LostItemCreatePayload {
  name: string
  category: ListingCategory
  description: string
  contact_info: string
  last_had_location: Point
}

export interface FoundItemCreatePayload {
  name: string
  category: ListingCategory
  description: string
  contact_info: string
  found_location: Point
}

async function postJson(path: string, payload: unknown): Promise<void> {
  const res = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const body = await res.json().catch(() => null)
    const message = Array.isArray(body?.detail)
      ? body.detail.map((d: { msg: string }) => d.msg).join(', ')
      : (body?.detail ?? 'Failed to submit post')
    throw new Error(message)
  }
}

export function createLostItem(payload: LostItemCreatePayload): Promise<void> {
  return postJson('/lost-items', payload)
}

export function createFoundItem(payload: FoundItemCreatePayload): Promise<void> {
  return postJson('/found-items', payload)
}
