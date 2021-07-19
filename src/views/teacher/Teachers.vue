<template>
  <q-page padding>
    <div>
      <q-table
        table-header-class="text-secondary"
        :data="data"
        :columns="columns"
        dense
        :loading="loadingTableTeachers"
        rows-per-page-label="Registros por página"
        row-key="title"
        :pagination="{rowsPerPage: 15}"
        :filter="filter"
      >
        <template v-slot:top="props">
          <div class="col-md-6 col-12 q-table__title">Professores</div>

          <div class="col-md-6 col-12 row justify-end q-col-gutter-sm">

            <div class="row col-md-6 col-12">
              <q-input
                outlined
                dense
                class="col-12"
                debounce="300"
                v-model="filter"
                placeholder="Pesquisar">
                <template v-slot:append>
                  <q-btn
                    flat
                    dense
                    @click="getAllTeachers"
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
                @click="openDialogTeacher"
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
            :class="props.row.statusView === 'Inativo' ? 'bg-red-2' : ''"
            @click="openDialogTeacher(props.row)"
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

    <q-dialog v-model="dialogTeacher" persistent>
      <q-card class="row">
        <q-card-section class="row col-12">
          <div class="col-10 text-h6">{{teacher.id ? 'Deseja atualizar as informações?' : 'Cadastrando professor'}}</div>
          <q-space />

          <div class="col-2">
            <q-btn
              icon="close"
              flat
              round
              dense
              color="secondary"
              v-close-popup />
          </div>
        </q-card-section>

        <q-card-section class="col-12 q-pt-none">
          <q-form
            class="row q-col-gutter-sm"
            greedy
            ref="formTeacher"
          >
            <div class="col-md-6 col-12">
              <q-input
                outlined
                dense
                v-model="teacher.name"
                ref="teacherName"
                label="Informe seu nome *"
                hide-bottom-space
                lazy-rules
                :rules="[ val => val && val.length > 0 || 'Por favor informe seu nome']"
              />

            </div>

            <div class="col-md-6 col-12">
              <q-input
                outlined
                dense
                v-model="teacher.email"
                ref="teacherEmail"
                label="Informe seu e-mail *"
                type="email"
                hide-bottom-space
                lazy-rules
                :rules="[isEmailValid]"
              />
            </div>

            <div class="col-12" v-if="!teacher.id">
              <q-input
                outlined
                dense
                v-model="teacher.password"
                ref="teacherPassword"
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
                v-model="teacher.subjects"
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
              <q-checkbox label="Status" v-model="teacher.status" />
            </div>

          </q-form>
        </q-card-section>

        <q-card-actions class="col-12" align="right">
          <q-btn
            flat
            :label="teacher.id ? 'Não' : 'Cancelar'"
            color="secondary"
            v-close-popup
          />
          <q-btn
            flat
            :label="teacher.id ? 'Sim, atualizar informações' : 'Cadastrar'"
            color="primary"
            @click="teacher.id ? updateTeacher() : createTeacher()"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import Teachers from '../../services/Teachers'
import Subjects from '../../services/Subjects'
import Validation from '../../utils/validation'
import { Notify } from 'quasar'

export default {
  mounted () {
    this.getAllTeachers()
  },
  methods: {
    isEmailValid (val) {
      return Validation.isEmail(val) || 'Por favor, informe um e-mail valido'
    },
    getAllTeachers () {
      this.loadingTableTeachers = true
      Teachers.getAllTeachers()
        .then((result) => {
          this.data = result.data.teachers.map((teacher) => ({
            id: teacher._id,
            name: teacher.name,
            email: teacher.email,
            status: teacher.status,
            statusView: teacher.status ? 'Ativo' : 'Inativo',
            subjects: teacher.subjects.map((subject) => (subject.title)),
            subjectsLength: teacher.subjects.length
          }))
        })
        .finally(() => {
          this.loadingTableTeachers = false
        })
    },
    createTeacher () {
      this.$refs.formTeacher.validate()
        .then(success => {
          if (success) {
            Teachers.createTeacher(this.teacher)
              .then((result) => {
                Notify.create({
                  color: 'secondary',
                  message: 'Professor cadastrado com sucesso',
                  icon: 'thumb_up_alt'
                })
              })
              .finally(() => {
                this.getAllTeachers()
                this.dialogTeacher = false
              })
          }
        })
    },
    updateTeacher () {
      this.$refs.formTeacher.validate()
        .then((success) => {
          if (success) {
            Teachers.updateTeacher(this.teacher.id, this.teacher)
              .then((result) => {
                Notify.create({
                  progress: true,
                  color: 'secondary',
                  message: 'Dados atualizados com sucesso',
                  icon: 'thumb_up_alt'
                })

                this.dialogTeacher = false
              })
              .finally(() => {
                this.getAllTeachers()
                this.dialogTeacher = false
              })
          }
        })
    },
    openDialogTeacher ({ id, name, email, status, subjects }) {
      this.getAllSubjects()

      this.teacher = {
        id: id,
        name: name || '',
        email: email || '',
        status: status || true,
        subjects: subjects || []
      }

      this.dialogTeacher = true
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
  name: 'Teachers',
  data () {
    return {
      loadingTableTeachers: false,
      dialogTeacher: false,
      filter: '',
      teacher: {
        id: null,
        name: '',
        email: '',
        password: '',
        status: true,
        subjects: []
      },
      columns: [
        {
          name: 'name',
          required: true,
          label: 'Nome',
          align: 'left',
          field: 'name',
          format: 'name',
          sortable: true
        },
        {
          name: 'email',
          align: 'center',
          label: 'E-mail',
          field: 'email',
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
          label: 'Status',
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
