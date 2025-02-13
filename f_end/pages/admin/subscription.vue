<template>
    <div>
      <div class="_main_content">
        <div class="row">
          <div class="col-12 col-md-12 col-lg-12 _mar_b10 p-5">
            <div>
              <!-- Add/Edit Subscription Modal -->
              <Modal okText="Back" width="1000" title="Add Subscription" v-model="addModal" :styles="{ top: '20px' }">
                <Row :gutter="16">
                  <Col span="6">
                    <label style="width: 100%" for="">Name</label>
                    <Input style="width: 100%" v-model="form.name" size="large" placeholder="Name" />
                  </Col>
                  <Col span="6">
                    <label style="width: 100%" for="">Price ($)</label>
                    <Input style="width: 100%" v-model="form.price" size="large" placeholder="Price" type="number" />
                  </Col>
                  <!-- <Col span="6">
                    <label style="width: 100%" for="">Duration Value</label>
                    <Input style="width: 100%" v-model="form.durationValue" size="large" placeholder="e.g. 1, 6, 12" type="number" />
                  </Col>
                  <Col span="6">
                    <label style="width: 100%" for="">Duration Type</label>
                    <Select v-model="form.durationUnit" size="large" style="width: 100%">
                      <Option value="day">Day</Option>
                      <Option value="month">Month</Option>
                      <Option value="year">Year</Option>
                    </Select>
                  </Col> -->
                  <Col span="12">
                    <label style="width: 100%" for="">Description</label>
                    <Input style="width: 100%" type="textarea" v-model="form.description" size="large" placeholder="Description" />
                  </Col>
                </Row>
                <Row :gutter="16" class="mt-4">
                  <Col span="6">
                    <Button v-if="form.id" @click="updateSubscription()" :loading="loading" type="primary">Update</Button>
                    <Button v-else @click="addSubscription()" :loading="loading" type="success">Add</Button>
                  </Col>
                </Row>
              </Modal>
            </div>
  
            <!-- Add Subscription Button -->
            <Row class="mb-3" :gutter="16">
              <Col span="3">
                <label style="width: 100%" for="">Subscriptions</label>
              </Col>
              <Col span="6">
                <Button @click="addModalOn" :size="'large'" icon="md-add" type="primary" shape="circle"></Button>
              </Col>
            </Row>
  
            <!-- Subscriptions Table -->
            <Table border :columns="columns" :data="subscriptionsData">
              <template #duration="{ row, index }">
                <b>{{ row.durationValue }} {{ row.durationUnit }}</b>
              </template>
              <template #action="{ row, index }">
                <div>
                  <Button type="primary" size="small" @click="editSubscription(row)">Edit</Button>
                  <Button type="error" size="small" @click="removeSubscription(row)">Delete</Button>
                </div>
              </template>
            </Table>
            <Page v-if="paginationInfo" :total="paginationInfo.total" :current="paginationInfo.current_page" :page-size="parseInt(paginationInfo.per_page)" @on-change="loadSubscriptions" />
          </div>
        </div>
      </div>
    </div>
  </template>
<script>
import axios from "axios";

export default {
  name: "subscriptions",
  data() {
    return {
      addModal: false,
      loading: false,
      form: {
        id: "",
        name: "",
        price: "",
        // durationValue: 0,
        // durationUnit: "month",
        description: "",
      },
      columns: [
        { title: "ID", key: "id", width: 50, align: "center", sortable: true },
        { title: "Name", key: "name" },
        { title: "Price ($)", key: "price" },
        // { title: "Duration", slot: "duration", key: "duration"},
        { title: "Description", key: "description" },
        { title: "Action", slot: "action", align: "center" },
      ],
      subscriptionsData: [],
      paginationInfo: null,
      per_page: 5,
    };
  },
  methods: {
    // Create Axios instance
    createAxiosInstance() {
      const axiosBase = localStorage.getItem("axiosBase");
      const authToken = localStorage.getItem("authToken");
      return axios.create({
        baseURL: axiosBase,
        headers: { Authorization: `Bearer ${authToken}` },
      });
    },

    // Load subscriptions
    async loadSubscriptions(page_number = 1) {
      const axiosInstance = this.createAxiosInstance();
      try {
        const res = await axiosInstance.get("/api/subscriptions", {
          params: { page: page_number, per_page: this.per_page },
        });
        this.subscriptionsData = res.data;
        this.paginationInfo = res.pagination;
      } catch (error) {
        console.error("Error loading subscriptions:", error);
      }
    },

    // Add subscription
    async addSubscription() {
      if (!this.form.name || !this.form.price) return;

      this.loading = true;
      const axiosInstance = this.createAxiosInstance();
      try {
        await axiosInstance.post("/api/subscriptions", this.form);
        this.loadSubscriptions();
        this.resetForm();
        this.addModal = false;
      } catch (error) {
        console.error("Error adding subscription:", error);
      } finally {
        this.loading = false;
      }
    },

    // Edit subscription
    editSubscription(subscription) {
      console.log(subscription)
      this.form = { ...subscription };
      this.addModal = true;
    },

    // Update subscription
    async updateSubscription() {
      if (!this.form.id) return;

      this.loading = true;
      const axiosInstance = this.createAxiosInstance();
      try {
        await axiosInstance.put(`/api/subscriptions/${this.form.id}`, this.form);
        this.loadSubscriptions();
        this.resetForm();
        this.addModal = false;
      } catch (error) {
        console.error("Error updating subscription:", error);
      } finally {
        this.loading = false;
      }
    },

    // Remove subscription
    async removeSubscription(subscription) {
      if (confirm("Are you sure you want to delete this subscription?")) {
        const axiosInstance = this.createAxiosInstance();
        try {
          await axiosInstance.delete(`/api/subscriptions/${subscription.id}`);
          this.subscriptionsData = this.subscriptionsData.filter((s) => s.id !== subscription.id);
        } catch (error) {
          console.error("Error deleting subscription:", error);
        }
      }
    },

    // Reset form data
    resetForm() {
      this.form = { id: "", name: "", price: "", durationValue: "", durationUnit: "month", description: "" };
    },

    // Open Add Modal
    addModalOn() {
      this.resetForm();
      this.addModal = true;
    },
  },
  created() {
    this.loadSubscriptions();
  },
};
</script>
  