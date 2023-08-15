import { createRouter, createWebHashHistory } from 'vue-router';

import HomeView from '../views/HomeView.vue';
import CityView from '../views/CityView.vue';

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      component: HomeView,
      name: "home",
      meta: {
        title: "Home"

      }

    },
    {
      path: '/weather/:country/:city',
      component: CityView,
      name: "city",
      meta: {
        title: "Weather"

      },

    },

  ],

});

router.beforeEach((to, from, next) => {
  document.title = `${
    to.params.country
      ? `${to.params.city}, ${to.params.country}`
      : to.meta.title
  } | The Local Weather`;
  next();

});

export default router;
