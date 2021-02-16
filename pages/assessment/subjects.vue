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
            <template v-slot:[`item.subjectInfo`]="{ item }">
              {{ item.subject.codet }} {{ item.subject.sname }}
            </template>
            <template v-slot:[`item.teacherName`]="{ item }"
              >{{ item.teachers.title }} {{ item.teachers.firstName }}
              {{ item.teachers.lastName }}</template
            >
            <template v-slot:[`item.actions`]="{ item }">
              <v-btn class="success" @click="score(item)">
                ดูคะแนน
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
  layout: "assessment",
  middleware: "assessment",
  async mounted() {
    this.query = this.$route.query;
    // this.teacherId = this.$store.state.auth.auth.teacherObjectId
    // 
    await this.getTeachByConditions().then(result => (this.items = result));
  },
  watch: {
    dialog(val) {
      val || this.close();
    }
  },
  data() {
    return {
      headers: [
        { text: "รหัส/ชื่อวิชา", value: "subjectInfo" },
        { text: "ระดับชั้น", value: "classRoomLevel" },
        { text: "ห้องเรียน", value: "classRoomName" },
        { text: "ครูผู้สอน", value: "teacherName" },
        { text: "Actions", value: "actions", sortable: false }
      ],
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
      items: [],
      ranking: ""
    };
  },
  methods: {
    async getTeachByConditions() {
      const data = {
        schoolYear: this.$route.query.schoolYear,
        term: this.$route.query.term,
        approved: "true"
      };
      const response = await this.$store.dispatch(
        `teach/getTeachByConditions`,
        data
      );
      // 
      return response.results;
    },

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
      // 
      return response.results;
    },

    async getGradeByConditions(item) {
      // 

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
      // 
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
        "classes/getClassesByConditins",
        conditions
      );
      // 
      // 
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
      // 
      var name = this.getStudentName(response.results);
      return name;
    },
    async createGrade(object) {
      const response = await this.$store.dispatch(`grade/createGrade`, object);
      // 
      return response;
    },

    async addRatingToTach(teach) {
      const response = await this.$store.dispatch(`teach/updateTeach`, teach);
      // 
      return response;
    },
    addPartNumber() {
      this.part_rating = [];
      for (var index = 0; index < this.part_num; index++) {
        this.part_rating.push({ name: "", rating: 0 });
      }
      // 
    },
    addRating(item) {
      this.dialog = true;
      this.teach = item;
      if (item.rating) {
        this.part_num = item.rating.length;
      }
      this.part_rating = item.rating;
      // 
    },
    getRating(item) {
      var rating = [];
      for (var index = 0; index < item.length; index++) {
        rating.push(item[index].name + " " + item[index].rating + " " + 0);
      }
      // 
      return rating;
    },
    getStudentName(item) {
      var studentName = [];
      for (var index = 0; index < item.length; index++) {
        studentName.push(
          item[index].tth + " " + item[index].namet + " " + item[index].snamet
        );
      }
      // 
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
      // 
      return student;
    },
    async score(item) {
      // 
      this.goToPreviewGrade(item);
    },
    
    close() {
      this.dialog = false;
      this.part_num = "";
      setTimeout(() => {}, 300);
    },
    back() {
      this.$router.go(-1);
      // 
    },

    goToPreviewGrade(item) {
      this.$router.push({
        name: "assessment-preview-grade",
        query: { id: item.objectId }
      });
    }
    // goToPreviewScore(item) {
    //   
    //   this.$router.push({
    //     name: "assessment-students",
    //     query: { id: item.classId }
    //   });
    // }
  }
};
</script>

<style lang="scss" scoped></style>
