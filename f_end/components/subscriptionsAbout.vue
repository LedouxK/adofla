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
            <Modal okText="Retour" width="1000" title="Modifier votre abonnement" v-model="addModal" :styles="{ top: '20px' }">
                <!-- Plans Container - Hauteur fixe pour éviter le décalage -->
                <div class="mx-auto mt-8 mb-16 grid max-w-lg grid-cols-1 items-stretch gap-y-6 sm:mt-12 sm:gap-y-0 lg:max-w-4xl lg:grid-cols-3" style="min-height: 620px;">
                    <!-- Plans organisés par ordre de priorité souhaité -->
                    <!-- Free Plan (toujours en premier) -->
                    <div v-if="getFreePlan" :key="getFreePlan.id"
                        class="relative rounded-3xl p-8 ring-1 ring-gray-900/10 bg-white/60 sm:mx-4 lg:mx-0"
                    >
                        <h3 :id="getFreePlan.id" class="text-indigo-600 text-base font-semibold">
                            {{ getFreePlan.name }}
                        </h3>
                        <p class="mt-4 flex items-baseline gap-x-2">
                            <!-- Affichage du prix avec hauteur fixe pour éviter les décalages -->
                            <div class="price-display" :class="{ 'yearly': getFreePlan.subscriptionType === 'year' }">
                                <span class="text-gray-900 text-5xl font-semibold tracking-tight">
                                    <span class="price-wrapper">{{ getFreePlan.subscriptionType === 'month' ? getFreePlan.monthlyPrice : getFreePlan.yearlyPrice }} <span class="currency">€</span></span>
                                </span>
                                <span class="text-gray-500 text-base ml-1">
                                    /mois
                                    <span v-if="getFreePlan.subscriptionType === 'year'" class="block text-xs text-right">facturé annuellement</span>
                                </span>
                            </div>
                        </p>
                        <p class="mt-6 text-gray-600 text-base">{{ getFreePlan.description }}</p>
                        <ul role="list" class="text-gray-600 mt-8 space-y-3 text-sm sm:mt-10">
                            <li v-for="feature in getFreePlan.features" :key="feature" class="flex gap-x-3">
                                <CheckIcon class="text-indigo-600 h-6 w-5 flex-none" aria-hidden="true" />
                                {{ feature }}
                            </li>
                        </ul>
                        
                        <!-- Type d'abonnement avec utilisation du composant ToggleSwitch existant -->
                        <div class="mt-5">
                            <p class="text-gray-700 text-sm font-medium mb-1">Type d'abonnement</p>
                            
                            <!-- Conteneur avec hauteur fixe pour garantir la stabilité du layout -->
                            <div class="billing-type-container">
                                <!-- Utilisé pour positionner le badge d'économie sans perturber la mise en page -->
                                <div class="relative">
                                    <!-- Composant ToggleSwitch avec v-model -->
                                    <ToggleSwitch
                                        v-model="getFreePlan.subscriptionType"
                                        :options="[
                                            { label: 'Mensuel', value: 'month' },
                                            { label: getFreePlan.subscriptionType === 'year' ? 'Annuel Eco 20%' : 'Annuel', value: 'year' }
                                        ]"
                                        class="toggle-custom"
                                    />
                                </div>
                            </div>
                        </div>
                        
                        <button @click="updateSubscription(getFreePlan)"
                            class="mt-8 block w-full rounded-md bg-indigo-50 px-3.5 py-2.5 text-center text-sm font-semibold text-indigo-600 shadow-sm hover:bg-indigo-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:mt-10"
                        >
                            S'abonner maintenant
                        </button>
                    </div>
                    
                    <!-- Mid-Tier Plan (maintenant en deuxième) -->
                    <div v-if="getMidTierPlan" :key="getMidTierPlan.id"
                        class="relative rounded-3xl p-8 ring-1 ring-gray-900/10 bg-gray-900 shadow-2xl"
                    >
                        <h3 :id="getMidTierPlan.id" class="text-indigo-400 text-base font-semibold">
                            {{ getMidTierPlan.name }}
                        </h3>
                        <p class="mt-4 flex items-baseline gap-x-2">
                            <!-- Affichage du prix avec hauteur fixe pour éviter les décalages -->
                            <div class="price-display" :class="{ 'yearly': getMidTierPlan.subscriptionType === 'year' }">
                                <span class="text-white text-5xl font-semibold tracking-tight">
                                    <span class="price-wrapper">{{ getMidTierPlan.subscriptionType === 'month' ? getMidTierPlan.monthlyPrice : getMidTierPlan.yearlyPrice }} <span class="currency">€</span></span>
                                </span>
                                <span class="text-gray-400 text-base ml-1">
                                    /mois
                                    <span v-if="getMidTierPlan.subscriptionType === 'year'" class="block text-xs text-right">facturé annuellement</span>
                                </span>
                            </div>
                        </p>
                        <p class="mt-6 text-gray-300 text-base">{{ getMidTierPlan.description }}</p>
                        <ul role="list" class="text-gray-300 mt-8 space-y-3 text-sm sm:mt-10">
                            <li v-for="feature in getMidTierPlan.features" :key="feature" class="flex gap-x-3">
                                <CheckIcon class="text-indigo-400 h-6 w-5 flex-none" aria-hidden="true" />
                                {{ feature }}
                            </li>
                        </ul>
                        
                        <!-- Type d'abonnement avec utilisation du composant ToggleSwitch existant -->
                        <div class="mt-5">
                            <p class="text-gray-200 text-sm font-medium mb-1">Type d'abonnement</p>
                            
                            <!-- Conteneur avec hauteur fixe pour garantir la stabilité du layout -->
                            <div class="billing-type-container">
                                <!-- Utilisé pour positionner le badge d'économie sans perturber la mise en page -->
                                <div class="relative">
                                    <!-- Composant ToggleSwitch avec v-model -->
                                    <ToggleSwitch
                                        v-model="getMidTierPlan.subscriptionType"
                                        :options="[
                                            { label: 'Mensuel', value: 'month' },
                                            { label: getMidTierPlan.subscriptionType === 'year' ? 'Annuel Eco 20%' : 'Annuel', value: 'year' }
                                        ]"
                                        class="toggle-custom toggle-dark"
                                    />
                                </div>
                            </div>
                        </div>
                        
                        <button @click="updateSubscription(getMidTierPlan)"
                            class="mt-8 block w-full rounded-md bg-indigo-500 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 sm:mt-10"
                        >
                            S'abonner maintenant
                        </button>
                    </div>
                    
                    <!-- Premium Plan (maintenant en troisième) -->
                    <div v-if="getPremiumPlan" :key="getPremiumPlan.id"
                        class="relative rounded-3xl p-8 ring-1 ring-gray-900/10 bg-white/60 sm:mx-4 lg:mx-0"
                    >
                        <h3 :id="getPremiumPlan.id" class="text-indigo-600 text-base font-semibold">
                            {{ getPremiumPlan.name }}
                        </h3>
                        <p class="mt-4 flex items-baseline gap-x-2">
                            <!-- Affichage du prix avec hauteur fixe pour éviter les décalages -->
                            <div class="price-display" :class="{ 'yearly': getPremiumPlan.subscriptionType === 'year' }">
                                <span class="text-gray-900 text-5xl font-semibold tracking-tight">
                                    <span class="price-wrapper">{{ getPremiumPlan.subscriptionType === 'month' ? getPremiumPlan.monthlyPrice : getPremiumPlan.yearlyPrice }} <span class="currency">€</span></span>
                                </span>
                                <span class="text-gray-500 text-base ml-1">
                                    /mois
                                    <span v-if="getPremiumPlan.subscriptionType === 'year'" class="block text-xs text-right">facturé annuellement</span>
                                </span>
                            </div>
                        </p>
                        <p class="mt-6 text-gray-600 text-base">{{ getPremiumPlan.description }}</p>
                        <ul role="list" class="text-gray-600 mt-8 space-y-3 text-sm sm:mt-10">
                            <li v-for="feature in getPremiumPlan.features" :key="feature" class="flex gap-x-3">
                                <CheckIcon class="text-indigo-600 h-6 w-5 flex-none" aria-hidden="true" />
                                {{ feature }}
                            </li>
                        </ul>
                        
                        <!-- Type d'abonnement avec utilisation du composant ToggleSwitch existant -->
                        <div class="mt-5">
                            <p class="text-gray-700 text-sm font-medium mb-1">Type d'abonnement</p>
                            
                            <!-- Conteneur avec hauteur fixe pour garantir la stabilité du layout -->
                            <div class="billing-type-container">
                                <!-- Utilisé pour positionner le badge d'économie sans perturber la mise en page -->
                                <div class="relative">
                                    <!-- Composant ToggleSwitch avec v-model -->
                                    <ToggleSwitch
                                        v-model="getPremiumPlan.subscriptionType"
                                        :options="[
                                            { label: 'Mensuel', value: 'month' },
                                            { label: getPremiumPlan.subscriptionType === 'year' ? 'Annuel Eco 20%' : 'Annuel', value: 'year' }
                                        ]"
                                        class="toggle-custom"
                                    />
                                </div>
                            </div>
                        </div>
                        
                        <button @click="updateSubscription(getPremiumPlan)"
                            class="mt-8 block w-full rounded-md bg-indigo-50 px-3.5 py-2.5 text-center text-sm font-semibold text-indigo-600 shadow-sm hover:bg-indigo-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:mt-10"
                        >
                            S'abonner maintenant
                        </button>
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
import ToggleSwitch from '@/components/ui/ToggleSwitch.vue'
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
    computed: {
        // Retourne le plan gratuit (Free Plan)
        getFreePlan() {
            return this.subscriptions.find(sub => sub.name.includes('Free'));
        },
        // Retourne le plan Mid-Tier
        getMidTierPlan() {
            return this.subscriptions.find(sub => sub.name.includes('Mid-Teir') || sub.name.includes('Mid-Tier'));
        },
        // Retourne le plan Premium
        getPremiumPlan() {
            return this.subscriptions.find(sub => sub.name.includes('Premium'));
        },
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
            this.updateSubscriptionObj.new_sub_id = new_sub.id
            this.loading = true;

            // Utiliser le nouveau format de payload avec subscriptionType (month/year) converti en monthly/yearly
            let payload = {
                subscription_id: this.updateSubscriptionObj.new_sub_id,
                type: new_sub.subscriptionType === 'year' ? 'yearly' : 'monthly',
            }

            try {
                const response = await axiosInstance.post('/api/subscribe', payload);

                if (response.status == 200) {
                    if (response.data.success) {
                        // Vérifier si c'est un nouvel abonnement ou un changement d'abonnement
                        const title = response.data.changed 
                            ? 'Forfait modifié !' 
                            : 'Abonnement réussi !';
                            
                        const desc = response.data.changed 
                            ? 'Votre nouvel abonnement est actif' 
                            : 'Bienvenue dans votre nouveau forfait';
                            
                        this.$Notice.success({
                            title: title,
                            desc: desc
                        });

                        // Reload subscriptions info
                        await this.loadActiveSubscriptions();
                        this.addModal = false
                    } else {
                        this.$Notice.error({
                            title: response.data.message ? response.data.message : 'Échec de la modification d\'abonnement.',
                            desc: 'Veuillez réessayer ultérieurement.'
                        });
                    }
                } else {
                    this.$Notice.error({
                        title: 'Échec de la modification d\'abonnement.',
                        desc: 'Veuillez réessayer ultérieurement.'
                    });
                }
            } catch (error) {
                console.error('Error updating subscription:', error);
                
                // Vérifier si c'est le cas spécifique où l'utilisateur a déjà ce forfait
                if (error.response && error.response.data && 
                    error.response.data.message && 
                    error.response.data.message.includes('déjà abonné')) {
                  
                    this.$Notice.info({
                        title: "Abonnement actif",
                        desc: "Vous êtes déjà abonné(e) à ce forfait"
                    });
                } else {
                    // Pour les autres types d'erreurs
                    this.$Notice.error({
                        title: "Une erreur s'est produite lors du traitement de votre abonnement.",
                        desc: error.response?.data?.message || "Veuillez réessayer ultérieurement."
                    });
                }
            } finally {
                this.loading = false;
            }
        },

        async modifySubscription(subscription) {
            this.updateSubscriptionObj.old_sub_id = subscription.id
            try {
                const response = await axiosInstance.post('/api/toModifyListSubscriptions', { id: subscription.id });

                // Pour éviter les fluctuations de la mise en page, on définit d'abord les caractéristiques fixes
                const regularFeatures = [
                    '25 produits', 
                    "Jusqu'à 10 000 abonnés", 
                    'Analyses avancées', 
                    'Support 24h/24 en 24h'
                ];
                
                const featuredFeatures = [
                    'Produits illimités',
                    'Abonnés illimités',
                    'Analyses avancées',
                    'Représentant de support dédié',
                    'Automatisations marketing',
                    'Intégrations personnalisées'
                ];
                
                // Mapper les données avec le même format que la page d'accueil
                this.subscriptions = response.data.map((element) => {
                    const monthlyPrice = element.price;
                    const yearlyPrice = (element.price * 0.8 * 12).toFixed(2);
                    // Attribuer featured=true uniquement au plan Mid-Tier (comme sur la page d'accueil)
                    const featured = element.name.includes('Mid-Teir') || element.name.includes('Mid-Tier');
                    
                    return {
                        ...element,
                        featured,
                        features: featured ? featuredFeatures : regularFeatures,
                        monthlyPrice,
                        yearlyPrice,
                        subscriptionType: 'month' // Valeur par défaut
                    };
                });
            } catch (error) {
                console.error('Error fetching subscriptions:', error);
                // Redirect to login if unauthorized
                if (error.response && error.response.status === 401) {
                    this.$router.push('/login');
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