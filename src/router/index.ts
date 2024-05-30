import { createRouter, createWebHistory, RouteRecordRaw, RouteLocationNormalized, NavigationGuardNext } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAuthentication } from '@/stores/authentication'

// 1. Define route components.
// These can be imported from other files

// Account
const AccountPage = () => import('@/views/account/AccountPage.vue')
const AccountGeneralPage = () => import('@/views/account/AccountGeneralPage.vue')
const AccountHangboardsPage = () => import('@/views/account/AccountHangboardsPage.vue')
const AccountHelpPage = () => import('@/views/account/AccountHelpPage.vue')
const AccountPrivacyPage = () => import('@/views/account/AccountPrivacyPage.vue')
const AccountProfilePage = () => import('@/views/account/AccountProfilePage.vue')
const AccountSubscriptionPage = () => import('@/views/account/AccountSubscriptionPage.vue')
const AccountWorkoutsPage = () => import('@/views/account/AccountWorkoutsPage.vue')
// Activity
const ActivityPage = () => import('@/views/activity/ActivityPage.vue')
const ActivityLeaderboardPage = () => import('@/views/activity/ActivityLeaderboardPage.vue')
const ActivityNotificationsPage = () => import('@/views/activity/ActivityNotificationsPage.vue')
// Authentication
const LoginPage = () => import('@/views/authentication/LoginPage.vue')
const CheckLoginPage = () => import('@/views/authentication/CheckLoginPage.vue')
// Brands
const BrandsPage = () => import('@/views/brands/BrandsPage.vue')
const BrandsDetailPage = () => import('@/views/brands/BrandsDetailPage.vue')
// Brands
const WorkoutsPage = () => import('@/views/workouts/WorkoutsPage.vue')
const WorkoutsDetailPage = () => import('@/views/workouts/WorkoutsDetailPage.vue')
const WorkoutsTimerPage = () => import('@/views/workouts/WorkoutsTimerPage.vue')
const WorkoutsQuickPage = () => import('@/views/workouts/WorkoutsQuickPage.vue')

// 2. Define some routes
// Each route should map to a component.
// We'll talk about nested routes later.
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: 'workouts',
    component: WorkoutsPage,
    name: 'HomePage',
    children: []
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
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    // always scroll to top
    return { top: 0 }
  }
})

router.beforeEach( (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
  // ✅ This will work because the router starts its navigation after
  // the router is installed and pinia will be installed too
  const { user } = storeToRefs(useAuthentication())

  if (
    !(to.meta && to.meta.public) &&
    (user.value === null || user.value === undefined) &&
    to.path !== '/iframe.html'
  ) {
    const path = user.value === null ? '/login' : '/check-login'
    next(`${path}?redirectUrl=${to.path}`)
  } else {
    next()
  }
})

export default router
