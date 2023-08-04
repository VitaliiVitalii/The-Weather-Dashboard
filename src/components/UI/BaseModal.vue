<template>
    <Teleport to="body">
        <div v-show="modalActive" class="modal">
            <div class="modal__wrapper" >
                <slot>
                    
                </slot>
            </div>
        </div>
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

