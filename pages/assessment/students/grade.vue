<template>
  <v-container>
    <div>
      <v-col cols="12" id="backButton">
        <v-btn
          class="mr-5 btnBack"
          color="primary"
          fab
          small
          dark
          @click="back"
        >
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
      </v-col>
      <div id="pdfDom" class="page">
        <v-col cols="12" class="page">
          <v-row justify="center" class="mt-5 mb-2"
            ><h3>ใบแจ้งผลการเรียน</h3></v-row
          >
          <v-row justify="center"
            ><h4>
              โรงเรียนสาธิตมหาวิทยาลัยขอนแก่น ฝ่ายมัธยมศึกษา (มอดินแดง)
              {{ classes }}
            </h4></v-row
          >
          <v-row class="mt-3" justify="center">
            <v-col cols="2">ชื่อ-นามสกุล</v-col>
            <v-col cols="3"
              >{{ studentInfo.tth }} {{ studentInfo.namet }}
              {{ studentInfo.snamet }}</v-col
            >
            <v-col cols="2">เลขประจำตัว</v-col>
            <v-col cols="1">{{ studentInfo.idstd }}</v-col>
            <v-col cols="1">ชั้น</v-col>
            <v-col cols="2"
              >{{ route.classRoomLevel }}/{{ route.classRoomName }}</v-col
            >
          </v-row>
          <v-row class="mt-5" justify="center">
            <v-simple-table dense style="width: 90%">
              <template>
                <thead>
                  <tr style="font-weight: bold">
                    <td>ภาคการเรียนที่</td>
                    <td>รหัสวิชา</td>
                    <td>ชื่อวิชา</td>
                    <td>หน่วย</td>
                    <td>ระดับ</td>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in items" :key="index">
                    <td>{{ route.term }}/{{ route.schoolYear }}</td>
                    <td v-if="item.subject">{{ item.subject.codet }}</td>
                    <td v-else>{{ item.teachInfo.codet }}</td>
                    <td v-if="item.subject">{{ item.subject.sname }}</td>
                    <td v-else>{{ item.teachInfo.sname }}</td>
                    <!-- <td>{{ parseFloat(item.teachInfo.credit).toFixed(1) }}</td> -->
                    <td v-if="item.subject">
                      {{ parseFloat(item.subject.credit).toFixed(1) }}
                    </td>
                    <td v-else>
                      {{ parseFloat(item.teachInfo.credit).toFixed(1) }}
                    </td>
                    <td v-if="item.grade_option">{{ item.grade_option }}</td>
                    <td v-else>{{ parseFloat(item.grade).toFixed(1) }}</td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-row>
          <v-row class="mt-5" justify="center"></v-row>
          <div style="width: 90%; margin: auto">
            <v-row class="mt-1">
              <v-col cols="3">คะแนนเฉลี่ยภาคเรียนนี้</v-col>
              <v-col cols="2" v-if="grade">{{
                parseFloat(grade.gpa).toFixed(3)
              }}</v-col>
              <v-col cols="2" v-else>0</v-col>
              <!-- <v-col cols="2">{{ parseFloat(gpa).toFixed(3) }}</v-col> -->
              <v-col cols="2">อยู่ลำดับที่</v-col>
              <v-col cols="1" v-if="grade">{{ grade.rankingInRoom }}</v-col>
              <v-col cols="2" v-else>0</v-col>
              <v-col cols="1">จาก</v-col>
              <v-col cols="1">{{ totalStudentInRoom.count }}</v-col>
              <v-col cols="2">ของห้อง</v-col>
            </v-row>
            <v-row style="margin-top: -20px">
              <v-col cols="2">หน่วยการเรียน</v-col>
              <v-col cols="3"
                >{{ totalCreditInStudent }} / {{ totalCreditInClass }}
              </v-col>
              <v-col cols="2">อยู่ลำดับที่</v-col>
              <v-col cols="1" v-if="grade">{{ grade.rankingInClasses }}</v-col>
              <v-col cols="2" v-else>0</v-col>
              <v-col cols="1">จาก</v-col>
              <v-col cols="1">{{ totalStudentInClasses.count }}</v-col>
              <v-col cols="2">ของระดับชั้น</v-col>
            </v-row>
            <v-row style="margin-top: -20px">
              <v-col cols="2">ภาคเรียนนี้ </v-col>
              <!-- <v-col cols="2">{{totalCreditInClass}} หน่วยกิต</v-col> -->
              <v-col cols="2"><p>ได้ / เรียน</p></v-col>
              <!-- <v-col cols="2"> {{totalCreditInStudent}} หน่วยกิต</v-col> -->
            </v-row>
            <v-row style="margin-top: -30px">
              <v-col cols="2"> {{ gatDate }} </v-col>
            </v-row>
            <v-row>
              <v-col cols="6">
                <v-row class="mt-2" justify="center"
                  >ลงชื่อ......................................................</v-row
                >
                <v-row justify="center" class="mt-2"
                  >( {{ teacher.teacher1 }} )</v-row
                >

                <v-row justify="center" class="mt-10"
                  >ลงชื่อ......................................................</v-row
                >
                <v-row justify="center" class="mt-2"
                  >( {{ teacher.teacher2 }} )</v-row
                >
                <v-row justify="center" class="mt-4">อาจารย์ประจำชั้น</v-row>
              </v-col>
              <v-col class="test" cols="6" style="margin-top: -70px">
                <!-- <img height="50" src="~/assets/logo-smd.png" /> -->
                <v-row justify="center">
                  <img height="100" src="~/assets/signature.jpg" />
                </v-row>
                <v-row justify="center"
                  >ลงชื่อ......................................................</v-row
                >
                <v-row justify="center" class="mt-2"
                  >( อาจารย์ ไพทูล นารคร )</v-row
                >
                <v-row justify="center" class="mt-2"
                  >รักษาการรองผู้อำนวยการฝ่ายมัธยมศึกษา (มอดินแดง)</v-row
                >
                <v-row justify="center" class="mt-2"
                  >ปฎิบัติราชการแทนผู้อำนวยการ</v-row
                >
              </v-col>
            </v-row>
          </div>
        </v-col>
      </div>

      <v-row class="btnApprove" justify="center">
        <v-col cols="4" align="center">
          <!-- <v-btn color="success">บันทึก</v-btn> -->
          <v-btn
            v-if="!approve"
            class="ml-5"
            color="green"
            dark
            @click="arrpove"
            >อนุมัติ</v-btn
          >
          <v-btn v-else class="ml-5" color="green" dark @click="unArrpove"
            >อนุมัติแล้ว</v-btn
          >
          <v-btn
            class="ml-5"
            color="info"
            dark
            @click="
              getPdf(
                `ใบแจ้งผลการเรียน-${route.schoolYear}-0${route.term}-${info.studentId}`
              )
            "
            >print</v-btn
          >
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script>
import VueHtml2pdf from "vue-html2pdf";
export default {
  components: {
    VueHtml2pdf,
  },
  layout: "assessment",
  middleware: "assessment",
  async mounted() {
    this.route = this.$route.query;
    this.studentInfo = await this.getStudent(this.route);
    console.log("this.info", this.studentInfo);
    await this.getGradeByConditions();
    this.totalCreditInClass = await this.sumCreateInClasses();
    this.totalCreditInStudent = await this.sumCreditStudent();
    this.teacher = await this.getTeacher();
    // this.gpa = this.calGPA();
    this.totalCredit = this.sumCredit();
    await this.getClass();
    // console.log('this.query', this.$route.query)
    this.grade = await this.getRanking();
    this.totalStudentInClasses = await this.countRankingClasses();
    this.totalStudentInRoom = await this.countRankingRoom();
  },
  computed: {
    gatDate() {
      var dt = new Date();
      var dateTime = `${dt.getDate().toString().padStart(2, "0")}/${(
        dt.getMonth() + 1
      )
        .toString()
        .padStart(2, "0")}/${(dt.getFullYear() + 543)
        .toString()
        .padStart(4, "0")} `;
      return dateTime;
    },
  },
  data() {
    return {
      route: "",
      items: "",
      newItems: "",
      rowSpan: "",
      totalCredit: 0,
      totalCreditInStudent: 0,
      totalCreditInClass: 0,
      approve: false,
      studentObjectId: "",
      classes: "",
      teach: "",
      studentInfo: "",
      grade: {
        gpa: 0,
        rankingInRoom: 0,
        rankingInClasses: 0,
      },
      teacher: "",
      save: false,
      totalStudentInClasses: 0,
      totalStudentInRoom: 0,
      studentInfo: {
        tth: "",
        name: "",
        sname: "",
      },
      info: {
        tth: "",
        studentName: "",
        studentId: "",
        classRoomLevel: "",
        classRoomName: "",
      },
    };
  },
  methods: {
    generateReport() {
      this.$refs.html2Pdf.generatePdf();
    },
    async getGradeByConditions() {
      var conditions = {
        studentId: this.$route.query.id,
        schoolYear: this.$route.query.schoolYear,
        term: this.$route.query.term,
        staff: true,
      };
      console.log("request grade", conditions);
      const response = await this.$store.dispatch(
        `grade/getGradeByConditions`,
        conditions
      );
      console.log("grade list Gpa", response.results);
      this.info = response.results[0];
      this.rowSpan = response.results.length;
      if (this.rowSpan == 0) {
        return;
      } else {
        this.approve = response.results[0].approve;
        this.studentObjectId = response.results[0].studentObjectId;
        this.items = this.sortData(response.results);
      }

      // return response.results;
    },
    async getStudent(item) {
      var condition = {
        idstd: item.id,
      };
      const response = await this.$store.dispatch(
        `students/getStudents`,
        condition
      );
      // console.log("response result student", response.results[0]);
      return response.results[0];
    },
    async getTeacher() {
      const data = {
        schoolYear: this.$route.query.schoolYear,
        term: this.$route.query.term,
        classRoomLevel: this.$route.query.classRoomLevel,
        classRoomName: this.$route.query.classRoomName,
      };
      // console.log("tacher request : ", data);
      const response = await this.$store.dispatch(
        `classes/getClassesByConditions`,
        data
      );
      // console.log("response getTeacher xxx", response.results);
      // console.log("response getClasses", response.results[0].advisoryTeacher);
      return response.results[0].advisoryTeacher;
    },
    async getRanking() {
      var condition = {
        schoolYear: this.$route.query.schoolYear,
        term: this.$route.query.term,
        classRoomLevel: this.$route.query.classRoomLevel,
        classRoomName: this.$route.query.classRoomName,
        studentId: this.$route.query.id,
      };
      console.log("ranking condition", condition);
      const response = await this.$store.dispatch(
        `ranking/getRankingByConditions`,
        condition
      );
      console.log("grade ranking", response.results);
      return response.results[0];
    },
    async countRankingClasses() {
      var condition = {
        schoolYear: this.$route.query.schoolYear,
        term: this.$route.query.term,
        classRoomLevel: this.$route.query.classRoomLevel,
      };
      // console.log("ranking condition", condition);
      const response = await this.$store.dispatch(
        `ranking/getRankingCount`,
        condition
      );
      // console.log("grade classes count", response);
      return response;
    },
    async countRankingRoom() {
      var condition = {
        schoolYear: this.$route.query.schoolYear,
        term: this.$route.query.term,
        classRoomLevel: this.$route.query.classRoomLevel,
        classRoomName: this.$route.query.classRoomName,
      };
      // console.log("ranking condition", condition);
      const response = await this.$store.dispatch(
        `ranking/getRankingCount`,
        condition
      );
      // console.log("grade room", response);
      return response;
    },
    async updateGrade(data) {
      const response = await this.$store.dispatch(`grade/updateGrade`, data);
      // console.log("update response", response);
    },
    getClass() {
      // console.log("classRoomLevel xxx", this.info);
      if (["ม.1", "ม.2", "ม.3"].includes(this.$route.query.classRoomLevel)) {
        this.classes = "ระดับมัธยมศึกษาตอนต้น";
      } else {
        this.classes = "ระดับมัธยมศึกษาตอนปลาย";
      }
      // console.log("this classes", this.classes);
    },
    sumCredit() {
      if (!this.items) {
        return;
      } else {
        var sum = 0;
        this.items.forEach((item) => {
          if (item.grade_option != "ร") {
            sum += parseFloat(item.teachInfo.credit);
          }
          // console.log('summ ',sum)
        });
        // console.log("sum create", sum);
        return sum;
      }
    },
    sumCreditStudent() {
      if (!this.items) {
        return;
      } else {
        var sum = 0;
        this.items.forEach((item) => {
          //  sum += parseFloat(item.teachInfo.credit);
          // console.log(typeof item.grade);
          if (item.grade_option == null || item.grade_option == "ผ") {
            if (item.grade != "0") {
              if (item.subject) {
                sum += parseFloat(item.subject.credit);
              } else {
                sum += parseFloat(item.teachInfo.credit);
              }
            }
          }
        });
        // console.log("sumxx", sum);
        return sum;
      }
    },
    async sumCreateInClasses() {
      if (!this.items) {
        return;
      } else {
        var sum = 0;
        this.items.forEach((item) => {
          if (item.subject) {
            sum += parseFloat(item.subject.credit);
          } else {
            sum += parseFloat(item.teachInfo.credit);
          }
        });
        // console.log('sumCreateInClasses', sum)
        return sum;
      }
    },
    calGPA() {
      var gpa = 0;
      var grade = 0;
      var totalCreditInStudent = 0;
      this.items.forEach((item) => {
        if (item.grade_option == null) {
          grade += parseFloat(item.grade) * parseFloat(item.teachInfo.credit);
          var credit_float = parseFloat(item.teachInfo.credit) || 0;
          totalCreditInStudent += credit_float;
        }
        // console.log('grade',grade)
      });
      // console.log("grade", grade);
      gpa = parseFloat(grade) / parseFloat(totalCreditInStudent);
      // console.log(
      //   "grade / totalCreditInStudent = ",
      //   grade,
      //   totalCreditInStudent,
      //   gpa
      // );
      return gpa;
    },

    sortData(data) {
      console.log("data sort", data);
      var newItems = data.sort(
        (a, b) => a.department_number - b.department_number
      );
      console.log("sort items", newItems);
      return newItems;
    },
    print() {
      window.print(1);
      // console.log("it ok");
      // this.$refs.html2Pdf.generatePdf();
    },
    back() {
      this.$router.go(-1);
    },
    async arrpove() {
      //update grade by condition
      if (confirm("ยืนยันการอนุมัติ")) {
        this.items.forEach((item) => {
          //  console.log(' score a', score.objectId)
          const data = {
            objectId: item.objectId,
            approve: true,
          };
          // console.log("data update", data);
          this.updateGrade(data);
          this.getGradeByConditions().then((result) => {
            this.items = result;
          });
        });
      }
    },
    generatePdf() {
      this.$refs.html2Pdf.generatePdf();
    },
    async unArrpove() {
      if (confirm("ยืนยันการยกเลิก")) {
        this.items.forEach((item) => {
          //  console.log(' score a', score.objectId)
          const data = {
            objectId: item.objectId,
            approve: false,
          };
          // console.log("data update", data);
          this.updateGrade(data);
          this.getGradeByConditions().then((result) => {
            this.items = result;
          });
        });
      }
    },
  },
};
</script>

<style lang="scss">
.page {
  width: 90%;
  margin: auto;
  size: A4 portrait;
}
.v-data-table td {
  height: 30px;
  border-bottom: none !important;
}
@media print {
  .page {
    margin-top: -20%;
    size: A4 portrait;
  }
  header {
    visibility: hidden;
  }
  #backButton {
    visibility: hidden;
  }
  #printButton {
    visibility: hidden;
  }
}
</style>
