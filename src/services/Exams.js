import { http } from './config.js'

export default {
  getAllExams: (query) => {
    return http.get('/exams', { params: query })
  },
  getOneExam: (id) => {
    return http.get(`/exams/${id}`)
  },
  createExam: (dados) => {
    return http.post('/exams/', dados)
  },
  updateExam: (id, dados) => {
    return http.put(`/exams/${id}`, dados)
  }
}
