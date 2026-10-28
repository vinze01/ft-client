<template>
  <div>
    <PageHeader
      title="Dashboard"
      :subtitle="`Here's an overview of your finances, ${firstName}.`"
    >
      <template #actions>
        <router-link to="/expenses" class="btn btn-primary btn-sm">
          <component :is="PlusIcon" class="w-4 h-4" />
          Add Transaction
        </router-link>
      </template>
    </PageHeader>

    <!-- Period selection -->
    <div class="mb-6">
      <PeriodSelector
        v-model:view="currentView"
        :period-label="periodLabel"
        :half-month="selectedHalfMonth"
        @update:half-month="onHalfMonthChange"
        @prev="prevPeriod"
        @next="nextPeriod"
      />
    </div>

    <!-- Summary cards -->
    <div v-if="loading" class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
      <div v-for="i in 4" :key="i" class="stat-card">
        <div class="skeleton h-4 w-20 mb-4"></div>
        <div class="skeleton h-8 w-28"></div>
      </div>
    </div>
    <div v-else class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
      <StatCard
        label="Income"
        :value="`₱${formatNumber(summary.totalIncome)}`"
        :icon="ArrowUpIcon"
        tone="income"
      />
      <StatCard
        label="Expenses"
        :value="`₱${formatNumber(summary.totalExpenses)}`"
        :icon="ArrowDownIcon"
        tone="expense"
      />
      <StatCard
        label="Balance"
        :value="`₱${formatNumber(summary.balance)}`"
        :icon="WalletIcon"
        :value-color="balanceColor"
      />
      <StatCard
        label="Budget Used"
        :value="`${budgetUsedPercent}%`"
        :icon="ChartBarIcon"
        :tone="budgetUsedPercent > 90 ? 'expense' : budgetUsedPercent > 70 ? 'warning' : 'accent'"
      >
        <div v-if="totalBudgeted > 0" class="mt-3">
          <ProgressBar :value="budgetUsedPercent" :label="'Budget used'" />
          <p class="text-xs mt-2" style="color: var(--text-secondary)">
            of ₱{{ formatNumber(totalBudgeted) }} budget
          </p>
        </div>
        <p v-else class="text-xs mt-2" style="color: var(--text-muted)">
          No budget configured
        </p>
      </StatCard>
    </div>

    <!-- Charts row -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
      <!-- Financial overview chart -->
      <div class="card p-5">
        <div class="flex items-center justify-between mb-4">
          <h3 class="section-title">{{ chartTitle }}</h3>
          <div class="flex items-center gap-4 text-xs" style="color: var(--text-secondary)">
            <span class="flex items-center gap-1.5">
              <span class="w-2.5 h-2.5 rounded-sm" :style="{ backgroundColor: chartIncomeColor }"></span>
              Income
            </span>
            <span class="flex items-center gap-1.5">
              <span class="w-2.5 h-2.5 rounded-sm" :style="{ backgroundColor: chartExpenseColor }"></span>
              Expenses
            </span>
          </div>
        </div>
        <div
          v-if="!loading && !hasChartData"
          class="h-48 flex items-center justify-center"
        >
          <EmptyState
            :icon="ReceiptIcon"
            title="No data for this period"
            description="Add income or expenses to see your overview chart."
            action-label="Add Transaction"
            @action="$router.push('/expenses')"
          />
        </div>
        <div
          v-show="loading || hasChartData"
          ref="chartRef"
          class="h-48 sm:h-56 w-full"
          role="img"
          :aria-label="`${chartTitle} bar chart comparing income and expenses`"
        ></div>
      </div>

      <!-- Expenses by category -->
      <div class="card p-5">
        <h3 class="section-title mb-4">Expenses by Category</h3>
        <div v-if="!loading && Object.keys(summary.expensesByCategory).length === 0">
          <EmptyState
            :icon="ReceiptIcon"
            title="No expenses yet"
            description="Start adding expenses to see your spending breakdown."
          />
        </div>
        <div v-else class="space-y-3">
          <div
            v-for="(amount, category) in summary.expensesByCategory"
            :key="category"
            class="flex items-center gap-3"
          >
            <span
              class="w-2.5 h-2.5 rounded-full flex-shrink-0"
              :style="{ backgroundColor: getCategoryColor(String(category)) }"
              aria-hidden="true"
            ></span>
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between mb-1 gap-2">
                <span class="text-[13px] truncate" style="color: var(--text-primary)">{{ category }}</span>
                <span class="text-[13px] font-semibold financial-amount whitespace-nowrap" style="color: var(--text-primary)">
                  ₱{{ formatNumber(amount) }}
                </span>
              </div>
              <div class="progress-bar">
                <div
                  class="progress-fill"
                  :style="{
                    width: `${getCategoryPercent(amount)}%`,
                    backgroundColor: getCategoryColor(String(category)),
                  }"
                ></div>
              </div>
            </div>
            <span
              class="text-xs financial-amount w-10 text-right flex-shrink-0"
              style="color: var(--text-muted)"
              >{{ getCategoryPercent(amount) }}%</span
            >
          </div>
        </div>
      </div>
    </div>

    <!-- Budget status -->
    <div class="card overflow-hidden">
      <div class="px-5 py-4 flex items-center justify-between" style="border-bottom: 1px solid var(--border)">
        <h3 class="section-title">Budget Status</h3>
        <router-link
          v-if="filteredBudgetStatus.length"
          to="/budgets"
          class="text-[13px] font-medium hover:underline"
          style="color: var(--accent-color)"
          >Manage budgets</router-link
        >
      </div>

      <div v-if="!loading && filteredBudgetStatus.length" class="overflow-x-auto">
        <table class="table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Type</th>
              <th class="!text-right">Budget</th>
              <th class="!text-right">Spent</th>
              <th class="!text-right">Remaining</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="record in filteredBudgetStatus"
              :key="record.category + record.type"
            >
              <td>
                <div class="flex items-center gap-2">
                  <span
                    class="w-2 h-2 rounded-full flex-shrink-0"
                    :style="{ backgroundColor: getCategoryColor(record.category) }"
                    aria-hidden="true"
                  ></span>
                  <span class="font-medium">{{ record.category }}</span>
                </div>
              </td>
              <td>
                <span
                  class="badge"
                  :class="{
                    'badge-success': record.type === 'monthly',
                    'badge-warning': record.type === 'yearly',
                    'badge-neutral': record.type === 'bi-monthly',
                  }"
                >
                  {{ formatBudgetType(record.type) }}
                </span>
              </td>
              <td class="text-right financial-amount">₱{{ formatNumber(record.budgeted) }}</td>
              <td class="text-right financial-amount">₱{{ formatNumber(record.spent) }}</td>
              <td
                class="text-right financial-amount font-medium"
                :style="{
                  color:
                    record.remaining > 0
                      ? 'var(--income)'
                      : record.remaining < 0
                        ? 'var(--expense)'
                        : 'var(--text-primary)',
                }"
              >
                {{ record.remaining > 0 ? "+" : "" }}₱{{ formatNumber(record.remaining) }}
              </td>
              <td>
                <span :class="record.remaining >= 0 ? 'badge-success' : 'badge-danger'">
                  {{ record.remaining >= 0 ? "Under Budget" : "Over Budget" }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <EmptyState
        v-else-if="!loading"
        :icon="TargetIcon"
        title="No budget configured"
        description="Set up budgets to track your spending limits for this period."
        action-label="Create Budget"
        @action="$router.push('/budgets')"
      />
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  computed,
  watch,
  onMounted,
  onUnmounted,
  nextTick,
} from "vue";
import { useAuthStore } from "../stores/authStore";
import { useThemeStore } from "../stores/themeStore";
import axios from "axios";
import type { DashboardSummary, BudgetView } from "../types";
import PageHeader from "../components/PageHeader.vue";
import StatCard from "../components/StatCard.vue";
import EmptyState from "../components/EmptyState.vue";
import ProgressBar from "../components/ProgressBar.vue";
import PeriodSelector from "../components/PeriodSelector.vue";
import {
  ArrowUpIcon,
  ArrowDownIcon,
  WalletIcon,
  ChartBarIcon,
  PlusIcon,
  ReceiptIcon,
  TargetIcon,
} from "../components/icons";
import { getCategoryColor } from "../utils/categoryColors";

const API_URL = "http://localhost:3001/api";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default defineComponent({
  name: "DashboardView",
  components: { PageHeader, StatCard, EmptyState, ProgressBar, PeriodSelector },
  setup() {
    const authStore = useAuthStore();
    const themeStore = useThemeStore();
    const chartRef = ref<HTMLElement | null>(null);
    const currentView = ref<BudgetView>("bi-monthly");
    const selectedYear = ref(new Date().getFullYear());
    const selectedMonth = ref(new Date().getMonth() + 1);
    const selectedHalfMonth = ref(1);
    const loading = ref(true);

    const summary = ref<DashboardSummary>({
      totalIncome: 0,
      totalExpenses: 0,
      balance: 0,
      expensesByCategory: {},
      budgetStatus: [],
      monthlyData: [],
      yearlyData: [],
      biMonthlyData: [],
    });

    const firstName = computed(() => (authStore.fullName || "User").split(" ")[0]);

    const totalBudgeted = computed(
      () =>
        filteredBudgetStatus.value.reduce((sum, b) => sum + b.budgeted, 0) || 0,
    );
    const budgetUsedPercent = computed(() => {
      if (totalBudgeted.value === 0) return 0;
      const spent =
        filteredBudgetStatus.value.reduce((sum, b) => sum + b.spent, 0) || 0;
      return Math.round((spent / totalBudgeted.value) * 100);
    });

    const balanceColor = computed(() => {
      if (summary.value.balance > 0) return "var(--income)";
      if (summary.value.balance < 0) return "var(--expense)";
      return "var(--text-primary)";
    });

    const filteredBudgetStatus = computed(() => {
      const status = summary.value.budgetStatus || [];
      if (currentView.value === "yearly") {
        return status.filter((b) => b.type === "yearly");
      } else if (currentView.value === "bi-monthly") {
        return status.filter((b) => {
          if (b.type !== "bi-monthly") return false;
          const halfMatch =
            selectedHalfMonth.value === 1
              ? b.period.includes("1st Half")
              : b.period.includes("2nd Half");
          return halfMatch;
        });
      } else {
        return status.filter((b) => b.type === "monthly");
      }
    });

    const periodLabel = computed(() => {
      if (currentView.value === "yearly") {
        return `${selectedYear.value}`;
      } else if (currentView.value === "bi-monthly") {
        const monthName = MONTHS[selectedMonth.value - 1];
        const halfLabel =
          selectedHalfMonth.value === 1 ? "1st Half" : "2nd Half";
        return `${monthName} ${halfLabel} ${selectedYear.value}`;
      } else {
        return `${MONTHS[selectedMonth.value - 1]} ${selectedYear.value}`;
      }
    });

    const chartTitle = computed(() => {
      if (currentView.value === "yearly") return "Yearly Overview";
      if (currentView.value === "bi-monthly") return "Bi-Monthly Overview";
      return "Monthly Overview";
    });

    const chartData = computed<any[]>(() => {
      if (currentView.value === "yearly") return summary.value.yearlyData || [];
      if (currentView.value === "bi-monthly")
        return summary.value.biMonthlyData || [];
      return summary.value.monthlyData || [];
    });

    const hasChartData = computed(() => chartData.value.length > 0);

    const formatNumber = (num: number): string => {
      return num.toLocaleString("en-PH", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    };

    const formatBudgetType = (type: string): string => {
      const labels: Record<string, string> = {
        monthly: "Monthly",
        yearly: "Yearly",
        "bi-monthly": "Bi-Monthly",
      };
      return labels[type] || type;
    };

    const getCategoryPercent = (amount: number): number => {
      const total = Object.values(summary.value.expensesByCategory).reduce(
        (a, b) => a + b,
        0,
      );
      return total > 0 ? Math.round((amount / total) * 100) : 0;
    };

    const prevPeriod = () => {
      if (currentView.value === "yearly") {
        selectedYear.value--;
      } else if (currentView.value === "bi-monthly") {
        if (selectedHalfMonth.value === 1) {
          selectedHalfMonth.value = 2;
          selectedMonth.value--;
          if (selectedMonth.value < 1) {
            selectedMonth.value = 12;
            selectedYear.value--;
          }
        } else {
          selectedHalfMonth.value = 1;
        }
      } else {
        selectedMonth.value--;
        if (selectedMonth.value < 1) {
          selectedMonth.value = 12;
          selectedYear.value--;
        }
      }
      fetchDashboard();
    };

    const nextPeriod = () => {
      if (currentView.value === "yearly") {
        selectedYear.value++;
      } else if (currentView.value === "bi-monthly") {
        if (selectedHalfMonth.value === 2) {
          selectedHalfMonth.value = 1;
          selectedMonth.value++;
          if (selectedMonth.value > 12) {
            selectedMonth.value = 1;
            selectedYear.value++;
          }
        } else {
          selectedHalfMonth.value = 2;
        }
      } else {
        selectedMonth.value++;
        if (selectedMonth.value > 12) {
          selectedMonth.value = 1;
          selectedYear.value++;
        }
      }
      fetchDashboard();
    };

    const onHalfMonthChange = (half: number) => {
      selectedHalfMonth.value = half;
      fetchDashboard();
    };

    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get<DashboardSummary>(
          `${API_URL}/dashboard`,
          {
            headers: { Authorization: `Bearer ${token}` },
            params: {
              view: currentView.value,
              year: selectedYear.value,
              month: selectedMonth.value,
              halfMonth:
                currentView.value === "bi-monthly"
                  ? selectedHalfMonth.value
                  : undefined,
            },
          },
        );
        summary.value = response.data;
      } catch (error) {
        console.error("Failed to fetch dashboard:", error);
      } finally {
        loading.value = false;
      }
    };

    /** Resolve current theme colors for the canvas chart. */
    const chartThemeColors = () => {
      const style = getComputedStyle(document.documentElement);
      const get = (name: string) => style.getPropertyValue(name).trim();
      return {
        income: get("--income") || "#10b981",
        expense: get("--expense") || "#ef4444",
        text: get("--text-muted") || "#94a3b8",
        grid: get("--border") || "#e2e8f0",
      };
    };

    const chartIncomeColor = ref("#10b981");
    const chartExpenseColor = ref("#ef4444");

    const shortMoney = (value: number): string => {
      if (value >= 1000) return `${(value / 1000).toFixed(1).replace(/\.0$/, "")}k`;
      return `${Math.round(value)}`;
    };

    const renderChart = () => {
      if (!chartRef.value) return;
      const data = chartData.value;

      if (!data.length) {
        chartRef.value.innerHTML = "";
        return;
      }

      const colors = chartThemeColors();
      chartIncomeColor.value = colors.income;
      chartExpenseColor.value = colors.expense;

      const canvas = document.createElement("canvas");
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      chartRef.value.innerHTML = "";
      chartRef.value.appendChild(canvas);

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const width = chartRef.value.offsetWidth;
      const height = chartRef.value.offsetHeight || 224;
      canvas.width = width * 2;
      canvas.height = height * 2;
      ctx.scale(2, 2);

      const padding = { top: 16, right: 16, bottom: 28, left: 44 };
      const chartWidth = width - padding.left - padding.right;
      const chartHeight = height - padding.top - padding.bottom;

      const maxValue =
        Math.max(
          ...data.map((d: any) => Math.max(d.income || 0, d.expenses || 0)),
        ) *
          1.15 || 1000;

      // Subtle horizontal gridlines + y-axis labels
      const gridLines = 4;
      ctx.strokeStyle = colors.grid;
      ctx.lineWidth = 1;
      ctx.font = "10px Inter, sans-serif";
      ctx.fillStyle = colors.text;
      ctx.textAlign = "right";
      for (let i = 0; i <= gridLines; i++) {
        const y = padding.top + (chartHeight / gridLines) * i;
        ctx.beginPath();
        ctx.moveTo(padding.left, y);
        ctx.lineTo(width - padding.right, y);
        ctx.stroke();
        ctx.fillText(
          shortMoney(maxValue - (maxValue / gridLines) * i),
          padding.left - 8,
          y + 3,
        );
      }

      const barWidth = chartWidth / data.length / 3;
      const spacing = chartWidth / data.length;

      // X-axis labels
      ctx.fillStyle = colors.text;
      ctx.textAlign = "center";
      data.forEach((d: any, i: number) => {
        const x = padding.left + i * spacing + spacing / 2;
        const label = d.month || d.label || String(d.year);
        ctx.fillText(
          label.length > 10 ? label.substring(0, 10) + "…" : label,
          x,
          height - padding.bottom + 16,
        );
      });

      // Bars
      data.forEach((d: any, i: number) => {
        const x = padding.left + i * spacing + spacing / 2 - barWidth / 2;

        ctx.fillStyle = colors.income;
        const ih = ((d.income || 0) / maxValue) * chartHeight;
        if (ih > 0) {
          ctx.beginPath();
          ctx.roundRect(
            x,
            padding.top + chartHeight - ih,
            barWidth - 4,
            ih,
            [4, 4, 0, 0],
          );
          ctx.fill();
        }

        ctx.fillStyle = colors.expense;
        const eh = ((d.expenses || 0) / maxValue) * chartHeight;
        if (eh > 0) {
          ctx.beginPath();
          ctx.roundRect(
            x + barWidth + 4,
            padding.top + chartHeight - eh,
            barWidth - 4,
            eh,
            [4, 4, 0, 0],
          );
          ctx.fill();
        }
      });
    };

    // Re-render the canvas chart when the theme changes (colors are CSS vars).
    watch(
      () => themeStore.isDark,
      async () => {
        await nextTick();
        renderChart();
      },
    );

    const onResize = () => renderChart();

    watch(currentView, () => {
      fetchDashboard();
    });

    watch(
      () => summary.value,
      async () => {
        await nextTick();
        renderChart();
      },
    );

    onMounted(() => {
      fetchDashboard();
      window.addEventListener("resize", onResize);
    });

    onUnmounted(() => {
      window.removeEventListener("resize", onResize);
    });

    return {
      chartRef,
      summary,
      firstName,
      totalBudgeted,
      budgetUsedPercent,
      balanceColor,
      filteredBudgetStatus,
      currentView,
      periodLabel,
      chartTitle,
      hasChartData,
      loading,
      formatNumber,
      formatBudgetType,
      getCategoryPercent,
      getCategoryColor,
      selectedHalfMonth,
      prevPeriod,
      nextPeriod,
      onHalfMonthChange,
      fetchDashboard,
      themeStore,
      chartIncomeColor,
      chartExpenseColor,
      ArrowUpIcon,
      ArrowDownIcon,
      WalletIcon,
      ChartBarIcon,
      PlusIcon,
      ReceiptIcon,
      TargetIcon,
    };
  },
});
</script>
