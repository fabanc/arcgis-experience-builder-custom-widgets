import { React, hooks, type AllWidgetProps, getAppStore, appActions, i18n } from 'jimu-core'
import type { IMConfig } from '../config'
import { JimuMapViewComponent, type JimuMapView } from 'jimu-arcgis'
import {Button, defaultMessages as jimuDefaultMessages} from 'jimu-ui'

// This party library that calculates the magnetic declination.
import * as geomag from './lib/geomag.min.js';

// Used to get points coordinates
import Point from 'esri/geometry/Point'

// Use to chose a point on a map
import Graphic from 'esri/Graphic'
import GraphicsLayer from 'esri/layers/GraphicsLayer'
import PictureMarkerSymbol from 'esri/symbols/PictureMarkerSymbol'


import defaultMessages from './translations/default'
import { LocatorOutlined } from 'jimu-icons/outlined/editor/locator'
import CopyRow from './components/copy-row'
import LabelRow from './components/label-row'



const { useState, useRef, useEffect } = React


const Widget = (props: AllWidgetProps<IMConfig>) => {
  const { coordinateDecimal, magneticDeclinationDecimal, horizontalIntensityDecimal, showSeparators} = props.config

  const useMapWidgetId = props.useMapWidgetIds?.[0]

  const [latitude, setLatitude] = useState<string>('')
  const [longitude, setLongitude] = useState<string>('')
  const [declination, setDeclination] = useState<string>('')
  const [horizontalIntensity, sethorizontalIntensity] = useState<string>('')
  const [currentJimuMapView, setCurrentJimuMapView] = useState(null)
  const [showMagneticNorth, setShowMagneticNorth] = useState(false)

  // Locate is true if the user is getting the magnetic declination by clicking the map.
  // Locate is false if the user is getting the magnetic declination by moving the mouse over the map.
  const [locateActive, setLocateActive] = useState(false)


  const magneticNorthLayer = useRef(null)
  const magneticNorthMarker = useRef(null)
  const graphicsLayer = useRef(null)
  const markerGraphic = useRef(null)
  const moveListener = useRef(null)
  const clickListener = useRef(null)
  const [enableRealtime, setEnableRealtime] = useState(true)
  const currentJimuMapViewRef = hooks.useLatest(currentJimuMapView)

  // translate
  const translate = hooks.useTranslation(defaultMessages, jimuDefaultMessages)
  const mapClickTips = translate('mapClickTips')
  const mouseMoveTips = translate('mouseMoveTips')
  const enableClickTips = translate('enableClickTips')
  const disableClickTips = translate('disableClickTips')
  const computing = translate('computing')
  const latitudeLabel = translate('latitude')
  const longitudeLabel = translate('longitude')
  const horizontalIntensityLabel = translate('horizontalIntensity')
  const magneticDeclinationLabel = translate('magneticDeclination')
  const showMagneticNorthLabel = translate('showMagneticNorth')


  const locateBtnTips = locateActive ? disableClickTips : enableClickTips

  useEffect(() => {
    console.log(showMagneticNorth)
    onShowMagneticNorth ()
  },[showMagneticNorth])

  useEffect(() => {
    graphicsLayer.current = new GraphicsLayer({ listMode: 'hide' })
    markerGraphic.current = null
    const map = currentJimuMapView?.view?.map
    map?.add(graphicsLayer.current)
    // change status when view switch
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentJimuMapView])


  useEffect(() => {
    return () => {
      if (currentJimuMapViewRef.current?.view) {
        currentJimuMapViewRef.current.view.cursor = 'default'
      }
      if (markerGraphic.current) {
        graphicsLayer.current?.remove(markerGraphic.current)
      }
      if (graphicsLayer.current) {
        const map = currentJimuMapViewRef.current?.view?.map
        map?.remove(graphicsLayer.current)
      }
      if (clickListener.current) clickListener.current?.remove()
      if (moveListener.current) moveListener.current?.remove()
    }
  }, [])  

   hooks.useUpdateEffect(() => {
     const view = currentJimuMapView?.view
     const viewTypeIsThree = view?.type === '3d'
     displayOnClient(null)
  
     if (locateActive == false) {
      console.log('Listening to mouse moves')
       clickListener.current?.remove()
       moveListener.current?.remove()
       moveListener.current = view?.on('pointer-move', (event) => {
         const point = view.toMap({ x: event.x, y: event.y })
         displayOnClient(point)
       })
     } else {

      clickListener.current?.remove()
      moveListener.current?.remove()
      clickListener.current = view?.on('click', (event) => {
        const threeDPoint = { x: event?.native?.pageX, y: event?.native?.pageY }
        onMapClick(event, viewTypeIsThree ? threeDPoint : undefined)
      })
     }
   }, [currentJimuMapView, locateActive, enableRealtime]) 



  const activeViewChangeHandler = (jmv: JimuMapView) => {
    if (jmv) {

      const viewTypeIsThree = jmv.view?.type === '3d'
      setCurrentJimuMapView(jmv)
      // When the pointer moves, take the pointer location and create a Point
      // Geometry out of it (`view.toMap(...)`), then update the state.
      moveListener.current = jmv.view.on('pointer-move', (evt) => {
        const point: Point = jmv.view.toMap({
          x: evt.x,
          y: evt.y
        })
        displayOnClient(point)
      })

      
      // clickListener.current = jmv.view?.on('click', (event) => {
      //   const threeDPoint = { x: event?.native?.pageX, y: event?.native?.pageY }
      //   onMapClick(event, viewTypeIsThree ? threeDPoint : undefined)
      // })
    }
  }

  const onShowMagneticNorthChange = (evt) => {
    setShowMagneticNorth(evt.target.checked)
  }

  const removeLayerAndMarker = () => {
    if (markerGraphic.current) {
      graphicsLayer.current?.remove(markerGraphic.current)
    }
    if (graphicsLayer.current) {
      const orgMap = currentJimuMapView?.view?.map
      orgMap?.remove(graphicsLayer.current)
    }
  }

  const onLocateClick = async () => {

    // Inform other widgets, map is used.
    if (locateActive) {
      getAppStore().dispatch(
        appActions.releaseAutoControlMapWidget(useMapWidgetId)
      )
    } else {
      getAppStore().dispatch(
        appActions.requestAutoControlMapWidget(useMapWidgetId, props.id)
      )
    }

    graphicsLayer.current.remove(markerGraphic.current)
    markerGraphic.current = null

    if (!locateActive) {
      setEnableRealtime(false)
    } else {
      setEnableRealtime(true)
    }
    
    if (currentJimuMapView?.view) {
      const cursorType = locateActive ? 'default' : 'crosshair'
      currentJimuMapView.view.cursor = cursorType
    }
    
    setLocateActive(!locateActive)
  }

  const onMapClick = async (evt, threeDPoint?) => {
  
    graphicsLayer.current.remove(markerGraphic.current)
    markerGraphic.current = null

    if (!evt.mapPoint) return
    const copyMapPoint = Point.fromJSON(evt.mapPoint.toJSON())
    evt.stopPropagation()

    markerGraphic.current = getMarkerGraphic(evt.mapPoint)
    graphicsLayer.current.add(markerGraphic.current)

    displayOnClient(evt.mapPoint)

  }

  const onShowMagneticNorth = () => {
    let map = currentJimuMapView?.view?.map
    if (!showMagneticNorth) {
      if (magneticNorthLayer.current != null){
        map.remove(magneticNorthLayer.current)
      }
      
      magneticNorthLayer.current = null
      magneticNorthMarker.current = null
    }
    else{
      const map = currentJimuMapView?.view?.map
      magneticNorthLayer.current = new GraphicsLayer({ listMode: 'hide' })
      map.add(magneticNorthLayer.current)
      const point = new Point({
        longitude: 139.384,
        latitude: 85.772
      })
      magneticNorthMarker.current = getMarkerGraphic(point)
      magneticNorthLayer.current.add(magneticNorthMarker.current)
    }
  }

  // Method to display the coordinates and declination on the client side. Used regardless
  // of the method used to capture the point.
  const displayOnClient = (point) => {

    if (!point){
      setLatitude(null)
      setLongitude(null)      
      setDeclination(null)
      sethorizontalIntensity(null)
    }
    else{ 
      setLatitude(
        localizeNumberBySettingInfo(
          point.latitude, 
          {places: coordinateDecimal, digitSeparator: showSeparators}
        )
      )
      setLongitude(
        localizeNumberBySettingInfo(
          point.longitude, 
          {places: coordinateDecimal, digitSeparator: showSeparators}
        )
      )

      var myGeoMag2020 = geomag.field(point.latitude, point.longitude);
      setDeclination(
        localizeNumberBySettingInfo(
          myGeoMag2020.declination, 
          {places: magneticDeclinationDecimal, digitSeparator: showSeparators}
        )
      )
      sethorizontalIntensity(
        localizeNumberBySettingInfo(
          myGeoMag2020.horizontalIntensity, 
          {places: horizontalIntensityDecimal, digitSeparator: showSeparators}
        )
      )

    }
  }

  const localizeNumberBySettingInfo = (num: number, settingInfo) => {
    const { places, digitSeparator } = settingInfo
    if (digitSeparator) {
      return i18n.getIntl().formatNumber(num, { maximumFractionDigits: places, minimumFractionDigits: places, useGrouping: true })
    } else {
      return i18n.getIntl().formatNumber(num, { maximumFractionDigits: places, minimumFractionDigits: places, useGrouping: false })
    }
  }  

  const getMarkerGraphic = (mapPoint) => {
    const symbol = new PictureMarkerSymbol({
      url: require('./assets/pin-exb.svg'),
      width: 12,
      height: 22,
      yoffset: 11
    })
    return new Graphic({
      geometry: mapPoint,
      symbol
    })
  }

  let tip = locateActive ? mapClickTips : mouseMoveTips

  return (
    <div className='jimu-widget-coordinates jimu-widget h-100' >
    <div className="coordinates-widget-container m-2 d-flex justify-content-between surface-1">
      <Button
        icon
        size='sm'
        type='tertiary'
        onClick={onLocateClick}
        variant={locateActive ? 'contained' : 'text'}
        color={locateActive ? 'primary' : 'default'}
        title={locateBtnTips}
        aria-label={locateBtnTips}
        className='jimu-outline-inside coordinates-locate'
      >
        <LocatorOutlined />
      </Button>
      <div className='coordinates-info text-truncate' title={tip}>
            {tip}
      </div>
    </div>

    
      {props.useMapWidgetIds && props.useMapWidgetIds.length === 1 && (
        <JimuMapViewComponent useMapWidgetId={props.useMapWidgetIds?.[0]} onActiveViewChange={activeViewChangeHandler} />
      )}
        <LabelRow label={showMagneticNorthLabel} checked={showMagneticNorth} onChange={onShowMagneticNorthChange}></LabelRow>
        <CopyRow label={latitudeLabel} copyableText={latitude}></CopyRow>
        <CopyRow label={longitudeLabel} copyableText={longitude}></CopyRow>
        <CopyRow label={magneticDeclinationLabel} copyableText={declination}></CopyRow>
        <CopyRow label={horizontalIntensityLabel} copyableText={horizontalIntensity}></CopyRow>

        
    </div>
  )

  
}


export default Widget
