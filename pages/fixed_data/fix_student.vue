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
      // 
      this.studentItems = response.results;
      
    },
    async getStudentFromStudentClass(objectId) {
      var response = await this.$store.dispatch(
        `students/getStudentById`,
        objectId
      );
      
      return response;
    },
    async createRanking(data) {
      var response = await this.$store.dispatch(`ranking/createRanking`, data);
      
    },
    async checkInit() {
      var conditions = {
        schoolYear: "2563",
        term: this.term,
        classRoomLevel: this.classes
      };
      
      var response = await this.$store.dispatch(
        `ranking/getRankingByConditions`,
        conditions
      );
      
      if (response.results.length == 0) {
        return false;
      }
      return true;
    },
    async create() {
      if (await this.checkInit()) {
        alert("ชั้นเรียนนี้ทำการ init ranking แล้ว");
        return
      } else {
        this.studentItems.forEach(item => {
          item.studentId.forEach(async student => {
            //get Students by student
            var studentObject = await this.getStudentFromStudentClass(student);
            // 
            // 
            var data = {
              schoolYear: item.schoolYear,
              term: item.term,
              classRoomLevel: item.classRoomLevel,
              classRoomName: item.classRoomName,
              studentObjectId: student,
              studentName: `${studentObject.tth} ${studentObject.namet} ${studentObject.snamet}`,
              studentId: studentObject.idstd
            };
            
            await this.createRanking(data);
            // length += 1
          });
        });
      }
      alert("init ranking success");
    }
  }
};
</script>

<style lang="scss" scoped></style>
