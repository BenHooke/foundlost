export type ListingType = 'lost' | 'found'

export type ListingCategory = 'bag' | 'pet' | 'wallet' | 'keys' | 'electronics' | 'other'

export interface ListingProperties {
  id: string
  name: string
  description: string
  type: ListingType
  category: ListingCategory
}
