<template>

  <MainLayout v-if="logado" />
  <Login v-if="!logado" />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import MainLayout from './layouts/MainLayout.vue'
import Login from './layouts/Login.vue';
const logado = ref(false);
</script>

<style lang="scss">
.title-pag {
  font-size: 26px;
  color: #434343;
  font-weight: 600!important;
}

.breadcrumb {
  color: #535353;
  font-size: 15px;
}

.page-active {
  color: #d31b27d7;
}
</style>