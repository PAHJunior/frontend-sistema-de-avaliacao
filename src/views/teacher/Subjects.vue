<template>
  <q-page padding>
    <div>
      <q-table
        table-header-class="text-secondary"
        :data="data"
        :columns="columns"
        :loading="loadingTableSubjects"
        dense
        rows-per-page-label="Registros por página"
        row-key="title"
        :pagination="{rowsPerPage: 15}"
        :filter="filter"
      >
        <template v-slot:top="props">
          <div class="col-6 q-table__title">Materias</div>

          <div class="col-6 row q-col-gutter-sm">

            <div class="row col-6">
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
                    @click="getAllSubjects"
                    icon="search"
                    />
                </template>
              </q-input>
            </div>

            <div class="row col-4">
              <q-btn
                class="col-12"
                outline
                dense
                color="secondary"
                label="Novo cadastro"
                @click="openDialogSubject"
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
            @click="openDialogSubject(props.row)"
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

    <q-dialog v-model="dialogSubject" persistent>
      <q-card class="row">
        <q-card-section class="row col-12">
          <div class="text-h6">{{subject.id ? 'Deseja atualizar as informações?' : 'Cadastrando professor'}}</div>
          <q-space />
          <q-btn
            icon="close"
            color="secondary"
            flat
            round
            dense
            v-close-popup />
        </q-card-section>

        <q-card-section class="col-12 q-pt-none">
          <q-form
            ref="formSubject"
            greedy
            class="row q-col-gutter-sm"
          >
            <div class="col-9">
              <q-input
                outlined
                ref="subjectTitle"
                dense
                v-model="subject.title"
                label="Informe o titulo da materia"
                hide-bottom-space
                lazy-rules
                :rules="[ val => val && val.length > 0 || 'Por favor informe o nome da materia']"
              />
            </div>

            <div class="col-3">
              <q-checkbox label="Status" v-model="subject.status" />
            </div>

          </q-form>
        </q-card-section>

        <q-card-actions class="col-12" align="right">
          <q-btn
            flat
            :label="subject.id ? 'Não' : 'Cancelar'"
            color="secondary"
            v-close-popup
          />
          <q-btn
            flat
            :label="subject.id ? 'Sim, atualizar informações' : 'Cadastrar'"
            color="primary"
            @click="subject.id ? updateSubject() : createSubject()"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import Subjects from '../../services/Subjects'
import { Notify } from 'quasar'

export default {
  mounted () {
    this.getAllSubjects()
  },
  methods: {
    createSubject () {
      this.$refs.formSubject.validate()
        .then(success => {
          if (success) {
            Subjects.createSubject(this.subject)
              .then((result) => {
                Notify.create({
                  color: 'secondary',
                  message: 'Materia cadastrada com sucesso',
                  icon: 'thumb_up_alt'
                })
              })
              .finally(() => {
                this.getAllSubjects()
                this.dialogSubject = false
              })
          }
        })
    },
    getAllSubjects () {
      this.loadingTableSubjects = true
      Subjects.getAllSubjects()
        .then((result) => {
          this.data = result.data.subjects.map((subject) => ({
            id: subject._id,
            title: subject.title,
            statusView: subject.status ? 'Ativo' : 'Inativo',
            status: subject.status
          }))
        })
        .finally(() => {
          this.loadingTableSubjects = false
        })
    },
    updateSubject () {
      this.$refs.formSubject.validate()
        .then(success => {
          if (success) {
            Subjects.updateSubject(this.subject.id, this.subject)
              .then((result) => {
                Notify.create({
                  progress: true,
                  color: 'secondary',
                  message: 'Dados atualizados com sucesso',
                  icon: 'thumb_up_alt'
                })
              })
              .finally(() => {
                this.getAllSubjects()
                this.dialogSubject = false
              })
          }
        })
    },
    openDialogSubject ({ id, title, status }) {
      this.getAllSubjects()

      this.subject = {
        id: id,
        title: title || '',
        status: status || true
      }

      this.dialogSubject = true
    }
  },
  name: 'Subjects',
  data () {
    return {
      loadingTableSubjects: false,
      filter: '',
      dialogSubject: false,
      subject: {
        id: null,
        title: '',
        status: true
      },
      columns: [
        {
          name: 'title',
          required: true,
          label: 'Título',
          align: 'left',
          field: 'title',
          format: val => `${val}`,
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
      data: []
    }
  }
}
</script>
