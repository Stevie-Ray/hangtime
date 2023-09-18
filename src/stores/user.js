import { defineStore, storeToRefs } from 'pinia'
import { useAuthentication } from '@/stores/authentication'
import hangboardBrands from '@/helpers/hangboards'

export const useUser = defineStore('user', {
  state: () => ({}),
  actions: {},
  getters: {
    /**
     * Get a hangboard object by company & hangboard ID
     * @return {function(*, *): string}
     */
    getHangboardByIds: () => (company, hangboard) =>
      hangboardBrands[company].hangboards[hangboard],
    /**
     * Get a company Name by  ID
     * @return Object
     */
    getCompanyById: () => (company) => hangboardBrands[company],
    /**
     * Get a hangboard Name by company & hangboard ID
     * @return {function(*, *): string}
     */
    getHangboardNameByIds: () => (company, hangboard) =>
      `${hangboardBrands[company].name} -  ${hangboardBrands[company].hangboards[hangboard].name}`,
    getCompanies: () =>
      [...hangboardBrands].sort((a, b) => a.name.localeCompare(b.name)),
    /**
     * Get hangboard from a company id
     * @return Array
     */
    getHangboardsByCompanyId: () => (company) =>
      hangboardBrands[company].hangboards,
    /**
     * Get company by its url key
     * @return Array
     */
    getCompanyByUrlKey: () => (url) =>
      hangboardBrands.find(
        (company) => company.name.replace(/\s+/g, '-').toLowerCase() === url
      ),
    /**
     * Get the users hangboards
     * @return Array
     */
    getUserHangboards: () => {
      const { user } = storeToRefs(useAuthentication())
      return user?.value?.settings?.hangboards
    },
    /**
     * Get the selected Hangboard ID
     * @return Number
     */
    getUserHangboardSelectedId: () => {
      const { user } = storeToRefs(useAuthentication())
      return user?.value?.settings?.selected
    },
    /**
     * Get the selected Hangboard Company
     * @return Object
     */
    getUserHangboardCompany: (state) => {
      if (!state.getUserHangboards && !state.getUserHangboardSelectedId)
        return false
      return hangboardBrands[
        state.getUserHangboards[state.getUserHangboardSelectedId]?.company
      ]
    },
    /**
     * Get the selected Hangboard
     * @return Object
     */
    getUserHangboard: (state) => {
      if (!state.getUserHangboardCompany) return false
      return state.getUserHangboardCompany.hangboards[
        state.getUserHangboards[state.getUserHangboardSelectedId]?.hangboard
      ]
    }
  }
})
