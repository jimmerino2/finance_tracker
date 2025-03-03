<script setup>
import { useDatabase } from "~/composables/useDatabase";

const select = async () => {
  const db = await useDatabase();
};
</script>

<template>
  Hello World
  <Button @click="select"></Button>
</template>
