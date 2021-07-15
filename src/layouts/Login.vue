<template>
  <q-layout view="lHh LpR fFf">

    <q-page-container>
      <q-page padding class="row content-center">
        <div class="row">
          <div class="col-8" style="height: 450px">
            <h2 class="col-12 text-h2">Faça login para acessar sua conta</h2>
          </div>
          <div class="row col-4 justify-end items-end">
            <img
              class="col-12"
              alt="Vue logo"
              src="../assets/teacher.svg"
              style="width: 400px; height: 400px;">
          </div>

          <div class="col-12 row q-col-gutter-sm">
            <div class="row col-6">
              <q-btn
                flat
                class="col-12"
                label="Aluno"
                align="between"
                icon-right="arrow_forward"
                size="30px"
                @click="dialogLoginStudent = !dialogLoginStudent"
              />
            </div>
            <div class="row col-6">
              <q-btn
                flat
                class="col-12"
                label="Professor"
                align="between"
                icon-right="arrow_forward"
                size="30px"
                @click="dialogLoginTeacher = !dialogLoginTeacher"
              />
            </div>
          </div>
        </div>
      </q-page>
    </q-page-container>

  <q-dialog v-model="dialogLoginTeacher" persistent>
    <q-card class="row">

      <q-card-section class="row col-12">
        <div class="text-h6">Entrando como Professor</div>
        <q-space />
        <q-btn
          icon="close"
          flat
          v-close-popup
        />
      </q-card-section>

      <q-card-section class="col-12 q-pt-none">
        <q-form
          @submit="onSubmit"
          @reset="onReset"
          class="q-gutter-md"
        >
          <q-input
            outlined
            v-model="teacher.email"
            label="Seu e-mail"
            hide-bottom-space
            lazy-rules
            :rules="[ val => val && val.length > 0 || 'Por favor informe seu e-mail']"
          />

          <q-input
            outlined
            :type="isTeacherPassword ? 'password' : 'text'"
            v-model="teacher.password"
            label="Sua senha"
            hide-bottom-space
            lazy-rules
            :rules="[ val => val && val.length > 0 || 'Por favor informe sua senha']"
          >
            <template v-slot:append>
              <q-icon
                :name="isTeacherPassword ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isTeacherPassword = !isTeacherPassword"
              />
            </template>
          </q-input>
        </q-form>
      </q-card-section>

      <q-card-actions class="col-12" align="right">
        <q-btn
          flat
          label="Entrar"
          color="primary"
          @click="loginTeacher"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <q-dialog v-model="dialogLoginStudent" persistent>
    <q-card class="row">
      <q-card-section class="row col-12">
        <div class="text-h6">Entrando como Aluno</div>
        <q-space />
        <q-btn
          icon="close"
          flat
          v-close-popup
        />
      </q-card-section>

      <q-card-section class="col-12 q-pt-none">
        <q-form
          @submit="onSubmit"
          @reset="onReset"
          class="q-gutter-md"
        >
          <q-input
            outlined
            v-model="student.ra"
            label="Informe seu RA"
            hide-bottom-space
            lazy-rules
            :rules="[ val => val && val.length > 0 || 'Por favor informe seu RA']"
          />

          <q-input
            outlined
            :type="isStudentPassword ? 'password' : 'text'"
            v-model="student.password"
            label="Sua senha"
            hide-bottom-space
            lazy-rules
            :rules="[ val => val && val.length > 0 || 'Por favor informe sua senha']"
          >
            <template v-slot:append>
              <q-icon
                :name="isStudentPassword ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isStudentPassword = !isStudentPassword"
              />
            </template>
          </q-input>
        </q-form>
      </q-card-section>

      <q-card-actions class="col-12" align="right">
        <q-btn
          flat
          label="Entrar"
          color="primary"
          v-close-popup
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
  </q-layout>
</template>

<script>
export default {
  methods: {
    loginTeacher () {
      this.$router.push('/college')
    }
  },
  data () {
    return {
      dialogLoginTeacher: false,
      dialogLoginStudent: false,
      isTeacherPassword: false,
      teacher: {
        email: '',
        password: ''
      },
      isStudentPassword: false,
      student: {
        ra: '',
        password: ''
      }
    }
  }
}
</script>

<style scoped>
h2 {
  font-family: 'Comfortaa'
}
</style>
