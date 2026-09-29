import type { CSSProperties } from 'react'

export type TypeFilter = 'lost' | 'all' | 'found'

interface FilterBarProps {
  value: TypeFilter
  onChange: (value: TypeFilter) => void
}

const OPTIONS: { value: TypeFilter; label: string }[] = [
  { value: 'lost', label: 'Lost' },
  { value: 'all', label: 'All' },
  { value: 'found', label: 'Found' },
]

export function FilterBar({ value, onChange }: FilterBarProps) {
  return (
    <div
      style={{
        position: 'absolute',
        top: 16,
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: 4,
        background: 'rgba(255, 255, 255, 0.92)',
        borderRadius: 999,
        padding: 4,
        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      {OPTIONS.map(({ value: optionValue, label }) => {
        const active = optionValue === value
        const style: CSSProperties = {
          border: 'none',
          borderRadius: 999,
          padding: '6px 18px',
          fontSize: 13,
          fontWeight: 600,
          cursor: 'pointer',
          background: active ? '#d32f2f' : 'transparent',
          color: active ? '#ffffff' : '#333333',
        }
        return (
          <button key={optionValue} type="button" style={style} onClick={() => onChange(optionValue)}>
            {label}
          </button>
        )
      })}
    </div>
  )
}
