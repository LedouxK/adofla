<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'

const addModal = ref(false)
const loading = ref(false)
const tblloading = ref(false)
const usersData = ref([])

interface PaginationInfo {
  total: number
  currentPage: number
  perPage: string | number
}

const paginationInfo = ref<PaginationInfo | null>(null)
const per_page = 5

const form = ref({
  id: '',
  email: '',
  password: '',
  role_id: 2,
})

const columns = [
  { title: 'ID', key: 'id', minWidth: 100, align: 'center', sortable: true },
  { title: 'Email', key: 'email', sortable: true, minWidth: 500 },
  { title: 'User Type', slot: 'userType', key: 'role_id', sortable: true, minWidth: 200 },
  { title: 'Action', slot: 'action', align: 'center', minWidth: 200 },
]

const addModalOn = () => {
  resetForm()
  addModal.value = true
}

const resetForm = () => {
  form.value = { id: '', email: '', password: '', role_id: 2 }
}

const createAxiosInstance = () => {
  const axiosBase = localStorage.getItem('axiosBase')
  const authToken = localStorage.getItem('authToken')
  return axios.create({
    baseURL: axiosBase || '',
    headers: { Authorization: `Bearer ${authToken}` },
  })
}

const loadUsers = async (page_number = 1) => {
  const axiosInstance = createAxiosInstance()
  try {
    tblloading.value = true
    const res = await axiosInstance.get('/api/users', {
      params: { page: page_number, per_page },
    })
    usersData.value = res.data.data
    paginationInfo.value = res.data.meta
  } catch (err) {
    console.error('Failed to load users:', err)
  } finally {
    tblloading.value = false
  }
}

const editUser = (user: any) => {
  form.value = {
    id: user.id,
    email: user.email,
    password: '',
    role_id: user.role_id,
  }
  addModal.value = true
}

const updateUser = async () => {
  if (!form.value.email || !form.value.role_id) return
  loading.value = true
  const axiosInstance = createAxiosInstance()
  try {
    await axiosInstance.put(`/api/users/${form.value.id}`, form.value)
    loadUsers()
    resetForm()
    addModal.value = false
  } catch (err) {
    console.error('Failed to update user:', err)
  } finally {
    loading.value = false
  }
}

const addUser = async () => {
  if (!form.value.email || !form.value.password || !form.value.role_id) return
  loading.value = true
  const axiosInstance = createAxiosInstance()
  try {
    await axiosInstance.post('/api/users', form.value)
    loadUsers()
    resetForm()
    addModal.value = false
  } catch (err) {
    console.error('Failed to add user:', err)
  } finally {
    loading.value = false
  }
}

const removeUser = async (row: any) => {
  if (!confirm('Are you sure you want to delete this user?')) return
  const axiosInstance = createAxiosInstance()
  try {
    await axiosInstance.delete(`/api/users/${row.id}`)
    usersData.value = usersData.value.filter((user: any) => user.id !== row.id)
  } catch (err) {
    console.error('Failed to delete user:', err)
  }
}

onMounted(() => {
  loadUsers()
})
</script>

<template>
  <div>
    <!-- Toolbar -->
    <div class="flex items-center justify-between px-6 py-4 border-b bg-white shadow-sm">
      <h1 class="text-xl font-semibold text-gray-800">Users</h1>
      <Button class="ml-4" @click="addModalOn" type="primary">Add+</Button>
    </div>

    <!-- Breadcrumb -->
    <div class="px-6 pt-2 pb-4 text-sm text-gray-600">
      <Breadcrumb>
        <BreadcrumbItem to="/admin">Home</BreadcrumbItem>
        <BreadcrumbItem>User Update</BreadcrumbItem>
      </Breadcrumb>
    </div>

    <!-- Modal -->
    <Modal v-model="addModal" title="Add User" :width="600" :footer="null">
      <form @submit.prevent="form.id ? updateUser() : addUser()" class="space-y-4">
        <div>
          <label for="email" class="block font-medium text-gray-700">Email</label>
          <Input
            id="email"
            v-model="form.email"
            size="large"
            placeholder="Enter email"
            class="w-full"
            required
          />
        </div>
        <div>
          <label for="password" class="block font-medium text-gray-700">Password</label>
          <Input
            id="password"
            v-model="form.password"
            size="large"
            placeholder="Enter password"
            type="password"
            class="w-full"
            required
          />
        </div>
        <div>
          <label for="role" class="block font-medium text-gray-700">User Type</label>
          <Select id="role" v-model="form.role_id" size="large" class="w-full" required>
            <Option value="1">Admin</Option>
            <Option value="2">User</Option>
          </Select>
        </div>
        <div class="flex justify-end space-x-2 pt-4">
          <Button :loading="loading" type="primary" html-type="submit">
            {{ form.id ? 'Update' : 'Add' }}
          </Button>
          <Button type="default" @click="addModal = false">Cancel</Button>
        </div>
      </form>
    </Modal>

    <!-- Table -->
    <div class="p-6">
      <Table :loading="tblloading" border :columns="columns" :data="usersData">
        <template #userType="{ row }">
          <b>{{ row.userRole.roleName }}</b>
        </template>
        <template #action="{ row }">
          <Button class="mr-2" type="primary" size="small" @click="editUser(row)">Edit</Button>
          <Button type="error" size="small" @click="removeUser(row)">Delete</Button>
        </template>
      </Table>

      <Page
        v-if="paginationInfo"
        :total="paginationInfo.total"
        :current="paginationInfo.currentPage"
        :page-size="parseInt(paginationInfo.perPage as string)"
        @on-change="loadUsers"
      />
    </div>
  </div>
</template>
