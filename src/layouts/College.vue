<template>
  <q-layout view="lHh LpR fFf">

    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="left = !left" />

        <q-toolbar-title>
          Faculdade <span class="text-bold">UMT</span>
        </q-toolbar-title>

        <q-space />
        <q-btn dense flat round icon="logout" @click="logout" />
      </q-toolbar>
    </q-header>

    <q-drawer show-if-above v-model="left" side="left" bordered>
      <q-scroll-area style="height: calc(100% - 150px); margin-top: 150px; border-right: 1px solid #ddd">
        <q-list bordered padding class="rounded-borders">
          <q-item
            clickable
            v-ripple
            to="/college/dashboard"
            active-class="bg-primary text-white"
          >
            <q-item-section avatar>
              <q-icon name="dashboard" />
            </q-item-section>

            <q-item-section>Dashboard</q-item-section>
          </q-item>

          <q-separator spaced />

          <q-item
            clickable
            v-ripple
            to="/college/subjects"
            active-class="bg-primary text-white"
          >
            <q-item-section avatar>
              <q-icon name="library_books" />
            </q-item-section>

            <q-item-section>Materias</q-item-section>
          </q-item>

          <q-item
            clickable
            v-ripple
            to="/college/teachers"
            active-class="bg-primary text-white"
          >
            <q-item-section avatar>
              <q-icon name="people" />
            </q-item-section>

            <q-item-section>Professores</q-item-section>
          </q-item>

          <q-item
            clickable
            v-ripple
            to="/college/students"
            active-class="bg-primary text-white"
          >
            <q-item-section avatar>
              <q-icon name="groups" />
            </q-item-section>

            <q-item-section>Alunos</q-item-section>
          </q-item>

          <q-item
            clickable
            v-ripple
            to="/college/exams"
            active-class="bg-primary text-white"
          >
            <q-item-section avatar>
              <q-icon name="description" />
            </q-item-section>

            <q-item-section>Provas</q-item-section>
          </q-item>

          <q-separator spaced />

          <q-item
            clickable
            v-ripple
            active-class="bg-primary text-white"
            @click="openPage('https://github.com/PAHJunior/')"
          >
            <q-item-section avatar>
              <q-icon name="fab fa-github" />
            </q-item-section>

            <q-item-section>GitHub</q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>

      <q-img class="absolute-top" src="data:image/jpeg;base64,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" style="height: 150px">
        <div class="absolute-bottom bg-transparent">
          <div class="text-h5 text-weight-bold text-white">{{ teacher.name }}</div>
        </div>
      </q-img>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script>
import { openURL, LocalStorage } from 'quasar'
export default {
  name: 'College',
  methods: {
    openPage (link) {
      openURL(link)
    },
    logout () {
      this.$router.push('/')
    }
  },
  data () {
    return {
      left: false,
      link: 'subjects',
      teacher: LocalStorage.getItem('teacher')
    }
  }
}
</script>
