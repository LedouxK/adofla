<script setup lang="ts">
import { ref, h } from 'vue'
import BaseTable from './BaseTable.vue'
import type { ColumnDef } from '@tanstack/vue-table'

const emit = defineEmits(['edit', 'delete'])

const props = defineProps<{ users: any[] }>()

const columns = ref<ColumnDef<any, any>[]>([
  {
    accessorKey: 'id',
    header: () => 'ID',
    cell: info => info.getValue(),
  },
  {
    accessorKey: 'email',
    header: () => 'Email',
    cell: info => info.getValue(),
  },
  {
    id: 'userType',
    header: () => 'User Type',
    accessorFn: row => row?.userRole?.roleName ?? 'N/A',
    cell: info => info.getValue(),
  },
  {
    id: 'actions', // 👈 obligatoire sans accessorKey
    header: () => 'Action',
    cell: ({ row }) => h('div', { class: 'flex gap-2' }, [
      h('button', {
        class: 'bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs transition',
        onClick: () => emit('edit', row.original),
      }, 'Edit'),
      h('button', {
        class: 'bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs transition',
        onClick: () => emit('delete', row.original),
      }, 'Delete'),
    ]),
  },
])
</script>

<template>
  <BaseTable :columns="columns" :data="users" />
</template>
