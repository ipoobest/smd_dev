<template>
  <div>
    init data
    <v-row justify="center">
      <v-col cols="3">
        <v-select
          v-model="classes"
          :items="items"
          label="Standard"
          @change="getStudent()"
        ></v-select>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-btn @click="create" class="success">init</v-btn>
    </v-row>
  </div>
</template>

<script>
export default {
  layout: "assessment",
  async mounted() {
    await this.getStudent().then(result => {
      this.students = result;
    });
  },
  data() {
    return {
      students: [],
      classes: "",
      items: ["ม.1", "ม.2", "ม.3", "ม.4", "ม.5", "ม.6"]
    };
  },
  // 1 get student
  methods: {
    async getStudent() {
      var query = {
        schoolYear: "2563",
        term: "1",
        classRoomLevel: this.classes
      };
      const response = await this.$store.dispatch(
        "grade/getGradeByConditions",
        query
      );
      // console.log('response.results', response.results)
      var students = response.results;
      var resArr = [];
      students.filter(function(item) {
        var i = resArr.findIndex(x => x.studentId == item.studentId);
        if (i <= -1) {
          resArr.push({
            studentId: item.studentId,
            schoolYear: item.schoolYear,
            term: item.term,
            gpa: 0,
            rankingInRoom: 0,
            rankingInClasses: 0,
            classRoomLevel: item.classRoomLevel,
            classRoomName: item.classRoomName
          });
        }
        return null;
      });
      console.log("response.results", resArr);
      this.students = resArr;
      // return resArr
    },
    async createRanking(data) {
      var response = await this.$store.dispatch(`ranking/createRanking`, data);
      console.log("respose create success", response);
    },
    async create() {
      console.log("xxxx");
      this.students.forEach(item => {
        this.createRanking(item);
        // console.log('item : ', item.studentId)
      });
      alert("init success");
    }
  }
};
</script>

<style lang="scss" scoped></style>
