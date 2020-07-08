import classes from '~/utils/classes'

export const state = () => {
  return {
    teacher: null,
    teachers: null,
    error: null
  }
}

export const mutations = {
  setTeacher(state, data) {
    state.teacher = data
  },
  setTeachers(state, data) {
    state.teachers = data
  },
  setError(state, error) {
    state.error = error
  }
}

export const actions = {
  async createTeacher({ commit }, object) {
    return new Promise(async (resolve, reject) => {
      try {
        const result = this.$axios.$post(`${process.env.parseUrl}/classes/${classes.teachers}`, object)

        commit('setTeacher', result)
        resolve(result)
      } catch (error) {
        commit(`setError`, error)
        reject(error)
      }
    })
  },
  async getTeacher({ commit }) {
    return new Promise(async (resolve, reject) => {
      try {
        const result = this.$axios.$get(`${process.env.parseUrl}/classes/${classes.teachers}`)
        
        commit('setTeacher', result)
        resolve(result)
      } catch (error) {
        console.log({ error })
        commit(`setError`, error)
        reject(error)
      }
    })
  },
  async getTeachers({ commit }, conditions) {
    return new Promise(async (resolve, reject) => {
      try {
        const where = JSON.stringify(conditions)
        const result = await this.$axios.$get(`${process.env.parseUrl}/users?where=${where}`)
        console.log('teacher url', `${process.env.parseUrl}/users?where=${where}`)
        commit('setTeachers', result)
        resolve(result)
      } catch (error) {
        console.log({ error })
        commit(`setError`, error)
        reject(error)
      }
    })
  },
  async getTeachersByClass({ commit }, classId) {
    return await this.getTeachers({ class: classId })
  },
  async updateTeacher({ commit },  object ) {
    return new Promise(async (resolve, reject) => {
      const objectId = object.objectId
      console.log('teacher objecId', objectId)
      try {
        const result = this.$axios.$put(`${process.env.parseUrl}/classes/${classes.teachers}/${objectId}`, object)

        commit('setTeacher', result)
        resolve(result)
      } catch (error) {
        console.log({ error })
        commit(`setError`, error)
        reject(error)
      }
    })
  },
  async deleteTeacher ({ commit }, objectId ) {
    return new Promise(async (resolve, reject) => {
      try {
        console.log('delete id', objectId)
        const result = this.$axios.$delete(`${process.env.parseUrl}/classes/${classes.teachers}/${objectId}`)

        commit('setTeacher', null)
        resolve(result)
      } catch (error) {
        console.log({ error })
        commit(`setError`, error)
        reject(error)
      }
    })
  },
}