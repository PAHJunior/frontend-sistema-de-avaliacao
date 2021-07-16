import { http } from './config.js'

export default {
  getAllTeachers: () => {
    return http.get('/teachers')
  },
  getOneTeacher: (id) => {
    return http.get(`/teachers/${id}`)
  },
  createTeacher: (dados) => {
    return http.post('/teachers/', dados)
  },
  updateTeacher: (id, dados) => {
    return http.put(`/teachers/${id}`, dados)
  }
}
