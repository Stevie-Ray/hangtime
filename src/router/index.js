import { createRouter, createWebHistory } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAuthentication } from '@/stores/authentication'

// 1. Define route components.
// These can be imported from other files

// Account
const AccountPage = () =>
  import(/* webpackChunkName: "page-account" */ '@/pages/account/AccountPage.vue')
const AccountGeneralPage = () =>
  import(/* webpackChunkName: "page-account" */ '@/pages/account/AccountGeneralPage.vue')
const AccountHangboardsPage = () =>
  import(/* webpackChunkName: "page-account" */ '@/pages/account/AccountHangboardsPage.vue')
const AccountHelpPage = () =>
  import(/* webpackChunkName: "page-account" */ '@/pages/account/AccountHelpPage.vue')
const AccountPrivacyPage = () =>
  import(/* webpackChunkName: "page-account" */ '@/pages/account/AccountPrivacyPage.vue')
const AccountProfilePage = () =>
  import(/* webpackChunkName: "page-account" */ '@/pages/account/AccountProfilePage.vue')
const AccountSubscriptionPage = () =>
  import(/* webpackChunkName: "page-account" */ '@/pages/account/AccountSubscriptionPage.vue')
const AccountWorkoutsPage = () =>
  import(/* webpackChunkName: "page-account" */ '@/pages/account/AccountWorkoutsPage.vue')
// Activity
const ActivityPage = () =>
  import(/* webpackChunkName: "page-activity" */ '@/pages/activity/ActivityPage.vue')
const ActivityLeaderboardPage = () =>
  import(/* webpackChunkName: "page-activity" */ '@/pages/activity/ActivityLeaderboardPage.vue')
const ActivityNotificationsPage = () =>
  import(/* webpackChunkName: "page-activity" */ '@/pages/activity/ActivityNotificationsPage.vue')
// Authentication
const LoginPage = () =>
  import(/* webpackChunkName: "page-login" */ '@/pages/authentication/LoginPage.vue')
const CheckLoginPage = () =>
  import(/* webpackChunkName: "page-login" */ '@/pages/authentication/CheckLoginPage.vue')
// Brands
const BrandsPage = () =>
  import(/* webpackChunkName: "page-brands" */ '@/pages/brands/BrandsPage.vue')
const BrandsDetailPage = () =>
  import(/* webpackChunkName: "page-brands" */ '@/pages/brands/BrandsDetailPage.vue')
// Brands
const WorkoutsPage = () =>
  import(/* webpackChunkName: "page-workouts" */ '@/pages/workouts/WorkoutsPage.vue')
const WorkoutsDetailPage = () =>
  import(/* webpackChunkName: "page-workouts" */ '@/pages/workouts/WorkoutsDetailPage.vue')
const WorkoutsTimerPage = () =>
  import(/* webpackChunkName: "page-workouts" */ '@/pages/workouts/WorkoutsTimerPage.vue')
const WorkoutsQuickPage = () =>
  import(/* webpackChunkName: "page-workouts" */ '@/pages/workouts/WorkoutsQuickPage.vue')

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
    path: '/workouts/:company:/:hangboard/:id',
    component: WorkoutsDetailPage,
    name: 'WorkoutsDetailPage'
  },
  {
    path: '/workouts/:company:/:hangboard/:id/timer',
    component: WorkoutsTimerPage,
    name: 'WorkoutsTimerPage'
  },
  {
    path: '/workouts/new',
    component: WorkoutsDetailPage,
    name: 'WorkoutsNewPage'
  },
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
  routes,
  scrollBehavior() {
    // always scroll to top
    return { top: 0 }
  }
})

router.beforeEach((to, from, next) => {
  // ✅ This will work because the router starts its navigation after
  // the router is installed and pinia will be installed too
  const { user } = storeToRefs(useAuthentication())

  if (!(to.meta && to.meta.public) && (user.value === null || user.value === undefined)) {
    const path = user.value === null ? '/login' : '/check-login'
    next(`${path}?redirectUrl=${to.path}`)
  }
  next()
})

export default router
