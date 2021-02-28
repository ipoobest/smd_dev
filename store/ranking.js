import classes from "~/utils/classes";

export const state = () => {
  return {
    ranking: null,
    error: null
  };
};

export const mutations = {
  setRanking(state, data) {
    state.ranking = data;
  },
  setError(state, error) {
    state.error = error;
  }
};

export const actions = {
  async createRanking({ commit }, object) {
    return new Promise(async (resolve, reject) => {
      try {
        const result = this.$axios.$post(
          `${process.env.parseUrl}/classes/${classes.ranking}/`,
          object
        );
        console.log("result xxxx", result);
        commit("setRanking", result);
        resolve(result);
      } catch (error) {
        console.log({ error });
        commit(`setError`, error);
        reject(error);
      }
    });
  },
  async getRanking({ commit }) {
    return new Promise(async (resolve, reject) => {
      try {
        const result = this.$axios.$get(
          `${process.env.parseUrl}/classes/${classes.ranking}?limit=1000`
        );

        commit("setRanking", result);
        resolve(result);
      } catch (error) {
        console.log({ error });
        commit(`setError`, error);
        reject(error);
      }
    });
  },
  async getRankingByConditions({ commit }, conditions) {
    return new Promise(async (resolve, reject) => {
      try {
        const where = JSON.stringify(conditions);
        console.log("where", where);
        const result = this.$axios.$get(
          `${process.env.parseUrl}/classes/${classes.ranking}?where=${where}&limit=1000`
        );
        commit("setRanking", result);
        resolve(result);
      } catch (error) {
        console.log({ error });
        commit(`setError`, error);
        reject(error);
      }
    });
  },
  async getRankingCount({ commit }, conditions) {
    return new Promise(async (resolve, reject) => {
      try {
        const where = JSON.stringify(conditions);
        console.log("where", where);
        const result = this.$axios.$get(
          `${process.env.parseUrl}/classes/${classes.ranking}?where=${where}&count=1&limit=0`
        );

        commit("setRanking", result);
        resolve(result);
      } catch (error) {
        console.log({ error });
        commit(`setError`, error);
        reject(error);
      }
    });
  },
  async getRankingByConditions({ commit }, conditions) {
    return new Promise(async (resolve, reject) => {
      try {
        const where = JSON.stringify(conditions);
        console.log("where", where);
        const result = this.$axios.$get(
          `${process.env.parseUrl}/classes/${classes.ranking}?where=${where}&limit=1000`
        );

        commit("setRanking", result);
        resolve(result);
      } catch (error) {
        console.log({ error });
        commit(`setError`, error);
        reject(error);
      }
    });
  },

  async updateRanking({ commit }, object) {
    return new Promise(async (resolve, reject) => {
      try {
        console.log("data", object);
        const result = this.$axios.$put(
          `${process.env.parseUrl}/classes/${classes.ranking}/${object.objectId}`,
          object
        );
        commit("setRanking", result);
        resolve(result);
      } catch (error) {
        commit(`setError`, error);
        reject(error);
      }
    });
  }
};
