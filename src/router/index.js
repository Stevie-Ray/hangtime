import { createRouter, createWebHistory } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAuthentication } from '@/stores/authentication'

// 1. Define route components.
// These can be imported from other files
import AccountPage from '@/pages/account/AccountPage'
import AccountGeneralPage from '@/pages/account/AccountGeneralPage'
import AccountHangboardsPage from '@/pages/account/AccountHangboardsPage'
import AccountHelpPage from '@/pages/account/AccountHelpPage'
import AccountPrivacyPage from '@/pages/account/AccountPrivacyPage'
import AccountProfilePage from '@/pages/account/AccountProfilePage'
import AccountSubscriptionPage from '@/pages/account/AccountSubscriptionPage'
import AccountWorkoutsPage from '@/pages/account/AccountWorkoutsPage'

import ActivityPage from '@/pages/activity/ActivityPage'
import ActivityLeaderboardPage from '@/pages/activity/ActivityLeaderboardPage'
import ActivityNotificationsPage from '@/pages/activity/ActivityNotificationsPage'

import BrandsPage from '@/pages/brands/BrandsPage'
import BrandsDetailPage from '@/pages/brands/BrandsDetailPage'

import LoginPage from '@/pages/authentication/LoginPage'
import CheckLoginPage from '@/pages/authentication/CheckLoginPage'

import WorkoutsPage from '@/pages/workouts/WorkoutsPage'
import WorkoutsDetailPage from '@/pages/workouts/WorkoutsDetailPage'
import WorkoutsTimerPage from '@/pages/workouts/WorkoutsTimerPage'
import WorkoutsQuickPage from '@/pages/workouts/WorkoutsQuickPage'

// 2. Define some routes
// Each route should map to a component.
// We'll talk about nested routes later.
const routes = [
  {
    path: '/',
    redirect: 'workouts',
    component: WorkoutsPage,
    name: 'HomePage'
  },
  {
    path: '/login',
    component: LoginPage,
    name: 'LoginPage',
    meta: { public: true }
  },
  {
    path: '/check-login',
    component: CheckLoginPage,
    name: 'CheckLoginPage',
    meta: { public: true }
  },
  { path: '/activity', component: ActivityPage, name: 'ActivityPage' },
  {
    path: '/activity/notifications',
    component: ActivityNotificationsPage,
    name: 'ActivityNotificationsPage'
  },
  {
    path: '/activity/leaderboard',
    component: ActivityLeaderboardPage,
    name: 'ActivityLeaderboardPage'
  },
  { path: '/workouts', component: WorkoutsPage, name: 'WorkoutsPage' },
  {
    path: '/workouts/:id',
    component: WorkoutsDetailPage,
    name: 'WorkoutsDetailPage'
  },
  {
    path: '/workouts/:id/timer',
    component: WorkoutsTimerPage,
    name: 'WorkoutsTimerPage'
  },
  // { path: '/workouts/new', component: WorkoutsDetailPage, name: 'WorkoutsNewPage' },
  {
    path: '/workouts/quick',
    component: WorkoutsQuickPage,
    name: 'WorkoutsQuickPage'
  },
  {
    path: '/workouts/community',
    component: WorkoutsPage,
    name: 'WorkoutsCommunityPage'
  },
  { path: '/account', component: AccountPage, name: 'AccountPage' },
  {
    path: '/account/profile',
    component: AccountProfilePage,
    name: 'AccountProfilePage'
  },
  {
    path: '/account/general',
    component: AccountGeneralPage,
    name: 'AccountGeneralPage'
  },
  {
    path: '/account/hangboards',
    component: AccountHangboardsPage,
    name: 'AccountHangboardsPage'
  },
  {
    path: '/account/workouts',
    component: AccountWorkoutsPage,
    name: 'AccountWorkoutsPage'
  },
  {
    path: '/account/subscription',
    component: AccountSubscriptionPage,
    name: 'AccountSubscriptionPage'
  },
  {
    path: '/account/help',
    component: AccountHelpPage,
    name: 'AccountHelpPage'
  },
  {
    path: '/brands',
    component: BrandsPage,
    name: 'BrandsPage',
    meta: { public: true }
  },
  {
    path: '/brands/:id',
    component: BrandsDetailPage,
    name: 'BrandsDetailPage',
    meta: { public: true }
  },
  {
    path: '/privacy',
    component: AccountPrivacyPage,
    name: 'AccountPrivacyPage',
    meta: { public: true }
  }
]

// 3. Create the router instance and pass the `routes` option
// You can pass in additional options here, but let's
// keep it simple for now.
const router = createRouter({
  // 4. Provide the history implementation to use.
  history: createWebHistory(),
  routes // short for `routes: routes`
})

router.beforeEach((to, from, next) => {
  // ✅ This will work because the router starts its navigation after
  // the router is installed and pinia will be installed too
  const { user } = storeToRefs(useAuthentication())

  if (
    !(to.meta && to.meta.public) &&
    (user.value === null || user.value === undefined)
  ) {
    const path = user.value === null ? '/login' : '/check-login'
    next(`${path}?redirectUrl=${to.path}`)
    return
  }
  next()
})

export default router
