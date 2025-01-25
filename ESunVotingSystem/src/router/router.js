import { createRouter, createWebHistory } from 'vue-router';

import Home from '@/views/Home.vue';
import VotingPage from '@/views/VotingPage.vue';
import AdminPage from '@/views/AdminPage.vue';

const routes = [
  { name: "Home", path: '/', component: Home },
  { name: "Voting", path: '/voting', component: VotingPage },
  { name: "Admin", path: '/admin', component: AdminPage }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;