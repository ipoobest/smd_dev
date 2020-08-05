import classes from '~/utils/classes'

export const state = () => {
  return {
    user: null,
    users: null,
    error: null
  }
}

export const mutations = {
  setUser (state, data) {
    state.student = data
  },
  setUsers (state, data) {
    state.students = data
  },
  setError (state, error) {
    state.error = error
  }
}

export const actions = {
  async createUser ({ commit }, object) {
    return new Promise(async (resolve, reject) => {
      try {
        // console.log('parms', { username, password, type, techerId })
        const result = await this.$axios.$post(`${process.env.parseUrl}/users`, object)
        console.log('create store user ', result)
        commit('setUser', result)
        resolve(result)
      } catch (error) {
        console.log({ error })
        commit(`setError`, error)
        reject(error)
      }
    })
  },
  async getUsers ({ commit }, objectId) {
    return new Promise(async (resolve, reject) => {
      try {
        const result = this.$axios.$get(`${process.env.parseUrl}/users/${objectId}`)

        commit('setUsers', result)
        resolve(result)
      } catch (error) {
        console.log({ error })
        commit(`setError`, error)
        reject(error)
      }
    })
  },
  async getListUser ({ commit }, objectId) {
    return new Promise(async (resolve, reject) => {
      try {
        const result = this.$axios.$get(`${process.env.parseUrl}/users`)

        commit('setUser', result)
        resolve(result)
      } catch (error) {
        console.log({ error })
        commit(`setError`, error)
        reject(error)
      }
    })
  },
  async getUserByConditions ({ commit }, conditions) {
    return new Promise(async (resolve, reject) => {
      try {
        const where = JSON.stringify(conditions)
        console.log('where', where)
        const result = this.$axios.$get(`${process.env.parseUrl}/users?where=${where}`)

        commit('setUser', result)
        resolve(result)
      } catch (error) {
        console.log({ error })
        commit(`setError`, error)
        reject(error)
      }
    })
  },
  async updateUser ({ commit }, data) {
    return new Promise(async (resolve, reject) => {
      try {
        const user = JSON.stringify(data)
        console.log('user.objectId', data.objectId)
        const result = this.$axios.$put(`${process.env.parseUrl}/users/${data.objectId}`, data)

        commit('setUser', result)
        resolve(result)
      } catch (error) {
        console.log({ error })
        commit(`setError`, error)
        reject(error)
      }
    })
  },
  async deleteUser ({ commit }, objectId) {
    return new Promise(async (resolve, reject) => {
      try {
        // console.log('user delete user', `${process.env.parseUrl}/users/${objectId}`)
        const result = this.$axios.$delete(`${process.env.parseUrl}/users/${objectId}`)

        commit('setUser', null)
        resolve(result)
      } catch (error) {
        console.log({ error })
        commit(`setError`, error)
        reject(error)
      }
    })
  },
}