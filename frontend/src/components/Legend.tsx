import { CATEGORY_OPTIONS, CATEGORY_COLORS } from '../data/categoryStyles'
import type { ListingCategory } from '../types/listing'

interface LegendProps {
  selectedCategories?: ListingCategory[]
}

export function Legend({ selectedCategories }: LegendProps) {
  const isFiltering = selectedCategories !== undefined && selectedCategories.length < CATEGORY_OPTIONS.length

  return (
    <div
      style={{
        background: 'rgba(255, 255, 255, 0.92)',
        borderRadius: 8,
        border: '2px solid #000000',
        padding: '10px 12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
        fontFamily: 'system-ui, sans-serif',
        fontSize: 12,
        fontWeight: 700,
        color: '#333',
        maxWidth: 190,
      }}
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, auto)', columnGap: 12, rowGap: 4 }}>
        {CATEGORY_OPTIONS.map(({ value, label }) => {
          const isCrossedOut = isFiltering && !selectedCategories?.includes(value)
          return (
            <div
              key={value}
              style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 6, opacity: isCrossedOut ? 0.5 : 1 }}
            >
              <span
                style={{
                  display: 'inline-block',
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  background: CATEGORY_COLORS[value],
                  flexShrink: 0,
                }}
              />
              <span>{label}</span>
              {isCrossedOut && (
                <span
                  style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    top: 'calc(50% - 0.5px)',
                    height: 1,
                    background: '#000000',
                  }}
                />
              )}
            </div>
          )
        })}
      </div>
      <hr style={{ margin: '8px 0', border: 'none', borderTop: '1px solid #ddd' }} />
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span
            style={{
              display: 'inline-block',
              width: 10,
              height: 10,
              borderRadius: '50%',
              background: '#7f8c8d',
              border: '2px solid #ffffff',
              flexShrink: 0,
            }}
          />
          <span>Lost</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span
            style={{
              display: 'inline-block',
              width: 10,
              height: 10,
              borderRadius: '50%',
              background: '#7f8c8d',
              border: '2px solid #000000',
              flexShrink: 0,
            }}
          />
          <span>Found</span>
        </div>
      </div>
    </div>
  )
}
