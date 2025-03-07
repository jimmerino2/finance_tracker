<script setup>
import {
  ArrowLeftRight,
  NotepadText,
  ChartBarBig,
  Settings,
} from "lucide-vue-next";
import { useDatabase } from "../composables/useDatabase";
import { useUserStore } from "../stores/userStore";

// Menu items.
const items = [
  {
    title: "Pages",
    content: [
      {
        title: "Dashboard",
        url: "/",
        icon: ChartBarBig,
      },
      {
        title: "Plans",
        url: "/plan",
        icon: NotepadText,
      },
      {
        title: "Transactions",
        url: "/transactions",
        icon: ArrowLeftRight,
      },
    ],
  },
  {
    title: "Profile",
    content: [
      {
        title: "Settings",
        url: "#",
        icon: Settings,
      },
    ],
  },
];

// Session Management
const userStore = useUserStore();
const selectedUser = ref();
let db;
onMounted(async () => {
  await userStore.loadUsers();

  // Get session user
  const sessionUser = localStorage.getItem("session_user");
  if (sessionUser && sessionUser !== "undefined") {
    const parsedUser = JSON.parse(sessionUser);
    selectedUser.value = parsedUser.id;
  }
});

async function selectUser(value) {
  db = await useDatabase();

  // Logout Previous
  await db.execute("DELETE FROM sessions");
  localStorage.removeItem("session_user");

  // Log In
  await db.execute("INSERT INTO sessions (user_id) VALUES (?)", [value]);
  const user = await db.select("SELECT * FROM users WHERE id = ?", [value]);
  localStorage.setItem("session_user", JSON.stringify(user[0]));
}
</script>

<template>
  <Sidebar>
    <!-- Header -->
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <Select
            class="w-full"
            @update:modelValue="selectUser"
            v-model="selectedUser"
          >
            <SelectTrigger>
              <SelectValue placeholder="Select an Account" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem v-for="user in userStore.users" :value="user.id">
                  {{ user.name }}
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>

    <!-- Content -->
    <SidebarContent>
      <SidebarGroup v-for="item in items" :key="item.title">
        <SidebarGroupLabel>{{ item.title }}</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem
              v-for="content in item.content"
              :key="content.title"
            >
              <SidebarMenuButton asChild>
                <NuxtLink :to="content.url">
                  <component :is="content.icon" />
                  <span>{{ content.title }}</span>
                </NuxtLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>

    <!-- Footer -->
    <SidebarFooter>
      <SidebarMenu>
        <SidebarMenuItem> </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  </Sidebar>
</template>
