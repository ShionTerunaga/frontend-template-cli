<script setup lang="ts">
import { useGetCharacters } from '@/features/harry-potter'
import { ja } from '../../shared/lang/ja'
import { gridBoxBaseStyles, titleStyles } from './harry-potter-characters.css'
import Card from '@/components/layout/card/card.vue'

const { isLoading, characters, error } = useGetCharacters()
</script>

<template>
  <main>
    <h1 :class="titleStyles">{{ ja.app.harryPotter.title }}</h1>

    <p v-if="isLoading">Loading...</p>
    <p v-else-if="error.isSome">Error: {{ error.value.message }}</p>

    <div v-else-if="characters.isSome" :class="gridBoxBaseStyles">
      <Card
        v-for="character in characters.value"
        :key="character.id"
        :title="character.name"
        :src="character.image"
        :alt="character.name"
        :boxHeight="300"
        :srcWidth="150"
        :srcHeight="200"
      />
    </div>
  </main>
</template>
