import { useState } from 'react'
import { ApiStatus } from './components/ApiStatus'
import { Header } from './components/Header'
import { MapView } from './components/MapView'
import { NewPostForm } from './components/NewPostForm'
import { CATEGORY_COLORS } from './data/categoryStyles'
import type { ListingType } from './types/listing'

const PIN_COLORS = ['#d32f2f', '#333333']

function App() {
  const [postType, setPostType] = useState<ListingType | null>(null)
  const [pins, setPins] = useState<[number, number][]>([])
  const [refreshToken, setRefreshToken] = useState(0)

  const pinsNeeded = postType === 'lost' ? 2 : postType === 'found' ? 1 : 0
  const isCreating = postType !== null

  const handleMapClick =
    isCreating && pins.length < pinsNeeded
      ? (lngLat: [number, number]) => setPins((prev) => [...prev, lngLat])
      : undefined

  const resetPostFlow = () => {
    setPostType(null)
    setPins([])
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100vw', height: '100vh' }}>
      <Header
        disabled={isCreating}
        onSelectPostType={(type) => {
          setPostType(type)
          setPins([])
        }}
      />
      <div style={{ position: 'relative', flex: 1, minHeight: 0 }}>
        <ApiStatus />
        <MapView
          onMapClick={handleMapClick}
          pendingPins={pins.map((lngLat, i) => ({ lngLat, color: PIN_COLORS[i] ?? CATEGORY_COLORS.other }))}
          refreshToken={refreshToken}
        />
        {postType && (
          <NewPostForm
            type={postType}
            pins={pins}
            pinsNeeded={pinsNeeded}
            onCancel={resetPostFlow}
            onSubmitted={() => {
              resetPostFlow()
              setRefreshToken((token) => token + 1)
            }}
          />
        )}
      </div>
    </div>
  )
}

export default App
