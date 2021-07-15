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
    name: 'Teacher',
    component: () => import('../layouts/College.vue'),
    children: [
      { path: 'subjects', component: () => import('../views/Subjects.vue') },
      { path: 'teachers', component: () => import('../views/Teachers.vue') },
      { path: 'students', component: () => import('../views/Students.vue') },
      { path: 'exams', component: () => import('../views/Exams.vue') }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
