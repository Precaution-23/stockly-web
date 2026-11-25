import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { provideApolloClient } from '@vue/apollo-composable'
import { abilitiesPlugin } from '@casl/vue'
import ability from '@/plugins/casl/ability'
import vuetify from '@/plugins/vuetify'
import router from '@/plugins/1.router'
import apolloClient from '@/apollo-config'
import App from './App.vue'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

const app = createApp(App)

app.use(pinia)
app.use(router)
app.use(vuetify)
app.use(abilitiesPlugin, ability, { useGlobalGuard: true })

provideApolloClient(apolloClient)

app.mount('#app')
