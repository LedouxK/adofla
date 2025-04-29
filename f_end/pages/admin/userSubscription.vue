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
                        <BreadcrumbItem to="/admin">Accueil</BreadcrumbItem>
                        <BreadcrumbItem>Abonnements utilisateurs</BreadcrumbItem>
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
                            <label class="block text-sm font-medium text-gray-700 mb-1" for="filterEmail">Filtrer par email</label>
                            <Input 
                               id="filterEmail"
                               style="width: 100%" 
                               @input="loadActiveSubscriptions()" 
                               v-model="filter.email"
                               size="large" 
                               placeholder="Rechercher par email" />
                            </Col>
                            <Col span="8">
                            <label class="block text-sm font-medium text-gray-700 mb-1" for="filterType">Filtrer par type d'abonnement</label>
                            <Select 
                               id="filterType"
                               clearable 
                               @onChange="loadActiveSubscriptions()" 
                               v-model="filter.sub_id" 
                               size="large"
                               style="width: 100%"
                               placeholder="Tous les types">
                                <Option v-for="(item, i) in subTypes" :key="i" :value="item.id">{{ item.name }}</Option>
                            </Select>
                            </Col>
                            <Col span="8">
                            <label class="block text-sm font-medium text-gray-700 mb-1" for="filterStatus">Filtrer par statut</label>
                            <Select 
                               id="filterStatus"
                               clearable 
                               @onChange="loadActiveSubscriptions()" 
                               v-model="filter.status" 
                               size="large"
                               style="width: 100%"
                               placeholder="Tous les statuts">
                                <Option value="active">Actif</Option>
                                <Option value="inactive">Inactif</Option>
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
                                        @click="detailsSubscription(row)">Détails</Button>
                                    <Button v-if="row.status == 'active'" class="m-1" type="success" size="small"
                                        @click="modifySubscription(row)">Modifier</Button>
                                    <Button v-if="row.status == 'active'" class="m-1" type="error" size="small"
                                        @click="confirmUnsubscribe(row)" title="Désactiver cet abonnement">Désactiver</Button>
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
                        <Modal okText="Fermer" cancelText="Annuler" width="1000" :title="modifySubButton ? 'Modifier l\'abonnement' : 'Ajouter un abonnement'" v-model="addModal" :styles="{ top: '10px', marginBottom: '10px' }" class="subscription-modal">
                            <!-- Sélection de l'utilisateur -->
                            <Row v-if="!modifySubButton" :gutter="16" class="mb-6">
                                <Col span="8">
                                <label class="block text-sm font-medium text-gray-700 mb-1" for="userSelect">Sélectionner un utilisateur</label>
                                <Select 
                                    id="userSelect"
                                    v-model="user_id" 
                                    size="large" 
                                    style="width: 100%" 
                                    placeholder="Rechercher un utilisateur par email"
                                    filterable
                                >
                                    <Option v-for="user in users" :key="user.id" :value="user.id">{{ user.email }}</Option>
                                </Select>
                                </Col>
                            </Row>
                            
                            <!-- Section tarifs avec les composants de la page d'accueil -->
                            <!-- Affichage d'un message de chargement si les données ne sont pas encore disponibles -->
                            <div v-if="!subscriptions || subscriptions.length === 0" class="text-center py-6">
                                <Spin size="large" fix></Spin>
                                <p class="mt-2 text-gray-600">Chargement des forfaits d'abonnement...</p>
                            </div>
                            
                            <!-- Rendu du composant PricingSection une fois les données chargées -->
                            <!-- Utilisation du même composant que sur la page index -->
                            <PricingSection 
                                v-else
                                :subscriptions="indexFormatSubscriptions()" 
                                :title="modifySubButton ? 'Choisissez le nouveau forfait' : 'Choisissez un forfait à attribuer'"
                                :subtitle="''"
                                :description="modifySubButton ? 'Modifiez le forfait d\'abonnement de l\'utilisateur en sélectionnant une nouvelle option ci-dessous.' : 'Attribuez un forfait d\'abonnement à l\'utilisateur en sélectionnant une option ci-dessous.'"
                                @subscribe="handleSubscriptionSelection"
                                class="admin-pricing"
                            />
                        </Modal>

                        <Modal okText="Fermer" cancelText="" width="1000" title="Détails de l'abonnement" v-model="viewModel" :styles="{ top: '20px' }">
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
                                            :class="[tier.featured ? 'text-gray-400' : 'text-gray-500', 'text-base']">Statut:
                                        </span>
                                        <span
                                            :class="[tier.featured ? 'text-white' : 'text-gray-900', 'text-5xl font-semibold tracking-tight']">{{
                                                tier.status }}</span>
                                        <!-- <span :class="[tier.featured ? 'text-gray-400' : 'text-gray-500', 'text-base']">User: </span>
                            <span
                                :class="[tier.featured ? 'text-white' : 'text-gray-900', 'text-5xl font-semibold tracking-tight']">{{
                                tier.user }}</span> -->
                                        <span
                                            :class="[tier.featured ? 'text-gray-400' : 'text-gray-500', 'text-base']"><b>Utilisateur:</b>
                                            {{
                                            tier.user }}</span>
                                    </p>
                                    <p class="mt-4 flex items-baseline gap-x-2">
                                        <span
                                            :class="[tier.featured ? 'text-gray-400' : 'text-gray-500', 'text-base']"><b>Date de début:</b>
                                            {{ tier.startDate }}</span>
                                        <span
                                            :class="[tier.featured ? 'text-gray-400' : 'text-gray-500', 'text-base']"><b>Date de fin:</b> {{
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
import { CheckIcon } from '@heroicons/vue/20/solid';
import PricingSection from '@/components/sections/Pricing/PricingSection.vue';

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
                { title: "Abonné", slot: "sub_info", minWidth: 200, sortable: true },
                { title: "Forfait", slot: "sub_name", key: "name", sortable: true, minWidth: 100 },
                { title: "Prix ($)", slot: "price", key: "price", sortable: true, minWidth: 50 },
                // { title: "Durée", slot: "duration", key: "duration" },
                // { title: "Description", slot: "desc", key: "description" },
                { title: "Statut", key: "status", sortable: true, minWidth: 50 },
                // { title: "Date de début", key: "startDate", sortable: true },
                // { title: "Date de fin", key: "endDate", sortable: true },
                { title: "Action", slot: "action", minWidth: 200 },
            ],
            viewSubscription: [],
            activeSubscriptions: [],
            subscriptionHistory: [],
            subTypes: [],
            currentId: null,
            updateSubscriptionObj: {},
            userSubscriptionId: null,
            selectedSubscriptionId: null,
            subscriptions: [], // Initialiser comme un tableau vide
            modifySubButton: false,
            old_sub_id: 0,
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
                        element.features = ['25 produits', 'Jusqu\'à 10 000 abonnés', 'Analytiques avancées', 'Délai de réponse de 24 heures'];
                    }
                    else {
                        element.subType = 'month'
                        element.featured = true;
                        element.features = [
                            'Produits illimités',
                            'Abonnés illimités',
                            'Analytiques avancées',
                            'Représentant de support dédié',
                            'Automatisations de marketing',
                            'Intégrations personnalisées',
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

        // Attribution d'un abonnement à un utilisateur par l'administrateur
        // Format exactement identique à celui utilisé sur la page index
        indexFormatSubscriptions() {
            // Vérifier si this.subscriptions est un tableau valide
            if (!this.subscriptions || !Array.isArray(this.subscriptions)) {
                console.warn('indexFormatSubscriptions: this.subscriptions n\'est pas un tableau valide');
                return []; // Retourner un tableau vide pour éviter les erreurs
            }
            
            // Définir exactement les mêmes fonctionnalités que sur la page index
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
            
            // Trouver les plans spéciaux comme dans la page index
            const freePlan = this.subscriptions.find(sub => parseFloat(sub.price) === 0 || sub.name.toLowerCase().includes('free') || sub.name.toLowerCase().includes('gratuit'));
            const premiumPlan = this.subscriptions.find(sub => parseFloat(sub.price) >= 100 || sub.name.toLowerCase().includes('premium'));
            const midTierPlan = this.subscriptions.find(sub => 
                sub.id !== (freePlan?.id || -1) && 
                sub.id !== (premiumPlan?.id || -2) && 
                (parseFloat(sub.price) > 0 && parseFloat(sub.price) < 100));
            
            const result = [];
            
            // Plan gratuit
            if (freePlan) {
                result.push({
                    id: freePlan.id,
                    subscription_id: freePlan.id,
                    name: 'Forfait Gratuit',
                    description: freePlan.description || 'Le forfait parfait pour démarrer avec notre produit.',
                    monthlyPrice: 0,
                    yearlyPrice: 0,
                    features: freeFeatures,
                    featured: false,
                    type: 'month'
                });
            }
            
            // Plan intermédiaire
            if (midTierPlan) {
                result.push({
                    id: midTierPlan.id,
                    subscription_id: midTierPlan.id,
                    name: 'Forfait Intermédiaire',
                    description: midTierPlan.description || 'Support et infrastructure dédiés à votre entreprise.',
                    monthlyPrice: midTierPlan.price,
                    yearlyPrice: (midTierPlan.price * 0.8 * 12).toFixed(2), // Calcul identique à la page index
                    features: midTierFeatures,
                    featured: true, // Plan intermédiaire est mis en avant comme sur l'index
                    type: 'month'
                });
            }
            
            // Plan premium
            if (premiumPlan) {
                result.push({
                    id: premiumPlan.id,
                    subscription_id: premiumPlan.id,
                    name: 'Forfait Premium',
                    description: premiumPlan.description || 'Support et infrastructure dédiés à votre entreprise avec service premium.',
                    monthlyPrice: premiumPlan.price,
                    yearlyPrice: (premiumPlan.price * 0.8 * 12).toFixed(2), // Calcul identique à la page index
                    features: premiumFeatures,
                    featured: false,
                    type: 'month'
                });
            }
            
            // Ajouter les plans restants s'il y en a
            this.subscriptions.forEach(sub => {
                if (sub.id !== (freePlan?.id || -1) && sub.id !== (midTierPlan?.id || -2) && sub.id !== (premiumPlan?.id || -3) && !result.some(p => p.id === sub.id)) {
                    result.push({
                        id: sub.id,
                        subscription_id: sub.id,
                        name: sub.name,
                        description: sub.description || 'Forfait personnalisé',
                        monthlyPrice: sub.price,
                        yearlyPrice: (sub.price * 0.8 * 12).toFixed(2), // Calcul identique à la page index
                        features: [
                            'Fonctionnalités complètes',
                            'Support dédié',
                            'Mises à jour régulières',
                            'Services personnalisés'
                        ],
                        featured: false,
                        type: 'month'
                    });
                }
            });
            
            return result;
        },
        
        // Gestion de la sélection d'un abonnement depuis PricingSection
        // Sélectionner un plan et un type d'abonnement
        selectPlan(plan, type) {
            this.selectedSubscriptionId = plan.id;
            this.selectedPlanType = type;
            
            // Trouve l'abonnement correspondant
            const selectedSub = this.subscriptions.find(sub => sub.id === plan.id);
            if (selectedSub) {
                // Mettre à jour le type d'abonnement
                selectedSub.subType = type;
                
                console.log('Abonnement sélectionné:', {
                    id: selectedSub.id,
                    type: selectedSub.subType,
                    user_id: this.user_id
                });
                
                if (this.modifySubButton) {
                    this.updateModifySubscription(selectedSub);
                } else {
                    this.updateSubscription(selectedSub);
                }
            } else {
                console.error('Impossible de trouver l\'abonnement avec l\'ID:', plan.id);
            }
        },
        
        // Méthode pour le composant PricingSection (garde la compatibilité)
        handleSubscriptionSelection(payload) {
            console.log('Abonnement sélectionné via PricingSection:', payload);
            
            // Met à jour le type d'abonnement et la sélection
            this.selectedSubscriptionId = payload.subscription_id;
            
            // NE PAS CONVERTIR: Le backend attend 'monthly' et 'yearly'
            // Le composant SubscriptionPlan envoie déjà ces valeurs correctement
            const convertedType = payload.type;
            
            console.log('Type d\'abonnement reçu (non converti):', payload.type);
                                  
            this.selectedPlanType = convertedType;
            
            // Trouve l'abonnement correspondant
            const selectedSub = this.subscriptions.find(sub => sub.id === payload.subscription_id);
            if (selectedSub) {
                // Convertir le type de subscription du composant SubscriptionPlan au format attendu par l'API
                selectedSub.subType = convertedType; // Utilise la valeur convertie
                
                console.log('Abonnement à traiter (après conversion):', {
                    id: selectedSub.id,
                    type: selectedSub.subType, // Maintenant 'month' ou 'year'
                    user_id: this.user_id
                });
                
                if (this.modifySubButton) {
                    this.updateModifySubscription(selectedSub);
                } else {
                    this.updateSubscription(selectedSub);
                }
            } else {
                console.error('Impossible de trouver l\'abonnement avec l\'ID:', payload.subscription_id);
            }
        },
        
        // Attribuer un abonnement à un utilisateur
        async updateSubscription(tier) {
            // Si aucun utilisateur n'est sélectionné, afficher un message d'erreur
            if (!this.user_id) {
                this.$Notice.warning({
                    title: 'Utilisateur requis',
                    desc: 'Veuillez sélectionner un utilisateur avant d\'attribuer un abonnement.',
                    duration: 6
                });
                return;
            }

            // Si aucun type d'abonnement n'est sélectionné, afficher un message d'erreur
            if (!tier.subType) {
                this.$Notice.warning({
                    title: 'Type d\'abonnement requis',
                    desc: 'Veuillez sélectionner un type d\'abonnement (mensuel ou annuel).',
                    duration: 6
                });
                return;
            }
            
            // Mettre à jour la sélection visuelle
            this.selectedSubscriptionId = tier.id;
            try {
                // Assurer que les IDs sont bien des nombres
                const subscription_id = parseInt(tier.id, 10);
                const user_id = parseInt(this.user_id, 10);
                
                console.log('Envoi des données:', { subscription_id, type: tier.subType, user_id });
                
                const response = await axiosInstance.post('/api/adminSubscribe', { 
                    subscription_id, 
                    type: tier.subType, 
                    user_id 
                });

                if (response.data.success) {
                    this.$Notice.success({
                        title: 'Abonnement ajouté avec succès!',
                        desc: 'L\'utilisateur a maintenant accès à ce forfait.',
                        duration: 5
                    });
                    this.loadActiveSubscriptions();
                    this.addModal = false;
                } else {
                    this.$Notice.error({
                        title: 'L\'ajout d\'abonnement a échoué',
                        desc: response.data.message || 'Une erreur s\'est produite lors de l\'attribution de l\'abonnement. Veuillez réessayer.',
                        duration: 8
                    });
                }
            } catch (error) {
                console.error('Erreur lors de l\'ajout d\'abonnement:', error);
                
                // Messages d'erreur spécifiques selon le type d'erreur
                if (error.response && error.response.status === 401) {
                    this.$Notice.error({
                        title: 'Accès refusé',
                        desc: 'Vous devez être administrateur pour attribuer des abonnements.',
                        duration: 8
                    });
                } else if (error.response && error.response.status === 400) {
                    this.$Notice.error({
                        title: 'Données invalides',
                        desc: error.response.data?.message || 'Vérifiez les informations fournies et réessayez.',
                        duration: 8
                    });
                } else {
                    this.$Notice.error({
                        title: 'Erreur lors de l\'attribution',
                        desc: error.response?.data?.message || error.message || 'Une erreur inattendue s\'est produite.',
                        duration: 8
                    });
                }
            }
        },
        async updateModifySubscription(new_sub) {
            // Vérification améliorée pour la modification d'abonnement
            if (!new_sub.subType) {
                this.$Notice.warning({
                    title: 'Type d\'abonnement manquant',
                    desc: 'Veuillez choisir entre abonnement mensuel ou annuel pour continuer.',
                    duration: 6
                });
                return;
            }
            
            if (this.user_id <= 0) {
                this.$Notice.warning({
                    title: 'Aucun utilisateur sélectionné',
                    desc: 'Veuillez sélectionner un utilisateur avant de modifier l\'abonnement.',
                    duration: 6
                });
                return;
            }
            
            // Assurer que les IDs sont bien des nombres
            this.updateSubscriptionObj.type = new_sub.subType;
            this.updateSubscriptionObj.new_sub_id = parseInt(new_sub.id, 10);
            this.updateSubscriptionObj.user_id = parseInt(this.user_id, 10);
            
            if (!this.updateSubscriptionObj.new_sub_id || !this.updateSubscriptionObj.old_sub_id) {
                this.$Notice.info({
                    title: 'Informations d\'abonnement incomplètes',
                });
                return;
            }

            console.log('Envoi des données de modification:', this.updateSubscriptionObj);
            
            this.loading = true;
            try {
                const response = await axiosInstance.post('/api/updateSubscription', this.updateSubscriptionObj);
                
                if (response.data && response.data.success) {
                    this.$Notice.success({
                        title: 'Abonnement modifié avec succès!',
                        desc: 'Le nouvel abonnement est maintenant actif pour cet utilisateur.',
                        duration: 5
                    });
                    this.loadActiveSubscriptions();
                    this.addModal = false;
                } else {
                    this.$Notice.warning({
                        title: 'Résultat incertain',
                        desc: response.data?.message || 'La réponse du serveur n\'indique pas clairement si la modification a réussi.',
                        duration: 6
                    });
                }
            } catch (error) {
                console.error("Erreur lors de la modification de l'abonnement:", error);
                
                // Messages d'erreur spécifiques
                if (error.response && error.response.status === 404) {
                    this.$Notice.error({
                        title: 'Abonnement non trouvé',
                        desc: 'L\'abonnement que vous essayez de modifier n\'existe pas ou a déjà été désactivé.',
                        duration: 8
                    });
                } else if (error.response && error.response.status === 400) {
                    this.$Notice.error({
                        title: 'Paramètres invalides',
                        desc: error.response.data?.message || 'Les informations fournies pour la modification sont incomplètes ou invalides.',
                        duration: 8
                    });
                } else {
                    this.$Notice.error({
                        title: 'Erreur de modification',
                        desc: error.response?.data?.message || error.message || 'Une erreur s\'est produite lors de la modification de l\'abonnement.',
                        duration: 8
                    });
                }
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
                'Produits illimités',
                'Abonnés illimités',
                'Analytiques avancées',
                'Représentant de support dédié',
                'Automatisations de marketing',
                'Intégrations personnalisées',
            ];


            this.viewSubscription = [data];
        },
        async modifySubscription(item) {
            this.modifySubButton = true
            this.viewRow = item;
            this.addModal = true
            this.user_id = item.user.id
            this.currentId = item.id
            
            // Présélectionner l'abonnement actuel de l'utilisateur
            this.selectedSubscriptionId = item.subscription_id;
            
            // Présélectionner le type d'abonnement
            this.subscriptions.forEach(sub => {
                if (sub.id === item.subscription_id) {
                    sub.subType = item.type === 'monthly' ? 'month' : 'year';
                }
            });
        },

        // Reset form data
        resetForm() {
            this.form = { id: "", name: "", price: "", durationValue: "", durationUnit: "month", description: "" };
        },

        addModalOn() {
            // Charger les abonnements si nécessaire
            if (!this.subscriptions || this.subscriptions.length === 0) {
                this.fetchSubscriptions();
            }
            
            this.addModal = true;
            // Réinitialiser la sélection d'abonnement et le bouton de modification
            this.selectedSubscriptionId = null;
            this.selectedPlanType = 'month';
            this.modifySubButton = false;
            this.user_id = null;
        },
        confirmUnsubscribe(subscription) {
            this.$Modal.confirm({
                title: 'Confirmer la désactivation',
                content: `Êtes-vous sûr de vouloir désactiver l'abonnement de <strong>${subscription.user.email}</strong>?<br>Cette action est irréversible.`,
                okText: 'Oui, désactiver',
                cancelText: 'Annuler',
                onOk: () => {
                    this.unsubscribe(subscription);
                }
            });
        },
        async unsubscribe(subscription) {
            try {
                const response = await axiosInstance.post('/api/unsubscribe', {
                    subscription_id: subscription.id
                });
                if (response.data.success) {
                    this.$Notice.success({
                        title: 'Abonnement désactivé',
                        desc: 'L\'abonnement a été désactivé avec succès.',
                        duration: 5
                    });
                    this.loadActiveSubscriptions();
                }
            } catch (error) {
                console.error('Erreur lors de la désactivation:', error);
                this.$Notice.error({
                    title: 'Erreur de désactivation',
                    desc: error.response?.data?.message || error.message || 'Une erreur s\'est produite lors de la désactivation de l\'abonnement.',
                    duration: 8
                });
            }
        },
    },
    mounted() {
        // Charger les données quand le composant est monté
        this.loadActiveSubscriptions();
        this.fetchUsers();
        this.fetchSubscriptions();
        
        // Style personnalisé pour les modals de confirmation
        document.head.insertAdjacentHTML('beforeend', `
            <style>
            .ivu-modal-confirm-head-icon-confirm .ivu-icon {
                color: #f8bb86;
            }
            .ivu-modal-confirm-footer button + button {
                margin-left: 10px;
            }
            </style>
        `);
    },
};
</script>

<style scoped>
/* Réduire l'espace en haut de la modal pour afficher plus de contenu */
.user-subscription-modal {
  top: 10px;
}
</style>