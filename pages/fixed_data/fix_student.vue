<template>
  <div>
    init data
    <v-row justify="center">
      <v-col cols="3">
        <v-select
          :disabled="true"
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
        "classes/getClassesByConditions",
        query
      );
      // console.log('response.results', response.results)
      var classes = response.results;
      // var length = 0
      console.log("classes", classes);
      classes.forEach(item => {
        item.studentId.forEach(async student => {
          //get Students by student
          var studentObject = await this.getStudentFromStudentClass(student);
          // console.log('students xxx', `${studentObject.tth} ${studentObject.namet} ${studentObject.snamet}`)
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
          // length += 1
        });
      });
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
