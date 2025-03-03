<script setup lang="ts">
import AppSidebar from "@/composables/AppSidebar.vue";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useDatabase } from "~/composables/useDatabase";

onMounted(async () => {
  await useDatabase(); // Initialize the database when the app loads
});
</script>

<template>
  <SidebarProvider>
    <AppSidebar />
    <main>
      <SidebarTrigger />
      <NuxtPage />
    </main>
  </SidebarProvider>
</template>
