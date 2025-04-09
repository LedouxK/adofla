import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, VueWrapper } from '@vue/test-utils';
import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '@/pages/index.vue';
import UserAvatar from '@/components/ui/UserAvatar.vue';
import AppButton from '@/components/ui/AppButton.vue';
import FeatureCard from '@/components/cards/FeatureCard.vue';
import StepCard from '@/components/cards/StepCard.vue';
import TestimonialCard from '@/components/cards/TestimonialCard.vue';

// Mocks
vi.mock('@/utils/axios', () => ({
  default: {
    get: vi.fn(() => Promise.resolve({ data: [] }))
  }
}));

vi.mock('@/utils/auth', () => ({
  log_out: vi.fn()
}));

// Mock des composants
vi.mock('@/components/ui/UserAvatar.vue', () => ({
  default: {
    template: '<div class="user-avatar-mock"></div>',
    props: ['imagePath']
  }
}));

vi.mock('@/components/ui/AppButton.vue', () => ({
  default: {
    template: '<button class="app-button-mock"></button>',
    props: ['variant', 'className']
  }
}));

vi.mock('@/components/cards/FeatureCard.vue', () => ({
  default: {
    template: '<div class="feature-card-mock"></div>',
    props: ['icon', 'title', 'description']
  }
}));

vi.mock('@/components/cards/StepCard.vue', () => ({
  default: {
    template: '<div class="step-card-mock"></div>',
    props: ['number', 'title', 'description']
  }
}));

vi.mock('@/components/cards/TestimonialCard.vue', () => ({
  default: {
    template: '<div class="testimonial-card-mock"></div>',
    props: ['quote', 'author', 'role']
  }
}));

// Mock de $Notice
const mockNotice = {
  info: vi.fn(),
  success: vi.fn(),
  error: vi.fn()
};

// Configuration du router
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: HomePage },
    { path: '/profile', component: { template: '<div>Profile</div>' } }
  ]
});

describe('HomePage', () => {
  let wrapper: VueWrapper<any>;
  
  beforeEach(() => {
    wrapper = mount(HomePage, {
      global: {
        plugins: [router],
        mocks: {
          $Notice: mockNotice,
          $router: {
            push: vi.fn()
          }
        },
        provide: {
          profile: {
            pPic: 'default.jpg'
          }
        }
      }
    });
  });

  describe('Rendu initial', () => {
    it('affiche correctement le header avec le logo et le user avatar', () => {
      expect(wrapper.find('header').exists()).toBe(true);
      expect(wrapper.find('img[alt="Logo FlapiCMS"]').exists()).toBe(true);
      expect(wrapper.find('.user-avatar-mock').exists()).toBe(true);
    });
  });
});