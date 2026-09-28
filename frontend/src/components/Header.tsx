import type { CSSProperties } from 'react'
import type { ListingType } from '../types/listing'

interface HeaderProps {
  onSelectPostType: (type: ListingType) => void
  disabled: boolean
}

export function Header({ onSelectPostType, disabled }: HeaderProps) {
  const buttonStyle: CSSProperties = {
    background: '#ffffff',
    color: '#d32f2f',
    border: 'none',
    borderRadius: 4,
    padding: '8px 14px',
    fontSize: 14,
    fontWeight: 600,
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.6 : 1,
  }

  return (
    <header
      style={{
        height: 56,
        background: '#d32f2f',
        color: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        fontFamily: 'system-ui, sans-serif',
        flexShrink: 0,
      }}
    >
      <span style={{ fontSize: 20, fontWeight: 700 }}>FoundLost</span>
      <div style={{ display: 'flex', gap: 8 }}>
        <button type="button" style={buttonStyle} disabled={disabled} onClick={() => onSelectPostType('lost')}>
          Report Lost
        </button>
        <button type="button" style={buttonStyle} disabled={disabled} onClick={() => onSelectPostType('found')}>
          Report Found
        </button>
      </div>
    </header>
  )
}
