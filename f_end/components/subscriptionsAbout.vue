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
            <Modal okText="Retour" cancelText="" width="1000" title="Modifier votre abonnement" v-model="addModal" :styles="{ top: '20px' }">
                <!-- Utilisation du même composant de section tarifs que sur la page d'accueil -->
                <PricingSection
                    :subscriptions="subscriptions"
                    @subscribe="updateSubscription"
                    subtitle="Changer d'abonnement"
                    title="Sélectionnez un nouveau forfait"
                    description="Choisissez l'abonnement qui correspond le mieux à vos besoins actuels. Les modifications prendront effet immédiatement."
                />
            </Modal>

            <Modal okText="Back" cancelText="" width="1000" title="Subscription" v-model="viewModel" :styles="{ top: '20px' }">
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
import PricingSection from '@/components/sections/Pricing/PricingSection.vue'
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
        // Retourne le plan gratuit (Free Plan / Forfait Gratuit)
        getFreePlan() {
            return this.subscriptions.find(sub => sub.name.includes('Free') || sub.name.includes('Gratuit'));
        },
        // Retourne le plan Mid-Tier / Forfait Intermédiaire
        getMidTierPlan() {
            return this.subscriptions.find(sub => 
                sub.name.includes('Mid-Teir') || 
                sub.name.includes('Mid-Tier') || 
                sub.name.includes('Intermédiaire')
            );
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

                // Pour éviter les fluctuations de la mise en page, on définit les fonctionnalités pour chaque niveau d'abonnement
                // Utilisation des mêmes listes de fonctionnalités que sur la page d'accueil
                const freeFeatures = [
                    "Jusqu'à 25 produits", 
                    "Jusqu'à 5 000 visiteurs par mois",
                    "Galerie d'images standard",
                    "Modèles de site de base",
                    "Support par email (48h)",
                    "Sauvegardes hebdomadaires"
                ];
                
                const midTierFeatures = [
                    "Toutes les fonctionnalités de l'offre Gratuite",
                    "Jusqu'à 100 produits",
                    "Jusqu'à 50 000 visiteurs par mois",
                    "Galerie d'images premium",
                    "Tous les modèles de site disponibles",
                    "Support prioritaire par email (24h)",
                    "Sauvegardes quotidiennes",
                    "Statistiques avancées",
                    "Personnalisation avancée"
                ];
                
                const premiumFeatures = [
                    "Toutes les fonctionnalités de l'offre Mid-Tier",
                    "Produits illimités",
                    "Visiteurs illimités",
                    "Représentant de support dédié",
                    "Automatisations marketing personnalisées",
                    "Intégrations API avancées",
                    "Sauvegardes en temps réel",
                    "Analyses prédictives",
                    "Optimisation SEO premium",
                    "Exports de données illimités"
                ];
                
                // Mapper les données avec le même format que la page d'accueil
                this.subscriptions = response.data.map((element) => {
                    const monthlyPrice = element.price;
                    const yearlyPrice = (element.price * 0.8 * 12).toFixed(2);
                    // Attribuer featured=true uniquement au plan Mid-Tier / Intermédiaire (comme sur la page d'accueil)
                    const featured = element.name.includes('Mid-Teir') || 
                               element.name.includes('Mid-Tier') || 
                               element.name.includes('Intermédiaire');
                    
                    // Déterminer les bonnes fonctionnalités selon le plan
                    let features;
                    if (element.name.includes('Free') || element.name.includes('Gratuit')) {
                        features = freeFeatures;
                    } else if (element.name.includes('Mid-Teir') || element.name.includes('Mid-Tier') || element.name.includes('Intermédiaire')) {
                        features = midTierFeatures;
                    } else if (element.name.includes('Premium')) {
                        features = premiumFeatures;
                    } else {
                        features = featured ? midTierFeatures : freeFeatures;
                    }
                    
                    return {
                        ...element,
                        featured,
                        features,
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