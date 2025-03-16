<template>
    <button 
      :class="[
        'btn-action', 
        variant === 'primary' ? 'btn-primary' : 'btn-secondary',
        className
      ]" 
      @click="$emit('click')"
      :type="type"
    >
      <slot></slot>
    </button>
  </template>
  
  <script>
  export default {
    name: 'AppButton',
    props: {
      variant: {
        type: String,
        default: 'primary',
        validator: value => ['primary', 'secondary'].includes(value)
      },
      type: {
        type: String,
        default: 'button'
      },
      className: {
        type: String,
        default: ''
      }
    },
    emits: ['click']
  }
  </script>
  
  <style scoped>
  .btn-action {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.75rem 1.5rem;
    font-weight: 600;
    border-radius: 0.375rem;
    transition: all 0.2s;
    cursor: pointer;
    font-size: 0.875rem;
  }
  
  .btn-primary {
    background-color: #7B68EE;
    color: white;
    border: none;
  }
  
  .btn-primary:hover {
    background-color: #6A5ACD;
  }
  
  .btn-secondary {
    background-color: white;
    color: #7B68EE;
    border: 1px solid #7B68EE;
  }
  
  .btn-secondary:hover {
    background-color: #F9F9FF;
  }
  </style>