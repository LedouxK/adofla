<template>
  <Teleport to="body">
    <div v-if="modelValue" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex min-h-screen items-center justify-center p-4 text-center">
        <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity" @click="handleClickOutside"></div>

        <div class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all w-full" :style="{ maxWidth: width + 'px', ...styles }">
          <!-- Header -->
          <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-medium text-gray-900">{{ title }}</h3>
            <button @click="close" class="text-gray-400 hover:text-gray-600 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Content -->
          <div class="p-6">
            <slot></slot>
          </div>

          <!-- Footer -->
          <div v-if="!footerHide" class="px-6 py-4 border-t border-gray-200 flex justify-end space-x-2">
            <slot name="footer">
              <button 
                v-if="cancelText" 
                @click="close" 
                class="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                {{ cancelText }}
              </button>
              <button 
                v-if="okText" 
                @click="handleOkClick" 
                class="px-4 py-2 bg-indigo-600 border border-transparent rounded-md text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                {{ okText }}
              </button>
            </slot>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script>
export default {
  name: 'BaseModal',
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    width: {
      type: [Number, String],
      default: 520
    },
    okText: {
      type: String,
      default: 'OK'
    },
    cancelText: {
      type: String,
      default: 'Annuler'
    },
    footerHide: {
      type: Boolean,
      default: false
    },
    styles: {
      type: Object,
      default: () => ({})
    },
    closeOnClickOutside: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    close() {
      this.$emit('update:modelValue', false);
      this.$emit('cancel');
    },
    handleOkClick() {
      this.$emit('ok');
    },
    handleClickOutside() {
      if (this.closeOnClickOutside) {
        this.close();
      }
    }
  }
};
</script>
