<script setup lang="ts">
import { type Option } from "ts-shared";
import type { APIView } from "~/features/harry-potter";
import type { FetcherError } from "~/shared/error/fetcher";
import { Error } from "~/components/layout";
import { Card } from "~/components/layout";

const props = defineProps<{
    characterList: Option<Array<APIView>>;
    isLoading: boolean;
    error: Option<FetcherError>;
    title: string;
}>();
</script>

<template>
    <main>
        <h1 class="title">{{ props.title }}</h1>

        <Error
            v-if="props.error.isSome"
            :errorMessage="props.error.value.message"
        />
        <p v-else-if="props.isLoading">loading...</p>
        <Error
            v-else-if="props.characterList.isNone"
            error-message="データがありません"
        />
        <div v-else class="grid-box">
            <Card
                v-for="character in props.characterList.value"
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
