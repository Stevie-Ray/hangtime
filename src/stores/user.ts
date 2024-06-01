import { defineStore, storeToRefs } from 'pinia'
import { useAuthentication } from '@/stores/authentication'
import hangboardBrands from '@/helpers/hangboards'
import { Company, Hangboard  } from '@/interfaces/user.interface'

export const useUser = defineStore('user', {
  state: () => ({}),
  actions: {},
  getters: {
    /**
     * Get a hangboard object by company & hangboard ID
     * @return {function(*, *): string}
     */
    getHangboardByIds: () => (companyId: number, hangboardId:number): Hangboard =>
      hangboardBrands
        .find((company: Company) => company.id === companyId)
        .hangboards.find((hangboard: Hangboard) => hangboard.id === hangboardId),
    /**
     * Get a company Name by  ID
     * @return Object
     */
    getCompanyById: () => (companyId: number) =>
      hangboardBrands.find((company: Company) => company.id === companyId),
    /**
     * Get a hangboard Name by company & hangboard ID
     * @return {function(*, *): string}
     */
    getHangboardNameByIds: (getters) => (company: number, hangboard: number) =>
      `${getters.getCompanyById(company).name} -  ${
        getters.getHangboardByIds(company, hangboard).name
      }`,
    /**
     * Get all companies sorted by name
     * @return {({country: string, hangboards: [{image: string, size: {x: null, y: null, z: null}, name: string, holds: number, id: number, type: string, url: null},{image: string, size: {x: number, y: number, z: number}, name: string, holds: number, id: number, type: string, url: string},{image: string, size: {x: number, y: number, z: number}, name: string, holds: number, id: number, type: string, url: string},{image: string, size: {x: number, y: number, z: number}, name: string, holds: number, id: number, type: string, url: string},{image: string, size: {x: null, y: null, z: null}, name: string, holds: number, id: number, type: string, url: null},null], name: string, description: string, location: {lon: string, lat: string}, id: number, socials: {facebook: string, instagram: string}, url: string}|{country: string, hangboards: [{image: string, size: {x: number, y: number, z: number}, name: string, holds: number, id: number, type: string, url: string},{image: string, size: {x: number, y: number, z: number}, name: string, holds: number, id: number, type: string, url: string}], name: string, description: string, location: {lon: string, lat: string}, id: number, socials: {facebook: string, instagram: string}, url: string}|{country: string, hangboards: [{image: string, size: {x: number, y: number, z: null}, name: string, holds: number, id: number, type: string, url: null}], name: string, description: string, location: {lon: string, lat: string}, id: number, socials: {facebook: string, instagram: string}, url: string}|{country: string, hangboards: [{image: string, size: {x: number, y: number, z: number}, name: string, holds: number, id: number, type: string, url: string},{image: string, size: {x: number, y: number, z: number}, name: string, holds: number, id: number, type: string, url: string},{image: string, size: {x: null, y: null, z: null}, name: string, holds: number, id: number, type: string, url: null},{image: string, size: {x: null, y: null, z: null}, name: string, holds: number, id: number, type: string, url: null},{image: string, size: {x: number, y: number, z: number}, name: string, holds: number, id: number, type: string, url: string},null,null], name: string, description: string, location: {lon: string, lat: string}, id: number, socials: {facebook: string, instagram: string}, url: string}|{country: string, hangboards: [{image: string, size: {x: number, y: number, z: number}, name: string, holds: number, id: number, type: string, url: null},{image: string, size: {x: number, y: number, z: number}, name: string, holds: number, id: number, type: string, url: null},{image: string, size: {x: number, y: number, z: number}, name: string, holds: number, id: number, type: string, url: null},{image: string, size: {x: number, y: number, z: number}, name: string, holds: number, id: number, type: string, url: null},{image: string, size: {x: null, y: null, z: null}, name: string, holds: number, id: number, type: string, url: null}], name: string, description: string, location: {lon: string, lat: string}, id: number, socials: {facebook: string, instagram: string}, url: string})[]}
     */
    getCompanies: () => [...hangboardBrands].sort((a: Company, b: Company) => a.name.localeCompare(b.name)),
    /**
     *
     */
    getHangboards: () => {
      const allHangboards = []
      // eslint-disable-next-line no-restricted-syntax
      for (const brand of [...hangboardBrands]) {
        if (brand.hangboards && Array.isArray(brand.hangboards)) {
          allHangboards.push(...brand.hangboards)
        }
      }
      return allHangboards
    },
    /**
     * Get company by its url key
     * @return Array
     */
    getCompanyByUrlKey: () => (url: string) =>
      hangboardBrands.find((company: Company) => company.name.replace(/\s+/g, '-').toLowerCase() === url),
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
    getUserHangboardCompany: (state): Company | boolean => {
      if (!state.getUserHangboards && !state.getUserHangboardSelectedId) return false
      return hangboardBrands[state.getUserHangboards[state.getUserHangboardSelectedId]?.company]
    },
    /**
     * Get the selected Hangboard
     * @return Object
     */
    getUserHangboard: (state): Hangboard | boolean => {
      const userHangboardCompany = state.getUserHangboardCompany
      if (userHangboardCompany === null || userHangboardCompany === undefined) return false

      const selectedHangboardId = state.getUserHangboardSelectedId
      if (selectedHangboardId === null || selectedHangboardId === undefined) return false

      const userHangboards = state.getUserHangboards
      if (!userHangboards || !userHangboards[selectedHangboardId]) return false

      const company = hangboardBrands[userHangboardCompany.id]
      const hangboardId = userHangboards[selectedHangboardId].hangboard
      const selectedHangboard = company.hangboards.find((hangboard: Hangboard) => hangboard.id === hangboardId)

      return selectedHangboard
    }
  }
})
