<script setup lang="ts">
import AppSidebar from "@/composables/AppSidebar.vue";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
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
