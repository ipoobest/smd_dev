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
          <v-simple-table width="100%">
            <template v-slot:default>
              <thead>
                <tr>
                  <th>รหัส/ชื่อวิขา</th>
                  <th>ระดับชั้น</th>
                  <th>ห้องเรียน</th>
                  <th>ครูผู้สอน</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{{ staff.staffType }}</td>
                  <td>{{ staff.classes }}</td>
                  <td>รวม</td>
                  <td>รวม</td>
                  <td><v-btn color="success">สรุป</v-btn></td>
                </tr>
                <tr v-for="item in items" :key="item.index">
                  <td v-if="item.teachInfo">
                    {{ item.teachInfo.codet }} {{ item.teachInfo.sname }}
                  </td>
                  <td v-else>
                    {{ item.subject.codet }} {{ item.subject.sname }}
                  </td>
                  <td>{{ item.classRoomLevel }}</td>
                  <td>{{ item.classRoomName }}</td>
                  <td v-if="item.teacher">{{ item.teacher.name }}</td>
                  <td v-else>
                    {{ item.teachers.title }} {{ item.teachers.firstName }}
                    {{ item.teachers.lastName }}
                  </td>
                  <td><v-btn @click="goToPreviewGrade(item)">จัดการ</v-btn></td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-card>
      </v-col>
    </v-row>
  </v-layout>
</template>

<script>
export default {
  layout: "staff",
  middleware: "staff",
  async mounted() {
    this.staff = this.$store.state.auth.auth;

    this.getSubjectsByConditions().then((result) => (this.items = result));
  },
  watch: {
    dialog(val) {
      val || this.close();
    },
  },
  data() {
    return {
      dialog: false,
      formTitle: "เกณฑ์การให้คะแนน",
      title: "เลือกห้องเรียน",
      search: "",
      items: [],
      staff: {},
    };
  },
  methods: {
    async getSubjectsByConditions() {
      const conditions = {
        schoolYear: this.$route.query.schoolYear,
        term: this.$route.query.term,
        send_score: true,
        // "subject_info.sname": {
        //   $regex: `^${this.staff.staffType}`
        // },
        department: `${this.staff.staffType}`,
        classRoomLevel: {
          $in: this.staff.classes,
        },
      };

      const response = await this.$store.dispatch(
        `teach/getSubjectsByConditions`,
        conditions
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
        "teacher.id": item.teacher.value,
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
        classRoomName: item.classRoomName,
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
          $in: data,
        },
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
            score: score[j],
          });
        }
      }

      return student;
    },
    async addScore(item) {
      // เช็คก่อนว่ามมี data ใน gradeรึยัง (1)

      this.goToAddScore(item);
    },
    save() {
      var rating = this.part_rating.map((result) => parseInt(result.rating));

      var sum = rating.reduce((a, b) => a + b);
      sum != 100 ? alert("กรุณาทำให้ผลรวม") : null;

      const teach = {
        objectId: this.teach.objectId,
        rating: this.part_rating,
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
    goToPreviewGrade(item) {
      this.$router.push({
        name: "staff-preview-grade",
        query: { id: item.objectId },
      });
      // this.$router.push({name: 'preview-grade', query: {id: '7NPLER6jFE'}})
    },
    goToAddScore(item) {
      this.$router.push({
        name: "teachers-add_score-add_score",
        query: {
          id: item.objectId,
          schoolYear: item.schoolYear,
          term: item.term,
          classRoomLevel: item.classRoomLevel,
          classRoomName: item.classRoomName,
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
