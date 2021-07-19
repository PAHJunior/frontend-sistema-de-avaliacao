<template>
  <q-page padding>
    <div>
      <q-table
        table-header-class="text-secondary"
        :data="data"
        :columns="columns"
        dense
        :loading="loadingTableStudents"
        rows-per-page-label="Registros por página"
        row-key="title"
        :pagination="{rowsPerPage: 15}"
        :filter="filter"
      >
        <template v-slot:top="props">
          <div class="col-md-6 col-12 q-table__title">Alunos</div>

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
                    @click="getAllStudents"
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
                @click="openDialogStudent"
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
            @click="openDialogStudent(props.row)"
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

    <q-dialog v-model="dialogStudent" persistent>
      <q-card class="row">
        <q-card-section class="row col-12">
          <div class="col-10 text-h6">{{student.id ? 'Deseja atualizar as informações?' : 'Cadastrando Aluno'}}</div>
          <q-space />
          <div class="col-2">
            <q-btn icon="close" color="secondary" flat round dense v-close-popup />
          </div>
        </q-card-section>

        <q-card-section class="col-12 q-pt-none">
          <q-form
            class="row q-col-gutter-sm"
            greedy
            ref="formStudent"
          >
            <div class="col-md-6 col-12">
              <q-input
                outlined
                dense
                v-model="student.name"
                ref="studentName"
                label="Nome *"
                hide-bottom-space
                lazy-rules
                :rules="[ val => val && val.length > 0 || 'Por favor informe seu nome']"
              />

            </div>

            <div class="col-md-6 col-12">
              <q-input
                outlined
                dense
                v-model="student.studentRecord"
                ref="studentRecord"
                label="RA *"
                hide-bottom-space
                lazy-rules
                :rules="[ val => val && val.length > 0 || 'Por favor informe o RA do aluno']"
              />
            </div>

            <div class="col-12" v-if="!student.id">
              <q-input
                outlined
                dense
                v-model="student.password"
                ref="studentPassword"
                label="Senha para acesso *"
                type="password"
                hide-bottom-space
                lazy-rules
                :rules="[ val => val && val.length > 0 || 'Por favor informe a senha']"
              />
            </div>

            <div class="col-12">
              <q-select
                label="Informe as Materias"
                outlined
                dense
                v-model="student.subjects"
                :options="optionsSubjects"
                use-input
                use-chips
                multiple
                input-debounce="0"
                new-value-mode="add-unique"
                hint="Precione enter para cadastrar uma nova materia"
              />
            </div>

            <div class="col-12">
              <q-checkbox label="Status" v-model="student.status" />
            </div>

          </q-form>
        </q-card-section>

        <q-card-actions class="col-12" align="right">
          <q-btn
            flat
            :label="student.id ? 'Não' : 'Cancelar'"
            color="secondary"
            v-close-popup
          />
          <q-btn
            flat
            :label="student.id ? 'Sim, atualizar informações' : 'Cadastrar'"
            color="primary"
            @click="student.id ? updateStudent() : createStudent()"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import Students from '../../services/Students'
import Subjects from '../../services/Subjects'
import { Notify } from 'quasar'

export default {
  mounted () {
    this.getAllStudents()
  },
  methods: {
    createStudent () {
      this.$refs.formStudent.validate()
        .then(success => {
          if (success) {
            Students.createStudent(this.student)
              .then((result) => {
                Notify.create({
                  color: 'secondary',
                  message: 'Aluno cadastrado com sucesso',
                  icon: 'thumb_up_alt'
                })
                this.dialogStudent = false
              })
              .finally(() => {
                this.getAllStudents()
              })
          }
        })
    },
    updateStudent () {
      this.$refs.formStudent.validate()
        .then((success) => {
          if (success) {
            Students.updateStudent(this.student.id, this.student)
              .then((result) => {
                Notify.create({
                  progress: true,
                  color: 'secondary',
                  message: 'Dados atualizados com sucesso',
                  icon: 'thumb_up_alt'
                })

                this.dialogStudent = false
              })
              .finally(() => {
                this.getAllStudents()
                this.dialogStudent = false
              })
          }
        })
    },
    getAllStudents () {
      this.loadingTableStudents = true
      Students.getAllStudents()
        .then((result) => {
          this.data = result.data.students.map((student) => ({
            id: student._id,
            name: student.name,
            studentRecord: student.studentRecord,
            status: student.status,
            statusView: student.status ? 'Ativo' : 'Inativo',
            subjects: student.subjects.map((subject) => (subject.title)),
            subjectsLength: student.subjects.length
          }))
        })
        .catch((error) => {
          console.error(error)
        })
        .finally(() => {
          this.loadingTableStudents = false
        })
    },
    openDialogStudent ({ id, name, studentRecord, status, subjects }) {
      this.getAllSubjects()

      this.student = {
        id: id,
        name: name || '',
        studentRecord: studentRecord || '',
        status: status || true,
        subjects: subjects || []
      }

      this.dialogStudent = true
    },
    getAllSubjects () {
      const query = {
        status: true
      }
      Subjects.getAllSubjects(query)
        .then((result) => {
          this.optionsSubjects = result.data.subjects.map((subject) => (subject.title))
        })
    }
  },
  name: 'Students',
  data () {
    return {
      student: {
        id: null,
        name: '',
        studentRecord: '',
        password: '',
        status: true,
        subjects: []
      },
      dialogStudent: false,
      loadingTableStudents: false,
      filter: '',
      columns: [
        {
          name: 'studentRecord',
          align: 'left',
          label: 'RA',
          field: 'studentRecord',
          required: true,
          sortable: true
        },
        {
          name: 'name',
          label: 'Nome',
          align: 'left',
          field: 'name',
          format: 'name',
          sortable: true
        },
        {
          name: 'subjectsLength',
          align: 'center',
          label: 'Materias',
          field: 'subjectsLength',
          sortable: true
        },
        {
          name: 'statusView',
          align: 'center',
          label: 'Materias',
          field: 'statusView',
          sortable: true
        }
      ],
      data: [],
      optionsSubjects: []
    }
  }
}
</script>
