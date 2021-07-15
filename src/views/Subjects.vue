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
  name: 'Subjects',
  data () {
    return {
      filter: '',
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
          name: 'subtitle',
          align: 'center',
          label: 'Sub Título',
          field: 'subtitle',
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
          title: 'Frozen Yogurt',
          subtitle: 159,
          status: 'Inativo'
        },
        {
          title: 'Ice cream sandwich',
          subtitle: 237,
          status: 'Ativo'
        },
        {
          title: 'Eclair',
          subtitle: 262,
          status: 'Ativo'
        },
        {
          title: 'Cupcake',
          subtitle: 305,
          status: 'Ativo'
        },
        {
          title: 'Gingerbread',
          subtitle: 356,
          status: 'Ativo'
        },
        {
          title: 'Jelly bean',
          subtitle: 375,
          status: 'Ativo'
        },
        {
          title: 'Lollipop',
          subtitle: 392,
          status: 'Ativo'
        },
        {
          title: 'Honeycomb',
          subtitle: 408,
          status: 'Ativo'
        },
        {
          title: 'Donut',
          subtitle: 452,
          status: 'Ativo'
        },
        {
          title: 'KitKat',
          subtitle: 518,
          status: 'Ativo'
        }
      ]
    }
  }
}
</script>
