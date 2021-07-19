import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Login',
    component: () => import('../layouts/Login.vue')
  },
  {
    path: '/college',
    name: 'College',
    meta: { title: 'College - UMT' },
    component: () => import('../layouts/College.vue'),
    children: [
      {
        path: 'dashboard',
        component: () => import('../views/teacher/Dashboard.vue'),
        meta: {
          title: 'Dashboard',
          titleTemplate: title => `${title} - UMT`
        }
      },
      {
        path: 'subjects',
        component: () => import('../views/teacher/Subjects.vue'),
        meta: {
          title: 'Subjects',
          titleTemplate: title => `${title} - UMT`
        }
      },
      {
        path: 'teachers',
        component: () => import('../views/teacher/Teachers.vue'),
        meta: { title: 'Teachers - UMT' }
      },
      {
        path: 'students',
        component: () => import('../views/teacher/Students.vue'),
        meta: { title: 'Students - UMT' }
      },
      {
        path: 'exams',
        component: () => import('../views/teacher/Exams.vue'),
        meta: { title: 'Exams - UMT' }
      }
    ]
  },
  {
    path: '/student',
    name: 'Student',
    meta: { title: 'Student - UMT' },
    component: () => import('../layouts/Student.vue'),
    children: [
      {
        path: 'dashboard',
        component: () => import('../views/student/Dashboard.vue'),
        meta: {
          title: 'Dashboard',
          titleTemplate: title => `${title} - UMT`
        }
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
