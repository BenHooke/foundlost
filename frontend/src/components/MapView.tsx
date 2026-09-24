import { useEffect, useRef } from 'react'
import * as maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { fakeListings } from '../data/fakeListings'
import { CATEGORY_COLORS } from '../data/categoryStyles'

const TORONTO_CENTER: [number, number] = [-79.3832, 43.6532]
const MAP_STYLE = 'https://tiles.openfreemap.org/styles/liberty'
const LISTINGS_SOURCE_ID = 'listings'

export function MapView() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: MAP_STYLE,
      center: TORONTO_CENTER,
      zoom: 11,
    })

    map.addControl(new maplibregl.NavigationControl())
    map.addControl(new maplibregl.GeolocateControl({}))
    map.addControl(new maplibregl.ScaleControl(), 'bottom-left')

    map.on('load', () => {
      map.addSource(LISTINGS_SOURCE_ID, {
        type: 'geojson',
        data: fakeListings,
      })

      map.addLayer({
        id: 'listings-markers',
        type: 'circle',
        source: LISTINGS_SOURCE_ID,
        paint: {
          'circle-radius': 8,
          'circle-color': [
            'match',
            ['get', 'category'],
            'bag',
            CATEGORY_COLORS.bag,
            'pet',
            CATEGORY_COLORS.pet,
            'wallet',
            CATEGORY_COLORS.wallet,
            'keys',
            CATEGORY_COLORS.keys,
            'electronics',
            CATEGORY_COLORS.electronics,
            CATEGORY_COLORS.other,
          ],
          'circle-stroke-width': 2,
          'circle-stroke-color': '#ffffff',
        },
      })
    })

    return () => {
      map.remove()
    }
  }, [])

  return <div ref={containerRef} style={{ width: '100vw', height: '100vh' }} />
}
