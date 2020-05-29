import VuexPersistence from 'vuex-persist'

export default ({ store }) => {
  new VuexPersistence({
    storage: window.localStorage,
    reducer: state => {
      return { auth: state.auth }
    }
  }).plugin(store)
}