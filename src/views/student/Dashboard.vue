<template>
  <q-page padding>
    <div>
      <q-list bordered class="rounded-borders">
        <q-expansion-item
          expand-separator
          icon="event_available"
          default-opened
          label="Provas disponiveis"
          :caption="`${dataAvailableExams.length} prova(s)`"
        >
          <q-card>
            <q-card-section>
              <div>
                <q-table
                  grid
                  :data="dataAvailableExams"
                  :columns="columnsExams"
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
                            label="Iniciar Prova"
                            @click="verifyStartExam(props.row)"
                          />
                        </div>
                      </q-card>
                    </div>
                  </template>
                </q-table>
              </div>
            </q-card-section>
          </q-card>
        </q-expansion-item>

        <q-expansion-item
          expand-separator
          icon="hourglass_bottom"
          label="Provas em andamento"
          header-class="text-primary"
          :caption="`${dataProgressExams.length} prova(s)`"
        >
          <q-card>
            <q-card-section>
              <div>
                <q-table
                  grid
                  :data="dataProgressExams"
                  :columns="columnsExams"
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
                            label="Continuar prova"
                            @click="continueExam(props.row)"
                          />
                        </div>
                      </q-card>
                    </div>
                  </template>
                </q-table>
              </div>
            </q-card-section>
          </q-card>
        </q-expansion-item>

        <q-expansion-item
          expand-separator
          icon="check"
          label="Provas finalizadas"
          :caption="`${dataFinishExams.length} prova(s)`"
        >
          <q-card>
            <q-card-section>
              <div>
                <q-table
                  grid
                  :data="dataFinishExams"
                  :columns="columnsExams"
                  :loading="loadingFinishExams"
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
                            label="Ver resultado"
                            @click="openExamFinish(props.row)"
                          />
                        </div>
                      </q-card>
                    </div>
                  </template>
                </q-table>
              </div>
            </q-card-section>
          </q-card>
        </q-expansion-item>
      </q-list>
    </div>

    <q-dialog v-model="dialogExam" persistent full-height full-width>
      <q-card>
        <q-bar class="bg-secondary bg-white">
          <q-space />
          <q-btn
            dense
            flat
            color="secondary"
            icon="close"
            v-close-popup />
        </q-bar>

        <q-card-section class="q-pt-sm">
          <div class="row">
            <div class="col-12">
              <span class="text-bold">Prova:</span>
              <span> {{exam.description}}</span>
            </div>

            <div class="col-12 text-subtitle1">
              <span class="text-bold">Data e hora do inicio:</span>
              <span> {{ new Date(exam.startAt).getDate() + '/' +new Date(exam.startAt).getMonth()  }}</span>
            </div>
          </div>
          <div>
            <q-stepper
              v-model="step"
              header-nav
              ref="stepper"
              color="primary"
              animated
            >
              <q-step
                :name="index"
                :title="question.label"
                icon="error"
                :done="question.alternatives.filter((element) => (element.isChoice === true)).length > 0"

                v-for="(question, index) in exam.questions"
                :key="question.name"
              >
                <div class="row">
                  <span class="text-bold text-h6">{{question.description}}</span>
                  <q-checkbox
                    dense
                    class="col-12"
                    @input="updateExam"
                    :disable="
                      exam.finishAt ||
                      question.alternatives.filter((element) => (element.isChoice === true)).length > 0 && !alternative.isChoice"
                    v-model="alternative.isChoice"
                    :label="alternative.description"
                    color="teal"
                    v-for="(alternative, index) in question.alternatives"
                    :key="index"
                  />
                </div>
              </q-step>

              <template v-slot:navigation>
                <q-stepper-navigation>
                  <div v-if="exam.questions.length === step + 1">
                    <q-btn
                      color="primary"
                      label="Encerrar a prova"
                      :disable="exam.finishAt"
                      @click="dialogVerifyFinishExam = !dialogVerifyFinishExam"
                    />
                    <q-btn
                      v-if="step > 0"
                      flat
                      color="primary"
                      @click="$refs.stepper.previous()"
                      label="Voltar"
                      :disable="exam.finishAt"
                      class="q-ml-sm" />
                  </div>

                  <div v-else>
                    <q-btn
                      @click="$refs.stepper.next()"
                      color="primary"
                      :disable="exam.finishAt"
                      label="Proxima questão"
                    />
                    <q-btn
                      v-if="step > 0"
                      flat color="primary"
                      :disable="exam.finishAt"
                      @click="$refs.stepper.previous()"
                      label="Voltar"
                      class="q-ml-sm" />
                  </div>
                </q-stepper-navigation>
              </template>
            </q-stepper>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="dialogVerifyStartExam" persistent>
      <q-card class="q-pa-sm">
        <q-bar dark class="text-white">
          <q-space />
          <q-btn
            dense
            flat
            round
            icon="close"
            v-close-popup
            color="dark"
          />
        </q-bar>
        <div class="col-12 text-center">
          <q-icon size="100px" color="red" name="error_outline"></q-icon>
        </div>
        <div class="row col-12 text-center">
          <span class="q-py-sm col-12 text-grey-8 text-bold text-h5">
            Deseja iniciar a prova de "{{exam.description}}" ?
          </span>
          <div class="row col-12">
            <div class="row col-xs-12 col-sm-6 q-pa-xs">
              <q-btn
                dense
                flat
                class="col-12"
                color="secondary"
                label="mais tarde"
              />
            </div>
            <div class="row col-xs-12 col-sm-6 q-pa-xs">
              <q-btn
                class="col-12"
                color="primary"
                label="Sim, iniciar prova"
                dense
                @click="startExam"
              />
            </div>
          </div>
        </div>
      </q-card>
    </q-dialog>

    <q-dialog v-model="dialogVerifyFinishExam" persistent>
      <q-card v-if="examResult" class="q-pa-sm">
        <div class="row col-12 text-center">
          <span class="q-py-sm col-12 text-grey-8 text-bold text-h5">
            Resultado da prova
          </span>
        </div>
        <div class="col-12 text-center">
          <q-circular-progress
            show-value
            font-size="25px"
            :value="percentageAnswers"
            size="200px"
            :thickness="0.22"
            :color="percentageAnswers >= 80 ? 'positive' : percentageAnswers >= 50 ? 'warning' : 'negative'"
            track-color="grey-3"
            class="q-ma-md"
          >

            <div class="row">
              <span class="col-12">{{ percentageAnswers }}%</span>
              <span class="col-12 text-subtitle1">{{rightAnswers.length}} de {{exam.questions.length}}</span>
            </div>
          </q-circular-progress>

          <div class="row col-12">
            <div class="row col-12 q-pa-xs">
              <q-btn
                dense
                flat
                class="col-12"
                color="primary"
                label="Fechar prova"
                @click="examResult = false; dialogVerifyFinishExam = false; dialogExam = false"
              />
            </div>
          </div>
        </div>
      </q-card>
      <q-card v-else class="q-pa-sm">
        <q-bar dark class="text-white">
          <q-space />
          <q-btn
            dense
            flat
            round
            icon="close"
            v-close-popup
            color="dark"
          />
        </q-bar>
        <div class="col-12 text-center">
          <q-icon size="100px" color="red" name="error_outline"></q-icon>
        </div>
        <div class="row col-12 text-center">
          <span class="q-py-sm col-12 text-grey-8 text-bold text-h5">
            Deseja finalizar a prova?
          </span>
          <div class="row col-12">
            <div class="row col-xs-12 col-sm-6 q-pa-xs">
              <q-btn
                dense
                flat
                class="col-12"
                color="secondary"
                label="continuar responsendo"
                v-close-popup
              />
            </div>
            <div class="row col-xs-12 col-sm-6 q-pa-xs">
              <q-btn
                class="col-12"
                color="primary"
                label="Sim, finalizar prova"
                dense
                @click="finishExam"
              />
            </div>
          </div>
        </div>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import Exams from '../../services/Exams'
import StudentTest from '../../services/StudentTest'
import { LocalStorage, Notify } from 'quasar'

export default {
  watch: {
    dialogExam: function (val) {
      this.getAllExams()
      this.getAllProgressExams()
      this.getAllFinishExams()
    }
  },
  mounted () {
    this.getAllExams()
    this.getAllProgressExams()
    this.getAllFinishExams()
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
          this.exam = {
            ...result.data.studentTest,
            id: result.data.studentTest._id
          }
          Notify.create({
            color: 'secondary',
            message: 'Boa Prova!'
          })
          this.dialogExam = true
        })
    },
    continueExam (exam) {
      this.dialogExam = true
      this.exam = exam
    },
    updateExam () {
      const exam = {
        questions: this.exam.questions
      }

      StudentTest.updateStudentTest(this.exam.id, exam)
    },
    finishExam () {
      const exam = {
        questions: this.exam.questions,
        finishAt: new Date()
      }

      StudentTest.updateStudentTest(this.exam.id, exam)
        .then((result) => {
          const rightAnswers = []
          for (const i in this.exam.questions) {
            const alternatives = this.exam.questions[i].alternatives
            for (const x in alternatives) {
              if ((alternatives[x].isChoice === true) && (alternatives[x].isCorrect === true)) {
                rightAnswers.push(alternatives[x])
              }
            }
          }

          const resultExam = this.getExamResult(this.exam)
          this.percentageAnswers = resultExam.percentageAnswers
          this.rightAnswers = resultExam.rightAnswers
          this.examResult = true

          this.step = 0
        })
    },
    openExamFinish (exam) {
      this.dialogVerifyFinishExam = true
      this.examResult = true

      this.exam = exam

      const resultExam = this.getExamResult(this.exam)
      this.percentageAnswers = resultExam.percentageAnswers
      this.rightAnswers = resultExam.rightAnswers

      this.step = 0
    },
    getExamResult (exam) {
      const rightAnswers = []
      for (const i in this.exam.questions) {
        const alternatives = this.exam.questions[i].alternatives
        for (const x in alternatives) {
          if ((alternatives[x].isChoice === true) && (alternatives[x].isCorrect === true)) {
            rightAnswers.push(alternatives[x])
          }
        }
      }

      return {
        percentageAnswers: (rightAnswers.length * 100) / this.exam.questions.length,
        rightAnswers: rightAnswers
      }
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
            questionsLength: exam.questions.length,
            startAt: exam.startAt,
            finishAt: exam.finishAt
          }))
        })
        .catch((error) => {
          console.error(error)
        })
        .finally(() => {
          this.loadingAvailableExams = false
        })
    },
    getAllProgressExams () {
      const query = {
        student: this.student._id,
        notFinishAt: true
      }
      this.loadingProgressExams = true
      StudentTest.getAllStudentTest(query)
        .then((result) => {
          this.dataProgressExams = result.data.studentTests.map((exam) => ({
            id: exam._id,
            description: exam.description,
            subject: exam.subject.title,
            subjectID: exam.subject._id,
            statusView: exam.status ? 'Ativo' : 'Inativo',
            status: exam.status,
            questions: exam.questions,
            questionsLength: exam.questions.length,
            startAt: exam.startAt,
            finishAt: exam.finishAt
          }))
        })
        .catch((error) => {
          console.error(error)
        })
        .finally(() => {
          this.loadingAvailableExams = false
        })
    },
    getAllFinishExams () {
      const query = {
        student: this.student._id,
        finishAt: true
      }
      this.loadingFinishExams = true
      StudentTest.getAllStudentTest(query)
        .then((result) => {
          this.dataFinishExams = result.data.studentTests.map((exam) => ({
            id: exam._id,
            description: exam.description,
            subject: exam.subject.title,
            subjectID: exam.subject._id,
            statusView: exam.status ? 'Ativo' : 'Inativo',
            status: exam.status,
            questions: exam.questions,
            questionsLength: exam.questions.length,
            startAt: exam.startAt,
            finishAt: exam.finishAt
          }))
        })
        .catch((error) => {
          console.error(error)
        })
        .finally(() => {
          this.loadingFinishExams = false
        })
    }
  },
  name: 'StudentDashboard',
  data () {
    return {
      step: 0,
      student: LocalStorage.getItem('student'),
      exam: {
        description: '',
        questions: [],
        subject: ''
      },
      percentageAnswers: 0,
      rightAnswers: 0,
      dialogExam: false,
      dialogVerifyStartExam: false,
      dialogVerifyFinishExam: false,
      loadingAvailableExams: false,
      loadingProgressExams: false,
      loadingFinishExams: false,
      examResult: false,
      filter: '',
      columnsExams: [
        {
          name: 'description',
          required: true,
          label: 'Descrição',
          align: 'left',
          field: row => row.name,
          format: val => `${val}`,
          sortable: true
        },
        { name: 'subject', align: 'center', label: 'Materia', field: 'subject', sortable: true },
        { name: 'questionsLength', label: 'Quantidade de questões', field: 'questionsLength', sortable: true }
      ],
      dataAvailableExams: [],
      dataProgressExams: [],
      dataFinishExams: []
    }
  }
}
</script>
