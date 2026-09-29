import { useRef, useState } from 'react'
import { useClickOutside } from '../hooks/useClickOutside'
import { CATEGORY_OPTIONS } from '../data/categoryStyles'
import type { ListingCategory } from '../types/listing'

const ALL_CATEGORIES = CATEGORY_OPTIONS.map((option) => option.value)

interface CategoryFilterProps {
  value: ListingCategory[]
  onChange: (categories: ListingCategory[]) => void
}

export function CategoryFilter({ value, onChange }: CategoryFilterProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const isAllSelected = value.length === ALL_CATEGORIES.length

  useClickOutside(containerRef, () => setMenuOpen(false), menuOpen)

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
    <div ref={containerRef} style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 8 }}>
      {menuOpen && (
        <div
          style={{
            position: 'absolute',
            left: 0,
            bottom: 'calc(100% + 8px)',
            background: 'rgba(255, 255, 255, 0.97)',
            borderRadius: 8,
            border: '2px solid #000000',
            padding: '8px 12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
            fontFamily: 'system-ui, sans-serif',
            fontSize: 13,
            color: '#333',
            width: 160,
          }}
        >
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '4px 0',
              fontWeight: 600,
              cursor: isAllSelected ? 'default' : 'pointer',
              opacity: isAllSelected ? 0.5 : 1,
            }}
          >
            <input
              type="checkbox"
              checked={isAllSelected}
              disabled={isAllSelected}
              onChange={selectAll}
              style={{ accentColor: '#888888' }}
            />
            All
          </label>
          <hr style={{ margin: '4px 0 6px', border: 'none', borderTop: '1px solid #ddd' }} />
          {CATEGORY_OPTIONS.map(({ value: category, label }) => (
            <label key={category} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '3px 0', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={value.includes(category)}
                onChange={() => toggleCategory(category)}
                style={{ accentColor: '#000000' }}
              />
              {label}
            </label>
          ))}
        </div>
      )}
      <div style={{ position: 'relative' }}>
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? 'Close category filter' : 'Filter by category'}
          style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            border: isAllSelected ? '2px solid #000000' : 'none',
            boxSizing: 'border-box',
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
        {!isAllSelected && (
          <span
            style={{
              position: 'absolute',
              top: -4,
              right: -4,
              minWidth: 18,
              height: 18,
              borderRadius: 9,
              background: '#d32f2f',
              color: '#ffffff',
              border: '2px solid #ffffff',
              fontSize: 11,
              fontWeight: 700,
              lineHeight: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0 4px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.4)',
              fontFamily: 'system-ui, sans-serif',
              boxSizing: 'border-box',
            }}
          >
            {value.length}
          </span>
        )}
      </div>
      {value.length === 0 && (
        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          style={{
            background: '#d32f2f',
            color: '#ffffff',
            border: 'none',
            borderRadius: 999,
            padding: '8px 14px',
            fontSize: 12,
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
            fontFamily: 'system-ui, sans-serif',
            whiteSpace: 'nowrap',
          }}
        >
          This is just a map now...
        </button>
      )}
    </div>
  )
}
