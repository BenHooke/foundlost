import { useEffect, useState } from 'react'

const API_URL = 'http://localhost:8000'

type Status = 'checking' | 'ok' | 'error'

export function ApiStatus() {
  const [status, setStatus] = useState<Status>('checking')

  useEffect(() => {
    fetch(`${API_URL}/health`)
      .then((res) => (res.ok ? setStatus('ok') : setStatus('error')))
      .catch(() => setStatus('error'))
  }, [])

  const color = status === 'ok' ? '#2ecc71' : status === 'error' ? '#e74c3c' : '#95a5a6'
  const label = status === 'ok' ? 'API connected' : status === 'error' ? 'API unreachable' : 'Checking API…'

  return (
    <div
      style={{
        position: 'absolute',
        top: 12,
        left: 12,
        zIndex: 1,
        background: 'white',
        padding: '6px 12px',
        borderRadius: 6,
        boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
        fontFamily: 'system-ui, sans-serif',
        fontSize: 13,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
      }}
    >
      <span style={{ width: 8, height: 8, borderRadius: '50%', background: color }} />
      {label}
    </div>
  )
}
