import { http } from './config.js'

export default {
  getAllStudents: (query) => {
    return http.get('/students', { params: query })
  },
  getOneStudent: (id) => {
    return http.get(`/students/${id}`)
  },
  createStudent: (dados) => {
    return http.post('/students/', dados)
  },
  updateStudent: (id, dados) => {
    return http.put(`/students/${id}`, dados)
  }
}
