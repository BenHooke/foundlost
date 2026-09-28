import { ApiStatus } from './components/ApiStatus'
import { Header } from './components/Header'
import { MapView } from './components/MapView'

function App() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100vw', height: '100vh' }}>
      <Header />
      <div style={{ position: 'relative', flex: 1, minHeight: 0 }}>
        <ApiStatus />
        <MapView />
      </div>
    </div>
  )
}

export default App
