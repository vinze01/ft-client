<template>
  <div class="budget-page">
    <Navbar />
    <h2>Budgets</h2>
    <p>Here you can manage your budgets.</p>

    <button class="add-budget-button" @click="showModal">Add New Budget</button>

    <!-- Modal for adding new budget -->
    <Modal :isVisible="isModalVisible" @close="closeModal">
      <form @submit.prevent="addBudget">
        <div class="modal-form-group">
          <label for="category">Category</label>
          <input v-model="category" type="text" required />
        </div>

        <div class="modal-form-group">
          <label for="amount">Amount</label>
          <input v-model="amount" type="number" required />
        </div>

        <div class="modal-form-group">
          <label for="month">Month</label>
          <select v-model="month" required>
            <option value="" disabled>Select a month</option>
            <option v-for="(month, index) in months" :key="index" :value="month">{{ month }}</option>
          </select>
        </div>

        <button type="submit" class="submit-button">Add Budget</button>
      </form>
    </Modal>

    <div class="budget-list">
      <h3>Your Budgets</h3>
      
      <!-- Filters for month and category -->
      <div class="filters">
        <label for="filter-month">Filter by Month:</label>
        <select v-model="filterMonth">
          <option value="">All Months</option>
          <option v-for="(month, index) in months" :key="index" :value="month">{{ month }}</option>
        </select>

        <label for="filter-category">Filter by Category:</label>
        <input v-model="filterCategory" type="text" placeholder="Search Category" />
      </div>

      <!-- Filtered budgets table -->
      <table v-if="filteredBudgets.length" class="budget-table">
        <thead>
          <tr>
            <th>Category</th>
            <th>Amount</th>
            <th>Month</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(budget, index) in filteredBudgets" :key="index" class="budget-item">
            <td>{{ budget.category }}</td>
            <td>₱{{ budget.amount.toFixed(2) }}</td>
            <td>{{ budget.month }}</td>
          </tr>
        </tbody>
      </table>
      <p v-else>No budgets found. Please add a budget!</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue';
import Navbar from '../components/Navbar.vue';
import axios from 'axios';

export default defineComponent({
  components: { Navbar },
  setup() {
    const category = ref('');
    const amount = ref(0);
    const month = ref('');
    const budgets = ref([]);
    const months = ref([
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ]);
    const filterMonth = ref('');
    const filterCategory = ref('');
    const isModalVisible = ref(false); // State for modal visibility

    const fetchBudgets = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/budgets', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        budgets.value = response.data;
      } catch (error) {
        console.error('Failed to fetch budgets', error);
      }
    };

    const filteredBudgets = computed(() => {
      return budgets.value.filter(budget => {
        const matchesMonth = filterMonth.value ? budget.month === filterMonth.value : true;
        const matchesCategory = filterCategory.value ? budget.category.toLowerCase().includes(filterCategory.value.toLowerCase()) : true;
        return matchesMonth && matchesCategory;
      });
    });

    const addBudget = async () => {
      try {
        await axios.post('http://localhost:3001/api/budgets', {
          category: category.value,
          amount: amount.value,
          month: month.value,
        }, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        category.value = '';
        amount.value = 0;
        month.value = '';
        closeModal();
        await fetchBudgets();
      } catch (error) {
        console.error('Failed to add budget', error);
      }
    };

    const showModal = () => {
      isModalVisible.value = true;
    };

    const closeModal = () => {
      isModalVisible.value = false;
    };

    onMounted(fetchBudgets);

    return {
      category,
      amount,
      month,
      budgets,
      months,
      filterMonth,
      filterCategory,
      filteredBudgets,
      addBudget,
      isModalVisible,
      showModal,
      closeModal,
    };
  },
});
</script>

<style scoped>
.budget-page {
  padding: 20px;
}

.budget-list {
  margin-top: 20px;
}

.add-budget-button {
  margin-bottom: 20px;
}

.filters {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.filters label {
  margin-right: 10px;
}

.modal-form-group {
  margin-bottom: 15px;
}

.budget-table {
  width: 100%;
  border-collapse: collapse;
}

.budget-table th,
.budget-table td {
  border: 1px solid #ccc;
  padding: 10px;
  text-align: left;
}

.budget-table th {
  background-color: #f2f2f2;
}

.budget-item:nth-child(even) {
  background-color: #f9f9f9;
}

.submit-button {
  margin-top: 15px;
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.submit-button:hover {
  background-color: #45a049;
}
</style>
