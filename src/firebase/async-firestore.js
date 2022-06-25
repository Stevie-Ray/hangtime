import firebase from 'firebase/compat/app'
import { isNil } from 'lodash'

let asyncFirestore = null

// Lazy load firestore with async import is important for performance

export default () => {
  if (isNil(asyncFirestore)) {
    asyncFirestore = import(
      /* webpackChunkName: "chunk-firestore" */ 'firebase/compat/firestore'
    ).then(() => {
      firebase.firestore().settings({})
      firebase.firestore().enablePersistence({ synchronizeTabs: true })
      return firebase.firestore()
    })
  }
  return asyncFirestore
}
