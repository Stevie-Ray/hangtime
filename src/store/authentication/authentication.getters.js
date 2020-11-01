import { isNil } from 'lodash'

export default {
  isUserLoggedIn: state => !isNil(state.user),
  weightShort: state => {
    const { weight } = state.user.settings
    if (!weight) {
      return state.settings.weight[0].short
    }
    return state.settings.weight[weight].short
  }
}
