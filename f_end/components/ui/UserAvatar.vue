<template>
    <Dropdown>
      <Button class="circle-button ml-4" type="primary">
        <img :src="imagePath" alt="Avatar utilisateur" class="user-avatar" />
      </Button>
      <template #list>
        <DropdownMenu>
          <DropdownItem @click="$emit('profile')">Profil</DropdownItem>
          <DropdownItem @click="$emit('logout')">Déconnexion</DropdownItem>
        </DropdownMenu>
      </template>
    </Dropdown>
  </template>
  
  <script>
  export default {
    name: 'UserAvatar',
    props: {
      imagePath: {
        type: String,
        required: true
      }
    },
    emits: ['profile', 'logout']
  }
  </script>
  
  <style scoped>
  .circle-button {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    padding: 0;
    background-color: #7B68EE;
    border-color: #7B68EE;
  }
  
  .user-avatar {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  </style>