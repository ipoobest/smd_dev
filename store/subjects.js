import classes from '~/utils/classes'

export const state = () => {
  return {
    subject: null,
    subjects: null,
    error: null
  }
}

export const mutations = {
  setSubject(state, data) {
    state.subject = data
  },
  setSubjects(state, data) {
    state.subjects = data
  },
  setError(state, error) {
    state.error = error
  }
}

export const actions = {
  async createSubject({ commit }, object) {
    return new Promise(async (resolve, reject) => {
      try {
        const result = this.$axios.$post(`${process.env.parseUrl}/classes/${classes.subjects}`, object)

        commit('setSubject', result)
        resolve(result)
      } catch (error) {
        console.log({ error })
        commit(`setError`, error)
        reject(error)
      }
    })
  },
  async getSubject({ commit }, objectId) {
    return new Promise(async (resolve, reject) => {
      try {
        const result = this.$axios.$get(`${process.env.parseUrl}/classes/${classes.subjects}/${objectId}`)
        
        commit('setSubject', result)
        resolve(result)
      } catch (error) {
        console.log({ error })
        commit(`setError`, error)
        reject(error)
      }
    })
  },
  async getSubjects({ commit }) {
    return new Promise(async (resolve, reject) => {
      try {
        const result = this.$axios.$get(`${process.env.parseUrl}/classes/${classes.subjects}`)

        commit('setSubjects', result)
        resolve(result)
      } catch (error) {
        console.log({ error })
        commit(`setError`, error)
        reject(error)
      }
    })
  },
  async getSubjectsByConditions ({ commit }, conditions){
    return new Promise(async (resolve, reject) => {
      try {
        const where = JSON.stringify(conditions)
        console.log('where', where)
        const result = this.$axios.$get(`${process.env.parseUrl}/classes/${classes.subjects}?where=${where}`)

        commit("setSubjects", result);
        resolve(result)
      } catch (error) {
        console.log({ error })
        commit(`setError`, error)
        reject(error)
      }
    })
  },
  async getSubjectsByClass({ commit }, classId) {
    return await this.getSubjects({ class: classId })
  },
  async updateSubject({ commit },  object ) {
    return new Promise(async (resolve, reject) => {
      console.log('update object', object)
      try {
        const result = this.$axios.$put(`${process.env.parseUrl}/classes/${classes.subjects}/${object.objectId}`, object)

        commit('setSubject', result)
        resolve(result)
      } catch (error) {
        console.log({ error })
        commit(`setError`, error)
        reject(error)
      }
    })
  },
  async deleteSubject({ commit }, object) {
    return new Promise(async (resolve, reject) => {
      try {
        console.log('data', object)
        const result = this.$axios.$delete(`${process.env.parseUrl}/classes/${classes.subjects}/${object}`)
        commit('setSubjects', null)
        resolve(result)
      } catch (error){
        commit(`setError`, error)
        reject(error)
      }
    })
  }
}