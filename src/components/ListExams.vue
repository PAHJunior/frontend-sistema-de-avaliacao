<template>
  <q-table
    grid
    :data="dataAvailableExams"
    :columns="columnsAvailableExams"
    :loading="loadingAvailableExams"
    row-key="name"
    :filter="filter"
    :pagination="{rowsPerPage: 10}"
    hide-header
  >
    <template v-slot:top>
      <q-input
        outlined
        dense
        debounce="300"
        v-model="filter"
        placeholder="Pesquisar">
        <template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-input>
    </template>
    <template v-slot:item="props">
      <div
        class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3 grid-style-transition"
        :style="props.selected ? 'transform: scale(0.95);' : ''"
      >
        <q-card :class="props.selected ? 'bg-grey-2' : ''">
          <q-card-section class="row">
            <span class="col-12 text-subtitle1 text-bold">{{ props.row.description }}</span>
          </q-card-section>
          <q-separator />
          <q-list dense>
            <q-item v-for="col in props.cols.filter(col => col.name !== 'description')" :key="col.name">
              <q-item-section>
                <q-item-label>{{ col.label }}</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-item-label caption>{{ col.value }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
          <div class="row q-pa-sm">
            <q-btn
              color="primary"
              dense
              class="col-12"
              label="Inciar Prova"
              @click="verifyStartExam(props.row)"
            />
          </div>
        </q-card>
      </div>
    </template>
  </q-table>
</template>

<script>

export default {
  props: {
  },
  methods: {
    verifyStartExam (exam) {
      this.dialogVerifyStartExam = true
      this.exam = exam
    },
    startExam () {
      this.dialogVerifyStartExam = false

      const exam = {
        description: this.exam.description,
        student: this.student._id,
        subject: this.exam.subjectID,
        questions: this.exam.questions,
        startAt: new Date()
      }

      StudentTest.createStudentTest(exam)
        .then((result) => {
          this.exam = result.data.studentTest
          Notify.create({
            color: 'secondary',
            message: 'Boa Prova!'
          })
        })
      this.dialogExam = true
    },
    getAllExams () {
      const query = {
        status: true
      }
      this.loadingAvailableExams = true
      Exams.getAllExams(query)
        .then((result) => {
          this.dataAvailableExams = result.data.exams.map((exam) => ({
            id: exam._id,
            description: exam.description,
            subject: exam.subject.title,
            subjectID: exam.subject._id,
            statusView: exam.status ? 'Ativo' : 'Inativo',
            status: exam.status,
            questions: exam.questions,
            questionsLength: exam.questions.length
          }))
        })
        .catch((error) => {
          console.error(error)
        })
        .finally(() => {
          this.loadingAvailableExams = false
        })
    }
  },
  name: 'ListExams'
}
</script>
