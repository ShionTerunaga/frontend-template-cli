<script setup lang="ts">
import { CharacterList } from "~/components/view";
import { isErr } from 'ts-utility-kit/result'
import { getCharacter } from "~/features/harry-potter";
import type { APIView } from "~/features/harry-potter";
import { ja } from "~/shared/lang/ja";
import { createNone, createSome } from 'ts-utility-kit/option'
import type { Option } from 'ts-utility-kit/option'
import type { FetcherError } from "~/shared/error/fetcher";

const characterList = await getCharacter("force-cache");

const value: Option<Array<APIView>> = isErr(characterList) ? createNone() : characterList.value;
const error: Option<FetcherError> = isErr(characterList) ? createSome<FetcherError>(characterList.err) : createNone();
</script>

<template>
    <CharacterList
        :title="ja.app.forceCacheCharacter.title"
        :characterList="value"
        :error="error"
        :isLoading="false"
    />
</template>
