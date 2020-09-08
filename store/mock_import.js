export const state = () => {
  return {
    student: null,
    students: null,
    error: null
  }
}

export const mutations = {
  setStudent (state, data) {
    state.student = data
  },
  setStudents (state, data) {
    state.students = data
  },
  setError (state, error) {
    state.error = error
  }
}

export const actions = {
  async createStudent({ commit }, object) {
    return new Promise(async (resolve, reject) => {
      try {
        const result = this.$axios.$post(
          `${process.env.parseUrl}/classes/mock_data`,
          object
        );
        commit("setStudent", result);
        resolve(result);
      } catch (error) {
        console.log({ error });
        commit(`setError`, error);
        reject(error);
      }
    });
  }
}