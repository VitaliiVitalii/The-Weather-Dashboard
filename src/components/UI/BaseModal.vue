<template>
    <Teleport to="body">
        <Transition>
            <div v-show="modalActive" class="modal">
                <div class="modal__wrapper" >
                    <slot>
            
                    </slot>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup>
defineProps({
    modalActive: {
        type: Boolean,
        default: false,

    }
    
})

</script>

<style scoped>
    .v-enter-active,
    .v-leave-active {
        transition: opacity 0.5s ease;
    }
    .v-enter-from,
    .v-leave-to {
    opacity: 0;
    }
</style>

