import { http } from './config.js'

export default {
  getAllStudentTest: (query) => {
    return http.get('/studenttests', { params: query })
  },
  getOneStudentTest: (id) => {
    return http.get(`/studenttests/${id}`)
  },
  createStudentTest: (dados) => {
    return http.post('/studenttests/', dados)
  },
  updateStudentTest: (id, dados) => {
    return http.put(`/studenttests/${id}`, dados)
  }
}
