import type { ThemeDefinition } from 'vuetify'

// Palette modelled on the uvosyo web UI: vivid blue primary, soft grey-violet
// background, ink-coloured text (#2F2B3D) and tinted shadows.
const primary = '#0064FC'
const primaryDarken = '#004FC3'

const sharedColors = {
  'primary': primary,
  'on-primary': '#FFFFFF',
  'primary-darken-1': primaryDarken,
  'secondary': '#808390',
  'on-secondary': '#FFFFFF',
  'secondary-darken-1': '#737682',
  'success': '#28C76F',
  'on-success': '#FFFFFF',
  'success-darken-1': '#24B364',
  'info': '#00BAD1',
  'on-info': '#FFFFFF',
  'info-darken-1': '#00A7BC',
  'warning': '#FF9F43',
  'on-warning': '#FFFFFF',
  'warning-darken-1': '#E68F3C',
  'error': '#FF4C51',
  'on-error': '#FFFFFF',
  'error-darken-1': '#E64449',
  // Table header band colour
  'header': '#144BE4',
  'on-header': '#FFFFFF',
}

const sharedVariables = {
  'hover-opacity': 0.06,
  'focus-opacity': 0.1,
  'selected-opacity': 0.08,
  'activated-opacity': 0.16,
  'pressed-opacity': 0.14,
  'dragged-opacity': 0.1,
  'disabled-opacity': 0.4,
  'border-opacity': 0.12,
  'high-emphasis-opacity': 0.9,
  'medium-emphasis-opacity': 0.7,
}

export const light: ThemeDefinition = {
  dark: false,
  colors: {
    ...sharedColors,
    'background': '#F8F7FA',
    'on-background': '#2F2B3D',
    'surface': '#FFFFFF',
    'on-surface': '#2F2B3D',
    'surface-variant': '#424242',
    'on-surface-variant': '#FFFFFF',
  },
  variables: {
    ...sharedVariables,
    'border-color': '#2F2B3D',
    'overlay-scrim-background': '#2F2B3D',
    'overlay-scrim-opacity': 0.5,
    'shadow-key-umbra-color': '#2F2B3D',
    'track-bg': '#F1F0F2',
  },
}

export const dark: ThemeDefinition = {
  dark: true,
  colors: {
    ...sharedColors,
    'background': '#25293C',
    'on-background': '#E1DEF5',
    'surface': '#2F3349',
    'on-surface': '#E1DEF5',
    'surface-variant': '#4A5072',
    'on-surface-variant': '#E1DEF5',
  },
  variables: {
    ...sharedVariables,
    'border-color': '#E1DEF5',
    'overlay-scrim-background': '#171925',
    'overlay-scrim-opacity': 0.6,
    'shadow-key-umbra-color': '#131120',
    'track-bg': '#3A3F57',
  },
}

export default { light, dark }
