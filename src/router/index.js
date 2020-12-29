import Vue from 'vue'
import Router from 'vue-router'
import Head from 'vue-head'
import { isNil } from 'lodash'
import CheckLogin from '@/views/authentication/CheckLogin'
import store from '@/store'

Vue.use(Router)

/* If you don't know about VueHead, please refer to https://github.com/ktquez/vue-head */

Vue.use(Head, {
  complement: process.env.VUE_APP_TITLE
})

/* If you don't know about VueRouter, please refer to https://router.vuejs.org/ */

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      component: () =>
        import(
          /* webpackChunkName: "client-chunk-tabs" */ '@/views/tabs/Tabs.vue'
        ),
      children: [
        {
          path: '/',
          name: 'workouts',
          component: () =>
            import(
              /* webpackChunkName: "client-chunk-tab-workouts" */ '@/views/tabs/Workouts.vue'
            )
        },
        {
          path: '/community',
          name: 'community',
          component: () =>
            import(
              /* webpackChunkName: "client-chunk-tab-community" */ '@/views/tabs/Community.vue'
            )
        },
        {
          path: '/progress',
          name: 'progress',
          component: () =>
            import(
              /* webpackChunkName: "client-chunk-tab-progress" */ '@/views/tabs/Progress.vue'
            )
        }
      ]
    },
    {
      path: '/grades',
      name: 'grades',
      component: () =>
        import(
          /* webpackChunkName: "client-chunk-grades" */ '@/views/grades/Index.vue'
        )
    },
    {
      path: '/quick-workout',
      name: 'quick-workout',
      component: () =>
        import(
          /* webpackChunkName: "client-chunk-quick" */ '@/views/quick/Index.vue'
        )
    },
    {
      path: '/leaderboard',
      name: 'leaderboard',
      component: () =>
        import(
          /* webpackChunkName: "client-chunk-quick" */ '@/views/leaderboard/Index.vue'
        )
    },
    {
      path: '/:userId/workout/new',
      name: 'new-workout',
      component: () =>
        import(
          /* webpackChunkName: "client-chunk-workouts" */ '@/views/workouts/New.vue'
        )
    },
    {
      path: '/:userId/workout/:company/:hangboard/:id',
      name: 'workout',
      props(route) {
        const props = { ...route.params }
        props.company = +props.company
        props.hangboard = +props.hangboard
        return props
      },
      component: () =>
        import(
          /* webpackChunkName: "client-chunk-workouts" */ '@/views/workouts/Workout.vue'
        )
    },
    {
      path: '/:userId/workout/:company/:hangboard/:id/run',
      name: 'run',
      props(route) {
        const props = { ...route.params }
        props.company = +props.company
        props.hangboard = +props.hangboard
        props.index = +props.index
        return props
      },
      component: () =>
        import(
          /* webpackChunkName: "client-chunk-workouts" */ '@/views/workouts/Run.vue'
        )
    },
    {
      path: '/:userId/workout/:company/:hangboard/:id/:index',
      name: 'exercise',
      props(route) {
        const props = { ...route.params }
        props.company = +props.company
        props.hangboard = +props.hangboard
        props.index = +props.index
        return props
      },
      component: () =>
        import(
          /* webpackChunkName: "client-chunk-workouts" */ '@/views/workouts/Exercise.vue'
        )
    },
    {
      path: '/:userId/community/:company/:hangboard/:id',
      name: 'community-workout',
      props: true,
      component: () =>
        import(
          /* webpackChunkName: "client-chunk-workouts" */ '@/views/workouts/Workout.vue'
        )
    },
    {
      path: '/profile/:userId/',
      name: 'user-profile',
      props: true,
      component: () =>
        import(
          /* webpackChunkName: "client-chunk-profile" */ '@/views/user/Profile.vue'
        )
    },
    {
      path: '/progress/record/:index',
      name: 'progress-record',
      props(route) {
        const props = { ...route.params }
        props.index = +props.index
        return props
      },
      component: () =>
        import(
          /* webpackChunkName: "client-chunk-progress" */ '@/views/progress/Record.vue'
        )
    },
    {
      path: '/:userId/progress/list/:index',
      name: 'progress-list',
      props(route) {
        const props = { ...route.params }
        props.index = +props.index
        return props
      },
      component: () =>
        import(
          /* webpackChunkName: "client-chunk-progress" */ '@/views/progress/List.vue'
        )
    },
    {
      path: '/settings',
      name: 'settings',
      component: () =>
        import(
          /* webpackChunkName: "client-chunk-settings" */ '@/views/settings/Settings.vue'
        )
    },
    {
      path: '/settings/general',
      name: 'settings-general',
      component: () =>
        import(
          /* webpackChunkName: "client-chunk-settings" */ '@/views/settings/General.vue'
        )
    },
    {
      path: '/settings/hangboards',
      name: 'settings-hangboards',
      component: () =>
        import(
          /* webpackChunkName: "client-chunk-settings" */ '@/views/settings/Hangboards.vue'
        )
    },
    {
      path: '/settings/hangboards/add',
      name: 'settings-hangboards-add',
      component: () =>
        import(
          /* webpackChunkName: "client-chunk-settings" */ '@/views/settings/AddHangboard.vue'
        )
    },
    {
      path: '/settings/profile',
      name: 'settings-profile',
      component: () =>
        import(
          /* webpackChunkName: "client-chunk-settings" */ '@/views/settings/Profile.vue'
        )
    },
    {
      path: '/settings/workouts',
      name: 'settings-workout',
      component: () =>
        import(
          /* webpackChunkName: "client-chunk-settings" */ '@/views/settings/Workouts.vue'
        )
    },
    {
      path: '/settings/notifications',
      name: 'settings-notifications',
      component: () =>
        import(
          /* webpackChunkName: "client-chunk-settings" */ '@/views/settings/Notifications.vue'
        )
    },
    {
      path: '/settings/help',
      name: 'faq',
      component: () =>
        import(
          /* webpackChunkName: "client-chunk-settings" */ '@/views/settings/Help.vue'
        )
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
        import(
          /* webpackChunkName: "client-chunk-login" */
          /* webpackPreload: true */
          '@/views/authentication/Login.vue'
        ),
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
