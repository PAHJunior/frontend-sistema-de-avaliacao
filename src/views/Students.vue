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
          <div class="col-6 q-table__title">Alunos</div>

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
  name: 'Students',
  data () {
    return {
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
          name: 'subjects',
          align: 'center',
          label: 'Disciplinas',
          field: 'subjects',
          sortable: true
        }
      ],
      data: [
        {
          name: 'Frozen Yogurt',
          studentRecord: 159,
          status: 'Inativo',
          subjects: 2
        },
        {
          name: 'Ice cream sandwich',
          studentRecord: 237,
          status: 'Ativo',
          subjects: 2
        },
        {
          name: 'Eclair',
          studentRecord: 262,
          status: 'Ativo',
          subjects: 2
        },
        {
          name: 'Cupcake',
          studentRecord: 305,
          status: 'Ativo',
          subjects: 2
        },
        {
          name: 'Gingerbread',
          studentRecord: 356,
          status: 'Ativo',
          subjects: 2
        },
        {
          name: 'Jelly bean',
          studentRecord: 375,
          status: 'Ativo',
          subjects: 2
        },
        {
          name: 'Lollipop',
          studentRecord: 392,
          status: 'Ativo',
          subjects: 2
        },
        {
          name: 'Honeycomb',
          studentRecord: 408,
          status: 'Ativo',
          subjects: 2
        },
        {
          name: 'Donut',
          studentRecord: 452,
          status: 'Ativo',
          subjects: 2
        },
        {
          name: 'KitKat',
          studentRecord: 518,
          status: 'Ativo',
          subjects: 2
        }
      ]
    }
  }
}
</script>
