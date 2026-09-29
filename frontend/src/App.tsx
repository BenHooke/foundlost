import { useState } from 'react'
import { ApiStatus } from './components/ApiStatus'
import { CategoryFilter } from './components/CategoryFilter'
import { CATEGORY_OPTIONS } from './data/categoryStyles'
import { FilterBar, type TypeFilter } from './components/FilterBar'
import { Header } from './components/Header'
import { Legend } from './components/Legend'
import { MapView } from './components/MapView'
import { NewPostForm } from './components/NewPostForm'
import { ReportFab } from './components/ReportFab'
import type { ListingCategory, ListingType } from './types/listing'

const PIN_COLOR = '#d32f2f'
const PINS_NEEDED = 1
const ALL_CATEGORIES = CATEGORY_OPTIONS.map((option) => option.value)

function App() {
  const [postType, setPostType] = useState<ListingType | null>(null)
  const [pins, setPins] = useState<[number, number][]>([])
  const [refreshToken, setRefreshToken] = useState(0)
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all')
  const [categoryFilter, setCategoryFilter] = useState<ListingCategory[]>(ALL_CATEGORIES)

  const isCreating = postType !== null

  const handleMapClick =
    isCreating && pins.length < PINS_NEEDED
      ? (lngLat: [number, number]) => setPins((prev) => [...prev, lngLat])
      : undefined

  const resetPostFlow = () => {
    setPostType(null)
    setPins([])
  }

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      <div style={{ position: 'absolute', inset: 0 }}>
        <ApiStatus />
        <MapView
          onMapClick={handleMapClick}
          pendingPins={pins.map((lngLat) => ({ lngLat, color: PIN_COLOR }))}
          refreshToken={refreshToken}
          typeFilter={typeFilter}
          categoryFilter={categoryFilter}
        />
        <FilterBar value={typeFilter} onChange={setTypeFilter} />
        <div style={{ position: 'absolute', left: 12, bottom: 12, display: 'flex', alignItems: 'flex-end', gap: 12 }}>
          <Legend selectedCategories={categoryFilter} />
          <CategoryFilter value={categoryFilter} onChange={setCategoryFilter} />
        </div>
        <ReportFab
          disabled={isCreating}
          onSelectPostType={(type) => {
            setPostType(type)
            setPins([])
          }}
        />
        {postType && (
          <NewPostForm
            type={postType}
            pins={pins}
            pinsNeeded={PINS_NEEDED}
            onCancel={resetPostFlow}
            onSubmitted={() => {
              resetPostFlow()
              setRefreshToken((token) => token + 1)
            }}
          />
        )}
      </div>
      <Header />
    </div>
  )
}

export default App
