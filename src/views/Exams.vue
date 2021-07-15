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
          <div class="col-6 q-table__title">Provas</div>

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
            :class="props.row.status === 'Inativo' ? 'bg-red-2' : ''"
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
  </q-page>
</template>

<script>
export default {
  name: 'Exams',
  data () {
    return {
      filter: '',
      columns: [
        {
          name: 'title',
          align: 'left',
          label: 'Titulo',
          field: 'title',
          required: true,
          sortable: true
        },
        {
          name: 'subjects',
          align: 'center',
          label: 'Disciplinas',
          field: 'subjects',
          sortable: true
        },
        {
          name: 'questions',
          align: 'center',
          label: 'Questoes',
          field: 'questions',
          sortable: true
        },
        {
          name: 'status',
          align: 'center',
          label: 'Status',
          field: 'status',
          sortable: true
        }
      ],
      data: [
        {
          title: 159,
          status: 'Inativo',
          subjects: 2,
          questions: 30
        },
        {
          title: 237,
          status: 'Ativo',
          subjects: 2,
          questions: 30
        },
        {
          title: 262,
          status: 'Ativo',
          subjects: 2,
          questions: 30
        },
        {
          title: 305,
          status: 'Ativo',
          subjects: 2,
          questions: 30
        },
        {
          title: 356,
          status: 'Ativo',
          subjects: 2,
          questions: 30
        },
        {
          title: 375,
          status: 'Ativo',
          subjects: 2,
          questions: 30
        },
        {
          title: 392,
          status: 'Ativo',
          subjects: 2,
          questions: 30
        },
        {
          title: 408,
          status: 'Ativo',
          subjects: 2,
          questions: 30
        },
        {
          title: 452,
          status: 'Ativo',
          subjects: 2,
          questions: 30
        },
        {
          title: 518,
          status: 'Ativo',
          subjects: 2,
          questions: 30
        }
      ]
    }
  }
}
</script>
