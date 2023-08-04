<template>
    <div class="grows">
        <Suspense>
            <AsyncCityView/>
            <template  #fallback >
                <BaseLoading/>
            </template>
        </Suspense>
    </div>
</template>

<script setup>
    import AsyncCityView from '../components/AsyncCityView.vue';
import BaseLoading from '../components/UI/BaseLoading.vue';


</script>

<style lang="scss">

</style>

