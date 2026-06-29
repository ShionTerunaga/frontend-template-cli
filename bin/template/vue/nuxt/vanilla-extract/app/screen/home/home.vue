<template>
    <section>
        <h1>{{ ja.app.home.title }}</h1>

        <NuxtLink to="/force-cache-characters">
            {{ ja.app.home.toForceCacheHarryPotterLink }}
        </NuxtLink>
        <br />
        <NuxtLink to="/no-store-characters">
            {{ ja.app.home.toNoStoreHarryPotterLink }}
        </NuxtLink>
        <br />
        <NuxtLink to="/dynamic-characters">
            {{ ja.app.home.toDynamicHaryyPotterLink }}
        </NuxtLink>
    </section>
</template>

<script setup lang="ts">
import { ja } from "~/shared/lang/ja";
</script>
