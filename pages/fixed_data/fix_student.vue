<template>
  <div>
    init data
    <v-row justify="center">
      <v-col cols="3">
        <v-select
          :disabled="false"
          v-model="classes"
          :items="items"
          label="ชั้นเรียน"
        ></v-select>
      </v-col>
      <v-col cols="3">
        <v-select
          :disabled="false"
          v-model="term"
          :items="terms"
          label="เทอม"
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
  layout: "fix_data",
  async mounted() {
    await this.getStudent().then(result => {
      this.students = result;
    });
  },
  data() {
    return {
      students: [],
      classes: "",
      term: "",
      studentItems: [],
      items: ["ม.1", "ม.2", "ม.3", "ม.4", "ม.5", "ม.6"],
      terms: ["1", "2"]
    };
  },
  // 1 get student
  methods: {
    async getStudent() {
      var query = {
        schoolYear: "2563",
        term: this.term,
        classRoomLevel: this.classes
      };
      const response = await this.$store.dispatch(
        "classes/getClassesByConditions",
        query
      );
      // console.log("response.results", response.results);
      this.studentItems = response.results;
      console.log("response.results", this.studentItems);
    },
    async getStudentFromStudentClass(objectId) {
      var response = await this.$store.dispatch(
        `students/getStudentById`,
        objectId
      );
      console.log("respose create success", response);
      return response;
    },
    async createRanking(data) {
      var response = await this.$store.dispatch(`ranking/createRanking`, data);
      console.log("respose create success", response);
    },
    async checkInit() {
      var conditions = {
        schoolYear: "2563",
        term: this.term,
        classRoomLevel: this.classes
      };
      console.log("check Init", conditions);
      var response = await this.$store.dispatch(
        `ranking/getRankingByConditions`,
        conditions
      );
      console.log("response ranking length", response.results.length);
      if (response.results.length == 0) {
        return false;
      }
      return true;
    },
    async initRanking() {
      console.log("init ranking");
      for (var item of this.studentItems) {
        for (var student of item.studentId) {
          var studentObject = await this.getStudentFromStudentClass(student);
          // console.log('student obj',item.schoolYear,item.term, item.classRoomLevel, item.classRoomName, studentObject)
          var data = {
            schoolYear: item.schoolYear,
            term: item.term,
            classRoomLevel: item.classRoomLevel,
            classRoomName: item.classRoomName,
            studentObjectId: student,
            studentName: `${studentObject.tth} ${studentObject.namet} ${studentObject.snamet}`,
            studentId: studentObject.idstd
          };
          console.log("data", data);
          await this.createRanking(data);
        }
      }
      alert("init ranking success");
    },
    async create() {
      if (await this.checkInit()) {
        alert("ชั้นเรียนนี้ทำการ init ranking แล้ว");
      } else {
        this.initRanking();
        // this.studentItems.forEach(item => {
        //   item.studentId.forEach(async student => {
        //     //get Students by student
        //     var studentObject = await this.getStudentFromStudentClass(student);
        //     // console.log('students xxx', `${studentObject.tth} ${studentObject.namet} ${studentObject.snamet}`)
        //     // console.log('student obj',item.schoolYear,item.term, item.classRoomLevel, item.classRoomName, studentObject)
        //     var data = {
        //       schoolYear: item.schoolYear,
        //       term: item.term,
        //       classRoomLevel: item.classRoomLevel,
        //       classRoomName: item.classRoomName,
        //       studentObjectId: student,
        //       studentName: `${studentObject.tth} ${studentObject.namet} ${studentObject.snamet}`,
        //       studentId: studentObject.idstd
        //     };
        //     console.log("data", data);
        //     await this.createRanking(data);
        // length += 1
        //   });
        // });
      }
      // alert("init ranking success");
    }
  }
};
</script>

<style lang="scss" scoped></style>
