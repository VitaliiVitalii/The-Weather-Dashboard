<template>
  <div class="wrapper flex">
    <the-header></the-header>
    <router-view v-slot="{Component}">
      <transition name="page" >
        <component :is="Component" />
      </transition>
    </router-view>
    <the-footer></the-footer>
  </div>
</template>

<script setup>
import TheFooter from './components/layout/TheFooter.vue';
import TheHeader from './components/layout/theHeader.vue';

</script>

<style lang="scss">
@import './assets/scss/style.scss';

</style>