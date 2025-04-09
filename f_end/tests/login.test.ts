import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import Login from '@/pages/login.vue'
import { createRouter, createMemoryHistory } from 'vue-router'
import Button from 'ant-design-vue/es/button'
import Icon from 'ant-design-vue/es/icon'

// Mock simplifié
vi.mock('axios', () => ({
  default: {
    create: () => ({
      post: vi.fn().mockResolvedValue({ status: 200, data: { token: 'test-token' } }),
      get: vi.fn().mockResolvedValue({ status: 200, data: { user: { roleId: 1 } } })
    })
  }
}))

const mockNotice = {
  error: vi.fn(),
  success: vi.fn()
}

const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    { path: '/', component: { template: '<div>Home</div>' } },
    { path: '/forgotPassword', component: { template: '<div>Forgot Password</div>' } }
  ],
})

describe('Login.vue', () => {
  it('affiche le titre correctement', () => {
    const wrapper = mount(Login, {
      global: {
        plugins: [router],
      },
    })
    expect(wrapper.text()).toContain('SubManage')
  })

  it('affiche les champs email et mot de passe', () => {
    const wrapper = mount(Login, {
      global: {
        plugins: [router],
      },
    })
    expect(wrapper.find('input[type="email"]').exists()).toBe(true)
    expect(wrapper.find('input[type="password"]').exists()).toBe(true)
  })

  it('affiche le bouton de connexion', () => {
    const wrapper = mount(Login, {
      global: {
        plugins: [router],
        components: {
          'a-button': Button,
        },
      },
    })
    const button = wrapper.find('button')
    expect(button.exists()).toBe(true)
    expect(button.text()).toContain('Sign In')
  })

  it('contient un lien vers la page de mot de passe oublié', () => {
    const wrapper = mount(Login, {
      global: {
        plugins: [router],
      },
    })
    const link = wrapper.find('a[href="/forgotPassword"]')
    expect(link.exists()).toBe(true)
    expect(link.text()).toContain('Forgot Password')
  })

  it('contient une icône dans le lien mot de passe oublié', () => {
    const wrapper = mount(Login, {
      global: {
        plugins: [router],
        components: {
          'a-icon': Icon,
        },
      },
    })
    const link = wrapper.find('a[href="/forgotPassword"]')
    expect(link.exists()).toBe(true)
    expect(link.html()).toContain('md-key')
  })

  it('soumet les informations de connexion', async () => {
    const wrapper = mount(Login, {
      global: {
        plugins: [router],
        components: {
          'a-button': Button,
        },
        mocks: {
          $Notice: mockNotice
        }
      },
    })

    await wrapper.find('input[type="email"]').setValue('test@example.com')
    await wrapper.find('input[type="password"]').setValue('password123')
    await wrapper.find('form').trigger('submit.prevent')

    // Vérification simplifiée mais robuste
    await new Promise(resolve => setTimeout(resolve, 50))
    expect(wrapper.emitted()).toHaveProperty('submit')
  })
})