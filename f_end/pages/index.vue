<template>
  <div>
    <header>
      <div class="header__container">
        <Dropdown>
        <Button class="circle-button" type="primary">
          <img :src="`/uploads/profile/${profile.pPic}`" alt="User Avatar" class="user-avatar" />
        </Button>
        <template #list>
            <DropdownMenu>
                <DropdownItem @click="goToProfile">Profile</DropdownItem>
                <DropdownItem @click="log_out()">Logout</DropdownItem>
            </DropdownMenu>
        </template>
    </Dropdown>
      </div>
    </header>

   <div>
<!-- LOGO ET NOM DE L'APPLICATION -->
<div class="app-header mx-auto text-center flex flex-col items-center justify-center space-y-4 mb-10">
  <img src="@/public/assets/media/logos/Flapi_logo.png" alt="FlapiCMS Logo" class="h-28" />
  <span class="text-black font-extrabold text-5xl">FlapiCMS</span>
</div>

<!-- Section Pricing -->
<div class="absolute inset-x-0 -top-3 -z-10 transform-gpu overflow-hidden px-36 blur-3xl mb-10" aria-hidden="true">
  <div class="mx-auto aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30" style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"></div>
</div>

<div class="mx-auto max-w-4xl text-center">
  <h2 class="text-lg font-semibold text-indigo-600">Pricing</h2>
  <p class="mt-4 text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">Choose the right plan for you</p>
</div>

    <p class="mx-auto mt-6 max-w-2xl text-pretty text-center text-lg font-medium text-gray-600 sm:text-xl/8">Choose an affordable plan that’s packed with the best features for engaging your audience, creating customer loyalty, and driving sales.</p>
    
    <div class="mx-auto mt-16 mb-16 grid max-w-lg grid-cols-1 items-center gap-y-6 sm:mt-20 sm:gap-y-0 lg:max-w-4xl lg:grid-cols-3">
      <div v-for="(tier, tierIdx) in subscriptions" :key="tier.id" :class="[tier.featured ? 'relative bg-gray-900 shadow-2xl' : 'bg-white/60 sm:mx-8 lg:mx-0', tier.featured ? '' : tierIdx === 0 ? 'rounded-t-3xl sm:rounded-b-none lg:rounded-bl-3xl lg:rounded-tr-none' : 'sm:rounded-t-none lg:rounded-bl-none lg:rounded-tr-3xl', 'rounded-3xl p-8 ring-1 ring-gray-900/10 sm:p-10']">
        <h3 :id="tier.id" :class="[tier.featured ? 'text-indigo-400' : 'text-indigo-600', 'text-base/7 font-semibold']">{{ tier.name }}</h3>
        <p class="mt-4 flex items-baseline gap-x-2">
          <span :class="[tier.featured ? 'text-white' : 'text-gray-900', 'text-5xl font-semibold tracking-tight']">${{ tier.price }}</span>
        </p>
        <p :class="[tier.featured ? 'text-gray-300' : 'text-gray-600', 'mt-6 text-base/7']">{{ tier.description }}</p>
        <ul role="list" :class="[tier.featured ? 'text-gray-300' : 'text-gray-600', 'mt-8 space-y-3 text-sm/6 sm:mt-10']">
          <li v-for="feature in tier.features" :key="feature" class="flex gap-x-3">
            <CheckIcon :class="[tier.featured ? 'text-indigo-400' : 'text-indigo-600', 'h-6 w-5 flex-none']" aria-hidden="true" />
            {{ feature }}
          </li>
        </ul>
         <div class="toggle-button">
            <button @click="tier.subType = 'month'" :class="tier.subType == 'month' ? 'toggle-option active' : 'toggle-option'">Monthly</button>
            <button @click="tier.subType = 'year'" :class="tier.subType == 'year' ? 'toggle-option active' : 'toggle-option'">Annually</button>
          </div>
        <a @click="subscribeToPlan(tier)" :class="[tier.featured ? 'bg-indigo-500 text-white shadow-sm hover:bg-indigo-400 focus-visible:outline-indigo-500' : 'text-indigo-600 ring-1 ring-inset ring-indigo-200 hover:ring-indigo-300 focus-visible:outline-indigo-600', 'mt-8 block rounded-md px-3.5 py-2.5 text-center text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:mt-10']">Get started today</a>
      </div>
    </div>
  </div>
  </div>
</template>

<script setup>
import { CheckIcon } from '@heroicons/vue/20/solid'

</script>
<script>
import axiosInstance from '@/utils/axios';

export default {
  data() {
    return {
      subscriptions: [],
      showDropdown: false,
      tiers: [
        {
          name: 'Hobby',
          id: 'tier-hobby',
          href: '#',
          priceMonthly: '$29',
          description: "The perfect plan if you're just getting started with our product.",
          features: ['25 products', 'Up to 10,000 subscribers', 'Advanced analytics', '24-hour support response time'],
          featured: false,
        },
        {
          name: 'Enterprise',
          id: 'tier-enterprise',
          href: '#',
          priceMonthly: '$99',
          description: 'Dedicated support and infrastructure for your company.',
          features: [
            'Unlimited products',
            'Unlimited subscribers',
            'Advanced analytics',
            'Dedicated support representative',
            'Marketing automations',
            'Custom integrations',
          ],
          featured: true,
        },
      ],

      profile: {
                name: "",
                pPic: "default.jpg",
                role: "",
                about: ""
            }
    };
  },
  methods: {
    async fetchSubscriptions() {
      try {
        const response = await axiosInstance.get('/api/subscriptions');
        this.subscriptions = response.data;
        this.subscriptions.forEach((element, index) => {
          if (index % 2 === 0) {
            element.featured = false;
            element.features = ['25 products', 'Up to 10,000 subscribers', 'Advanced analytics', '24-hour support response time'];
            element.subType = 'month'
          } else {
            element.featured = true;
            element.features = [
              'Unlimited products',
              'Unlimited subscribers',
              'Advanced analytics',
              'Dedicated support representative',
              'Marketing automations',
              'Custom integrations',
            ];
            element.subType = 'month'
          }
        });
      } catch (error) {
        console.error('Error fetching subscriptions:', error);
        if (error.response && error.response.status === 401) {
          this.$router.push('/login');
        }
      }
    },
    toggleDropdown() {
      this.showDropdown = !this.showDropdown;
    },
    goToProfile() {
      this.$router.push('/profile');
    },
    async loadProfileInfo() {
            const res = await uploadProfileInformation()
            if (res.status === 200) {
                    this.profile = res.data;
                }
        },
    // logOut() {
    //   localStorage.removeItem('authToken');
    //   window.location.reload(true);
    // },
    async subscribeToPlan(plan) {
      if (!plan.subType) {
        this.$Notice.info({
          title: 'Select Type!',
          // desc: 'Choose a type to proceed.',
        });
        return;
      }
      try {
        const response = await axiosInstance.post('/api/subscribe', {
          subscription_id: plan.id,
          type: plan.subType,
        });

        if (response.data.success) {
          // alert('Subscription successful!');
          this.$Notice.success({
          title: 'Subscription successful!',
          // desc: 'Choose a type to proceed.',
        });
        } else {
          this.$Notice.error({
          title: response.data.message ? response.data.message : 'Subscription failed. Please try again.',
          // desc: 'Choose a type to proceed.',
        });
          // alert(response.data.message ? response.data.message : 'Subscription failed. Please try again.');
        }
      } catch (error) {
        console.error('Error subscribing to plan:', error);
        alert('An error occurred while processing your subscription.');
      }
    },
  },
  mounted() {
    this.loadProfileInfo();
    this.fetchSubscriptions();
  },
};
</script>


<style scoped>
@import '@/assets/subscription/style.css';

.header__container {
  display: flex;
  justify-content: flex-end;
  padding: 10px;
  position: relative;
}

.circle-button {
  width: 65px;
    height: 65px;
    border-radius: 50%;
    border: 5px solid black;
    background-color: #f0f0f0;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    padding: 2px;
    margin: 25px 80px 0px 0px;
}

.user-avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}

.dropdown {
  position: absolute;
  top: 50px;
  right: 0;
  background-color: white;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow: hidden;
}

.dropdown__menu {
  list-style: none;
  margin: 0;
  padding: 0;
}

.dropdown__menu li {
  padding: 10px 20px;
  cursor: pointer;
  text-align: left;
  transition: background-color 0.2s ease-in-out;
}

.dropdown__menu li:hover {
  background-color: #f5f5f5;
}


</style>