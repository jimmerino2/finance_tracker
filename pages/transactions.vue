<script setup>
import { useDatabase } from "../composables/useDatabase";
const db = await useDatabase();

const data = ref([]);
data.value = await db.select(`SELECT * FROM transactions`);

let categories = [];
const categoryData = await db.select(`SELECT name FROM category`);
categoryData.forEach((element) => {
  categories.push(element.name);
});

const inputs = [
  { label: "description", type: "text" },
  { label: "amount", type: "number" },
  { label: "isFixed", type: "select", options: [true, false] },
  { label: "category", type: "select", options: categories },
];
const formData = ref({
  description: "",
  amount: 0,
  isFixed: false,
  category: "",
});

async function submitForm(event) {
  event.preventDefault();

  try {
    console.log(formData.value);
    await db.execute(
      `INSERT INTO transactions (description, amount, isFixed, category) VALUES (?, ?, ?, ?)`,
      [
        formData.value.description,
        formData.value.amount,
        formData.value.isFixed,
        formData.value.category,
      ]
    );

    console.log("✅ Data inserted successfully!");
    data.value = await db.select(`SELECT * FROM transactions`);
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
        v-if="items.type == 'text' || items.type == 'number'"
        :type="items.type"
        :id="items.label"
        v-model="formData[items.label]"
        class="border border-gray-300 mx-2"
      />

      <select
        v-else-if="items.type == 'select'"
        v-model="formData[items.label]"
        class="w-32 border border-gray-300 mx-2"
      >
        <option
          v-for="(option, index) in items.options"
          :key="index"
          :value="option"
        >
          {{ option }}
        </option>
      </select>
    </div>

    <Button>Submit</Button>
  </form>

  <table class="border border-black">
    <thead>
      <tr>
        <th class="border border-black px-2">No.</th>
        <th class="border border-black px-2">Name</th>
        <th class="border border-black px-2">Category</th>
        <th class="border border-black px-2">Amount</th>
        <th class="border border-black px-2">Fixed</th>
        <th class="border border-black px-2">Date</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in data">
        <td class="border border-black px-2">{{ item.id }}</td>
        <td class="border border-black px-2">{{ item.description }}</td>
        <td class="border border-black px-2">{{ item.category }}</td>
        <td class="border border-black px-2">{{ item.amount }}</td>
        <td class="border border-black px-2">{{ item.isFixed }}</td>
        <td class="border border-black px-2">{{ item.date }}</td>
      </tr>
    </tbody>
  </table>
</template>
