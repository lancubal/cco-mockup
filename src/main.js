import { createApp } from 'vue'
import App from './App.vue'
import PrimeVue from 'primevue/config';
import router from './router'

import Tooltip from 'primevue/tooltip';

import store from "./store/store"
import 'primevue/resources/themes/nova/theme.css';
import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css';
import "./index.css";
const app = createApp(App).use(store).use(PrimeVue).use(router).directive('tooltip', Tooltip).mount('#app')
