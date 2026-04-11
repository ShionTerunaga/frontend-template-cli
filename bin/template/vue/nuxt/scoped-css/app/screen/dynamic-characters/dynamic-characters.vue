<script setup lang="ts">
import { CharacterList } from "~/components/view";
import { useGetCharacters } from "~/features/harry-potter";
import { ja } from "~/shared/lang/ja";
const { isLoading, error, characters } = useGetCharacters();
</script>

<template>
    <CharacterList
        :title="ja.app.dynamicCharacter.title"
        :characterList="characters"
        :error="error"
        :isLoading="isLoading"
    />
</template>
