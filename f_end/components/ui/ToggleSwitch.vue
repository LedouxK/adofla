<template>
    <div class="toggle-container">
      <button 
        @click="$emit('update:modelValue', options[0].value)" 
        :class="modelValue === options[0].value ? 'toggle-option toggle-option--active' : 'toggle-option toggle-option--inactive'"
      >
        {{ options[0].label }}
      </button>
      <button 
        @click="$emit('update:modelValue', options[1].value)" 
        :class="modelValue === options[1].value ? 'toggle-option toggle-option--active' : 'toggle-option toggle-option--inactive'"
      >
        {{ options[1].label }}
      </button>
    </div>
  </template>
  
  <script>
  export default {
    name: 'ToggleSwitch',
    props: {
      modelValue: {
        type: String,
        required: true
      },
      options: {
        type: Array,
        default: () => [
          { label: 'Monthly', value: 'month' },
          { label: 'Annually', value: 'year' }
        ],
        validator: options => options.length === 2
      }
    },
    emits: ['update:modelValue']
  }
  </script>