import { isNil } from 'lodash'

export default {
  isUserLoggedIn: (state) => !isNil(state.user),
  weightShort: (state) => {
    let weight
    if (state.user) {
      weight = state.user.settings.weight
    }
    if (typeof weight === 'undefined') {
      return state.settings.weight[0].short
    }
    return state.settings.weight[weight].short
  }
}
