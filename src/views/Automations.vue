<template>
  <div class="animate-fade-in">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-1">
          Automations
        </h1>
        <p class="text-gray-500 dark:text-gray-400 text-sm">
          Trigger actions automatically from rules
        </p>
      </div>
      <div class="flex gap-2">
        <button @click="runAll" class="btn btn-secondary">Run All</button>
        <button @click="showAddModal = true" class="btn btn-primary">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
          </svg>
          Add Rule
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      <div
        v-for="rule in automationStore.rules"
        :key="rule.id"
        class="card p-4"
        :class="{ 'opacity-60': !rule.isActive }"
      >
        <div class="flex items-start justify-between mb-2">
          <h3 class="font-semibold text-gray-800 dark:text-white">{{ rule.name }}</h3>
          <span class="badge" :class="rule.isActive ? 'badge-success' : 'badge-neutral'">
            {{ rule.isActive ? 'Active' : 'Paused' }}
          </span>
        </div>
        <p v-if="rule.description" class="text-sm text-gray-500 dark:text-gray-400 mb-3">{{ rule.description }}</p>
        <div class="flex flex-wrap gap-2 mb-3">
          <span class="badge badge-neutral">{{ formatTrigger(rule.triggerType) }}</span>
          <span class="text-gray-400">→</span>
          <span class="badge badge-warning">{{ formatAction(rule.actionType) }}</span>
        </div>
        <p class="text-xs text-gray-500 dark:text-gray-400 mb-3">
          Ran {{ rule.executionCount }} time(s)
          <span v-if="rule.lastExecutedAt">· last {{ formatDate(rule.lastExecutedAt) }}</span>
        </p>
        <div class="flex gap-2">
          <button @click="toggleRule(rule.id)" class="btn btn-secondary flex-1 text-sm">
            {{ rule.isActive ? 'Pause' : 'Resume' }}
          </button>
          <button @click="openTestModal(rule.id)" class="btn btn-secondary flex-1 text-sm">Test</button>
          <button @click="editRule(rule)" class="btn btn-ghost">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a3.5 3.5 0 11-4.95 4.95l-4.95 4.95a3.5 3.5 0 014.95 4.95l5.657 5.657a3.5 3.5 0 01-4.95 4.95l-5.657-5.657a3.5 3.5 0 00-4.95 0"></path>
            </svg>
          </button>
          <button @click="deleteRule(rule.id)" class="btn btn-ghost text-red-500">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1H6a1 1 0 00-1 1v3M4 7h16"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <div v-if="automationStore.rules.length === 0 && !automationStore.loading" class="empty-state">
      <div class="empty-state-icon">
        <svg class="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
        </svg>
      </div>
      <h3 class="empty-state-title">No automation rules yet</h3>
      <p class="empty-state-description">Create rules to react to balances, due dates, and schedules</p>
      <button @click="showAddModal = true" class="btn btn-primary mt-4">Add Rule</button>
    </div>

    <div v-if="showAddModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" @click.self="closeModal">
      <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-lg animate-fade-in max-h-[90vh] overflow-y-auto">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl font-bold text-gray-800 dark:text-white">{{ editMode ? 'Edit' : 'Add' }} Rule</h3>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label class="label">Rule Name</label>
            <input v-model="form.name" type="text" class="input" placeholder="Low balance alert" required />
          </div>

          <div>
            <label class="label">Description</label>
            <input v-model="form.description" type="text" class="input" placeholder="Notify me when balance drops" />
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="label">Trigger</label>
              <select v-model="form.triggerType" class="input">
                <option value="transaction_added">Transaction Added</option>
                <option value="balance_low">Balance Low</option>
                <option value="due_date">Due Date</option>
                <option value="recurring_executed">Recurring Executed</option>
                <option value="periodic">Periodic</option>
              </select>
            </div>
            <div>
              <label class="label">Action</label>
              <select v-model="form.actionType" class="input">
                <option value="allocate_savings">Allocate Savings</option>
                <option value="send_notification">Send Notification</option>
                <option value="create_transaction">Create Transaction</option>
                <option value="mark_paid">Mark Bill Paid</option>
              </select>
            </div>
          </div>

          <div>
            <label class="label">Trigger Conditions (JSON)</label>
            <textarea
              v-model="form.triggerConditionsText"
              rows="3"
              class="input font-mono text-sm"
              placeholder='{"field": "amount", "operator": "gt", "value": 100}'
            ></textarea>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Operators: eq, ne, gt, lt, gte, lte, contains. Balance-low also reads "value" as threshold.
            </p>
          </div>

          <div>
            <label class="label">Action Parameters (JSON)</label>
            <textarea
              v-model="form.actionParamsText"
              rows="3"
              class="input font-mono text-sm"
              placeholder='{"title": "Heads up", "message": "Balance is low"}'
            ></textarea>
          </div>

          <div class="flex items-center gap-2">
            <input v-model="form.isActive" type="checkbox" id="ruleActive" class="w-4 h-4" />
            <label for="ruleActive" class="text-sm text-gray-600 dark:text-gray-300">Active</label>
          </div>

          <div class="flex gap-3">
            <button type="button" @click="closeModal" class="btn btn-secondary flex-1">Cancel</button>
            <button type="submit" class="btn btn-primary flex-1">{{ editMode ? 'Update' : 'Create' }}</button>
          </div>
        </form>
      </div>
    </div>

    <div v-if="showTestModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" @click.self="showTestModal = false">
      <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md animate-fade-in">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl font-bold text-gray-800 dark:text-white">Test Rule</h3>
          <button @click="showTestModal = false" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <div class="mb-4">
          <label class="label">Sample Event Data (JSON)</label>
          <textarea v-model="testDataText" rows="4" class="input font-mono text-sm" placeholder='{"amount": 150}'></textarea>
        </div>

        <div v-if="testResult" class="p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 mb-4 text-sm">
          <p class="text-gray-800 dark:text-white">
            Would trigger:
            <span class="font-bold" :class="testResult.wouldTrigger ? 'text-emerald-600' : 'text-gray-500'">
              {{ testResult.wouldTrigger ? 'Yes' : 'No' }}
            </span>
          </p>
          <p v-if="testResult.actionResult" class="text-gray-500 dark:text-gray-400 mt-1 break-all">
            {{ JSON.stringify(testResult.actionResult) }}
          </p>
        </div>

        <div class="flex gap-3">
          <button @click="showTestModal = false" class="btn btn-secondary flex-1">Close</button>
          <button @click="submitTest" class="btn btn-primary flex-1">Run Test</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, onMounted, ref } from 'vue';
import { useAutomationStore, type AutomationRule } from '../stores/automationStore';
import { toast } from '../components/Toast.vue';
import { confirm } from '../components/ConfirmModal.vue';

const TRIGGER_LABELS: Record<string, string> = {
  transaction_added: 'Transaction Added',
  balance_low: 'Balance Low',
  due_date: 'Due Date',
  recurring_executed: 'Recurring Executed',
  periodic: 'Periodic'
};

const ACTION_LABELS: Record<string, string> = {
  allocate_savings: 'Allocate Savings',
  send_notification: 'Send Notification',
  create_transaction: 'Create Transaction',
  mark_paid: 'Mark Bill Paid'
};

export default defineComponent({
  name: 'AutomationsView',
  setup() {
    const automationStore = useAutomationStore();
    const showAddModal = ref(false);
    const showTestModal = ref(false);
    const editMode = ref(false);
    const testingRuleId = ref<number | null>(null);
    const testDataText = ref('{}');
    const testResult = ref<{ wouldTrigger: boolean; actionResult: any } | null>(null);

    const form = reactive({
      id: null as number | null,
      name: '',
      description: '',
      triggerType: 'balance_low',
      triggerConditionsText: '',
      actionType: 'send_notification',
      actionParamsText: '',
      isActive: true
    });

    const formatTrigger = (t: string) => TRIGGER_LABELS[t] || t;
    const formatAction = (a: string) => ACTION_LABELS[a] || a;

    const formatDate = (date: string) => {
      if (!date) return '-';
      return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const parseJsonField = (text: string, fieldName: string) => {
      if (!text.trim()) return undefined;
      try {
        return JSON.parse(text);
      } catch (e) {
        throw new Error(`Invalid JSON in ${fieldName}`);
      }
    };

    const editRule = (rule: AutomationRule) => {
      form.id = rule.id;
      form.name = rule.name;
      form.description = rule.description || '';
      form.triggerType = rule.triggerType;
      form.triggerConditionsText = rule.triggerConditions ? JSON.stringify(rule.triggerConditions) : '';
      form.actionType = rule.actionType;
      form.actionParamsText = rule.actionParams ? JSON.stringify(rule.actionParams) : '';
      form.isActive = rule.isActive;
      editMode.value = true;
      showAddModal.value = true;
    };

    const deleteRule = async (id: number) => {
      const ok = await confirm({
        title: 'Delete Rule',
        content: 'Are you sure you want to delete this automation rule?',
        confirmText: 'Delete'
      });
      if (!ok) return;
      try {
        await automationStore.deleteRule(id);
        toast.success('Rule deleted');
      } catch (e) {
        toast.error('Failed to delete rule');
      }
    };

    const toggleRule = async (id: number) => {
      try {
        const rule = await automationStore.toggleRule(id);
        toast.success(rule.isActive ? 'Rule resumed' : 'Rule paused');
      } catch (e) {
        toast.error('Failed to update rule');
      }
    };

    const runAll = async () => {
      try {
        const result = await automationStore.executeAll();
        toast.success(`Executed ${result.executedCount} rule(s)`);
      } catch (e) {
        toast.error('Failed to run automations');
      }
    };

    const openTestModal = (id: number) => {
      testingRuleId.value = id;
      testDataText.value = '{}';
      testResult.value = null;
      showTestModal.value = true;
    };

    const submitTest = async () => {
      if (testingRuleId.value === null) return;
      let testData: any = {};
      try {
        testData = testDataText.value.trim() ? JSON.parse(testDataText.value) : {};
      } catch (e) {
        toast.error('Invalid JSON in sample event data');
        return;
      }
      try {
        testResult.value = await automationStore.testRule(testingRuleId.value, testData);
      } catch (e) {
        toast.error('Failed to test rule');
      }
    };

    const handleSubmit = async () => {
      let triggerConditions: any;
      let actionParams: any;
      try {
        triggerConditions = parseJsonField(form.triggerConditionsText, 'trigger conditions');
        actionParams = parseJsonField(form.actionParamsText, 'action parameters');
      } catch (e: any) {
        toast.error(e.message);
        return;
      }
      const payload = {
        name: form.name,
        description: form.description || undefined,
        triggerType: form.triggerType,
        triggerConditions,
        actionType: form.actionType,
        actionParams,
        isActive: form.isActive
      };
      try {
        if (editMode.value && form.id) {
          await automationStore.updateRule(form.id, payload);
          toast.success('Rule updated');
        } else {
          await automationStore.createRule(payload);
          toast.success('Rule created');
        }
        closeModal();
      } catch (e: any) {
        toast.error(e.response?.data?.error || 'Failed to save rule');
      }
    };

    const closeModal = () => {
      showAddModal.value = false;
      editMode.value = false;
      form.id = null;
      form.name = '';
      form.description = '';
      form.triggerType = 'balance_low';
      form.triggerConditionsText = '';
      form.actionType = 'send_notification';
      form.actionParamsText = '';
      form.isActive = true;
    };

    onMounted(async () => {
      try {
        await automationStore.fetchRules();
      } catch (e) {
        toast.error('Failed to load automation rules');
      }
    });

    return {
      automationStore,
      showAddModal,
      showTestModal,
      editMode,
      form,
      testDataText,
      testResult,
      formatTrigger,
      formatAction,
      formatDate,
      editRule,
      deleteRule,
      toggleRule,
      runAll,
      openTestModal,
      submitTest,
      handleSubmit,
      closeModal
    };
  }
});
</script>
