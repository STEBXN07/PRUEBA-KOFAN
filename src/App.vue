<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

// Verificar si el token guardado sigue siendo valido al iniciar la app
onMounted(async () => {
  await authStore.checkSession()
})
</script>

<template>
  <router-view />
</template>

<style>
html, body, #app {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  overflow-x: hidden;
}
</style>
