import { useEffect, useRef } from 'react'
import * as maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { fakeListings, type ListingProperties } from '../data/fakeListings'
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

      const hoverPopup = new maplibregl.Popup({
        closeButton: false,
        closeOnClick: false,
        offset: 12,
      })

      let openClickPopup: maplibregl.Popup | null = null
      let openClickPopupId: string | null = null

      map.on('mouseenter', 'listings-markers', (e) => {
        map.getCanvas().style.cursor = 'pointer'
        const feature = e.features?.[0]
        if (!feature || feature.geometry.type !== 'Point') return

        const { id, name } = feature.properties as ListingProperties
        if (id === openClickPopupId) return

        const coordinates = feature.geometry.coordinates.slice() as [number, number]
        hoverPopup.setLngLat(coordinates).setText(name).addTo(map)
      })

      map.on('mouseleave', 'listings-markers', () => {
        map.getCanvas().style.cursor = ''
        hoverPopup.remove()
      })

      map.on('click', 'listings-markers', (e) => {
        const feature = e.features?.[0]
        if (!feature || feature.geometry.type !== 'Point') return

        hoverPopup.remove()
        openClickPopup?.remove()

        const coordinates = feature.geometry.coordinates.slice() as [number, number]
        const { id, name, description } = feature.properties as ListingProperties

        const container = document.createElement('div')

        const title = document.createElement('h3')
        title.textContent = name
        title.style.margin = '0 0 6px'
        title.style.fontSize = '15px'

        const body = document.createElement('p')
        body.textContent = description
        body.style.margin = '0'
        body.style.fontSize = '13px'

        container.append(title, body)

        const popup = new maplibregl.Popup({ offset: 12 }).setLngLat(coordinates).setDOMContent(container).addTo(map)

        popup.on('close', () => {
          if (openClickPopupId === id) openClickPopupId = null
        })

        openClickPopup = popup
        openClickPopupId = id
      })
    })

    return () => {
      map.remove()
    }
  }, [])

  return <div ref={containerRef} style={{ width: '100vw', height: '100vh' }} />
}
