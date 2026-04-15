import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { createPinia } from "pinia";
import axios from "axios";
import "./style.css";
import { useThemeStore } from "./stores/themeStore";

const token = localStorage.getItem("token");
if (token) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

const pinia = createPinia();
const app = createApp(App);

app.use(pinia);
app.use(router);

const themeStore = useThemeStore(pinia);
themeStore.init();

app.mount("#app");
