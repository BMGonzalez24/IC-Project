import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';

import ChatContainer from '@/containers/ChatContainer.vue';
import Chat from '@/views/Chat.vue';
import Call from '@/views/Call.vue';
import Login from '@/views/Login.vue';
import Help from '@/views/Help.vue';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: '/',
    component: Login,
    name: 'Login',
  },
  {
    path: '/app',
    component: ChatContainer,
    children: [
      {
        path: '',
        name: 'Chat',
        component: Chat,
      },
      {
        path: 'call',
        name: 'Call',
        component: Call,
      },
    ],
  },
  {
    path: '/help',
    component: {
      render(c) { return c('router-view'); },
    },
    children: [
      {
        path: '',
        redirect: {
          name: 'Help',
          params: { p: 'chat' },
        },
      },
      {
        path: ':p',
        name: 'Help',
        component: Help,
      },
    ],
  },
];

const router = new VueRouter({
  mode: 'hash',
  base: './', // '/~ic024/entregas/iteracao3/E3-2/',
  routes,
});

export default router;
