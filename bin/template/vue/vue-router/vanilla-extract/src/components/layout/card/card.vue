<script setup lang="ts">
import type { CSSProperties } from 'vue'
import cardStyle from './card.css'

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
  <div :class="cardStyle.cardContainer" :style="boxStyle">
    <img :class="cardStyle.image" :src="src" :alt="alt" :width="srcWidth" :height="srcHeight" />
    <p :class="cardStyle.title">{{ title }}</p>
  </div>
</template>
