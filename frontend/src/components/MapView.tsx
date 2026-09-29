import { useEffect, useRef } from 'react'
import * as maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { fetchListings } from '../api/listings'
import type { ListingProperties } from '../types/listing'
import { CATEGORY_COLORS } from '../data/categoryStyles'
import type { TypeFilter } from './FilterBar'

const TORONTO_CENTER: [number, number] = [-79.3832, 43.6532]
const MAP_STYLE = 'https://tiles.openfreemap.org/styles/liberty'
const LISTINGS_SOURCE_ID = 'listings'
const LISTINGS_LAYER_ID = 'listings-markers'

export interface PendingPin {
  lngLat: [number, number]
  color: string
}

interface MapViewProps {
  onMapClick?: (lngLat: [number, number]) => void
  pendingPins?: PendingPin[]
  refreshToken?: number
  typeFilter?: TypeFilter
}

export function MapView({ onMapClick, pendingPins, refreshToken, typeFilter = 'all' }: MapViewProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<maplibregl.Map | null>(null)
  const pendingMarkersRef = useRef<maplibregl.Marker[]>([])

  useEffect(() => {
    if (!containerRef.current) return

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: MAP_STYLE,
      center: TORONTO_CENTER,
      zoom: 11,
      attributionControl: false,
    })
    mapRef.current = map

    map.addControl(new maplibregl.AttributionControl({ compact: true }))
    map.addControl(new maplibregl.NavigationControl())
    map.addControl(new maplibregl.GeolocateControl({}))

    map.on('load', () => {
      map.addSource(LISTINGS_SOURCE_ID, {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: [] },
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
            'clothes',
            CATEGORY_COLORS.clothes,
            'accessory',
            CATEGORY_COLORS.accessory,
            'pet',
            CATEGORY_COLORS.pet,
            'wallet',
            CATEGORY_COLORS.wallet,
            'card',
            CATEGORY_COLORS.card,
            'keys',
            CATEGORY_COLORS.keys,
            'electronics',
            CATEGORY_COLORS.electronics,
            CATEGORY_COLORS.other,
          ],
          'circle-stroke-width': 2,
          'circle-stroke-color': ['match', ['get', 'type'], 'found', '#000000', '#ffffff'],
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
        const { id, name, description, contactInfo } = feature.properties as ListingProperties

        const container = document.createElement('div')

        const title = document.createElement('h3')
        title.textContent = name
        title.style.margin = '0 0 6px'
        title.style.fontSize = '15px'

        const body = document.createElement('p')
        body.textContent = description
        body.style.margin = '0 0 6px'
        body.style.fontSize = '13px'

        const contact = document.createElement('p')
        contact.textContent = `Contact: ${contactInfo}`
        contact.style.margin = '0'
        contact.style.fontSize = '13px'
        contact.style.fontWeight = '600'

        container.append(title, body, contact)

        const popup = new maplibregl.Popup({ offset: 12 }).setLngLat(coordinates).setDOMContent(container).addTo(map)

        popup.on('close', () => {
          if (openClickPopupId === id) openClickPopupId = null
        })

        openClickPopup = popup
        openClickPopupId = id
      })

      fetchListings()
        .then((data) => {
          const source = map.getSource(LISTINGS_SOURCE_ID) as maplibregl.GeoJSONSource
          source.setData(data)
        })
        .catch((error: unknown) => {
          console.error('Failed to load listings', error)
        })
    })

    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [])

  useEffect(() => {
    const map = mapRef.current
    if (!map || !onMapClick) return

    const handleClick = (e: maplibregl.MapMouseEvent) => {
      onMapClick([e.lngLat.lng, e.lngLat.lat])
    }

    map.on('click', handleClick)
    return () => {
      map.off('click', handleClick)
    }
  }, [onMapClick])

  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    pendingMarkersRef.current.forEach((marker) => marker.remove())
    pendingMarkersRef.current = (pendingPins ?? []).map(({ lngLat, color }) =>
      new maplibregl.Marker({ color }).setLngLat(lngLat).addTo(map),
    )

    return () => {
      pendingMarkersRef.current.forEach((marker) => marker.remove())
      pendingMarkersRef.current = []
    }
  }, [pendingPins])

  useEffect(() => {
    const map = mapRef.current
    if (!map || refreshToken === undefined) return

    const source = map.getSource(LISTINGS_SOURCE_ID) as maplibregl.GeoJSONSource | undefined
    if (!source) return

    fetchListings()
      .then((data) => source.setData(data))
      .catch((error: unknown) => {
        console.error('Failed to load listings', error)
      })
  }, [refreshToken])

  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    const applyFilter = () => {
      if (!map.getLayer(LISTINGS_LAYER_ID)) return
      map.setFilter(LISTINGS_LAYER_ID, typeFilter === 'all' ? null : ['==', ['get', 'type'], typeFilter])
    }

    if (map.isStyleLoaded()) {
      applyFilter()
    } else {
      map.once('load', applyFilter)
    }
  }, [typeFilter])

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
}
