<template>
  <q-page padding>
    <div>
      <q-table
        table-header-class="text-secondary"
        :data="data"
        :columns="columns"
        dense
        rows-per-page-label="Registros por página"
        row-key="title"
        :pagination="{rowsPerPage: 15}"
        :filter="filter"
      >
        <template v-slot:top="props">
          <div class="col-6 q-table__title">Professores</div>

          <div class="col-6 row justify-end">
            <q-input
              outlined
              dense
              class="col-10"
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

            <q-btn
              class="col-2"
              flat round dense
              :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
              @click="props.toggleFullscreen"
            />
          </div>
        </template>

        <template v-slot:body="props">
          <q-tr
            :props="props"
            :class="props.row.statusView === 'Inativo' ? 'bg-red-2' : ''"
            @click="getLine(props.row)"
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
          <div class="text-h6">{{teacher.id ? 'Deseja atualizar as informações?' : 'Cadastrando professor'}}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="col-12 q-pt-none">
          <q-form
            class="row q-col-gutter-sm"
          >
            <div class="col-6">
              <q-input
                outlined
                dense
                v-model="teacher.name"
                label="Informe seu nome"
                hide-bottom-space
                lazy-rules
                :rules="[ val => val && val.length > 0 || 'Por favor informe seu nome']"
              />

            </div>

            <div class="col-6">
              <q-input
                outlined
                dense
                v-model="teacher.email"
                label="Informe seu e-mail"
                hide-bottom-space
                lazy-rules
                :rules="[ val => val && val.length > 0 || 'Por favor informe seu e-mail']"
              />
            </div>

            <div class="col-12">
              <q-select
                label="Informe as disciplinas"
                outlined
                dense
                v-model="teacher.subjects"
                :options="optionsSubjects"
                use-input
                use-chips
                multiple
                input-debounce="0"
                new-value-mode="add-unique"
                hint="Precione enter para cadastrar a disciplina"
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
import Teachers from '../services/Teachers'
import Subjects from '../services/Subjects'
import { Notify } from 'quasar'

export default {
  mounted () {
    this.getAllTeachers()
  },
  methods: {
    getAllTeachers () {
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

        })
    },
    updateTeacher () {
      Teachers.updateTeacher(this.teacher.id, this.teacher)
        .then((result) => {
          Notify.create({
            progress: true,
            color: 'positive',
            message: 'Dados atualizados com sucesso',
            icon: 'thumb_up_alt',
            actions: [{
              color: 'white',
              icon: 'close'
            }]
          })

          this.dialogTeacher = false
        })
        .finally(() => {
          this.getAllTeachers()
        })
    },
    getLine (teacher) {
      this.getAllSubjects()

      this.teacher = {
        id: teacher.id,
        name: teacher.name,
        email: teacher.email,
        status: teacher.status,
        subjects: teacher.subjects
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
      dialogTeacher: false,
      filter: '',
      teacher: {
        id: null,
        name: '',
        email: '',
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
          label: 'Disciplinas',
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
