import { CATEGORY_OPTIONS, CATEGORY_COLORS } from '../data/categoryStyles'

export function Legend() {
  return (
    <div
      style={{
        background: 'rgba(255, 255, 255, 0.92)',
        borderRadius: 8,
        padding: '10px 12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
        fontFamily: 'system-ui, sans-serif',
        fontSize: 12,
        color: '#333',
        maxWidth: 160,
      }}
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, auto)', columnGap: 12, rowGap: 4 }}>
        {CATEGORY_OPTIONS.map(({ value, label }) => (
          <div key={value} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
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
          </div>
        ))}
      </div>
      <hr style={{ margin: '8px 0', border: 'none', borderTop: '1px solid #ddd' }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
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
