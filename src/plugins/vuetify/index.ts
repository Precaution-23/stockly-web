import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { VBtn } from 'vuetify/components/VBtn'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import '@mdi/font/css/materialdesignicons.css'
// Must load after Vuetify's component CSS so our overrides win
import '@/styles/components.css'
import defaults from './defaults'
import themes from './theme'

export default createVuetify({
  components,
  directives,
  aliases: {
    IconBtn: VBtn,
  },
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: { mdi },
  },
  theme: {
    defaultTheme: 'light',
    themes,
  },
  defaults,
})
