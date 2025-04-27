<template>
    <div>
        <!-- Main content -->
        <section>
            <div>
                <div class="row">
                    <!-- /.col -->
                    <div class="col-md-12">
                        <div class="card">
                            <div class="card-body">
                                <div class="tab-content">
                                    <div class="active tab-pane" id="activity">
                                        <h1 class="text-xl font-bold pb-5">Active Subscription</h1>
                                        <!-- Subscriptions Table -->
                                        <Table border :columns="columns" :data="activeSubscriptions">
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
                                                {{ row.subscription.durationValue }} {{
                                                    row.subscription.durationUnit }}
                                            </template>
                                            <template #action="{ row, index }">
                                                <div>
                                                    <Button class="mx-1" type="primary" size="small"
                                                        @click="detailsSubscription(row)">Details</Button>
                                                    <Button class="mx-1" type="success" size="small"
                                                        @click="modifySubscription(row.subscription)">Modify</Button>
                                                    <Button class="mx-1" type="error" size="small"
                                                        @click="unsubscribe(row)">Unsubscribe</Button>
                                                </div>
                                            </template>
                                        </Table>
                                        <!-- <Page v-if="paginationInfo" :total="paginationInfo.total"
                                                :current="paginationInfo.current_page"
                                                :page-size="parseInt(paginationInfo.per_page)"
                                                @on-change="loadSubscriptions" /> -->
                                    </div>
                                </div>
                                <!-- /.tab-content -->
                            </div><!-- /.card-body -->
                            <div class="card-body">
                                <div class="tab-content">
                                    <div class="active tab-pane" id="activity">
                                        <h1 class="text-xl font-bold pb-5">Subscription History</h1>
                                        <!-- Subscriptions Table -->
                                        <Table border :columns="columns2" :data="subscriptionHistory">
                                            <template #sub_name="{ row, index }">
                                                {{ row.subscription.name }}
                                            </template>
                                            <template #action="{ row, index }">
                                                <div>
                                                    <Button class="mx-1" type="primary" size="small"
                                                        @click="detailsSubscription(row)">Details</Button>
                                                </div>
                                            </template>
                                        </Table>
                                        <!-- <Page v-if="paginationInfo" :total="paginationInfo.total"
                                                :current="paginationInfo.current_page"
                                                :page-size="parseInt(paginationInfo.per_page)"
                                                @on-change="loadSubscriptions" /> -->
                                    </div>
                                </div>
                                <!-- /.tab-content -->
                            </div><!-- /.card-body -->
                        </div>
                        <!-- /.card -->
                    </div>
                    <!-- /.col -->
                </div>
                <!-- /.row -->
            </div><!-- /.container-fluid -->
        </section>
        <!-- /.content -->

        <div>
            <!-- Add/Edit Subscription Modal -->
            <Modal okText="Back" width="1000" title="Add Subscription" v-model="addModal" :styles="{ top: '20px' }">
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
                        <p :class="[tier.featured ? 'text-gray-300' : 'text-gray-600', 'mt-6 text-base/7']">{{
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
                        <div class="subscription-options">
                            <h4>Choisissez le type d'abonnement</h4>
                            <div class="toggle-button">
                                <button 
                                    @click="tier.subType = 'month'" 
                                    :class="tier.subType === 'month' ? 'toggle-option active' : 'toggle-option'">
                                    Mensuel
                                </button>
                                <button 
                                    @click="tier.subType = 'year'" 
                                    :class="tier.subType === 'year' ? 'toggle-option active' : 'toggle-option'">
                                    Annuel
                                </button>
                            </div>

                            <h4>Choisissez la durée de l'abonnement</h4>
                            <select v-model="tier.duration" class="duration-select">
                                <option value="1">1 mois</option>
                                <option value="3">3 mois</option>
                                <option value="6">6 mois</option>
                                <option value="12">12 mois</option>
                            </select>
                        </div>

                        <a 
                            @click="updateSubscription(tier)"
                            :class="[
                                tier.featured ? 'bg-indigo-500 text-white shadow-sm hover:bg-indigo-400 focus-visible:outline-indigo-500' : 'text-indigo-600 ring-1 ring-inset ring-indigo-200 hover:ring-indigo-300 focus-visible:outline-indigo-600',
                                'mt-8 block rounded-md px-3.5 py-2.5 text-center text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:mt-10'
                            ]">
                            S'abonner maintenant
                        </a>
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
                        <p :class="[tier.featured ? 'text-gray-300' : 'text-gray-600', 'mt-6 text-base/7']">{{
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
                            <span :class="[tier.featured ? 'text-gray-400' : 'text-gray-500', 'text-base']">Status: </span>
                            <span
                                :class="[tier.featured ? 'text-white' : 'text-gray-900', 'text-5xl font-semibold tracking-tight']">{{
                                tier.status }}</span>
                        </p>
                        <p class="mt-4 flex items-baseline gap-x-2">
                            <span :class="[tier.featured ? 'text-gray-400' : 'text-gray-500', 'text-base']"><b>Start Date:</b> {{ tier.startDate }}</span>
                            <span :class="[tier.featured ? 'text-gray-400' : 'text-gray-500', 'text-base']"><b>End Date:</b> {{ tier.endDate }}</span>
                        </p>
                    </div>
                </div>
            </Modal>
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
    name: "subscriptionsAbout",
    data() {
        return {
            subscriptions: [],
            viewSubscription: [],
            updateSubscriptionObj: { new_sub_id: 0, old_sub_id: 0 },
            addModal: false,
            viewModel: false,
            loading: false,
            form: {
                id: "",
                name: "",
                price: "",
                durationValue: "",
                durationUnit: "month",
                description: "",
            },
            columns: [
                // { title: "ID", key: "id", width: 100, align: "center", sortable: true },
                { title: "Plan", minWidth: 50, slot: "sub_name", key: "name" },
                // { title: "Price ($)", slot: "price", key: "price" },
                // // { title: "Description", slot: "desc", key: "description" },
                // { title: "Status", key: "status" },
                { title: "Start Date", minWidth: 150, key: "startDate" },
                { title: "Expiry Date", minWidth: 150, key: "endDate" },
                { title: "Action", slot: "action", minWidth: 300, },
            ],
            columns2: [
                { title: "ID", key: "id", minWidth: 50, align: "center", sortable: true },
                { title: "Plan", minWidth: 150, slot: "sub_name", key: "name" },
                // { title: "Price ($)", slot: "price", key: "price" },
                // // { title: "Duration", slot: "duration", key: "duration" },
                // { title: "Description", slot: "desc", key: "description" },
                // { title: "Status", key: "status" },
                { title: "Start Date", minWidth: 150, key: "startDate" },
                { title: "Expiry Date", minWidth: 150, key: "endDate" },
                // { title: "Inactive Date", key: "updatedAt", width: 130 },
                { title: "Action", slot: "action",  minWidth: 100, },
            ],
            activeSubscriptions: [],
            subscriptionHistory: [],
            paginationInfo: null,
            per_page: 5,
        };
    },
    methods: {
        formatDate(date)
        {
            var startDate = new Intl.DateTimeFormat('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit'
                                }).format(new Date(date));
            
            return startDate
        },
        // Load subscriptions
        async loadActiveSubscriptions(page_number = 1) {
            try {
                const res = await axiosInstance.get("/api/activeSubscriptions");
                res.data.forEach(element => {
                    element.startDate = this.formatDate(element.startDate)
                    element.endDate = this.formatDate(element.endDate)
                });
                this.activeSubscriptions = res.data;
                // this.paginationInfo = res.pagination;
            } catch (error) {
                console.error("Error loading subscriptions:", error);
            }
        },
        async loadSubscriptionHistory(page_number = 1) {
            try {
                const res = await axiosInstance.get("/api/subscriptionHistory");
                res.data.forEach(element => {
                    element.startDate = this.formatDate(element.startDate)
                    element.endDate = this.formatDate(element.endDate)
                });
                this.subscriptionHistory = res.data;
                // this.paginationInfo = res.pagination;
            } catch (error) {
                console.error("Error loading subscriptions:", error);
            }
        },

        // // Add subscription
        // async addSubscription() {
        //     if (!this.form.name || !this.form.price || !this.form.durationValue || !this.form.durationUnit) return;

        //     this.loading = true;
        //     // const axiosInstance = this.createAxiosInstance();
        //     try {
        //         await axiosInstance.post("/api/subscriptions", this.form);
        //         this.loadActiveSubscriptions();
        //         this.resetForm();
        //         this.addModal = false;
        //     } catch (error) {
        //         console.error("Error adding subscription:", error);
        //     } finally {
        //         this.loading = false;
        //     }
        // },

        // Edit subscription
        editSubscription(subscription) {
            console.log(subscription)
            this.form = { ...subscription };
            this.addModal = true;
        },



        // Remove subscription
        async unsubscribe(subscription) {
            if (confirm("Are you sure you want to delete this subscription?")) {
                try {
                    await axiosInstance.post(`/api/unsubscribe`, { subscriptionId: subscription.id });
                    this.$Notice.success({
                    title: 'Unsubscribed.',
                    // desc: nodesc ? '' : 'Here is the notification description. Here is the notification description. '
                });
                    this.loadInitials();
                } catch (error) {
                    console.error("Error deleting subscription:", error);
                }
            }
        },

        // Update subscription
        async updateSubscription(new_sub) {
            if (!new_sub.subType) {
                // this.$Message.info('Select Type!');
                this.$Notice.info({
                    title: 'Select Type!',
                    // desc: nodesc ? '' : 'Here is the notification description. Here is the notification description. '
                });
                return
            }
            this.updateSubscriptionObj.type = new_sub.subType
            this.updateSubscriptionObj.new_sub_id = new_sub.id
            if (!this.updateSubscriptionObj.new_sub_id || !this.updateSubscriptionObj.old_sub_id) return;

            this.loading = true;
            try {
                await axiosInstance.post('/api/updateSubscription', this.updateSubscriptionObj);
                this.$Notice.success({
                    title: 'Successfully Updated',
                    // desc: nodesc ? '' : 'Here is the notification description. Here is the notification description. '
                });
                this.loadInitials();
                this.addModal = false;
            } catch (error) {
                console.error("Error updating subscription:", error);
            } finally {
                this.loading = false;
            }
        },

        async modifySubscription(subscription) {
            this.updateSubscriptionObj.old_sub_id = subscription.id
            try {
                const response = await axiosInstance.post('/api/toModifyListSubscriptions', { id: subscription.id });

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
        },
        detailsSubscription(row) {
            var data = row.subscription
            data.status = row.status.toUpperCase();
            data.startDate = row.startDate;
            data.endDate = row.endDate;
            // data.startDate = new Intl.DateTimeFormat('en-US', {
            //                     year: 'numeric',
            //                     month: 'long',
            //                     day: '2-digit',
            //                     hour: '2-digit',
            //                     minute: '2-digit',
            //                     second: '2-digit'
            //                     }).format(new Date(row.startDate));
            // data.endDate = new Intl.DateTimeFormat('en-US', {
            //                     year: 'numeric',
            //                     month: 'long',
            //                     day: '2-digit',
            //                     hour: '2-digit',
            //                     minute: '2-digit',
            //                     second: '2-digit'
            //                     }).format(new Date(row.endDate));
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
        loadInitials() {
            this.loadActiveSubscriptions();
            this.loadSubscriptionHistory();
        },
    },

    mounted() {
        this.loadInitials();
    },
};
</script>

<style scoped>
@import '@/assets/subscription/style.css';
</style>