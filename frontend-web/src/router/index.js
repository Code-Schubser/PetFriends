// In deiner src/router/index.js (FRONTEND!)

import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '../views/DashboardView.vue'
import DiscoverView from '../views/DiscoverView.vue'
import LoginView from '../views/LoginView.vue'
import AdminView from '../views/AdminView.vue'
import ChatView from '../views/ChatView.vue' // 1. Hier importieren

const routes = [
  { path: '/', component: DashboardView },
  { path: '/login', component: LoginView },
  { path: '/discover', component: DiscoverView },
  { path: '/admin', component: AdminView },
  // 2. Diese Zeile fehlte – sie verknüpft den Button mit der Chat-Seite
  { path: '/chat/:matchId', component: ChatView } 
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router