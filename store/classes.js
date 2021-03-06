import classes from '~/utils/classes'

export const store = () => {
  return {
    class: null,
    classes: null,
    error: null
  }
}

export const mutations = {
  setClass (state, data) {
    state.class = data
  },
  setClasses(state, data){
    state.classes = data
  },
  setError(state, error) {
    state.error = error
  }
}

export const actions = {
  async createClasses ({ commit }, object) {
    return new Promise(async (resolve, reject) => {
      try {
        const result = this.$axios.$post(`${process.env.parseUrl}/classes/${classes.class}`, object)
        commit('setClass', result)
        resolve(result)
      } catch (error) {
        console.log({ error })
        commit(`setError`, error)
        reject(error)
      }
    })
  },
  async getClass ({ commit }, classId) {
    return new Promise(async (resolve, reject) => {
      try {
        const result = this.$axios.$get(`${process.env.parseUrl}/classes/${classes.class}/${classId}`)
        commit('setClass', result)
        resolve(result)
      } catch (error) {
        console.log({ error })
        commit(`setError`, error)
        reject(error)
      }
    })
  },
  async getListClasses ({ commit } ) {
    return new Promise(async (resolve, reject) => {
      try {
        const result = this.$axios.$get(`${process.env.parseUrl}/classes/${classes.class}`)
        commit('setClasses', result)
        resolve(result)
      } catch (error) {
        console.log({ error })
        commit(`setError`, error)
        reject(error)
      }
    })
  },

  async getClassesByConditions ({ commit }, conditions) {
    return new Promise(async (resolve, reject) => {
      try {
        const where = JSON.stringify(conditions)
        const result = this.$axios.$get(
          `${process.env.parseUrl}/classes/${classes.class}/?where=${where}&order=classRoomId`
        );
        commit('setClasses', result)
        resolve(result)
      } catch (error) {
        console.log({ error })
        commit(`setError`, error)
        reject(error)
      }
    })
  },  
  async updateClasses ({ commit }, object) {
    return new Promise(async (resolve, reject) => {
      try {
        // console.log(object)
        const result = this.$axios.$put(`${process.env.parseUrl}/classes/${classes.class}/${object.objectId}`,  object )

        commit('setClasses', result)
        resolve(result)
      } catch (error) {
        console.log({ error })
        commit(`setError`, error)
        reject(error)
      }
    })
  },
  async deleteClass ({ commit }, objectId) {
    return new Promise(async (resolve, reject) => {
      try {
        const result = this.$axios.$delete(`${process.env.parseUrl}/classes/${classes.class}/${objectId}`)
        console.log('delete this', result)

        commit('setClass', null)
        resolve(result)
      } catch (error) {
        console.log({ error })
        commit(`setError`, error)
        reject(error)
      }
    })
  },    
}  