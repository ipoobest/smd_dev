<template>
  <v-layout>
    <v-row align="center">
      <v-col cols="12">
        <v-card>
          <v-card-title>
            <v-btn class="mr-5" color="primary" fab small dark @click="back">
              <v-icon>mdi-arrow-left</v-icon>
            </v-btn>
            {{ title }}
            <v-spacer></v-spacer>
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Search"
              single-line
              hide-details
            ></v-text-field>
          </v-card-title>
          <v-data-table :headers="headers" :items="items" :search="search">
            <template v-slot:[`item.actions`]="{ item }">
              <v-btn class="success" @click="addScore(item)">
                ให้คะแนน
              </v-btn>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </v-layout>
</template>

<script>
export default {
  layout: "teacher",
  middleware: "teacher",
  async mounted() {
    this.query = this.$route.query;
    // this.teacherId = this.$store.state.auth.auth.teacherObjectId
    
    await this.getTeachByConditions(this.query.id).then(
      result => (this.items = result)
    );
    // get rating
    // this.part_rating = this.items.rating
    // 
  },
  watch: {
    dialog(val) {
      val || this.close();
    }
  },
  data() {
    return {
      dialog: false,
      formTitle: "เกณฑ์การให้คะแนน",
      title: "เลือกห้องเรียน",
      search: "",
      query: "",
      teacherId: "",
      teach: "",
      dialogCreateTeach: "false",
      part_num: "",
      part_point: [],
      part_rating: [],
      studentsId: [],
      studentsNamr: [],
      rating: [],
      headers: [
        { text: "รหัส/ชื่อวิขา", value: "sname", align: "center" },
        { text: "ระดับชั้น", value: "classRoomLevel", align: "center" },
        { text: "ห้องเรียน", value: "classRoomName", align: "center" },
        { text: "ครูผู้สอน", value: "teacher.name", align: "center" },
        { text: "Actions", value: "actions", sortable: false, align: "center" }
      ],
      items: []
    };
  },
  methods: {
    async getTeachByConditions(teacherId) {
      const data = {
        schoolYear: this.$route.query.schoolYear,
        term: this.$route.query.term,
        "teacher.value": teacherId
      };
      const response = await this.$store.dispatch(
        `teach/getTeachByConditions`,
        data
      );
      
      return response.results;
    },
    async getGradeByConditions(item) {
      

      const conditions = {
        subject: item.sname,
        schoolYear: item.schoolYear,
        term: item.term,
        classRoomLevel: item.classRoomLevel,
        classRoomName: item.classRoomName,
        "teacher.id": item.teacher.value
      };
      const response = await this.$store.dispatch(
        `grade/getGradeByConditions`,
        conditions
      );
      
      return response.results;
    },
    async getStudentByTeach(item) {
      const conditions = {
        schoolYear: item.schoolYear,
        term: item.term,
        classRoomLevel: item.classRoomLevel,
        classRoomName: item.classRoomName
      };
      const response = await this.$store.dispatch(
        "classes/getClassesByConditions",
        conditions
      );
      
      
      return response.results[0].studentId;
    },
    async getStudent(data) {
      const query = {
        objectId: {
          $in: data
        }
      };
      const response = await this.$store.dispatch(
        "students/getStudents",
        query
      );
      
      var name = this.getStudentName(response.results);
      return name;
    },
    async createGrade(object) {
      const response = await this.$store.dispatch(`grade/createGrade`, object);
      
      return response;
    },
    async addRatingToTach(teach) {
      const response = await this.$store.dispatch(`teach/updateTeach`, teach);
      
      return response;
    },
    addPartNumber() {
      this.part_rating = [];
      for (var index = 0; index < this.part_num; index++) {
        this.part_rating.push({ name: "", rating: 0 });
      }
      
    },
    addRating(item) {
      this.dialog = true;
      this.teach = item;
      if (item.rating) {
        this.part_num = item.rating.length;
      }
      this.part_rating = item.rating;
      
    },
    getRating(item) {
      var rating = [];
      for (var index = 0; index < item.length; index++) {
        rating.push(item[index].name + " " + item[index].rating + " " + 0);
      }
      
      return rating;
    },
    getStudentName(item) {
      var studentName = [];
      for (var index = 0; index < item.length; index++) {
        studentName.push(
          item[index].tth + " " + item[index].namet + " " + item[index].snamet
        );
      }
      
      return studentName;
    },
    mapScoreName(name, score) {
      var student = [];
      for (var i = 0; i < name.length; i++) {
        for (var j = 0; j < score.length; j++) {
          student.push({
            name: name[i],
            score: score[j]
          });
        }
      }
      
      return student;
    },
    async addScore(item) {
      // เช็คก่อนว่ามมี data ใน gradeรึยัง (1)
      
      this.goToAddScore(item)
    },
    save() {
      var rating = this.part_rating.map(result => parseInt(result.rating));

      var sum = rating.reduce((a, b) => a + b);
      sum != 100 ? alert("กรุณาทำให้ผลรวม") : null;

      const teach = {
        objectId: this.teach.objectId,
        rating: this.part_rating
      };
      
      this.addRatingToTach(teach);
      this.close();
    },
    close() {
      this.dialog = false;
      this.part_num = "";
      setTimeout(() => {}, 300);
    },
    back() {
      this.$router.go(-1);
      
    },
    goToAddScore(item) {
      this.$router.push({
        name: "teachers-teach-add_score",
        query: {
          id: item.objectId,
          schoolYear: item.schoolYear,
          term: item.term,
          classRoomLevel: item.classRoomLevel,
          classRoomName: item.classRoomName
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped></style>
