<template>
  <v-layout>
    <v-row align="center">
      <v-col cols="12">
        <v-card>
          <v-card-title>
            {{ title }}
            <v-spacer></v-spacer>
          </v-card-title>
          <v-col>
            <v-row>
              <v-col cols="3">
                <v-select
                  v-model="classRoomLevel"
                  :items="classes"
                  dense
                  outlined
                  label="ระดับชั้น"
              /></v-col>
              <v-col cols="3">
                <v-select
                  v-model="classRoomName"
                  :items="Room"
                  dense
                  outlined
                  label="ห้องเรียน"
              /></v-col>
              <v-col cols="1"
                ><v-btn color="success" @click="getStudent()">GET</v-btn></v-col
              >
              <v-col cols="1"
                ><v-btn color="info" @click="update()">update</v-btn></v-col
              >
            </v-row>
          </v-col>
          <v-data-table :headers="headers" :items="items" :search="search">
            <template v-slot:top>
              <v-toolbar flat color="white">
                <v-spacer></v-spacer>
              </v-toolbar>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </v-layout>
</template>

<script>
export default {
  middleware: "authentication",
  layout: "fix_data",
  mounted() {},
  watch: {
    dialog(val) {
      val || this.close();
    },
  },
  data() {
    return {
      headers: [
        { text: "ปีการศึกษา", value: "schoolYear", align: "center" },
        { text: "เทอม", value: "term", align: "center  " },
        { text: "เลขที่", value: "studentNumber", align: "center  " },
        { text: "ชื่อ", value: "studentName", align: "center  " },
        {
          text: "เกรด",
          value: "gpa",
          align: "center  ",
        },
      ],
      dialogCreateYear: false,
      items: [],
      search: ``,
      title: `เกรด`,
      classRoomLevel: "",
      classRoomName: "",
      subject: "",
      department: "",
      departmentNumber: "",
      classes: ["ม.1", "ม.2", "ม.3", "ม.4", "ม.5", "ม.6"],
      Room: ["1", "2", "3", "4", "5"],
      subjectList: [],
      departmentList: [],
    };
  },
  methods: {
    async getStudent() {
      var query = {
        schoolYear: "2563",
        classRoomLevel: this.classRoomLevel,
        classRoomName: this.classRoomName,
      };
      const response = await this.$store.dispatch(
        "ranking/getRankingByConditions",
        query
      );
      console.log("response grade", response.results);
      this.items = response.results;
    },
    async getStudentFromStudentClass(objectId) {
      var response = await this.$store.dispatch(
        `students/getStudentById`,
        objectId
      );
      console.log("response students", response);
      return response;
    },
    async updateRanking(data) {
      var response = await this.$store.dispatch(`ranking/updateRanking`, data);
      console.log("response updata", response);
      //   return response.results;
    },
    async update() {
      for (var index in this.items) {
        // console.log("this obj", this.items[index].studentObjectId);
        var student = await this.getStudentFromStudentClass(
          this.items[index].studentObjectId
        );
        var data = {
          objectId: this.items[index].objectId,
          studentNumber: student.number,
        };
        console.log("data update", data);
        var response = await this.updateRanking(data);
        // console.log("response", response);
      }
      this.getStudent();
    },
  },
};
</script>
