import { ApiStatus } from './components/ApiStatus'
import { MapView } from './components/MapView'

function App() {
  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      <ApiStatus />
      <MapView />
    </div>
  )
}

export default App
