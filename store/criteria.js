import classes from "~/utils/classes";
export const state = () => {
  return {
    criteria: null,
    error: null
  };
};

export const mutations = {
  setCriteria(state, data) {
    state.Criteria = data;
  },
  setError(state, error) {
    state.error = error;
  }
};

export const actions = {
  async createCriteria({ commit }, object) {
    return new Promise(async (resolve, reject) => {
      try {
        const result = this.$axios.$post(
          `${process.env.parseUrl}/classes/${classes.criteria}`,
          object
        );

        commit("setCriteria", result);
        resolve(result);
      } catch (error) {
        commit(`setError`, error);
        reject(error);
      }
    });
  },
  async getCriteria({ commit }) {
    return new Promise(async (resolve, reject) => {
      try {
        const result = this.$axios.$get(
          `${process.env.parseUrl}/classes/${classes.criteria}`
        );

        commit("setCriteria", result);
        resolve(result);
      } catch (error) {
        console.log({ error });
        commit(`setError`, error);
        reject(error);
      }
    });
  },
  async updateCriteria({ commit }, object) {
    return new Promise(async (resolve, reject) => {
      try {
        const objectId = object.objectId;
        const result = this.$axios.$put(
          `${process.env.parseUrl}/classes/${classes.criteria}/${objectId}`,
          object
        );

        commit("setCriteria", result);
        resolve(result);
      } catch (error) {
        console.log({ error });
        commit(`setError`, error);
        reject(error);
      }
    });
  }
};
