import Vue from 'vue'
import Router from 'vue-router'
import Head from 'vue-head'
import { isNil } from 'lodash'
import CheckLogin from '@/views/authentication/CheckLogin'
import store from '@/store'

Vue.use(Router)

/* If you don't know about VueHead, please refer to https://github.com/ktquez/vue-head */

Vue.use(Head, {
  complement: 'HangTime'
})

/* If you don't know about VueRouter, please refer to https://router.vuejs.org/ */

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      component: () =>
        import(/* webpackChunkName: "client-chunk-tabs" */ '@/views/tabs/Tabs.vue'),
      children: [
        {
          path: '/',
          name: 'workouts',
          component: () =>
            import(/* webpackChunkName: "client-chunk-workouts" */ '@/views/tabs/Workouts.vue')
        },
        {
          path: '/community',
          name: 'community',
          component: () =>
            import(/* webpackChunkName: "client-chunk-community" */ '@/views/tabs/Community.vue')
        },
        {
          path: '/progress',
          name: 'progress',
          component: () =>
            import(/* webpackChunkName: "client-chunk-hangtime" */ '@/views/tabs/Progress.vue')
        }
      ]
    },
    {
      path: '/:userId/workout/new',
      name: 'new-workout',
      component: () =>
        import(/* webpackChunkName: "client-chunk-workouts" */ '@/views/workouts/New.vue')
    },
    {
      path: '/:userId/workout/:id',
      name: 'workout',
      props: true,
      component: () =>
        import(/* webpackChunkName: "client-chunk-workouts" */ '@/views/workouts/Workout.vue')
    },
    {
      path: '/:userId/workout/:id/run',
      name: 'run',
      props: true,
      component: () =>
        import(/* webpackChunkName: "client-chunk-workouts" */ '@/views/workouts/Run.vue')
    },
    {
      path: '/:userId/workout/:id/:index',
      name: 'exercise',
      props(route) {
        const props = { ...route.params }
        props.index = +props.index
        return props
      },
      component: () =>
        import(/* webpackChunkName: "client-chunk-workouts" */ '@/views/workouts/Exercise.vue')
    },
    {
      path: '/:userId/community/:id',
      name: 'community-workout',
      props: true,
      component: () =>
        import(/* webpackChunkName: "client-chunk-workouts" */ '@/views/workouts/Workout.vue')
    },
    {
      path: '/progress/:id/:type/record/:index',
      name: 'progress-record',
      props(route) {
        const props = { ...route.params }
        props.id = +props.id
        props.index = +props.index
        return props
      },
      component: () =>
        import(/* webpackChunkName: "client-chunk-workouts" */ '@/views/progress/Record.vue')
    },
    {
      path: '/progress/:id/:type/list/:index',
      name: 'progress-list',
      props(route) {
        const props = { ...route.params }
        props.id = +props.id
        props.index = +props.index
        return props
      },
      component: () =>
        import(/* webpackChunkName: "client-chunk-workouts" */ '@/views/progress/List.vue')
    },
    {
      path: '/progress/:id/:type',
      name: 'progress-type',
      props(route) {
        const props = { ...route.params }
        props.id = +props.id
        return props
      },
      component: () =>
        import(/* webpackChunkName: "client-chunk-workouts" */ '@/views/progress/Type.vue')
    },

    {
      path: '/settings',
      name: 'settings',
      component: () =>
        import(/* webpackChunkName: "client-chunk-workouts" */ '@/views/settings/Settings.vue')
    },
    {
      path: '/settings/general',
      name: 'settings-general',
      component: () =>
        import(/* webpackChunkName: "client-chunk-workouts" */ '@/views/settings/General.vue')
    },
    {
      path: '/settings/hangboards',
      name: 'settings-hangboards',
      component: () =>
        import(/* webpackChunkName: "client-chunk-workouts" */ '@/views/settings/Hangboards.vue')
    },
    {
      path: '/settings/hangboards/add',
      name: 'settings-hangboards-add',
      component: () =>
        import(/* webpackChunkName: "client-chunk-workouts" */ '@/views/settings/AddHangboard.vue')
    },
    {
      path: '/settings/profile',
      name: 'settings-profile',
      component: () =>
        import(/* webpackChunkName: "client-chunk-workouts" */ '@/views/settings/Profile.vue')
    },
    {
      path: '/settings/workouts',
      name: 'settings-workout',
      component: () =>
        import(/* webpackChunkName: "client-chunk-workouts" */ '@/views/settings/Workouts.vue')
    },
    {
      path: '/settings/help',
      name: 'faq',
      component: () =>
        import(/* webpackChunkName: "client-chunk-workouts" */ '@/views/settings/Help.vue')
    },
    {
      path: '/check-login',
      name: 'check-login',
      component: CheckLogin,
      meta: {
        authNotRequired: true
      }
    },
    {
      path: '/login',
      name: 'login',
      component: () =>
        import(/* webpackChunkName: "client-chunk-login" */ '@/views/authentication/Login.vue'),
      meta: {
        authNotRequired: true
      }
    },
    { path: '*', redirect: '/' }
  ]
})

/**
 * Handle user redirections
 */
// eslint-disable-next-line consistent-return
router.beforeEach((to, from, next) => {
  if (
    !(to.meta && to.meta.authNotRequired) &&
    isNil(store.state.authentication.user)
  ) {
    const path =
      store.state.authentication.user === null ? '/login' : '/check-login'
    return next(`${path}?redirectUrl=${to.path}`)
  }
  next()
})

export default router
