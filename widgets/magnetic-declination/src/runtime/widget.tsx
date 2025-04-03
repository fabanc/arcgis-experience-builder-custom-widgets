import { React, type AllWidgetProps } from 'jimu-core'
import type { IMConfig } from '../config'
import { JimuMapViewComponent, type JimuMapView } from 'jimu-arcgis'

import Point from 'esri/geometry/Point'
import * as geomag from './lib/geomag.min.js';

const { useState } = React


const Widget = (props: AllWidgetProps<IMConfig>) => {

const [latitude, setLatitude] = useState<string>('')
const [longitude, setLongitude] = useState<string>('')
const [declination, setDeclination] = useState<string>('')
const [horizontalIntensity, sethorizontalIntensity] = useState<string>('')

const activeViewChangeHandler = (jmv: JimuMapView) => {
  if (jmv) {
    // When the pointer moves, take the pointer location and create a Point
    // Geometry out of it (`view.toMap(...)`), then update the state.
    jmv.view.on('pointer-move', (evt) => {
      const point: Point = jmv.view.toMap({
        x: evt.x,
        y: evt.y
      })
      setLatitude(point.latitude.toFixed(3))
      setLongitude(point.longitude.toFixed(3))

      var myGeoMag2020 = geomag.field(point.latitude, point.longitude);
      setDeclination(myGeoMag2020.declination.toFixed(3))
      sethorizontalIntensity(myGeoMag2020.horizontalIntensity.toFixed(3))
    })
  }
}

  return (
    <div className="widget-demo jimu-widget m-2">
      <p>Magnetic Declination</p>
      {props.useMapWidgetIds && props.useMapWidgetIds.length === 1 && (
        <JimuMapViewComponent useMapWidgetId={props.useMapWidgetIds?.[0]} onActiveViewChange={activeViewChangeHandler} />
      )}

        <p> Lat/Lon: {latitude} {longitude} </p>
        <p> Magnetic Declination: {declination} </p>
        <p> Horizontal Intensity: {horizontalIntensity} </p>
    </div>
  )
}


export default Widget
