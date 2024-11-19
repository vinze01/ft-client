import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import Dashboard from '../views/Dashboard.vue';
import Budgets from '../views/Budgets.vue';
import Expenses from '../views/Expenses.vue';

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/dashboard', component: Dashboard },
  { path: '/budgets', component: Budgets },
  { path: '/expenses', component: Expenses },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
