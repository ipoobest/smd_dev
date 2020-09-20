import classes from '~/utils/classes'

export const state = () => {
  return {
    grade: null,
    error: null
  }
}

export const mutations = {
  setGrade (state, data) {
    state.grade = data
  },
  setError (state, error) {
    state.error = error
  }
}

export const actions = {
         async createGrade({ commit }, object) {
           return new Promise(async (resolve, reject) => {
             try {
               const result = this.$axios.$post(
                 `${process.env.parseUrl}/classes/${classes.grade}`,
                 object
               );

               commit("setGrade", result);
               resolve(result);
             } catch (error) {
               commit(`setError`, error);
               reject(error);
             }
           });
         },
         async getGrade({ commit }) {
           return new Promise(async (resolve, reject) => {
             try {
               const result = this.$axios.$get(
                 `${process.env.parseUrl}/classes/${classes.grade}`
               );

               commit("setGrade", result);
               resolve(result);
             } catch (error) {
               console.log({ error });
               commit(`setError`, error);
               reject(error);
             }
           });
         },
         async getGradeByConditions({ commit }, conditions) {
           return new Promise(async (resolve, reject) => {
             try {
               const where = JSON.stringify(conditions);
               const result = await this.$axios.$get(
                 `${process.env.parseUrl}/classes/${classes.grade}?where=${where}`
               );
               console.log(
                 "grades url",
                 `${process.env.parseUrl}/classes/${classes.grade}?where=${where}`
               );
               // commit('setGrade', result)
               resolve(result);
             } catch (error) {
               console.log({ error });
               commit(`setError`, error);
               reject(error);
             }
           });
         },
         async updateGrade({ commit }, object) {
           return new Promise(async (resolve, reject) => {
             const objectId = object.objectId;
             console.log("grades objecId", objectId);
             try {
               const result = await this.$axios.$put(
                 `${process.env.parseUrl}/classes/${classes.grade}/${objectId}`,
                 object
               );

               commit("setGrade", result);
               resolve(result);
             } catch (error) {
               console.log({ error });
               commit(`setError`, error);
               reject(error);
             }
           });
         },
         async deleteGrade({ commit }, objectId) {
           return new Promise(async (resolve, reject) => {
             try {
               console.log("delete id", objectId);
               const result = this.$axios.$delete(
                 `${process.env.parseUrl}/classes/${classes.grade}/${objectId}`
               );

               commit("setGrade", null);
               resolve(result);
             } catch (error) {
               console.log({ error });
               commit(`setError`, error);
               reject(error);
             }
           });
         },
         async deleteGradeByConditions({ commit }, conditions) {
           return new Promise(async (resolve, reject) => {
             try {
               const where = JSON.stringify(conditions);
               const result = this.$axios.$delete(
                 `${process.env.parseUrl}/classes/${classes.grade}${classes.grade}?where=${where}`
               );

               commit("setGrade", null);
               resolve(result);
             } catch (error) {
               console.log({ error });
               commit(`setError`, error);
               reject(error);
             }
           });
         }
       };