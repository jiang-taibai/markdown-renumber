import {createApp} from 'vue'
import App from './App.vue'
import '@/assets/css/style.css'
import i18n from "./i18n/index";

const app = createApp(App)

app.use(i18n)
app.mount('#app')
