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
          <div class="col-6 q-table__title">Disciplinas</div>

          <div class="col-6 row justify-end">
            <q-input
              outlined
              dense
              class="col-10"
              debounce="300"
              v-model="filter"
              placeholder="Pesquisar">
              <template v-slot:append>
                <q-icon name="search" />
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

    <q-dialog v-model="dialogSubject" persistent>
      <q-card class="row">
        <q-card-section class="row col-12">
          <div class="text-h6">{{subject.id ? 'Deseja atualizar as informações?' : 'Cadastrando professor'}}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="col-12 q-pt-none">
          <q-form
            class="row q-col-gutter-sm"
          >
            <div class="col-9">
              <q-input
                outlined
                dense
                v-model="subject.title"
                label="Informe o titulo da disciplina"
                hide-bottom-space
                lazy-rules
                :rules="[ val => val && val.length > 0 || 'Por favor informe seu nome']"
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
import Subjects from '../services/Subjects'
import { Notify } from 'quasar'

export default {
  mounted () {
    this.getAllSubjects()
  },
  methods: {
    getAllSubjects () {
      Subjects.getAllSubjects()
        .then((result) => {
          this.data = result.data.subjects.map((subject) => ({
            id: subject._id,
            title: subject.title,
            statusView: subject.status ? 'Ativo' : 'Inativo',
            status: subject.status
          }))
        })
    },
    updateSubject () {
      Subjects.updateSubject(this.subject.id, this.subject)
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
        })
        .finally(() => {
          this.getAllSubjects()
        })
    },
    getLine (subject) {
      this.subject = {
        id: subject.id,
        title: subject.title,
        status: subject.status
      }

      this.dialogSubject = true
    }
  },
  name: 'Subjects',
  data () {
    return {
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
