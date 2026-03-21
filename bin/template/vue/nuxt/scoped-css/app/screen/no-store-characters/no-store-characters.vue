<script setup lang="ts">
import { CharacterList } from "~/components/view";
import { getCharacter } from "~/features/harry-potter";
import { ja } from "~/shared/lang/ja";

const { createNone, createSome } = optionUtility;

const characterList = await getCharacter("no-store");
const value = characterList.isOk ? characterList.value : createNone();
const error = characterList.isErr
    ? createSome(characterList.err)
    : createNone();
</script>

<template>
    <CharacterList
        :title="ja.app.noStoreCharacter.title"
        :characterList="value"
        :error="error"
        :isLoading="false"
    />
</template>
