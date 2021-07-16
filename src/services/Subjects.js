import { http } from './config.js'

export default {
  getAllSubjects: (query) => {
    return http.get('/subjects', { params: query })
  },
  getOneSubject: (id) => {
    return http.get(`/subjects/${id}`)
  },
  createSubject: (dados) => {
    return http.post('/subjects/', dados)
  },
  updateSubject: (id, dados) => {
    return http.put(`/subjects/${id}`, dados)
  }
}
