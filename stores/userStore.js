import { defineStore } from "pinia";
import { useDatabase } from "../composables/useDatabase";

export const useUserStore = defineStore("userStore", () => {
  const users = ref([]);
  let db;

  async function loadUsers() {
    db = await useDatabase();
    users.value = await db.select("SELECT * FROM users");
  }

  async function addUser(name, income, saving) {
    await db.execute(
      "INSERT INTO users (name, income, saving) VALUES (?, ?, ?)",
      [name, income, saving]
    );
    await loadUsers(); // Refresh user list
  }

  return { users, loadUsers, addUser };
});
