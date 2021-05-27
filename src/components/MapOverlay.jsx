import React, { useState } from 'react'
import Button from './common/Button'
import XIcon from '@heroicons/react/outline/XIcon'
import { DeckGL } from 'deck.gl'
import { CartoSQLLayer } from '@deck.gl/carto'
import { StaticMap } from 'react-map-gl'
import { useSelectedAccount } from '@/lib/AccountsContext'
import { useAlertSetter } from '@/lib/AlertContext'
import Spinner from './common/Spinner'

function noop() {}

const INITIAL_VIEW_STATE = {
  longitude: 0,
  latitude: 0,
  zoom: 2
}

function handleMapTooltip({ object }) {
  if (object) {
    let html = ''
    Object.keys(object.properties).forEach((propertyName) => {
      if (propertyName === 'layerName') return
      html = html.concat(
        `<strong>${propertyName}</strong>: ${object.properties[propertyName]}<br/>`
      )
    })
    return { html }
  }
}

export default function MapOverlay({ query, onClose = noop }) {
  const credentials = useSelectedAccount()
  const [loading, setLoading] = useState(true)
  const [layers, setLayers] = useState([])
  const setAlert = useAlertSetter()

  function createCartoLayer() {
    function handleError(err) {
      // eslint-disable-next-line no-console
      console.error('[MapOverlay.js] Error calling maps API', err)
      setLoading(false)
      setAlert(err.toString())
    }

    function handleLoad() {
      setLoading(false)
    }

    const baseTemplate = credentials.urlTemplate || 'https://{user}.carto.com'
    const base = baseTemplate.replace('{user}', credentials.username)
    const layer = new CartoSQLLayer({
      id: 'viewer',
      data: query,
      pickable: true,
      credentials: {
        username: credentials.username,
        apiKey: credentials.apikey,
        sqlUrl: base + '/api/v2/sql',
        mapsUrl: base + '/api/v1/map'
      },
      pointRadiusMinPixels: 6,
      getLineColor: [0, 0, 0, 0.75],
      getFillColor: [238, 77, 90],
      lineWidthMinPixels: 1,
      onDataError: handleError,
      onDataLoad: handleLoad
    })

    return layer
  }

  return (
    <div className="absolute inset-0 z-10 bg-gray-300">
      <Button
        onClick={onClose}
        padding="p-2"
        color="gray"
        className="rounded-full m-2 absolute top-0 left-0 z-20"
      >
        <XIcon className="w-5 h-5" />
      </Button>
      {loading && (
        <div className="absolute inset-0 z-10 flex justify-center items-center bg-black bg-opacity-10">
          <Spinner size="12" />
        </div>
      )}
      <div className="relative w-ful h-full">
        <DeckGL
          initialViewState={INITIAL_VIEW_STATE}
          controller={true}
          onLoad={() => setLayers([createCartoLayer()])}
          getTooltip={handleMapTooltip}
          layers={layers}
        >
          <StaticMap
            reuseMaps
            mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
            preventStyleDiffing
          />
        </DeckGL>
      </div>
    </div>
  )
}
