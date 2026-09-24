import type { FeatureCollection, Point } from 'geojson'

export type ListingType = 'lost' | 'found'

export type ListingCategory = 'bag' | 'pet' | 'wallet' | 'keys' | 'electronics' | 'other'

export interface ListingProperties {
  id: string
  name: string
  description: string
  type: ListingType
  category: ListingCategory
}

export const fakeListings: FeatureCollection<Point, ListingProperties> = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [-79.3871, 43.6426] },
      properties: {
        id: '1',
        name: 'Black backpack',
        description: 'Small black Herschel backpack with a laptop sleeve, left near a park bench.',
        type: 'lost',
        category: 'bag',
      },
    },
    {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [-79.3957, 43.6629] },
      properties: {
        id: '2',
        name: 'Grey cat',
        description: 'Grey tabby cat with a blue collar, last seen wandering near a side street.',
        type: 'lost',
        category: 'pet',
      },
    },
    {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [-79.3733, 43.6511] },
      properties: {
        id: '3',
        name: 'Wallet',
        description: 'Brown leather wallet found on a bench, contains cards but no cash.',
        type: 'found',
        category: 'wallet',
      },
    },
    {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [-79.4103, 43.6656] },
      properties: {
        id: '4',
        name: 'House keys',
        description: 'Set of three keys on a red keychain, found near a bus stop.',
        type: 'found',
        category: 'keys',
      },
    },
    {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [-79.3559, 43.6677] },
      properties: {
        id: '5',
        name: 'Prescription glasses',
        description: 'Thin wire-frame prescription glasses in a black case.',
        type: 'lost',
        category: 'other',
      },
    },
    {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [-79.4222, 43.6389] },
      properties: {
        id: '6',
        name: 'Blue umbrella',
        description: 'Large blue golf umbrella left leaning against a shop entrance.',
        type: 'found',
        category: 'other',
      },
    },
    {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [-79.4001, 43.6552] },
      properties: {
        id: '7',
        name: 'Phone',
        description: 'Black smartphone with a cracked screen protector, no case.',
        type: 'lost',
        category: 'electronics',
      },
    },
  ],
}
