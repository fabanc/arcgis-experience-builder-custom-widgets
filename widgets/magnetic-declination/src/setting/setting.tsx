/** @jsxImportSource @emotion/react */
import { React, hooks, defaultMessages as jimuCoreMessages } from 'jimu-core'
import { type AllWidgetSettingProps } from 'jimu-for-builder'
import { getSettingStyle } from './style'
import { Button, defaultMessages as jimuMessages, Icon, Label, NumericInput, Radio, Switch, Tooltip } from 'jimu-ui'
import { MapWidgetSelector, SettingRow, SettingSection, SidePopper } from 'jimu-ui/advanced/setting-components'
import defaultMessages from './translations/default'
import { type CoordinateConfig, DisplayOrderType, ElevationUnitType, type IMConfig, WidgetStyleType } from '../config'

const Setting = (props: AllWidgetSettingProps<any>) => {
  const {
    id,
    theme,
    onSettingChange,
    config: propConfig,
    useMapWidgetIds
  } = props

  const { coordinateSystem, showSeparators, coordinateDecimal, magneticDeclinationDecimal, magneticInclinationDecimal, horizontalIntensityDecimal, altitudeDecimal, displayOrder } = propConfig

  // translate
  const translate = hooks.useTranslation(defaultMessages, jimuMessages, jimuCoreMessages)
  const selectMapWidget = translate('selectMapWidget')
  const classicType = translate('classic')
  const modernType = translate('modern')
  const outputCoordinateSystem = translate('outputCoordinateSystem')
  const newCoordinateSystem = translate('newCoordinate')
  const remove = translate('remove')
  const configureCoordinateSystem = translate('configureCoordinate')
  const displayOptions = translate('displayOptions')
  const coordinateDecimalLabel = translate('coordinateDecimal')
  const magneticDeclinationLabel = translate('magneticDeclinationDecimal')
  const magneticInclinationLabel = translate('magneticInclinationDecimal')
  const horizontalIntensityLabel = translate('horizontalIntensityDecimal')
  const altitudeDecimalLabel = translate('altitudeDecimal')
  const showSeparatorsLabel = translate('showSeparators')
  const displayOrderLabel = translate('displayOrder')
  const loLaMode = translate('loLaMode')
  const laLoMode = translate('laLoMode')
  const selectMapHint = translate('selectMapHint')
  const widgetStyleLabel = translate('style')


  const onPropertyChange = (name, value) => {
    if (value === propConfig[name]) return
    const newConfig = propConfig.set(name, value)
    const newProps = { id, config: newConfig }
    onSettingChange(newProps)
  }

  const handleCoordinateDecimal = (valueInt: number) => {
    onPropertyChange('coordinateDecimal', valueInt)
  }

  const handleMagneticDeclinationDecimal = (valueInt: number) => {
    onPropertyChange('magneticDeclinationDecimal', valueInt)
  } 

  const handleMagneticInclinationDecimal = (valueInt: number) => {
    onPropertyChange('magneticInclinationDecimal', valueInt)
  } 

  const handleHorizontalIntensityDecimal = (valueInt: number) => {
    onPropertyChange('horizontalIntensityDecimal', valueInt)
  }

  const handleAltitudeDecimal = (valueInt: number) => {
    onPropertyChange('altitudeDecimal', valueInt)
  }

  const onMapWidgetSelected = (useMapWidgetIds: string[]) => {
      props.onSettingChange({
        id: props.id,
        useMapWidgetIds: useMapWidgetIds
      })
    }
    return (
      <div className='widget-setting-coordinates jimu-widget-setting' css={getSettingStyle(props.theme) as any}>

          <SettingSection
            title={selectMapWidget}
          >
            <SettingRow>
              <MapWidgetSelector
                onSelect={onMapWidgetSelected}
                useMapWidgetIds={props.useMapWidgetIds}
              />
            </SettingRow>
          </SettingSection>

              <SettingSection
                title={displayOptions}
                role='group'
                aria-label={displayOptions}
              >
                <SettingRow flow='wrap' label={coordinateDecimalLabel}>
                  <NumericInput
                    size='sm'
                    value={coordinateDecimal}
                    precision={0}
                    min={0}
                    max={10}
                    onChange={handleCoordinateDecimal}
                    aria-label={coordinateDecimalLabel}
                    className='w-100'
                  />
                </SettingRow>
                <SettingRow flow='wrap' label={magneticDeclinationLabel}>
                <NumericInput
                    size='sm'
                    value={magneticDeclinationDecimal}
                    precision={0}
                    min={0}
                    max={10}
                    onChange={handleMagneticDeclinationDecimal}
                    aria-label={magneticDeclinationLabel}
                    className='w-100'
                  />
                </SettingRow>
                <SettingRow flow='wrap' label={horizontalIntensityLabel}>
                <NumericInput
                    size='sm'
                    value={magneticInclinationDecimal}
                    precision={0}
                    min={0}
                    max={10}
                    onChange={handleMagneticInclinationDecimal}
                    aria-label={magneticInclinationLabel}
                    className='w-100'
                  />
                </SettingRow>                     
                <SettingRow flow='wrap' label={horizontalIntensityLabel}>
                  <NumericInput
                    size='sm'
                    value={horizontalIntensityDecimal}
                    precision={0}
                    min={0}
                    max={10}
                    onChange={handleHorizontalIntensityDecimal}
                    aria-label={horizontalIntensityLabel}
                    className='w-100'
                  />
                </SettingRow>                  
                <SettingRow tag='label' label={showSeparatorsLabel}>
                  <Switch
                    className='can-x-switch'
                    checked={showSeparators}
                    data-key='showSeparators'
                    onChange={evt => {
                      onPropertyChange('showSeparators', evt.target.checked)
                    }}
                  />
                </SettingRow>
              </SettingSection>
      </div>
    )
}
    
export default Setting
