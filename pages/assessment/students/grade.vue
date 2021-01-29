<template>
  <v-container>
    <div>
      <v-col cols="12">
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
        <v-col cols="12" class="page" >
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
            <v-col cols="3">{{ info.studentName }}</v-col>
            <v-col cols="2">เลขประจำตัว</v-col>
            <v-col cols="1">{{ info.studentId }}</v-col>
            <v-col cols="1">ชั้น</v-col>
            <v-col cols="2"
              >{{ info.classRoomLevel }}/{{ info.classRoomName }}</v-col
            >
          </v-row>
          <v-row class="mt-5" justify="center">
            <v-simple-table style="width:90%">
              <template>
                <thead>
                  <tr>
                    <th >ภาคการเรียนที่</th>
                    <th>รหัสวิชา</th>
                    <th>ชื่อวิชา</th>
                    <th>หน่วย</th>
                    <th>ระดับ</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in items" :key="index">
                    <td>{{ route.term }}/{{ route.schoolYear }}</td>
                    <td>{{ item.teachInfo.codet }}</td>
                    <td>{{ item.teachInfo.sname }}</td>
                    <td>{{ parseFloat(item.teachInfo.credit).toFixed(1) }}</td>
                    <td v-if="item.grade_option">{{ item.grade_option }}</td>
                    <td v-else>{{ parseFloat(item.grade).toFixed(1) }}</td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-row>
          <v-divider class="mt-2"></v-divider>
          <div style="width:90%; margin:auto;">
          <v-row class="mt-2">
            <v-col cols="3">คะแนนเฉลี่ยภาคเรียนนี้</v-col>
            <!-- TODO กลับมาแก้เรื่อง คำนวนเกรดเฉลี่ย assessment/calculate_score/subject function calculateGpa-->
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
          <v-row>
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
          <v-row>
            <v-col cols="2">ภาคเรียนนี้ </v-col>
            <!-- <v-col cols="2">{{totalCreditInClass}} หน่วยกิต</v-col> -->
            <v-col cols="2"><p>ได้ / เรียน</p></v-col>
            <!-- <v-col cols="2"> {{totalCreditInStudent}} หน่วยกิต</v-col> -->
          </v-row>
          <v-row style="margin-top:-30px;">
            <v-col cols="2"> {{ gatDate }} </v-col>
          </v-row>
          <v-row class="mt-2">
            <v-col cols="6">
              <v-row justify="center"
                >ลงชื่อ
                ......................................................</v-row
              >
              <v-row v-if="teacher.teather1" justify="center" class="ml-5 mt-2"
                >( {{ teacher.teather1 }} )</v-row
              >
              <v-row v-else justify="center" class="ml-5 mt-2">
               <!-- ( {{xxx}} )  -->
              </v-row>

              <v-row justify="center" class="mt-5"
                >ลงชื่อ
                ......................................................</v-row
              >
              <v-row justify="center" class="ml-5 mt-2"
                >( {{ teacher.teather2 }} )</v-row
              >
              <v-row justify="center" class="ml-5 mt-2">อาจารย์ประจำชั้น</v-row>
            </v-col>
            <v-col class="test" cols="6" style="margin-top:-70px;">
              <!-- <img height="50" src="~/assets/logo-smd.png" /> -->
              <v-row justify="center">
                <img height="100" src="~/assets/signature.jpg" />
              </v-row>
              <v-row justify="center"
                >ลงชื่อ
                ......................................................</v-row
              >
              <v-row justify="center" class="ml-5 mt-2"
                >( อาจารย์ ไพทูล นารคร )</v-row
              >
              <v-row justify="center" class="ml-5 mt-2"
                >รักษาการรองผู้อำนวยการฝ่ายมัธยมศึกษา (มอดินแดง)</v-row
              >
              <v-row justify="center" class="ml-5 mt-2"
                >ปฎิบัติราชการแทนผู้อำนวยการ</v-row
              >
            </v-col>
          </v-row>
          </div>
        </v-col>
      </div>

      <v-row class="btnApprove" justify="center">
        <v-col cols="3">
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
        </v-col>
        <v-col cols="3">
          <!-- <v-btn color="success">บันทึก</v-btn> -->
          <v-btn class="ml-5" color="info" dark @click="getPdf(`ใบแจ้งผลการเรียน-${route.schoolYear}-0${route.term}-${info.studentId}`)"
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
    VueHtml2pdf
  },
  layout: "assessment",
  middleware: "assessment",
  async mounted() {
    this.route = this.$route.query;
    await this.getGradeByConditions();
    this.totalCreditInClass = await this.sumCreateInClasses();
    this.totalCreditInStudent = await this.sumCreditStudent();
    this.teacher = await this.getTeacher();
    // this.gpa = this.calGPA();
    this.totalCredit = this.sumCredit();
    this.getClass();
    // console.log('this.query', this.$route.query)
    this.grade = await this.getRanking();
    this.totalStudentInClasses = await this.countRankingClasses();
    this.totalStudentInRoom = await this.countRankingRoom();
  },
  computed: {
    gatDate() {
      var dt = new Date();
      var dateTime = `${dt
        .getDate()
        .toString()
        .padStart(2, "0")}/${(dt.getMonth() + 1)
        .toString()
        .padStart(2, "0")}/${(dt.getFullYear() + 543)
        .toString()
        .padStart(4, "0")} `;
      return dateTime;
    }
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
      grade: {
        gpa: 0,
        rankingInRoom: 0,
        rankingInClasses: 0
      },
      teacher: "",
      save: false,
      totalStudentInClasses: 0,
      totalStudentInRoom: 0,
      info: {
        studentName: "",
        studentId: "",
        classRoomLevel: "",
        classRoomName: ""
      },
      // pdfTitle: `ใบแจ้งผลการเรียน-${this.$route.query.schoolYear}-${this.$route.term}-${this.info.classRoomLevel}-${this.info.classRoomName}-${this.info.studentId}`
    };
  },
  methods: {
    generateReport() {
      this.$refs.html2Pdf.generatePdf();
    },
    async beforeDownload({ html2pdf, options, pdfContent }) {
      await html2pdf()
        .set(options)
        .from(pdfContent)
        .toPdf()
        .get("pdf")
        .then(pdf => {
          const totalPages = pdf.internal.getNumberOfPages();
          for (let i = 1; i <= totalPages; i++) {
            pdf.setPage(i);
            pdf.setFontSize(10);
            pdf.setTextColor(150);
            pdf.text(
              "Page " + i + " of " + totalPages,
              pdf.internal.pageSize.getWidth() * 0.88,
              pdf.internal.pageSize.getHeight() - 0.3
            );
          }
        })
        .save();
    },
    async getGradeByConditions() {
      var conditions = {
        studentId: this.$route.query.id,
        schoolYear: this.$route.query.schoolYear,
        term: this.$route.query.term,
        staff: true
      };
      const response = await this.$store.dispatch(
        `grade/getGradeByConditions`,
        conditions
      );
      console.log("grade list Gpa", response.results);
      this.info = response.results[0];
      this.rowSpan = response.results.length;
      this.approve = response.results[0].approve;
      this.studentObjectId = response.results[0].studentObjectId;
      this.items = this.sortData(response.results);
      // return response.results;
    },
    async getTeacher() {
      const data = {
        schoolYear: this.$route.query.schoolYear,
        term: this.$route.query.term,
        classRoomLevel: this.info.classRoomLevel,
        classRoomName: this.info.classRoomName
      };
      const response = await this.$store.dispatch(
        `classes/getClassesByConditions`,
        data
      );
      // console.log('response getTeacher', response.results)
      console.log("response getClasses", response.results[0].teatherName);
      return response.results[0].teatherName;
    },
    async createRanking() {
      var data = {
        schoolYear: this.$route.query.schoolYear,
        term: this.$route.query.term,
        classRoomLevel: this.info.classRoomLevel,
        classRoomName: this.info.classRoomName,
        grade: this.grade,
        studentId: this.$route.id
      };
      const response = await this.$store.dispatch(
        `ranking/createRanking`,
        data
      );
    },
    async getRanking() {
      var condition = {
        schoolYear: this.$route.query.schoolYear,
        term: this.$route.query.term,
        classRoomLevel: this.info.classRoomLevel,
        classRoomName: this.info.classRoomName,
        studentId: this.$route.query.id
      };
      console.log("ranking condition", condition);
      const response = await this.$store.dispatch(
        `ranking/getRankingByConditions`,
        condition
      );
      console.log("grade ranking", response.results[0]);
      return response.results[0];
    },
    async countRankingClasses() {
      var condition = {
        schoolYear: this.$route.query.schoolYear,
        term: this.$route.query.term,
        classRoomLevel: this.info.classRoomLevel
      };
      console.log("ranking condition", condition);
      const response = await this.$store.dispatch(
        `ranking/getRankingCount`,
        condition
      );
      console.log("grade classes", response);
      return response;
    },
    async countRankingRoom() {
      var condition = {
        schoolYear: this.$route.query.schoolYear,
        term: this.$route.query.term,
        classRoomLevel: this.info.classRoomLevel,
        classRoomName: this.info.classRoomName
      };
      console.log("ranking condition", condition);
      const response = await this.$store.dispatch(
        `ranking/getRankingCount`,
        condition
      );
      console.log("grade room", response);
      return response;
    },
    async updateGrade(data) {
      const response = await this.$store.dispatch(`grade/updateGrade`, data);
      console.log("update response", response);
    },
    getClass() {
      if (["ม.1", "ม.2", "ม.3"].includes(this.info.classRoomLevel)) {
        this.classes = "ระดับมัธยมศึกษาตอนต้น";
      } else {
        this.classes = "ระดับมัธยมศึกษาตอนปลาย";
      }
    },
    sumCredit() {
      var sum = 0;
      this.items.forEach(item => {
        if (item.grade_option != "ร") {
          sum += parseFloat(item.teachInfo.credit);
        }
        // console.log('summ ',sum)
      });
      // console.log('sum create', sum)
      return sum;
    },
    sumCreditStudent() {
      var sum = 0;
      this.items.forEach(item => {
        //  sum += parseFloat(item.teachInfo.credit);
        console.log(typeof item.grade);
        if (item.grade_option == null || item.grade_option == "ผ") {
          if (item.grade != "0") {
            sum += parseFloat(item.teachInfo.credit);
          }
        }
      });
      console.log("sumxx", sum);
      return sum;
    },
    async sumCreateInClasses() {
      var sum = 0;
      this.items.forEach(item => {
        //  sum += parseFloat(item.teachInfo.credit);
        sum += parseFloat(item.teachInfo.credit);
      });
      // console.log('sumCreateInClasses', sum)
      return sum;
    },
    calGPA() {
      var gpa = 0;
      var grade = 0;
      var totalCreditInStudent = 0;
      this.items.forEach(item => {
        if (item.grade_option == null) {
          grade += parseFloat(item.grade) * parseFloat(item.teachInfo.credit);
          var credit_float = parseFloat(item.teachInfo.credit) || 0;
          totalCreditInStudent += credit_float;
        }
        // console.log('grade',grade)
      });
      console.log("grade", grade);
      gpa = parseFloat(grade) / parseFloat(totalCreditInStudent);
      console.log(
        "grade / totalCreditInStudent = ",
        grade,
        totalCreditInStudent,
        gpa
      );
      return gpa;
    },

    sortData(data) {
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
        this.items.forEach(item => {
          //  console.log(' score a', score.objectId)
          const data = {
            objectId: item.objectId,
            approve: true
          };
          // console.log("data update", data);
          this.updateGrade(data);
          this.getGradeByConditions().then(result => {
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
        this.items.forEach(item => {
          //  console.log(' score a', score.objectId)
          const data = {
            objectId: item.objectId,
            approve: false
          };
          // console.log("data update", data);
          this.updateGrade(data);
          this.getGradeByConditions().then(result => {
            this.items = result;
          });
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.page {
  width: 90%;
  margin: auto;
  size: A4 portrait; 
}
@page {
  size: A4 portrait;
  // left: 0.1;
  // top: -5;
}
</style>
