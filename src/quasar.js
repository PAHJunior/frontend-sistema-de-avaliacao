import Vue from 'vue'

import './styles/quasar.sass'
import '@quasar/extras/roboto-font/roboto-font.css'
import '@quasar/extras/material-icons/material-icons.css'
import '@quasar/extras/fontawesome-v5/fontawesome-v5.css'
import { Quasar, Notify, LocalStorage, Dialog } from 'quasar'

Vue.use(Quasar, {
  config: {
    notify: {
      progress: true,
      actions: [{
        color: 'white',
        icon: 'close'
      }]
    }
  },
  plugins: {
    Notify,
    LocalStorage,
    Dialog
  }
})
