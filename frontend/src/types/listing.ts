export type ListingType = 'lost' | 'found'

export type ListingCategory =
  | 'bag'
  | 'clothes'
  | 'accessory'
  | 'pet'
  | 'wallet'
  | 'card'
  | 'keys'
  | 'electronics'
  | 'other'

export interface ListingProperties {
  id: string
  name: string
  description: string
  contactInfo: string
  type: ListingType
  category: ListingCategory
}
