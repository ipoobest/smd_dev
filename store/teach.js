import classes from '~/utils/classes'

export const state = () => {
  return {
    teach: null,
    subjects: null,
    classId: null,
    error: null
  }
}

export const mutations = {
  setTeach (state, data) {
    state.teach = data
  },
  setSubjects (state, data) {
    state.subjects = data
  },
  setClassId (state, data) {
    state.classId = data
  },
  setError (state, error) {
    state.error = error
  }
}

export const actions = {
  async createTeach ({ commit }, object) {
    return new Promise(async (resolve, reject) => {
      try {
        const result = this.$axios.$post(`${process.env.parseUrl}/classes/${classes.teach}`, object)
        console.log('result xxxx', result)
        commit('setTeach', result)
        resolve(result)
      } catch (error) {
        console.log({ error })
        commit(`setError`, error)
        reject(error)
      }
    })
  },
  async getSubjects ({ commit }) {
    return new Promise(async (resolve, reject) => {
      try {
        const result = this.$axios.$get(`${process.env.parseUrl}/classes/${classes.teach}/`)

        commit('setSubjects', result)
        resolve(result)
      } catch (error) {
        console.log({ error })
        commit(`setError`, error)
        reject(error)
      }
    })
  },
  async getSubjectsByConditions ({ commit }, conditions) {
    return new Promise(async (resolve, reject) => {
      try {
        const where = JSON.stringify(conditions)
        console.log('where', where)
        const result = this.$axios.$get(`${process.env.parseUrl}/classes/${classes.teach}/?where=${where}&&limit=500`)

        commit('setSubjects', result)
        resolve(result)
      } catch (error) {
        console.log({ error })
        commit(`setError`, error)
        reject(error)
      }
    })
  },
  async getTeachById ({commit}, id) {
    return new Promise(async (resolve, reject) => {
      try {
        const result = this.$axios.$get(`${process.env.parseUrl}/classes/${classes.teach}/${id}`)
        commit("setSubjects", result);
        resolve(result);        
      } catch (error) {
        console.log({ error });
        commit(`setError`, error);
        reject(error);
      }
    })
  },
  async getTeachByTeacherId ({ commit }, conditions) {
    return new Promise(async (resolve, reject) => {
      try {
        const where = JSON.stringify(conditions);
        const result = this.$axios.$get(
          `${process.env.parseUrl}/classes/${classes.teach}?where=${where}&&limit=500`
        );

        commit("setSubjects", result);
        resolve(result);
      } catch (error) {
        console.log({ error });
        commit(`setError`, error);
        reject(error);
      }
    })
  },
  async getSubjectsByClass ({ commit }, classId) {
    return await this.getSubjects({ class: classId })
  },
  async updateTeach ({ commit }, object) {
    return new Promise(async (resolve, reject) => {
      console.log('update object', object)
      try {
        const result = this.$axios.$put(`${process.env.parseUrl}/classes/${classes.teach}/${object.objectId}`, object)

        commit("setTeach", result);
        resolve(result)
      } catch (error) {
        console.log({ error })
        commit(`setError`, error)
        reject(error)
      }
    })
  },
  async deleteSubjectInTeach ({ commit }, object) {
    return new Promise(async (resolve, reject) => {
      try {
        console.log('data', object)
        const result = this.$axios.$delete(`${process.env.parseUrl}/classes/${classes.teach}/${object}`)
        commit('setSubjects', null)
        resolve(result)
      } catch (error) {
        commit(`setError`, error)
        reject(error)
      }
    })
  }
}