import type { ImmutableObject } from 'seamless-immutable'


export interface Config {
  coordinateDecimal: number
  magneticDeclinationDecimal: number
  horizontalIntensityDecimal: number
  showSeparators: boolean
}

export type IMConfig = ImmutableObject<Config>
