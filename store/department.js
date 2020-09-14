import classes from "~/utils/classes";
export const state = () => {
  return {
    department: null,
    error: null
  };
};

export const mutations = {
  setDepartment(state, data) {
    state.department = data;
  },
  setError(state, error) {
    state.error = error;
  }
};

export const actions = {
  async createDepartment({ commit }, object) {
    return new Promise(async (resolve, reject) => {
      try {
        const result = this.$axios.$post(
          `${process.env.parseUrl}/classes/${classes.department}`,
          object
        );

        commit("setDepartment", result);
        resolve(result);
      } catch (error) {
        commit(`setError`, error);
        reject(error);
      }
    });
  },
  async getDepartment({ commit }) {
    return new Promise(async (resolve, reject) => {
      try {
        const result = this.$axios.$get(
          `${process.env.parseUrl}/classes/${classes.department}`
        );
        commit("setDepartment", result);
        resolve(result);
      } catch (error) {
        console.log({ error });
        commit(`setError`, error);
        reject(error);
      }
    });
  },
  async updateDepartment({ commit }, object) {
    return new Promise(async (resolve, reject) => {
      try {
        const objectId = object.objectId;
        const result = this.$axios.$put(
          `${process.env.parseUrl}/classes/${classes.department}/${objectId}`,
          object
        );

        commit("setDepartment", result);
        resolve(result);
      } catch (error) {
        console.log({ error });
        commit(`setError`, error);
        reject(error);
      }
    });
  }
};
