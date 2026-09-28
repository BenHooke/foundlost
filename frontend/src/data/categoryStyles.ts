import type { ListingCategory } from '../types/listing'

export const CATEGORY_COLORS: Record<ListingCategory, string> = {
  bag: '#e67e22',
  clothes: '#c0392b',
  accessory: '#e84393',
  pet: '#8e44ad',
  wallet: '#f1c40f',
  card: '#27ae60',
  keys: '#16a085',
  electronics: '#2980b9',
  other: '#7f8c8d',
}

export const CATEGORY_OPTIONS: { value: ListingCategory; label: string }[] = [
  { value: 'bag', label: 'Bag' },
  { value: 'clothes', label: 'Clothes' },
  { value: 'accessory', label: 'Accessory' },
  { value: 'pet', label: 'Pet' },
  { value: 'wallet', label: 'Wallet' },
  { value: 'card', label: 'Card' },
  { value: 'keys', label: 'Keys' },
  { value: 'electronics', label: 'Electronics' },
  { value: 'other', label: 'Other' },
]
