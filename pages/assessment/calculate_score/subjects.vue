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
              <v-btn class="success" :disabled="disable" @click="calGradeRaking()">คำนวนเกรด</v-btn>
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
                  <td v-else>{{ item.sname }}</td>
                  <td>{{ item.classRoomLevel }}</td>
                  <td>{{ item.classRoomName }}</td>
                  <td>{{ item.teacher.name }}</td>
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
    // console.log("params", this.query.id);
    // await this.getTeachByConditions().then(result => (this.items = result));
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
      classesRoomLevel: '',
      classes: [
        "ม.1",
        "ม.2",
        "ม.3",
        "ม.4",
        "ม.5",
        "ม.6",
      ]
    };
  },
  methods: {
    async getTeachByConditions() {
      var approved
      const data = {
        schoolYear: this.$route.query.schoolYear,
        term: this.$route.query.term,
        // $nin: approved,
        approved: null,
      };
      const response = await this.$store.dispatch(
        `teach/getTeachByTeacherId`,
        data
      );
      console.log("response getTeachByTeacherId", response);
      return response.results;
    },
    async getTeachByClasses () {
      var approved
      const data = {
        schoolYear: this.$route.query.schoolYear,
        term: this.$route.query.term,
        approved: null,
        classRoomLevel: this.classesRoomLevel
      };
      const response = await this.$store.dispatch(
        `teach/getTeachByTeacherId`,
        data
      );
      console.log("response getTeachByTeacherId", response);
      this.items = response.results
      console.log('xxx', this.items.length)
      if(this.items.length == 0) {
        this.disable = false
        console.log('this disable', this.disable)
      } else {
        console.log('this disable', this.disable)
      }
    },
    async getTeachByTeacherId(teacherId) {
      const data = {
        schoolYear: this.$route.query.schoolYear,
        term: this.$route.query.term,
        "teacher.value": teacherId
      };
      const response = await this.$store.dispatch(
        `teach/getTeachByTeacherId`,
        data
      );
      console.log("response getTeachByTeacherId", response);
      return response.results;
    },
    async getGradeByConditions() {
      const conditions = {
        schoolYear: this.$route.query.schoolYear,
        term: this.$route.query.term,
        classRoomLevel: this.classesRoomLevel,
      };
      const response = await this.$store.dispatch(
        `grade/getGradeByConditions`,
        conditions
      );
      console.log("response get grade", response.results);
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
        "classes/getClassesByAcademicYears",
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
      console.log("response student test", response.results);
      var name = this.getStudentName(response.results);
      return name;
    },
    async createGrade(object) {
      const response = await this.$store.dispatch(`grade/createGrade`, object);
      console.log("response create grade", response);
      return response;
    },
    async addRatingToTach(teach) {
      const response = await this.$store.dispatch(`teach/updateTeach`, teach);
      console.log("response addRatingToTach", response);
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
      console.log("getRankingByConditions", response.results);
      return response.results;
    },
    async calGradeRaking() {
      var student_ranking = this.getRanking()
      var grade_subject  = this.getGradeByConditions()

      // คำนวณเกรดนร. ในระดับ
      for (student of student_ranking) {
        var student_grade_list = grade_subject.filter(grade => grade.studentId == student.studentId)
        student.gpa = this.calGpa(student_grade_list)
      }
      // Order by GPA
      student_ranking.sort((a, b) => (a.gpa < b.gpa) ? 1 : -1)

      // จัดอันดับที่ใน ระดับชั้น
      student_ranking = this.sortByGPA(student_ranking, student_ranking.rankingInClasses)

    // สร้าง Array ห้องเรียน(ที่ไม่ซ้ำ) เพื่อเอาไป filter แบ่งนร.เป็นห้อง
      var student_class = student_ranking.map(student => student.classRoomName) // ดึงค่าห้องเรียนจากตาราง ranking มาเป็น array. (ยังมีค่าซ้ำ)
      var classroom = Array.from(new Set(student_class)) // ทำเป็น Set เพื่อไม่ให้มีค่าซ้ำ -> แล้วแปลง Set กลับไปเป็น Array
    // จัดอันดับที่ให้ ห้องเรียน + update DB
      for(room of classroom) {
        var room_ranking = student_ranking.filter(student => student.classRoomName == room)

        // จัดอันดับที่ให้ ห้องเรียน
        room_ranking = this.sortByGPA(room_ranking, student_ranking.rankingInRoom) // ‘rankingInRoom’ คือ ชื่อฟิล ‘ลำดับในห้อง’ 

        // update DB
        room_ranking.forEach(std => {
          // *** update ’std’ เข้าตาราง Ranking *** //
        })
      }
    },
    calGPA(grade_list) {
      var gpa = 0;
      var grade = 0;
      var totalCreditInStudent = 0;
      grade_list.forEach(item => {
        var credit_float = parseFloat(item.teachInfo.credit)
        grade += parseFloat(item.grade) * credit_float ;
        totalCreditInStudent += credit_float
      });
      console.log("grade", grade);
      gpa = parseFloat(grade) / parseFloat(this.totalCreditInStudent);
      // console.log(
      //   "grade / totalCreditInStudent = ",
      //   grade,
      //   this.totalCreditInStudent,
      //   gpa
      // );
      return gpa;
    },
    addPartNumber() {
      this.part_rating = [];
      for (var index = 0; index < this.part_num; index++) {
        this.part_rating.push({ name: "", rating: 0 });
      }
      console.log("length", this.part_point);
    },
    addRating(item) {
      this.dialog = true;
      this.teach = item;
      if (item.rating) {
        this.part_num = item.rating.length;
      }
      this.part_rating = item.rating;
      console.log("addrateing", item.rating);
    },
    getRating(item) {
      var rating = [];
      for (var index = 0; index < item.length; index++) {
        rating.push(item[index].name + " " + item[index].rating + " " + 0);
      }
      console.log("student name", rating);
      return rating;
    },
    getStudentName(item) {
      var studentName = [];
      for (var index = 0; index < item.length; index++) {
        studentName.push(
          item[index].tth + " " + item[index].namet + " " + item[index].snamet
        );
      }
      console.log("student name", studentName);
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
      console.log("x y", student);
      return student;
    },
    async addScore(item) {
      // เช็คก่อนว่ามมี data ใน gradeรึยัง (1)
      console.log("addScore 1", item);
      this.goToAddScore(item);
    },
    close() {
      this.dialog = false;
      this.part_num = "";
      setTimeout(() => {}, 300);
    },
    back() {
      this.$router.go(-1);
      console.log("back");
    },
    goToPreviewGrade(item) {
      this.$router.push({
        name: "assessment-preview-grade",
        query: { id: item.objectId }
      });
    },
    goToPreviewScore(item) {
      console.log("item id ", item.classId);
      this.$router.push({
        name: "assessment-students",
        query: { id: item.classId }
      });
    }
  }
};
</script>

<style lang="scss" scoped></style>
