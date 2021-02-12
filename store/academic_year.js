import classes from "~/utils/classes";

export const store = () => {
  return {
    academicYear: null,
    schoolYear: null,
    term: null,
    error: null
  };
};

export const mutations = {
  setAcademicYear(state, data) {
    state.academicYear = data;
  },
  setSchoolYear(state, data) {
    state.schoolYear = data;
  },
  setTerm(state, data) {
    state.term = data;
  },
  setError(state, error) {
    state.error = error;
  }
};

export const actions = {
  async createAcademicYear({ commit }, object) {
    return new Promise(async (resolve, reject) => {
      try {
        const result = this.$axios.$post(
          `${process.env.parseUrl}/classes/${classes.academicYear}`,
          object
        );
        console.log("academicYear create", result);
        commit("setAcademicYear", result);
        resolve(result);
      } catch (error) {
        console.log({ error });
        commit(`setError`, error);
        reject(error);
      }
    });
  },
  async getAcademicYear({ commit }) {
    return new Promise(async (resolve, reject) => {
      try {
        const result = this.$axios.$get(
          `${process.env.parseUrl}/classes/${classes.academicYear}`
        );

        commit("setAcademicYear", result);
        resolve(result);
      } catch (error) {
        console.log({ error });
        commit(`setError`, error);
        reject(error);
      }
    });
  },
  async getAcademicYear({ commit }) {
    return new Promise(async (resolve, reject) => {
      try {
        const result = this.$axios.$get(
          `${process.env.parseUrl}/classes/${classes.academicYear}`
        );

        commit("setAcademicYear", result);
        resolve(result);
      } catch (error) {
        console.log({ error });
        commit(`setError`, error);
        reject(error);
      }
    });
  },
  async getAcademicYearByCondition({ commit }, conditions) {
    return new Promise(async (resolve, reject) => {
      try {
        const where = JSON.stringify(conditions);
        const result = this.$axios.$get(
          `${process.env.parseUrl}/classes/${classes.academicYear}/?where=${where}`
        );

        commit("setAcademicYear", result);
        resolve(result);
      } catch (error) {
        console.log({ error });
        commit(`setError`, error);
        reject(error);
      }
    });
  },
  async deleteAcademicYear({ commit }, objectId) {
    return new Promise(async (resolve, reject) => {
      try {
        const result = this.$axios.$delete(
          `${process.env.parseUrl}/classes/${classes.academicYear}/${objectId}`
        );

        commit("setAcademicYear", null);
        resolve(result);
      } catch (error) {
        console.log({ error });
        commit(`setError`, error);
        reject(error);
      }
    });
  }
};
