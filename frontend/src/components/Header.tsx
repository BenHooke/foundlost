export function Header() {
  return (
    <header
      style={{
        position: 'relative',
        zIndex: 2,
        height: 56,
        background: '#d32f2f',
        color: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        padding: '0 16px',
        fontFamily: 'system-ui, sans-serif',
        flexShrink: 0,
        borderBottom: '3px solid #000000',
        borderBottomLeftRadius: 14,
        borderBottomRightRadius: 14,
      }}
    >
      <span style={{ fontSize: 20, fontWeight: 700 }}>FoundLost</span>
    </header>
  )
}
