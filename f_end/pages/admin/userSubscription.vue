<template>
    <div>
        <div class="toolbar" id="kt_toolbar">
            <!--begin::Container-->
            <div id="kt_toolbar_container" class="container-fluid d-flex flex-stack">
                <!--begin::Page title-->
                <div class="flex items-center mb-3 md:mb-0">
          <h1 class="text-2xl font-bold text-gray-800 dark:text-white">
            Gestion des abonnements
            <button 
              @click="addModalOn" 
              class="ml-2 py-1 px-3 bg-[#7B68EE] hover:bg-[#6A5ACD] text-white text-sm font-medium rounded transition duration-200"
            >
              Ajouter un abonnement
            </button>
          </h1>
        </div>
                <!--end::Page title-->
                <!--begin::Actions-->
                <div class="d-flex align-items-center py-1">
                    <Breadcrumb class="breadcrumb float-sm-right">
                        <BreadcrumbItem to="/admin">Home</BreadcrumbItem>
                        <!-- <BreadcrumbItem to="/components/breadcrumb">Components</BreadcrumbItem> -->
                        <BreadcrumbItem>Users Subscribtion</BreadcrumbItem>
                    </Breadcrumb>
                </div>
                <!--end::Actions-->
            </div>
            <!--end::Container-->
        </div>
        <div class="_main_content p-5">
            <div class="row">
                <div class="col-12 col-md-12 col-lg-12 _mar_b10 px-5">
                    <div>
                        <!-- <h4>Subscriptions</h4> -->
                        <Row :gutter="16" class="mb-3">
                            <Col span="8">
                            <label style="width: 100%" for="">Filter By Email</label>
                            <Input style="width: 100%" @input="loadActiveSubscriptions()" v-model="filter.email"
                                size="large" placeholder="Email" />
                            </Col>
                            <Col span="8">
                            <label style="width: 100%" for="">Filter By Type</label>
                            <Select clearable @onChange="loadActiveSubscriptions()" v-model="filter.sub_id" size="large"
                                style="width: 100%">
                                <Option v-for="(item, i) in subTypes" :key="i" :value="item.id">{{ item.name }}</Option>
                            </Select>
                            </Col>
                            <Col span="8">
                            <label style="width: 100%" for="">Filter By Status</label>
                            <Select clearable @onChange="loadActiveSubscriptions()" v-model="filter.status" size="large"
                                style="width: 100%">
                                <Option value="active">Active</Option>
                                <Option value="inactive">Inactive</Option>
                            </Select>
                            </Col>
                        </Row>

                        <!-- Subscriptions Table -->
                        <Table :loading="tblloading" border :columns="columns" :data="activeSubscriptions">
                            <template #sub_info="{ row, index }">
                                <b>Email:</b> {{ row.user.email }}
                            </template>
                            <template #sub_name="{ row, index }">
                                {{ row.subscription.name }}
                            </template>
                            <template #price="{ row, index }">
                                {{ row.subscription.price }}
                            </template>
                            <template #desc="{ row, index }">
                                {{ row.subscription.description }}
                            </template>
                            <template #duration="{ row, index }">
                                {{ row.subscription.durationValue }} {{ row.subscription.durationUnit }}
                            </template>
                            <template #action="{ row, index }">
                                <div>
                                    <Button class="m-1" type="primary" size="small"
                                        @click="detailsSubscription(row)">Details</Button>
                                    <Button v-if="row.status == 'active'" class="m-1" type="success" size="small"
                                        @click="modifySubscription(row)">Modify</Button>
                                    <Button v-if="row.status == 'active'" class="m-1" type="error" size="small"
                                        @click="unsubscribe(row)">Unsubscribe</Button>
                                </div>
                            </template>
                        </Table>
                        <Page v-if="paginationInfo" :total="paginationInfo.total" :current="paginationInfo.currentPage"
                            :page-size="parseInt(paginationInfo.perPage)" @on-change="loadActiveSubscriptions" />
                        <!-- <Page v-if="paginationInfo" :total="paginationInfo.total"
                    :current="paginationInfo.current_page"
                    :page-size="parseInt(paginationInfo.per_page)"
                    @on-change="loadSubscriptions" /> -->
                    </div>

                    <div>
                        <!-- Add/Edit Subscription Modal -->
                        <!-- <Modal okText="Back" width="1000" title="Add Subscription" v-model="addModal" :styles="{ top: '20px' }">
                            <Row v-if="!modifySubButton" :gutter="16">
                                <Col span="8">
                                <label style="width: 100%" for="">Select for which User</label>
                                <Select v-model="user_id" size="large" style="width: 100%">
                                    <Option v-for="(item, i) in users" :key="i" :value="item.id">{{ item.email }}</Option>
                                </Select>
                                </Col>
                            </Row>
                            <div class="planItem__container">
                                <div v-for="(item, i) in subscriptions" :key="i" class="planItem planItem--pro">
                                    <div class="card">
                                        <div class="card__header">
                                            <div class="card__icon symbol"></div>
                                            <h2>{{ item.name }}</h2>
                                            <div class="card__label label">Best Value</div>
                                        </div>
                                        <div class="card__desc">{{ item.description }}</div>
                                    </div>

                                    <div class="price">${{ item.price }}<span>/ {{ item.durationValue }} {{
                                            item.durationUnit }}(s)</span>
                                    </div>

                                    <ul class="featureList">
                                        <li>2 links</li>
                                        <li>Own analytics platform</li>
                                        <li>Chat support</li>
                                        <li class="disabled">Mobile application</li>
                                        <li class="disabled">Unlimited users</li>
                                    </ul>

                                    <h4>Select Type</h4>
                                    <RadioGroup v-model="item.subType">
                                        <Radio label="month" border>Month</Radio>
                                        <Radio label="year" border>Year</Radio>
                                    </RadioGroup>

                                    <button v-if="modifySubButton" @click="updateModifySubscription(item)"
                                        class="button button--pink">Modify Subscription</button>
                                    <button v-else @click="updateSubscription(item)" class="button button--pink">Add
                                        Subscription</button>
                                </div>

                            </div>
                        </Modal> -->
                        <Modal okText="Back" width="1000" title="Add Subscription" v-model="addModal" :styles="{ top: '20px' }">
                            <Row v-if="!modifySubButton" :gutter="16">
                                <Col span="8">
                                <label style="width: 100%" for="">Select for which User</label>
                                <Select v-model="user_id" size="large" style="width: 100%">
                                    <Option v-for="(item, i) in users" :key="i" :value="item.id">{{ item.email }}
                                    </Option>
                                </Select>
                                </Col>
                            </Row>
                            <div
                                class="mx-auto grid max-w-lg grid-cols-1 items-center gap-y-6 sm:gap-y-0 lg:max-w-4xl lg:grid-cols-3">
                                <div v-for="(tier, tierIdx) in subscriptions" :key="tier.id"
                                    :class="[tier.featured ? 'relative bg-gray-900 shadow-2xl' : 'bg-white/60 sm:mx-8 lg:mx-0', tier.featured ? '' : tierIdx === 0 ? 'rounded-t-3xl sm:rounded-b-none lg:rounded-bl-3xl lg:rounded-tr-none' : 'sm:rounded-t-none lg:rounded-bl-none lg:rounded-tr-3xl', 'rounded-3xl p-8 ring-1 ring-gray-900/10 sm:p-10']">
                                    <h3 :id="tier.id"
                                        :class="[tier.featured ? 'text-indigo-400' : 'text-indigo-600', 'text-base/7 font-semibold']">
                                        {{
                                        tier.name }}</h3>
                                    <p class="mt-4 flex items-baseline gap-x-2">
                                        <span
                                            :class="[tier.featured ? 'text-white' : 'text-gray-900', 'text-5xl font-semibold tracking-tight']">${{
                                                tier.price }}</span>
                                        <!-- <span :class="[tier.featured ? 'text-gray-400' : 'text-gray-500', 'text-base']">/month</span> -->
                                    </p>
                                    <p :class="[tier.featured ? 'text-gray-300' : 'text-gray-600', 'mt-6 text-base/7']">
                                        {{
                                            tier.description
                                        }}</p>
                                    <ul role="list"
                                        :class="[tier.featured ? 'text-gray-300' : 'text-gray-600', 'mt-8 space-y-3 text-sm/6 sm:mt-10']">
                                        <li v-for="feature in tier.features" :key="feature" class="flex gap-x-3">
                                            <CheckIcon
                                                :class="[tier.featured ? 'text-indigo-400' : 'text-indigo-600', 'h-6 w-5 flex-none']"
                                                aria-hidden="true" />
                                            {{ feature }}
                                        </li>
                                    </ul>
                                    <!-- <RadioGroup size="small" class="mt-5" :style="tier.featured ? 'color: white' : ''" v-model="tier.subType">
                                        <Radio label="month" border>Month</Radio>
                                        <Radio label="year" border>Year</Radio>
                                    </RadioGroup> -->
                                    <div class="toggle-button">
            <button @click="tier.subType = 'month'" :class="tier.subType == 'month' ? 'toggle-option active' : 'toggle-option'">Monthly</button>
            <button @click="tier.subType = 'year'" :class="tier.subType == 'year' ? 'toggle-option active' : 'toggle-option'">Annually</button>
          </div>
                                    <a v-if="modifySubButton" @click="updateModifySubscription(tier)"
                                        :class="[tier.featured ? 'bg-indigo-500 text-white shadow-sm hover:bg-indigo-400 focus-visible:outline-indigo-500' : 'text-indigo-600 ring-1 ring-inset ring-indigo-200 hover:ring-indigo-300 focus-visible:outline-indigo-600', 'mt-8 block rounded-md px-3.5 py-2.5 text-center text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:mt-10']">
                                        Modify Subscription</a>
                                    <a v-else @click="updateSubscription(tier)"
                                        :class="[tier.featured ? 'bg-indigo-500 text-white shadow-sm hover:bg-indigo-400 focus-visible:outline-indigo-500' : 'text-indigo-600 ring-1 ring-inset ring-indigo-200 hover:ring-indigo-300 focus-visible:outline-indigo-600', 'mt-8 block rounded-md px-3.5 py-2.5 text-center text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:mt-10']">Get
                                        started today</a>
                                </div>
                            </div>
                        </Modal>

                        <Modal okText="Back" width="1000" title="Subscription" v-model="viewModel" :styles="{ top: '20px' }">
                            <!-- this.viewSubscription -->
                            <div
                                class="mx-auto grid max-w-lg grid-cols-1 items-center gap-y-6 sm:gap-y-0 lg:max-w-4xl lg:grid-cols-0">
                                <div v-for="(tier, tierIdx) in viewSubscription" :key="tier.id"
                                    :class="[tier.featured ? 'relative bg-gray-900 shadow-2xl' : 'bg-white/60 sm:mx-8 lg:mx-0', tier.featured ? '' : tierIdx === 0 ? 'rounded-t-3xl sm:rounded-b-none lg:rounded-bl-3xl lg:rounded-tr-none' : 'sm:rounded-t-none lg:rounded-bl-none lg:rounded-tr-3xl', 'rounded-3xl p-8 ring-1 ring-gray-900/10 sm:p-10']">
                                    <h3 :id="tier.id"
                                        :class="[tier.featured ? 'text-indigo-400' : 'text-indigo-600', 'text-base/7 font-semibold']">
                                        {{
                                        tier.name }}</h3>
                                    <p class="mt-4 flex items-baseline gap-x-2">
                                        <span
                                            :class="[tier.featured ? 'text-white' : 'text-gray-900', 'text-5xl font-semibold tracking-tight']">${{
                                                tier.price }}</span>
                                        <!-- <span :class="[tier.featured ? 'text-gray-400' : 'text-gray-500', 'text-base']">/month</span> -->
                                    </p>
                                    <p :class="[tier.featured ? 'text-gray-300' : 'text-gray-600', 'mt-6 text-base/7']">
                                        {{
                                            tier.description
                                        }}</p>
                                    <ul role="list"
                                        :class="[tier.featured ? 'text-gray-300' : 'text-gray-600', 'mt-8 space-y-3 text-sm/6 sm:mt-10']">
                                        <li v-for="feature in tier.features" :key="feature" class="flex gap-x-3">
                                            <CheckIcon
                                                :class="[tier.featured ? 'text-indigo-400' : 'text-indigo-600', 'h-6 w-5 flex-none']"
                                                aria-hidden="true" />
                                            {{ feature }}
                                        </li>
                                    </ul>
                                    <p class="mt-4 flex items-baseline gap-x-2">
                                        <span
                                            :class="[tier.featured ? 'text-gray-400' : 'text-gray-500', 'text-base']">Status:
                                        </span>
                                        <span
                                            :class="[tier.featured ? 'text-white' : 'text-gray-900', 'text-5xl font-semibold tracking-tight']">{{
                                                tier.status }}</span>
                                        <!-- <span :class="[tier.featured ? 'text-gray-400' : 'text-gray-500', 'text-base']">User: </span>
                            <span
                                :class="[tier.featured ? 'text-white' : 'text-gray-900', 'text-5xl font-semibold tracking-tight']">{{
                                tier.user }}</span> -->
                                        <span
                                            :class="[tier.featured ? 'text-gray-400' : 'text-gray-500', 'text-base']"><b>User:</b>
                                            {{
                                            tier.user }}</span>
                                    </p>
                                    <p class="mt-4 flex items-baseline gap-x-2">
                                        <span
                                            :class="[tier.featured ? 'text-gray-400' : 'text-gray-500', 'text-base']"><b>Start
                                                Date:</b>
                                            {{ tier.startDate }}</span>
                                        <span
                                            :class="[tier.featured ? 'text-gray-400' : 'text-gray-500', 'text-base']"><b>End
                                                Date:</b> {{
                                            tier.endDate }}</span>
                                    </p>
                                </div>
                            </div>
                        </Modal>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { CheckIcon } from '@heroicons/vue/20/solid'

</script>
<script>
import axios from "axios";
import axiosInstance from '@/utils/axios';

export default {
    name: "subscriptions",
    data() {
        return {
            addModal: false,
            loading: false,
            tblloading: false,
            viewModel: false,
            user_id: 0,
            filter: {
                email: ""
            },
            form: {
                id: "",
                name: "",
                price: "",
                // durationValue: 0,
                // durationUnit: "month",
                description: "",
            },
            columns: [
                { title: "ID", key: "id", minWidth: 50, align: "center", resizable: true, sortable: true },
                { title: "Subscriber", slot: "sub_info", minWidth: 200, sortable: true },
                { title: "Plan", slot: "sub_name", key: "name", sortable: true, minWidth: 100 },
                { title: "Price ($)", slot: "price", key: "price", sortable: true, minWidth: 50 },
                // { title: "Duration", slot: "duration", key: "duration" },
                // { title: "Description", slot: "desc", key: "description" },
                { title: "Status", key: "status", sortable: true, minWidth: 50 },
                // { title: "Start Date", key: "startDate", sortable: true },
                // { title: "End Date", key: "endDate", sortable: true },
                { title: "Action", slot: "action", minWidth: 200 },
            ],
            viewSubscription: [],
            activeSubscriptions: [],
            subscriptions: [],
            users: [],
            subTypes: [],
            updateSubscriptionObj: { new_sub_id: 0, old_sub_id: 0 },
            modifySubButton: false,
            paginationInfo: null,
            per_page: 5,
        };
    },
    methods: {
        async fetchSubscriptions() {
            try {
                const response = await axiosInstance.get('/api/subscriptions');
                this.subscriptions = response.data;
                this.subscriptions.forEach((element, index) => {
                    if (index % 2 === 0) {
                        element.subType = 'month'
                        element.featured = false;
                        element.features = ['25 products', 'Up to 10,000 subscribers', 'Advanced analytics', '24-hour support response time'];
                    }
                    else {
                        element.subType = 'month'
                        element.featured = true;
                        element.features = [
                            'Unlimited products',
                            'Unlimited subscribers',
                            'Advanced analytics',
                            'Dedicated support representative',
                            'Marketing automations',
                            'Custom integrations',
                        ];
                    }
                });

            } catch (error) {
                console.error('Error fetching subscriptions:', error);
                // Redirect to login if unauthorized
                if (error.response && error.response.status === 401) {
                    router.push('/login');
                }
            }
        },
        async fetchUsers() {
            try {
                const response = await axiosInstance.get('/api/users');
                this.users = response.data;
            } catch (error) {
                console.error('Error fetching users:', error);
                // Redirect to login if unauthorized
                if (error.response && error.response.status === 401) {
                    router.push('/login');
                }
            }
        },
        async loadActiveSubscriptions(page_number = 1) {
            try {
                this.tblloading = true;
                this.filter.page = page_number;
                this.filter.per_page = this.per_page;

                const res = await axiosInstance.post("/api/allActiveSubscriptions", this.filter);
                // this.activeSubscriptions = res.data;
                // this.paginationInfo = res.pagination;
                this.activeSubscriptions = res.data.data;
                this.paginationInfo = res.data.meta;
                this.tblloading = false;
            } catch (error) {
                console.error("Error loading subscriptions:", error);
            }
        },

        async loadSubscriptions() {
            try {
                const res = await axiosInstance.get(`/api/subscriptions`
                );
                this.subTypes = res.data;
                // this.subTypes = res.data.data;
                // this.paginationInfo = res.data.meta;
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
        async unsubscribe(subscription) {
            console.log(subscription)
            if (confirm("Are you sure you want to delete this subscription?")) {
                try {
                    await axiosInstance.post(`/api/unsubscribe`, { subscriptionId: subscription.id, user_id: subscription.userId });
                    this.loadActiveSubscriptions();
                } catch (error) {
                    console.error("Error deleting subscription:", error);
                }
            }
        },
        // Edit subscription
        editSubscription(subscription) {
            console.log(subscription)
            this.form = { ...subscription };
            this.addModal = true;
        },

        // Update subscription
        async updateSubscription(plan) {
            if (!plan.subType || this.user_id <= 0) {
                // alert('Select Type or User');
                this.$Notice.info({
                    title: 'Select Type and User',
                    // desc: nodesc ? '' : 'Here is the notification description. Here is the notification description. '
                });
                return
            }
            try {
                const response = await axiosInstance.post('/api/subscribe', { subscription_id: plan.id, type: plan.subType, user_id: this.user_id });

                if (response.data.success) {
                    // alert('Subscription successful!');
                    this.$Notice.success({
                        title: 'Subscription successful!',
                        // desc: nodesc ? '' : 'Here is the notification description. Here is the notification description. '
                    });
                    this.loadActiveSubscriptions();
                    this.addModal = false;
                } else {
                    this.$Notice.error({
                        title: response.data.message ? response.data.message : 'Subscription failed. Please try again.',
                        // desc: nodesc ? '' : 'Here is the notification description. Here is the notification description. '
                    });
                    // alert(response.data.message ? response.data.message : 'Subscription failed. Please try again.');
                }
            } catch (error) {
                console.error('Error subscribing to plan:', error);
                // alert('An error occurred while processing your subscription.');
                this.$Notice.error({
                    title: 'An error occurred while processing your subscription.',
                    // desc: nodesc ? '' : 'Here is the notification description. Here is the notification description. '
                });
            }
        },
        async updateModifySubscription(new_sub) {
            if (!new_sub.subType) {
                // alert('Select Type!');
                this.$Notice.info({
                    title: 'Select Type',
                    // desc: nodesc ? '' : 'Here is the notification description. Here is the notification description. '
                });
                return
            }
            this.updateSubscriptionObj.type = new_sub.subType
            this.updateSubscriptionObj.new_sub_id = new_sub.id
            this.updateSubscriptionObj.user_id = this.user_id
            if (!this.updateSubscriptionObj.new_sub_id || !this.updateSubscriptionObj.old_sub_id) return;

            this.loading = true;
            try {
                await axiosInstance.post('/api/updateSubscription', this.updateSubscriptionObj);
                this.loadActiveSubscriptions();
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
        detailsSubscription(row) {
            var data = row.subscription
            data.user = row.user.email;
            data.status = row.status.toUpperCase();
            data.startDate = new Intl.DateTimeFormat('en-US', {
                year: 'numeric',
                month: 'long',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            }).format(new Date(row.startDate));
            data.endDate = new Intl.DateTimeFormat('en-US', {
                year: 'numeric',
                month: 'long',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            }).format(new Date(row.endDate));
            this.viewModel = true;
            data.features = [
                'Unlimited products',
                'Unlimited subscribers',
                'Advanced analytics',
                'Dedicated support representative',
                'Marketing automations',
                'Custom integrations',
            ];


            this.viewSubscription = [data];
        },
        async modifySubscription(subscription) {
            this.user_id = subscription.userId
            this.updateSubscriptionObj.old_sub_id = subscription.subscriptionId;
            this.modifySubButton = true;
            console.log(subscription)
            // this.updateSubscriptionObj.old_sub_id = subscription.id
            // try {
            //     const response = await axiosInstance.post('/api/toModifyListSubscriptions', {id: subscription.id});

            //     this.subscriptions = response.data;
            //     } catch (error) {
            //         console.error('Error fetching subscriptions:', error);
            //         // Redirect to login if unauthorized
            //         if (error.response && error.response.status === 401) {
            //         router.push('/login');
            //         }
            //     }
            this.addModal = true;
        },

        // Reset form data
        resetForm() {
            this.form = { id: "", name: "", price: "", durationValue: "", durationUnit: "month", description: "" };
        },

        // Open Add Modal
        addModalOn() {
            this.resetForm();
            this.addModal = true;
            this.modifySubButton = false;
            this.user_id = 0;
        },
    },
    mounted() {
        this.loadSubscriptions();
        this.loadActiveSubscriptions();
        this.fetchSubscriptions();
        this.fetchUsers();

    },
};
</script>

<style scoped>
@import '@/assets/subscription/style.css';
</style>