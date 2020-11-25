<template>
  <v-container>
    <v-col cols="12">
      <v-btn class="mr-5" color="primary" fab small dark @click="back">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <v-row justify="center" class="mt-5 mb-5"
        ><h3>ใบแจ้งผลการเรียน</h3></v-row
      >
      <v-row justify="center"
        ><h4>
          โรงเรียนสาธิตมหาวิทยาลัยขอนแก่น ฝ่ายมัธยมศึกษา (มอดินแดง)
          {{ classes }}
        </h4></v-row
      >
      <v-row class="mt-3">
        <v-col cols="2">ชื่อ-นามสกุล</v-col>
        <v-col cols="3">{{ info.studentName }}</v-col>
        <v-col cols="2">เลขประจำตัว</v-col>
        <v-col cols="1">{{ info.studentId }}</v-col>
        <v-col cols="1">ชั้น</v-col>
        <v-col cols="2"
          >{{ info.classRoomLevel }}/{{ info.classRoomName }}</v-col
        >
      </v-row>
      <v-row class="mt-5">
        <v-simple-table style="width:100%">
          <template>
            <thead>
              <tr>
                <th :rowspan="2">ภาคการเรียนที่</th>
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
      <v-divider class="mt-10"></v-divider>
      <v-row class="mt-10">
        <v-col cols="3">คะแนนเฉลี่ยภาคเรียนนี้</v-col>
        <!-- <v-col cols="2">{{ parseFloat(grade.gpa).toFixed(3) }}</v-col> -->
        <!-- TODO กลับมาแก้เรื่อง คำนวนเกรดเฉลี่ย assessment/calculate_score/subject function calculateGpa-->
        <v-col cols="2">{{ parseFloat(gpa).toFixed(3) }}</v-col>
        <v-col cols="2">อยู่ลำดับที่</v-col>
        <v-col cols="1">{{ grade.rankingInRoom }}</v-col>
        <v-col cols="1">จาก</v-col>
        <v-col cols="1">{{totalStudentInRoom.count}}</v-col>
        <v-col cols="2">ของห้อง</v-col>
      </v-row>
      <v-row>
        <v-col cols="2">หน่วยการเรียน</v-col>
        <v-col cols="3"
          >{{ totalCreditInStudent }} / {{ totalCreditInClass }}
        </v-col>
        <v-col cols="2">อยู่ลำดับที่</v-col>
        <v-col cols="1">{{ grade.rankingInClasses }}</v-col>
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
      <v-row>
        <v-col cols="2"> {{ gatDate }} </v-col>
      </v-row>
      <v-row class="mt-5">
        <v-col cols="6">
          <v-row justify="center"
            >ลงชื่อ
            ......................................................</v-row
          >
          <v-row justify="center" class="ml-5 mt-2"
            >( {{ teacher.teather1 }} )</v-row
          >

          <v-row justify="center" class="mt-5"
            >ลงชื่อ
            ......................................................</v-row
          >
          <v-row justify="center" class="ml-5 mt-2"
            >( {{ teacher.teather2 }} )</v-row
          >
          <v-row justify="center" class="ml-5 mt-2">อาจารย์ประจำชั้น</v-row>
        </v-col>
        <v-col cols="6">
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
    </v-col>
    <!-- <v-row justify="center">
      <v-col cols="2">
        <v-radio-group v-model="items.approved">
          <v-radio label="อนุมัติ" value="ture"></v-radio>
          <v-radio label="ไม่อนุมัติ" value="false"></v-radio>
        </v-radio-group>
      </v-col>
    </v-row> -->
    <v-row justify="center">
      <v-col cols="3">
        <!-- <v-btn color="success">บันทึก</v-btn> -->
        <v-btn v-if="!approve" class="ml-5" color="green" dark @click="arrpove"
          >อนุมัติ</v-btn
        >
        <v-btn v-else class="ml-5" color="green" dark @click="unArrpove"
          >อนุมัติแล้ว</v-btn
        >
      </v-col>
      <v-col cols="3">
        <!-- <v-btn color="success">บันทึก</v-btn> -->
        <v-btn class="ml-5" color="info" dark @click="print">print</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  layout: "assessment",
  middleware: "assessment",
  async mounted() {
    this.route = this.$route.query;
    console.log("this. route", this.route);
    await this.getGradeByConditions().then(result => {
      this.items = result;
    });
    this.teach = await this.getTeachInClasses();
    this.totalCreditInClass = await this.sumCreateInClasses();
    this.totalCreditInStudent = await this.sumCreditStudent();
    this.teacher = await this.getTeacher();
    this.gpa = this.calGPA();
    this.totalCredit = this.sumCredit();
    this.getClass();
    // console.log('this.query', this.$route.query)
    this.grade = await this.getRanking();
    this.totalStudentInClasses = await this.countRankingClasses()
    this.totalStudentInRoom = await this.countRankingRoom()
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
    },
    sortSubject() {
      //  return this.score.sort((a, b) => a.studentNumber - b.studentNumber);
    }
  },
  data() {
    return {
      route: "",
      items: "",
      rowSpan: "",
      totalCredit: 0,
      totalCreditInStudent: 0,
      totalCreditInClass: 0,
      approve: false,
      studentObjectId: "",
      classes: "",
      teach: "",
      grade: 0,
      gpa: 0,
      teacher: "",
      save: false,
      totalStudentInClasses: 0,
      totalStudentInRoom: 0,
      info: {
        studentName: "",
        studentId: "",
        classRoomLevel: "",
        classRoomName: ""
      }
    };
  },
  methods: {
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
      console.log("grade id", response.results);
      this.info = response.results[0];
      this.rowSpan = response.results.length;
      this.approve = response.results[0].approve;
      this.studentObjectId = response.results[0].studentObjectId;
      return response.results;
    },
    async getTeachInClasses() {
      var data = {
        schoolYear: this.$route.query.schoolYear,
        term: this.$route.query.term,
        classRoomLevel: this.info.classRoomLevel,
        classRoomName: this.info.classRoomName
      };
      console.log("data getTeacInClass", data);
      const response = await this.$store.dispatch(
        `teach/getSubjectsByConditions`,
        data
      );
      console.log("response teach", response);
      return response.results;
    },
    async getTeacher() {
      const data = {
        schoolYear: this.$route.query.schoolYear,
        term: this.$route.query.term,
        classRoomLevel: this.info.classRoomLevel,
        classRoomName: this.info.classRoomName
      };
      const response = await this.$store.dispatch(
        `classes/getClassesByAcademicYears`,
        data
      );
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
        studentObjectId: this.studentObjectId
      };
      console.log("ranking condition", condition);
      const response = await this.$store.dispatch(
        `ranking/getRankingByConditions`,
        condition
      );
      console.log("grade ปปป", response.results[0]);
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
        classRoomName: this.info.classRoomName,
      };
      console.log("ranking condition", condition);
      const response = await this.$store.dispatch(
        `ranking/getRankingCount`,
        condition
      );
      console.log("grade room", response);
      return response;
    },
    async saveGpa() {
      var data = {
        schoolYear: this.$route.query.schoolYear,
        term: this.$route.query.term,
        classRoomLevel: this.info.classRoomLevel,
        classRoomName: this.info.classRoomName,
        studentId: this.$route.query.id,
        gpa: this.gpa,
        rankingInRoom: 0,
        rankingInClasses: 0
      };
      this.save = true;
      console.log("save gpa", data);
      const response = await this.$store.dispatch(
        `ranking/createRanking`,
        data
      );
      console.log("response create ranking");
      if (response) {
        alert("บันทึกสำเร็จ");
      }
    },
    async updateGrade(data) {
      const response = await this.$store.dispatch(`grade/updateGrade`, data);
      console.log("update response", response);
    },
    getClass() {
      // console.log("xxx", this.info.classRoomLevel);
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
      // this.totalCredit = sum;
      return sum;
    },
    sumCreditStudent() {
      var sum = 0;
      this.items.forEach(item => {
        //  sum += parseFloat(item.teachInfo.credit);
        if (item.grade_option == null || item.grade_option == "ผ") {
          sum += parseFloat(item.teachInfo.credit);
        }
      });
      // console.log('sumxx', sum)
      return sum;
    },
    async sumCreateInClasses() {
      var sum = 0;
      this.items.forEach(item => {
        //  sum += parseFloat(item.teachInfo.credit);
        sum += parseFloat(item.teachInfo.credit);
      });
      // console.log('sumxx', sum)
      return sum;
    },
    calGPA() {
      var gpa = 0;
      var grade = 0;
      var totalCreditInStudent = 0;
      this.items.forEach(item => {
        if(item.grade_option == null) {
          grade += parseFloat(item.grade) * parseFloat(item.teachInfo.credit);
          var credit_float = parseFloat(item.teachInfo.credit) || 0;
          totalCreditInStudent += credit_float
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
      // this.items เกรดจริง
      // this.totalCreditInClass หน่วยกิตรวม
    },
    print() {
      window.print();
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
  width: 210mm;
  min-height: 297mm;
  padding: 3.5mm;
  padding-top: 10mm;
  padding-bottom: 10mm;
  margin: 10mm auto;
  border: 1px #d3d3d3 solid;
  border-radius: 5px;
  background: white;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
}
@media print {
  body {
    transform: scale(0.7);
  }
}
</style>
