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
            <v-col cols="2">
              <v-select
                v-model="classesRoomLevel"
                :items="classes"
                label="ระดับชั้น"
                @change="getTeachByClasses()"
              ></v-select>
            </v-col>
            <v-col cols="2">
              <v-btn
                class="success"
                :disabled="disable"
                @click="calGradeRaking()"
                >คำนวนเกรด</v-btn
              >
            </v-col>
          </v-card-title>
          <v-simple-table v-if="classesRoomLevel" width="100%">
            <template v-slot:default>
              <thead>
                <tr>
                  <th>รหัส/ชื่อวิขา</th>
                  <th>ระดับชั้น</th>
                  <th>ห้องเรียน</th>
                  <th>ครูผู้สอน</th>
                  <!-- <th>Actions</th> -->
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in items" :key="item.index">
                  <td v-if="item.subject_info">
                    {{ item.subject_info.codet }} {{ item.subject_info.sname }}
                  </td>
                  <td v-else>
                    {{ item.subject.codet }} {{ item.subject.sname }}
                  </td>
                  <td>{{ item.classRoomLevel }}</td>
                  <td>{{ item.classRoomName }}</td>
                  <td>
                    {{ item.teachers.title }} {{ item.teachers.firstName }}
                    {{ item.teachers.lastName }}
                  </td>
                  <!-- <td>
                      <v-btn color="info" @click="goToPreviewGrade(item)"
                        >จัดการ</v-btn
                      >
                    </td> -->
                </tr>
              </tbody>
            </template>
          </v-simple-table>
          <v-row v-else justify="center">
            <h3 class="pt-10 pb-10">กรุณาเลือกระดับชั้น</h3>
          </v-row>
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
    // await this.getTeachByConditions().then(result => (this.items = result));
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
      disable: true,
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
      classesRoomLevel: "",
      classes: ["ม.1", "ม.2", "ม.3", "ม.4", "ม.5", "ม.6"],
    };
  },
  methods: {
    async getTeachByConditions() {
      var approved;
      const data = {
        schoolYear: this.$route.query.schoolYear,
        term: this.$route.query.term,
        // $nin: approved,
        approved: null,
      };
      const response = await this.$store.dispatch(
        `teach/getTeachByConditions`,
        data
      );
      //
      // return response.results;
    },
    async getTeachByClasses() {
      var approved;
      const data = {
        schoolYear: this.$route.query.schoolYear,
        term: this.$route.query.term,
        approved: null,
        classRoomLevel: this.classesRoomLevel,
      };
      const response = await this.$store.dispatch(
        `teach/getTeachByConditions`,
        data
      );
      //
      this.items = response.results;
      //
      if (this.items.length == 0) {
        this.disable = false;
        //
      } else {
        //
      }
    },
    async getTeachByConditions(teacherId) {
      const data = {
        schoolYear: this.$route.query.schoolYear,
        term: this.$route.query.term,
        "teacher.value": teacherId,
      };
      const response = await this.$store.dispatch(
        `teach/getTeachByConditions`,
        data
      );
      //
      return response.results;
    },
    async getGradeByConditions() {
      const conditions = {
        schoolYear: this.$route.query.schoolYear,
        term: this.$route.query.term,
        classRoomLevel: this.classesRoomLevel,
        staff: true,
      };
      //
      const response = await this.$store.dispatch(
        `grade/getGradeByConditions`,
        conditions
      );
      //
      console.log("grade 2 : ", response.results);
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
    async getRanking() {
      var condition = {
        schoolYear: this.$route.query.schoolYear,
        term: this.$route.query.term,
        classRoomLevel: this.classesRoomLevel,
      };
      const response = await this.$store.dispatch(
        `ranking/getRankingByConditions`,
        condition
      );
      //
      console.log("rankgin 1 :", response.results);
      return response.results;
    },
    async updateRanking(data) {
      const response = await this.$store.dispatch(
        `ranking/updateRanking`,
        data
      );
      "updateRanking", response;
      return;
    },
    async calGradeRaking() {
      var student_ranking = await this.getRanking();
      var grade_subject = await this.getGradeByConditions();
      //
      // คำนวณเกรดนร. ในระดับ
      for (const student of student_ranking) {
        var student_grade_list = grade_subject.filter(
          // grade => grade.studentObjectId == student.studentObjectId
          (grade) => grade.studentId == student.studentId
        );
        //
        student.gpa = this.calculateGpa(
          student_grade_list,
          student.studentObjectId
        );
      }
      // Order by GPA
      student_ranking.sort((a, b) => (a.gpa < b.gpa ? 1 : -1));

      // จัดอันดับที่ใน ระดับชั้น
      student_ranking = this.sortByGPA(student_ranking, "rankingInClasses");

      // สร้าง Array ห้องเรียน(ที่ไม่ซ้ำ) เพื่อเอาไป filter แบ่งนร.เป็นห้อง
      var student_class = student_ranking.map(
        (student) => student.classRoomName
      ); // ดึงค่าห้องเรียนจากตาราง ranking มาเป็น array. (ยังมีค่าซ้ำ)
      var classroom = Array.from(new Set(student_class)); // ทำเป็น Set เพื่อไม่ให้มีค่าซ้ำ -> แล้วแปลง Set กลับไปเป็น Array
      // จัดอันดับที่ให้ ห้องเรียน + update DB
      for (const room of classroom) {
        //
        var room_ranking = student_ranking.filter(
          (student) => student.classRoomName == room
        );

        // จัดอันดับที่ให้ ห้องเรียน
        room_ranking = this.sortByGPA(room_ranking, "rankingInRoom"); // ‘rankingInRoom’ คือ ชื่อฟิล ‘ลำดับในห้อง’
        //
        // update DB
        room_ranking.forEach(async (std) => {
          //
          // *** update ’std’ เข้าตาราง Ranking *** //
          var data = {
            classRoomLevel: std.classRoomLevel,
            classRoomName: std.classRoomName,
            gpa: std.gpa,
            objectId: std.objectId,
            rankingInClasses: std.rankingInClasses,
            rankingInRoom: std.rankingInRoom,
            schoolYear: std.schoolYear,
            term: std.term,
            studentId: std.studentId,
            studentNumber: std.studentNumber,
          };
          // console.log("student data", data);
          await this.updateRanking(data);
        });
      }
    },
    calculateGpa(grade_list, objectId) {
      //
      var gpa = 0;
      var grade = 0;
      var totalCreditInStudent = 0;
      grade_list.forEach((item) => {
        var credit_float = parseFloat(item.teachInfo.credit) || 0;
        // เช็คเกรด
        if (item.grade_option == null) {
          var grade_float = parseFloat(item.grade) || 0;
          // เกรด * หน่วยกิต
          grade += grade_float * credit_float;
          // หน่วยกิตทั้งหมด
          totalCreditInStudent += credit_float;
        }
      });
      //
      //
      //   "grade (เกรด * หน่วยกิต)",
      //   grade,
      //   totalCreditInStudent,
      //   objectId
      // );
      gpa = parseFloat(grade) / parseFloat(totalCreditInStudent);
      //
      //   "grade / totalCreditInStudent = ",
      //   grade,
      //   totalCreditInStudent,
      //   gpa
      // );
      return gpa;
    },
    sortByGPA(std_list, key) {
      //
      var rank = 1;
      var i;

      // ***Array เรียงลำดับตามเกรดมาอยู่แล้ว
      std_list[0][key] = rank; // index แรก คนเกรดสูงสุด (อันดับ 1)
      for (i = 1; i < std_list.length; i++) {
        // เทียบกับเกรดก่อนหน้า ถ้าเกรดเท่ากัน อันดับไม่เปลี่ยน * ถ้าไม่เท่าให้เพิ่มค่าอันดับ (อันดับจะจัดตามข้างล่าง)
        if (std_list[i].gpa < std_list[i - 1].gpa) {
          rank = i + 1;
        }
        // ‘rankingInRoom’ บรรทัดนี้คือ std_list[i].rankingInRoom = rank
        std_list[i][key] = rank;
        //
      }
      return std_list;
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
            score: score[j],
          });
        }
      }
      //
      return student;
    },
    async addScore(item) {
      // เช็คก่อนว่ามมี data ใน gradeรึยัง (1)
      //
      this.goToAddScore(item);
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
        query: { id: item.objectId },
      });
    },
    goToPreviewScore(item) {
      //
      this.$router.push({
        name: "assessment-students",
        query: { id: item.classId },
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
