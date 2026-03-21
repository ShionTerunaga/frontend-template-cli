<script setup lang="ts">
const props = defineProps<{
    errorMessage: string;
}>();
</script>

<template>
    <p>Error:{{ props.errorMessage }}</p>
</template>
