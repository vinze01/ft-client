import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/authStore';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import Dashboard from '../views/Dashboard.vue';
import Budgets from '../views/Budgets.vue';
import Expenses from '../views/Expenses.vue';
import Incomes from '../views/Incomes.vue';
import Settings from '../views/Settings.vue';
import ResetPassword from '../views/ResetPassword.vue';
import Accounts from '../views/Accounts.vue';
import Bills from '../views/Bills.vue';
import Goals from '../views/Goals.vue';
import Recurring from '../views/Recurring.vue';
import Insights from '../views/Insights.vue';
import Tags from '../views/Tags.vue';
import Savings from '../views/Savings.vue';
import Automations from '../views/Automations.vue';
import Notifications from '../views/Notifications.vue';

const routes: any = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login, meta: { guest: true } },
  { path: '/register', component: Register, meta: { guest: true } },
  { path: '/reset-password', component: ResetPassword, meta: { guest: true } },
  { path: '/dashboard', component: Dashboard, meta: { requiresAuth: true } },
  { path: '/budgets', component: Budgets, meta: { requiresAuth: true } },
  { path: '/expenses', component: Expenses, meta: { requiresAuth: true } },
  { path: '/incomes', component: Incomes, meta: { requiresAuth: true } },
  { path: '/settings', component: Settings, meta: { requiresAuth: true } },
  { path: '/accounts', component: Accounts, meta: { requiresAuth: true } },
  { path: '/bills', component: Bills, meta: { requiresAuth: true } },
  { path: '/goals', component: Goals, meta: { requiresAuth: true } },
  { path: '/recurring', component: Recurring, meta: { requiresAuth: true } },
  { path: '/insights', component: Insights, meta: { requiresAuth: true } },
  { path: '/tags', component: Tags, meta: { requiresAuth: true } },
  { path: '/savings', component: Savings, meta: { requiresAuth: true } },
  { path: '/automations', component: Automations, meta: { requiresAuth: true } },
  { path: '/notifications', component: Notifications, meta: { requiresAuth: true } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const token = authStore.token || localStorage.getItem('token');
  
  if (to.meta.requiresAuth && !token) {
    next('/login');
  } else if (to.meta.guest && token) {
    next('/dashboard');
  } else {
    next();
  }
});

export default router;