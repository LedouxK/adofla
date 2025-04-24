<script setup lang="ts">
import {
  createTable,
  getCoreRowModel,
  useVueTable,
} from '@tanstack/vue-table'
import type { ColumnDef } from '@tanstack/vue-table'
import { useTableRender } from '@/composables/useTableRender'

// Props : colonnes et données à afficher
const props = defineProps<{ columns: ColumnDef<any, any>[], data: any[] }>()

// Initialisation de la table avec TanStack
const table = useVueTable({
  data: props.data,
  columns: props.columns,
  getCoreRowModel: getCoreRowModel(),
})

// Helper de rendu TanStack Vue-compatible
const { flexRender } = useTableRender()
</script>

<template>
  <!-- Table avec gestion du mode sombre -->
  <div class="overflow-x-auto rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
    <table class="min-w-full table-auto text-sm text-left text-gray-700 dark:text-gray-100">

      <!-- En-têtes dynamiques -->
      <thead class="bg-gray-100 dark:bg-gray-700">
        <tr v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
          <th
            v-for="header in headerGroup.headers"
            :key="header.id"
            class="px-4 py-3 font-medium text-gray-700 dark:text-gray-200"
          >
            <div v-if="!header.isPlaceholder">
              {{ flexRender(header.column.columnDef.header, header.getContext()) }}
            </div>
          </th>
        </tr>
      </thead>

      <!-- Données -->
      <tbody>
        <tr
          v-for="row in table.getRowModel().rows"
          :key="row.id"
          class="border-t border-gray-100 dark:border-gray-700"
        >
          <td
            v-for="cell in row.getVisibleCells()"
            :key="cell.id"
            class="px-4 py-2 whitespace-nowrap"
          >
            {{ flexRender(cell.column.columnDef.cell, cell.getContext()) }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
