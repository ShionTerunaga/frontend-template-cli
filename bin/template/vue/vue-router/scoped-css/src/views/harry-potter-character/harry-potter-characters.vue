<script setup lang="ts">
import { useGetCharacters } from '@/features/harry-potter'
import { ja } from '../../shared/lang/ja'
import Card from '@/components/layout/card/card.vue'

const { isLoading, characters, error } = useGetCharacters()
</script>

<template>
  <main>
    <h1 class="title">{{ ja.app.harryPotter.title }}</h1>

    <p v-if="isLoading">Loading...</p>
    <p v-else-if="error.isSome">Error: {{ error.value.message }}</p>

    <div v-else-if="characters.isSome" class="grid-box">
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

<style scoped>
.grid-box {
  display: grid;
  justify-items: center;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.title {
  font-size: 24px;
  text-align: center;
}
</style>
