<script setup>
import { useDatabase } from "../composables/useDatabase";
const inputs = [
  {
    label: "name",
    type: "text",
  },
  {
    label: "description",
    type: "text",
  },
  {
    label: "budget",
    type: "number",
  },
];

const db = await useDatabase();
const formData = ref([]);
async function submitForm(event) {
  event.preventDefault(); // ✅ Prevent page refresh

  try {
    await db.execute(
      `INSERT INTO category (name, description, budget, userID) VALUES (?, ?, ?, 1)`,
      [formData.value.name, formData.value.description, formData.value.budget]
    );

    console.log("✅ Data inserted successfully!");
  } catch (error) {
    console.error("❌ Error inserting data:", error);
  }
}
</script>

<template>
  <NuxtLink to="/">
    <Button>To Dashboard</Button>
  </NuxtLink>

  <form @submit="submitForm">
    <div class="m-2" v-for="items in inputs">
      <label for="name">{{ items.label }}</label>
      <input
        :type="items.type"
        :id="items.label"
        v-model="formData[items.label]"
        class="border border-gray-300 mx-2"
      />
    </div>

    <Button>Submit</Button>
  </form>
</template>
