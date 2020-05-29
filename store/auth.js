import classes from '~/utils/classes'

export const state = () => {
  return {
    auth: null,
    error: null
  }
}

export const mutations = {
  setAuth (state, data) {
    state.auth = data
  },
  setError (state, error) {
    state.error = error
  }
}

export const actions = {
  async login ({ commit }, { data }) {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this.$axios.$get(`${process.env.parseUrl}/login`, {
          params: data
        })
        console.log('auth', result)

        if (result) {
          commit('setAuth', result)
          this.$cookies.set(
            `X-Parse-Session-Token`,
            _.get(result, `sessionToken`, ``)
          )
          resolve(result)
        } else {
          throw new TypeError(`Not active or verify`)
        }
      } catch (error) {
        console.log({ error })
        commit('setError', error)
        reject(error)
      }
    })
  },
  logout ({ commit }) {
    return new Promise((resolve, rejcet) => {
      try {
        this.$cookies.set('X-Parse-Session-Token', '')
        commit('setAuth', null)

        resolve('')
      } catch (error) {
        console.log({ error })
        commit('setError', error)
        reject(error)
      }
    })
  }
}
