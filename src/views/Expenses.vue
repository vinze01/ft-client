<template>
  <Navbar />
  <div class="expense-page">
    
    <h2>Expenses</h2>
    <p>Here you can manage your expenses.</p>

    <a-button type="primary" @click="showModal">Add New Expense</a-button>

    <!-- Modal for adding new expense -->
    <Modal :open="isModalVisible" @cancel="closeModal" title="Add New Expense" okText="Add Expense" @ok="addExpense">
      <a-form :model="form">
        <a-form-item label="Description" required>
          <a-input v-model:value="form.description" placeholder="Enter description" />
        </a-form-item>

        <a-form-item label="Amount" required>
          <a-input-number v-model:value="form.amount" :min="0" placeholder="Enter amount" />
        </a-form-item>

        <a-form-item label="Category" required>
          <a-input v-model:value="form.category" placeholder="Enter category" />
        </a-form-item>

        <a-form-item label="Date" required>
          <a-date-picker v-model:value="form.date" placeholder="Select date" />
        </a-form-item>
      </a-form>
    </Modal>

    <div class="expense-list">
      <h3>Your Expenses</h3>

      <!-- Filters for category -->
      <div class="filters">
        <a-form layout="inline">
          <a-form-item label="Filter by Category:">
            <a-input v-model="filterCategory" placeholder="Search Category" />
          </a-form-item>
        </a-form>
      </div>

      <!-- Filtered expenses table -->
      <a-table v-if="filteredExpenses.length" :data-source="filteredExpenses" :pagination="false">
        <a-table-column title="Description" data-index="description" />
        <a-table-column title="Amount" data-index="amount" />
        <a-table-column title="Category" data-index="category" />
        <a-table-column title="Date" data-index="date" />
      </a-table>

      <p v-else>No expenses found. Please add an expense!</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue';
import Navbar from '../components/Navbar.vue';
import { Modal, Table, Input, Button, Form, DatePicker, InputNumber } from 'ant-design-vue';
import axios from 'axios';

export default defineComponent({
  components: { Navbar, Modal, Table, Input, Button, Form, DatePicker, InputNumber },
  setup() {
    const form = ref({
      description: '',
      amount: 0,
      category: '',
      date: null,
    });
    const expenses = ref([]);
    const filterCategory = ref('');
    const isModalVisible = ref(false); // State for modal visibility

    const fetchExpenses = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/expenses', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        expenses.value = response.data;
      } catch (error) {
        console.error('Failed to fetch expenses', error);
      }
    };

    const filteredExpenses = computed(() => {
      return expenses.value.filter(expense => {
        return filterCategory.value ? expense.category.toLowerCase().includes(filterCategory.value.toLowerCase()) : true;
      });
    });

    const amountRender = (text) => `$${text.toFixed(2)}`;

    const addExpense = async () => {
      try {
        // Make sure to format the date if necessary
        await axios.post('http://localhost:3001/api/expenses', {
          description: form.value.description,
          amount: form.value.amount,
          category: form.value.category,
          date: form.value.date,
        }, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });

        // Reset the form fields
        form.value = {
          description: '',
          amount: 0,
          category: '',
          date: null,
        };
        closeModal();
        await fetchExpenses();
      } catch (error) {
        console.error('Failed to add expense', error);
      }
    };

    const showModal = () => {
      isModalVisible.value = true;
    };

    const closeModal = () => {
      isModalVisible.value = false;
    };

    onMounted(fetchExpenses);

    return {
      form,
      expenses,
      filterCategory,
      filteredExpenses,
      addExpense,
      isModalVisible,
      showModal,
      closeModal,
      amountRender,
    };
  },
});
</script>

<style scoped>
.expense-page {
  padding: 40px;
}

.expense-list {
  margin-top: 20px;
}

.filters {
  margin-bottom: 20px;
}

.filters .ant-form-item {
  margin-bottom: 0;
}
</style>
