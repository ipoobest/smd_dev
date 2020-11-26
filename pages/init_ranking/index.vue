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
      <!-- <v-btn @click="create" class="success">init</v-btn> -->
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
        "classes/getClassesByAcademicYears",
        query
      );
      // console.log('response.results', response.results)
      var classes = response.results;
      var langht = 0
      console.log('classes', classes)
      classes.forEach(item => {
        item.studentId.forEach(async student => {
          console.log('students xxx', student)
          console.log('student obj',item.schoolYear,item.term, item.classRoomLevel, item.classRoomName, item)
          var data = {
            schoolYear: item.schoolYear,
            term: item.term,
            classRoomLevel: item.classRoomLevel,
            classRoomName: item.classRoomName,
            studentObjectId: student
          }
          console.log('data', data)
          // await this.createRanking(data)
          langht += 1
        })
      })
      console.log('student obj langht', langht)

      // var resArr = [];
      // students.filter(function(item) {
      //   var i = resArr.findIndex(x => x.studentId == item.studentId);
      //   if (i <= -1) {
      //     resArr.push({
      //       studentId: item.studentId,
      //       schoolYear: item.schoolYear,
      //       term: item.term,
      //       gpa: 0,
      //       rankingInRoom: 0,
      //       rankingInClasses: 0,
      //       classRoomLevel: item.classRoomLevel,
      //       classRoomName: item.classRoomName
      //     });
      //   }
      //   return null;
      // });
      // console.log("response.results", resArr);
      // this.students = resArr;
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
