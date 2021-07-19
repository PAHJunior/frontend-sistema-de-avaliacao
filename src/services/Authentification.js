import { http } from './config.js'

export default {
  loginTeacher: (dados) => {
    return http.post('/auth/teacher', dados)
  },
  loginStudent: (dados) => {
    return http.post('/auth/student', dados)
  }
}
