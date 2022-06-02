import Vue from 'vue'
import VueRouter from 'vue-router'

import Store from '@/store/index.js'

import Home from '@/views/Home.vue'
import Login from '@/components/Login.vue'
import Register from '@/components/Register.vue'
import Recipes from '@/components/Recipes.vue'
import Ingredients from '@/components/Ingredients.vue'
import MyIngredients from '@/components/MyIngredients.vue'
import RecipeDetails from '@/components/RecipeDetails.vue'
import NotFound from '@/components/NotFound.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { requiresAuth: false },
    children: [
      {
        name: 'Login',
        path: 'login',
        component: Login,
      },
      {
        path: 'register',
        component: Register,
      },
      {
        path: 'about',
        component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
      },
      {
        path: 'feedback',
        component: () => import(/* webpackChunkName: "feedback" */ '../views/Feedback.vue'),
      },
      {
        path: 'ingredients',
        name: 'IngredientList',
        component: Ingredients,
      },
      {
        path: 'my-ingredients',
        name: 'MyIngredientList',
        component: MyIngredients,
        meta: { requiresAuth: true },
      },
      {
        path: '',
        name: 'RecipeList',
        component: Recipes,
      },
      {
        path: 'recipe/:id',
        component: RecipeDetails,
      },
      {
        path: ':pathMatch(.*)*',
        name: 'NotFound',
        component: NotFound,
      },
    ],
  },
]

const router = new VueRouter({
  routes,
})

router.beforeEach((to, from, next) => {
  // check for a token
  Store.commit('auth/checkToken')
  // redirect to Login if no authenticated, but route needs it
  if (
    !Store.getters['auth/isAuthenticated'] &&
    to.matched.some(record => record.meta.requiresAuth === true)
  ) {
    return next({
      name: 'Login',
    })
  }

  return next()
})

export default router
