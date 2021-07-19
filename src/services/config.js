import axios from 'axios'
import { LocalStorage, Dialog, Notify } from 'quasar'

export const http = axios.create({
  baseURL: 'http://localhost:3000/api',
  timeout: 60000
})

http.interceptors.response.use((response) => {
  if (response.data.status === 400) {
    for (let i = 0; i < response.data.errors.length; i++) {
      Notify.create({
        color: 'negative',
        title: 'Alerta',
        message: `${response.data.errors[i].message}`,
        icon: 'warning'
      })
    }
  }
  return response
}, (error) => {
  if (error.response) {
    const { data, status } = error.response
    const { errors } = data

    if (status === 400 || status === 404) {
      for (let i = 0; i < errors.length; i++) {
        if (errors[i].status === 400) {
          Notify.create({
            color: 'negative',
            title: 'Alerta',
            message: `${errors[i].message}`,
            icon: 'warning'
          })
        }
      }
    }
    if (status === 401 || status === 403) {
      if (LocalStorage.getItem('token')) {
        LocalStorage.clear('token')
        Dialog.create({
          icon: 'warning',
          title: 'Alerta',
          message: 'Por medida de segurança, desconectamos você do sistema pelo longo pedíodo de inatividade.',
          persistent: true
        }).onOk(() => {
          window.location.href = '/'
        })
      }
    }
  } else {
    Notify.create({
      color: 'negative',
      title: 'Alerta',
      message: 'Sem conexão com a internet',
      icon: 'signal_wifi_connected_no_internet_4'
    })
  }
  return Promise.reject(error)
})
