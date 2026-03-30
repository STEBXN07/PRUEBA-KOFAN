<template>
  <div class="public-layout">
    <TheNarvar /> <main>
      <router-view /> </main>
    
    <Footer /> </div>
</template>

<script setup>
import TheNarvar from '@/components/TheNarvar.vue'
import Footer from '@/components/Footer.vue'
</script>