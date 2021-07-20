<template>
  <q-page padding>
    <div>
      <q-table
        table-header-class="text-secondary"
        :data="data"
        :columns="columns"
        dense
        :loading="loadingTableExams"
        rows-per-page-label="Registros por página"
        row-key="title"
        :pagination="{rowsPerPage: 15}"
        :filter="filter"
      >
        <template v-slot:top="props">
          <div class="col-md-6 col-12 q-table__title">Provas</div>

          <div class="col-md-6 col-12 row q-col-gutter-sm">
            <div class="row col-md-6 col-12">
              <q-input
                outlined
                dense
                class="col-12"
                debounce="300"
                v-model="filter"
                placeholder="Pesquisar"
              >
                <template v-slot:append>
                  <q-btn
                    flat
                    dense
                    @click="getAllExams"
                    icon="search"
                    />
                </template>
              </q-input>
            </div>

            <div class="row col-md-4 col-10">
              <q-btn
                class="col-12"
                outline
                dense
                color="secondary"
                label="Novo cadastro"
                @click="openDialogExams"
              />
            </div>

            <div class="row col-2">
              <q-btn
                class="col-12"
                flat
                round
                dense
                :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
                @click="props.toggleFullscreen"
              />
            </div>
          </div>
        </template>

        <template v-slot:body="props">
          <q-tr
            :props="props"
            :class="props.row.status === 'Inativo' ? 'bg-red-2' : ''"
            @click="openDialogExams(props.row)"
          >
            <q-td
              v-for="(coluna) in columns"
              :key="coluna.name"
              :props="props"
            >
              <div class="cursor-pointer">
                {{ props.row[coluna.name] }}
              </div>
            </q-td>
          </q-tr>
        </template>

      </q-table>
    </div>

    <q-dialog v-model="dialogExams" persistent full-height full-width>
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

        <q-card-actions class="col-12" align="right">
          <q-form
            class="row q-col-gutter-sm col-12"
            greedy
            ref="formExam"
          >
            <div class="col-md-6 col-12">
              <q-input
                outlined
                dense
                v-model="exam.description"
                ref="examDescription"
                label="Descrição da prova *"
                hide-bottom-space
                class="col-12"
                lazy-rules
                :rules="[ val => val && val.length > 0 || 'Por favor informe o titulo da prova']"
              />

            </div>

            <div class="col-md-5 col-12">
              <q-select
                label="Informe a materia *"
                outlined
                dense
                v-model="exam.subject"
                :options="optionsSubjects"
                clearable
                input-debounce="0"
                hint="Precione enter para cadastrar uma nova materia"
                :rules="[ val => val || 'Por favor informe a materia']"
                hide-bottom-space
                lazy-rules
                option-value="id"
                option-label="title"
              />
            </div>

            <div class="col-md-1 col-12">
              <q-checkbox label="Status" v-model="exam.status" />
            </div>

            <div>
              <q-btn
                :disable="questions.length === 10"
                label="Adicionar nova pergunta"
                icon="add"
                color="primary"
                flat
                @click="addQuestion"
              />
            </div>

            <div>
              <q-btn
                :disable="questions.length === 1"
                label="Remover"
                class="col-12"
                icon="delete"
                color="negative"
                flat
                @click="removeQuestion"
              />
            </div>

            <div class="row col-12">
              <q-tabs
                v-model="tab"
                inline-label
                shrink
                stretch
              >
                <q-tab v-for="question in questions" :key="question.name" v-bind="question" />
              </q-tabs>
            </div>

            <q-tab-panels
              v-model="tab"
              animated
              class="col-12"
            >
              <q-tab-panel
                v-for="question in questions"
                :key="question.name"
                :name="question.name">
                <div class="row col-12 q-col-gutter-sm">
                  <div class="row col-12 q-col-gutter-sm">
                    <div class="row col-12">
                      <q-input
                        outlined
                        dense
                        autogrow
                        label="Descrição da pergunta *"
                        class="col-12"
                        debounce="300"
                        :ref="`${question.name}-question`"
                        :rules="[ val => val && val.length > 0 || 'Por favor informe a descrição da alternativa']"
                        v-model="question.description"
                      />
                    </div>

                    <div class="row">
                      <q-btn
                        :disable="question.alternatives.length === 5"
                        label="Adicionar alternativas"
                        color="primary"
                        flat
                        icon="add"
                        class="col-12"
                        @click="addRow(question.alternatives)"
                      />
                    </div>

                    <div class="row">
                      <q-btn
                        :disable="question.alternatives.length === 2"
                        label="Remover"
                        class="col-12"
                        flat
                        color="negative"
                        icon="delete"
                        @click="removeRow(question.alternatives)"
                      />
                    </div>

                    <div class="row col-12">
                      <div v-mutation="handler" class="col-12">
                        <q-list
                          v-if="question.alternatives.length > 0"
                          bordered
                          separator
                        >
                          <q-item
                            v-for="(alternative, index) in question.alternatives"
                            :key="index"
                            :id="`item-${index}`"
                          >
                            <div class="row col-12 items-center">
                              <div class="row col-md-10 col-12">
                                <q-input
                                  outlined
                                  dense
                                  autogrow
                                  :label="`Descrição da alternativa ${index + 1} *`"
                                  :ref="`${question.name}-alternative-${index}`"
                                  :rules="[ val => val && val.length > 0 || 'Por favor informe a descrição da alternativa']"
                                  class="col-12"
                                  hide-bottom-space
                                  debounce="300"
                                  v-model="alternative.description"
                                />
                              </div>

                              <div class="row col-md-2 col-12">
                                <q-checkbox
                                  :disable="
                                    question.alternatives.filter((element) => (element.isCorrect === true)).length > 0 && !alternative.isCorrect"
                                  v-model="alternative.isCorrect"
                                  label="Alternativa correta" />
                              </div>
                            </div>
                          </q-item>
                        </q-list>
                      </div>
                    </div>
                  </div>
                </div>
              </q-tab-panel>
            </q-tab-panels>

            <div class="row col-12 justify-center">
              <div class="row">
                <q-btn
                  :label="exam.id ? 'Sim, atualizar informações' : 'Cadastrar'"
                  class="col-12"
                  color="primary"
                  @click="exam.id ? updateExam(exam.id) : createExam()"
                />
              </div>
            </div>
          </q-form>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import Exams from '../../services/Exams'
import Subjects from '../../services/Subjects'
import { Notify } from 'quasar'

// https://v1.quasar.dev/vue-directives/mutation#example--catch-everything
function domToObj (domEl, whitelist) {
  const obj = {}
  for (let i = 0; i < whitelist.length; i++) {
    if (domEl[whitelist[i]] instanceof NodeList) {
      obj[whitelist[i]] = Array.from(domEl[whitelist[i]])
    } else {
      obj[whitelist[i]] = domEl[whitelist[i]]
    }
  }
  return obj
}

const whitelist = [
  'id',
  'type',
  'addedNodes',
  'removedNodes',
  'attributeName',
  'attributeNamespace',
  'nextSibling',
  'oldValue',
  'previousSibling',
  'target',
  'tagName',
  'className',
  'childNodes'
]

export default {
  mounted () {
    this.getAllExams()
    this.getAllSubjects()
  },
  methods: {
    openDialogExams ({ id, description, status, subject, questions }) {
      this.tab = 'question1'
      this.dialogExams = true
      this.questions = questions || [
        {
          name: 'question1',
          label: 'Pergunta 1',
          description: '',
          alternatives: [
            {
              description: '',
              isCorrect: false
            },
            {
              description: '',
              isCorrect: false
            }
          ]
        }
      ]
      this.exam = {
        id: id,
        description: description || '',
        status: status || true,
        subject: subject || ''
      }
    },
    getAllExams () {
      this.loadingTableExams = true
      Exams.getAllExams()
        .then((result) => {
          this.data = result.data.exams.map((exam) => ({
            id: exam._id,
            description: exam.description,
            subject: exam.subject.title,
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
          this.loadingTableExams = false
        })
    },
    handler (mutationRecords) {
      const info = []

      for (const index in mutationRecords) {
        const record = mutationRecords[index]

        info.push(
          JSON.stringify(record, function (name, value) {
            if (name === '') {
              return domToObj(value, whitelist)
            }
            if (Array.isArray(this)) {
              if (typeof value === 'object') {
                return domToObj(value, whitelist)
              }
              return value
            }
            if (whitelist.find(x => (x === name))) {
              return value
            }
          }, 2)
        )
      }
    },
    addRow (alternatives) {
      alternatives.push({
        description: '',
        isCorrect: false
      })
    },
    removeRow (alternatives) {
      alternatives.pop()
    },
    addQuestion () {
      this.questions.push({
        description: '',
        alternatives: [
          {
            description: '',
            isCorrect: false
          },
          {
            description: '',
            isCorrect: false
          }
        ],
        label: `Pergunta ${this.questions.length + 1}`,
        name: `question${this.questions.length + 1}`
      })
    },
    removeQuestion () {
      this.questions.pop()
    },
    validateExam () {
      return this.$refs.formExam.validate()
        .then((success) => {
          if (success) {
            const error = []

            this.questions.forEach(element => {
              if (!element.description) {
                error.push(true)
              }
              element.alternatives.forEach((alternative) => {
                if (!alternative.description) {
                  error.push(true)
                }
              })
            })

            if (error.length > 0) {
              Notify.create({
                color: 'negative',
                message: 'Prencha os campos obrigatório(s)',
                icon: 'warning'
              })

              return true
            }

            return false
          } else {
            Notify.create({
              color: 'negative',
              message: 'Prencha os campos obrigatório(s)',
              icon: 'warning'
            })

            return true
          }
        })
    },
    async createExam () {
      const isError = await this.validateExam()
      if (!isError) {
        const bodyExame = {
          status: this.exam.status,
          subject: this.exam.subject.id,
          description: this.exam.description,
          questions: this.questions
        }

        Exams.createExam(bodyExame)
          .then((result) => {
            Notify.create({
              color: 'secondary',
              message: 'Prova cadastrado com sucesso',
              icon: 'thumb_up_alt'
            })
            this.dialogExams = false
          })
          .finally(() => {
            this.getAllExams()
          })
      }
    },

    async updateExam (id) {
      const isError = await this.validateExam()
      if (!isError) {
        const bodyExame = {
          status: this.exam.status,
          subject: this.exam.subject.id,
          description: this.exam.description,
          questions: this.questions
        }

        Exams.updateExam(id, bodyExame)
          .then((result) => {
            Notify.create({
              color: 'secondary',
              message: 'Prova atualizada com sucesso',
              icon: 'thumb_up_alt'
            })
            this.dialogExams = false
          })
          .finally(() => {
            this.getAllExams()
          })
      }
    },
    getAllSubjects () {
      const query = {
        status: true
      }
      Subjects.getAllSubjects(query)
        .then((result) => {
          this.optionsSubjects = result.data.subjects.map((subject) => ({
            title: subject.title,
            id: subject._id
          }))
        })
    }
  },
  name: 'Exams',
  data () {
    return {
      exam: {
        id: null,
        title: '',
        status: true,
        subject: ''
      },
      dialogExams: false,
      loadingTableExams: false,
      filter: '',
      columns: [
        {
          name: 'description',
          align: 'left',
          label: 'Description',
          field: 'description',
          required: true,
          sortable: true
        },
        {
          name: 'subject',
          align: 'left',
          label: 'Materias',
          field: 'subject',
          sortable: true
        },
        {
          name: 'questionsLength',
          align: 'left',
          label: 'Questoes',
          field: 'questionsLength',
          sortable: true
        },
        {
          name: 'statusView',
          align: 'left',
          label: 'Status',
          field: 'statusView',
          sortable: true
        }
      ],
      data: [],
      questions: [
        {
          name: 'question1',
          label: 'Pergunta 1',
          description: '',
          alternatives: [
            {
              description: '',
              isCorrect: false
            },
            {
              description: '',
              isCorrect: false
            }
          ]
        }
      ],
      optionsSubjects: [],
      tab: 'question1'
    }
  }
}
</script>
