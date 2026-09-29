import { useState } from 'react'
import { CATEGORY_OPTIONS } from '../data/categoryStyles'
import type { ListingCategory } from '../types/listing'

const ALL_CATEGORIES = CATEGORY_OPTIONS.map((option) => option.value)

interface CategoryFilterProps {
  value: ListingCategory[]
  onChange: (categories: ListingCategory[]) => void
}

export function CategoryFilter({ value, onChange }: CategoryFilterProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const isAllSelected = value.length === ALL_CATEGORIES.length

  const selectAll = () => {
    onChange(ALL_CATEGORIES)
  }

  const toggleCategory = (category: ListingCategory) => {
    if (isAllSelected) {
      onChange([category])
      return
    }

    const next = value.includes(category) ? value.filter((c) => c !== category) : [...value, category]
    onChange(next)
  }

  return (
    <div style={{ position: 'relative' }}>
      {menuOpen && (
        <div
          style={{
            position: 'absolute',
            left: 0,
            bottom: 'calc(100% + 8px)',
            background: 'rgba(255, 255, 255, 0.97)',
            borderRadius: 8,
            padding: '8px 12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
            fontFamily: 'system-ui, sans-serif',
            fontSize: 13,
            color: '#333',
            width: 160,
          }}
        >
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0', fontWeight: 600, cursor: 'pointer' }}>
            <input type="checkbox" checked={isAllSelected} onChange={selectAll} />
            All
          </label>
          <hr style={{ margin: '4px 0 6px', border: 'none', borderTop: '1px solid #ddd' }} />
          {CATEGORY_OPTIONS.map(({ value: category, label }) => (
            <label key={category} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '3px 0', cursor: 'pointer' }}>
              <input type="checkbox" checked={value.includes(category)} onChange={() => toggleCategory(category)} />
              {label}
            </label>
          ))}
        </div>
      )}
      <button
        type="button"
        onClick={() => setMenuOpen((open) => !open)}
        aria-label={menuOpen ? 'Close category filter' : 'Filter by category'}
        style={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          border: 'none',
          background: isAllSelected ? 'rgba(255, 255, 255, 0.92)' : '#d32f2f',
          color: isAllSelected ? '#333333' : '#ffffff',
          cursor: 'pointer',
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
        </svg>
      </button>
    </div>
  )
}
