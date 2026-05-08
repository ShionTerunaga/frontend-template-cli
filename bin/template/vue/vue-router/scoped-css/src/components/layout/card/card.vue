<script setup lang="ts">
import type { CSSProperties } from 'vue'

const { title, src, alt, boxHeight, srcWidth, srcHeight } = defineProps<{
  title: string
  src: string
  alt: string
  boxHeight: number
  srcWidth: number
  srcHeight: number
}>()

const boxStyle: CSSProperties = {
  height: `${boxHeight}px`,
  width: `${srcWidth}px`,
}
</script>

<template>
  <div class="card-container" :style="boxStyle">
    <img class="image" :src="src" :alt="alt" :width="srcWidth" :height="srcHeight" />
    <p class="title">{{ title }}</p>
  </div>
</template>

<style scoped>
.card-container {
  border: 1px solid #ccc;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgb(0 0 0 / 10%);
  text-align: center;
  margin: 1rem;
}

.image {
  object-fit: cover;
}

.title {
  padding: 1rem;
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
  margin: 0;
}
</style>
