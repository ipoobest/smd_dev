import classes from '~/utils/classes'

export const state = () => {
  return {
    student: null,
    students: null,
    error: null
  }
}

export const mutations = {
  setStudent(state, data) {
    state.student = data
  },
  setStudents(state, data) {
    state.students = data
  },
  setError(state, error) {
    state.error = error
  }
}

export const actions = {
         async createStudent({ commit }, object) {
           return new Promise(async (resolve, reject) => {
             try {
               const result = this.$axios.$post(
                 `${process.env.parseUrl}/classes/${classes.students}`,
                 object
               );
               console.log("student create", result);
               commit("setStudent", result);
               resolve(result);
             } catch (error) {
               console.log({ error });
               commit(`setError`, error);
               reject(error);
             }
           });
         },
         async getStudent({ commit }) {
           return new Promise(async (resolve, reject) => {
             try {
               const result = this.$axios.$get(
                 `${process.env.parseUrl}/classes/${classes.students}`
               );

               commit("setStudent", result);
               resolve(result);
             } catch (error) {
               console.log({ error });
               commit(`setError`, error);
               reject(error);
             }
           });
         },
         async getStudents({ commit }, conditions) {
           return new Promise(async (resolve, reject) => {
             try {
               const where = JSON.stringify(conditions);
               console.log("where", where);
               const result = this.$axios.$get(
                 `${process.env.parseUrl}/classes/${classes.students}?where=${where}`
               );
               commit("setStudents", result);
               resolve(result);
             } catch (error) {
               console.log({ error });
               commit(`setError`, error);
               reject(error);
             }
           });
         },
         async getStudentById({ commit }, studentId) {
            return new Promise(async (resolve, reject) => {
              try {
                const result = this.$axios.$get(
                  `${process.env.parseUrl}/classes/${classes.students}/${studentId}`
                );
                commit("setStudent", result);
                resolve(result);
              } catch (error) {
                console.log({ error });
                commit(`setError`, error);
                reject(error);
              }
            });
         },
         async updateStudent({ commit }, { objectId, object }) {
           return new Promise(async (resolve, reject) => {
             try {
               const result = this.$axios.$put(
                 `${process.env.parseUrl}/classes/${classes.students}/${objectId}`,
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
       };