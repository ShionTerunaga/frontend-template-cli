<script setup lang="ts">
import { CharacterList } from "~/components/view";
import { getCharacter } from "~/features/harry-potter";
import { ja } from "~/shared/lang/ja";
import { optionUtility } from "ts-shared";

const { createNone, createSome } = optionUtility;

const characterList = await getCharacter("force-cache");

const value = characterList.isOk ? characterList.value : createNone();
const error = characterList.isErr
    ? createSome(characterList.err)
    : createNone();
</script>

<template>
    <CharacterList
        :title="ja.app.forceCacheCharacter.title"
        :characterList="value"
        :error="error"
        :isLoading="false"
    />
</template>
