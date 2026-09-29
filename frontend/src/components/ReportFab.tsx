import { useRef, useState } from 'react'
import { useClickOutside } from '../hooks/useClickOutside'
import type { ListingType } from '../types/listing'

interface ReportFabProps {
  onSelectPostType: (type: ListingType) => void
  disabled: boolean
}

export function ReportFab({ onSelectPostType, disabled }: ReportFabProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useClickOutside(containerRef, () => setMenuOpen(false), menuOpen)

  const choose = (type: ListingType) => {
    setMenuOpen(false)
    onSelectPostType(type)
  }

  return (
    <div
      ref={containerRef}
      style={{ position: 'absolute', right: 24, bottom: 48, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 12 }}
    >
      {menuOpen && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <button
            type="button"
            onClick={() => choose('lost')}
            style={{
              background: '#ffffff',
              color: '#d32f2f',
              border: '2px solid #000000',
              borderRadius: 999,
              padding: '10px 20px',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
            }}
          >
            Lost it
          </button>
          <button
            type="button"
            onClick={() => choose('found')}
            style={{
              background: '#ffffff',
              color: '#d32f2f',
              border: '2px solid #000000',
              borderRadius: 999,
              padding: '10px 20px',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
            }}
          >
            Found it
          </button>
        </div>
      )}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setMenuOpen((open) => !open)}
        style={{
          width: 56,
          height: 56,
          borderRadius: '50%',
          border: 'none',
          background: '#d32f2f',
          color: '#ffffff',
          fontSize: 28,
          lineHeight: 1,
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.6 : 1,
          boxShadow: '0 2px 8px rgba(0,0,0,0.35)',
          transform: menuOpen ? 'rotate(45deg)' : 'none',
          transition: 'transform 0.15s ease',
        }}
        aria-label={menuOpen ? 'Close report menu' : 'Report an item'}
      >
        +
      </button>
    </div>
  )
}
