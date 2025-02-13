<template>
    <div>
        <div class="toolbar" id="kt_toolbar">
            <!--begin::Container-->
            <div id="kt_toolbar_container" class="container-fluid d-flex flex-stack">
                <!--begin::Page title-->
                <div data-kt-swapper="true" data-kt-swapper-mode="prepend"
                    data-kt-swapper-parent="{default: '#kt_content_container', 'lg': '#kt_toolbar_container'}"
                    class="page-title d-flex align-items-center flex-wrap me-3 mb-5 mb-lg-0">
                    <!--begin::Title-->
                    <h1 class="d-flex align-items-center text-dark fw-bolder fs-3 my-1">Users

                        <!-- <Button class="mx-1" @click="addModalOn" :size="'large'" icon="md-add" type="primary"
                            shape="circle"></Button> -->
                        <Button class="mx-4" @click="addModalOn" type="primary">Add+</Button>
                    </h1>
                    <!--end::Title-->
                </div>
                <!--end::Page title-->
                <!--begin::Actions-->
                <div class="d-flex align-items-center py-1">
                    <Breadcrumb class="breadcrumb float-sm-right">
                        <BreadcrumbItem to="/admin">Home</BreadcrumbItem>
                        <!-- <BreadcrumbItem to="/components/breadcrumb">Components</BreadcrumbItem> -->
                        <BreadcrumbItem>User Update</BreadcrumbItem>
                    </Breadcrumb>
                </div>
                <!--end::Actions-->
            </div>
            <!--end::Container-->
        </div>
        <div class="p-5">
            <div class="row">
                <div ref="focusForm" class="col-12 col-md-12 col-lg-12 _mar_b10 px-5">
                    <div style="z-index: 99999999999;">
                        <Modal okText="Back" width="1000" title="Add User" v-model="addModal" :styles="{ top: '20px' }">
                            <Row :gutter="16">
                                <Col span="8">
                                <label style="width: 100%" for="">Email</label>
                                <Input style="width: 100%" v-model="form.email" size="large" placeholder="email" />
                                </Col>
                                <Col span="8">
                                <label style="width: 100%" for="">Password</label>
                                <Input style="width: 100%" v-model="form.password" size="large" placeholder="password"
                                    type="password" />
                                </Col>
                                <Col span="8">
                                <label style="width: 100%" for="">User Type</label>
                                <Select v-model="form.role_id" size="large" style="width: 100%">
                                    <Option value="1">Admin</Option>
                                    <Option value="2">User</Option>
                                </Select>
                                </Col>
                            </Row>
                            <Row :gutter="16">
                                <Col span="8">
                                <br />
                                <Button v-if="form.id" @click="updateUser()" :loading="loading" type="primary"
                                    long>Update</Button>
                                <Button v-else @click="addUser()" :loading="loading" type="success" long>ADD</Button>
                                </Col>
                            </Row>
                        </Modal>
                    </div>
                    <Table :loading="tblloading" border :columns="columns" :data="usersData">
                        <template #userType="{ row, index }">
                            <b>{{ row.userRole.roleName }}</b>
                        </template>
                        <template #action="{ row, index }">
                            <div>
                                <Button class="mx-1" type="primary" size="small" @click="editUser(row)">Edit</Button>
                                <Button class="mx-1" type="error" size="small" @click="removeUser(row)">Delete</Button>
                            </div>
                        </template>
                    </Table>
                    <Page v-if="paginationInfo" :total="paginationInfo.total" :current="paginationInfo.currentPage"
                        :page-size="parseInt(paginationInfo.perPage)" @on-change="loadUsers" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import _ from "lodash";
import axios from "axios";
export default {
    name: "user",
    data() {
        return {
            addModal: false,
            loading: false,
            tblloading: false,
            form: {
                id: "",
                email: "",
                password: "",
                role_id: 2,
            },
            columns: [
                { title: "ID", key: "id", minWidth: 100, align: "center", sortable: true },
                { title: "Email", key: "email", sortable: true, minWidth: 500 },
                { title: "User Type", slot: "userType", key: "role_id", sortable: true, minWidth: 200 },
                { title: "Action", slot: "action", align: "center", minWidth: 200 },
            ],
            usersData: [],
            paginationInfo: null,
            per_page: 5,
        };
    },
    methods: {
        // Create an Axios instance with baseURL and Authorization headers
        createAxiosInstance() {
            if (process.client) {
                const axiosBase = localStorage.getItem("axiosBase");
                const authToken = localStorage.getItem("authToken");
                return axios.create({
                    baseURL: axiosBase,
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                });
            }
            return axios;
        },

        // Load all users
        async loadUsers(page_number = 1) {
            const axiosInstance = this.createAxiosInstance();
            try {
                this.tblloading = true;
                const res = await axiosInstance.get(`/api/users`, {
                    params: {
                        page: page_number,
                        per_page: this.per_page,
                    },
                });
                // console.log(res)
                this.usersData = res.data.data;
                this.paginationInfo = res.data.meta;
                this.tblloading = false;
            } catch (error) {
                console.error("Error loading users:", error);
            }
        },
        editUser(user) {
            // Set form data to the selected user's information
            this.form = {
                id: user.id,
                email: user.email,
                password: "", // Leave password blank for security; user can enter a new one
                role_id: user.role_id,
            };
            // Open the modal
            this.addModal = true;
        }
        ,
        async updateUser() {
            if (this.hasEmptyFields()) return;

            this.loading = true;
            const axiosInstance = this.createAxiosInstance();
            try {
                const res = await axiosInstance.put(`/api/users/${this.form.id}`, this.form);
                this.loadUsers();
                this.resetForm(); // Reset the form
                this.addModal = false; // Close the modal
            } catch (error) {
                console.error("Error updating user:", error);
            } finally {
                this.loading = false;

            }
        }
        ,
        // Add a user
        async addUser() {
            if (this.hasEmptyFields()) return;

            this.loading = true;
            const axiosInstance = this.createAxiosInstance();
            try {
                const res = await axiosInstance.post(`/api/users`, this.form);
                this.loadUsers();
                this.resetForm();
                this.addModal = false;
            } catch (error) {
                console.error("Error adding user:", error);
            } finally {
                this.loading = false;
            }
        },

        // Remove a user
        async removeUser(row) {
            if (confirm("Are you sure you want to delete this user?")) {
                const axiosInstance = this.createAxiosInstance();
                try {
                    await axiosInstance.delete(`/api/users/${row.id}`);
                    this.usersData = this.usersData.filter((user) => user.id !== row.id);
                } catch (error) {
                    console.error("Error deleting user:", error);
                }
            }
        },

        // Reset form data
        resetForm() {
            this.form = { id: "", email: "", password: "", role_id: 2 };
        },

        // Check for empty fields
        hasEmptyFields() {
            return !this.form.email || !this.form.password || !this.form.role_id;
        },

        // Open add modal
        addModalOn() {
            this.resetForm();
            this.addModal = true;
        },
    },

    // Page meta for authentication and user type check
    definePageMeta() {
        return {
            middleware: [
                function (to, from) {
                    // Authentication check
                    if (process.client) {
                        const token = localStorage.getItem("authToken");
                        const storedUser = JSON.parse(localStorage.getItem('authUser'));

                        // If no token, redirect to login
                        if (!token) {
                            return navigateTo("/login");
                        }

                        // If user type is not 'admin', redirect to login
                        if (storedUser.user.roleId !== 1) {
                            return navigateTo("/login");
                        }
                    }
                },
            ],
        };
    },

    mounted() {
        if (process.client) {
            this.loadUsers();
        }
    },
};
</script>

<style scoped></style>