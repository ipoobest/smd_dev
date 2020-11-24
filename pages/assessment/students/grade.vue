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
                <td>{{ item.teachInfo.credit }}</td>
                <td>{{ item.grade }}</td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-row>
      <v-divider class="mt-10"></v-divider>
      <v-row class="mt-10">
        <v-col cols="3">คะแนนเฉลี่ยภาคเรียนนี้</v-col>
        <v-col cols="2">{{ gpa }}</v-col>
        <v-col cols="2">อยู่ลำดับที่</v-col>
        <v-col cols="1">รอ</v-col>
        <v-col cols="1">จาก</v-col>
        <v-col cols="1">รอ</v-col>
        <v-col cols="2">ของห้อง</v-col>
      </v-row>
      <v-row>
        <v-col cols="2">หน่วยการเรียน</v-col>
        <v-col cols="3"
          >{{ totalCreditInClass }} / {{ totalCreditInStudent }}</v-col
        >
        <v-col cols="2">อยู่ลำดับที่</v-col>
        <v-col cols="1">รอ</v-col>
        <v-col cols="1">จาก</v-col>
        <v-col cols="1">รอ</v-col>
        <v-col cols="2">ระดับชั้น</v-col>
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
            >( ...................................................... )</v-row
          >

          <v-row justify="center" class="mt-5"
            >ลงชื่อ
            ......................................................</v-row
          >
          <v-row justify="center" class="ml-5 mt-2"
            >( ...................................................... )</v-row
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
        <v-btn class="ml-5" color="info" dark>print</v-btn>
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
    this.sumCredit();
    // this.getTeachInClasses()
    this.teach = await this.getTeachInClasses();
    this.totalCreditInClass = await this.sumCreateInClasses();
    this.totalCreditInStudent = await this.sumCreditStudent();
    this.getClass();
    this.gpa = this.calGPA();
    // console.log('this.query', this.$route.query)
    // this.grade = await this.getRanking()
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
      rowSpan: "",
      totalCredit: 0,
      totalCreditInStudent: 0,
      totalCreditInClass: 0,
      approve: false,
      classes: "",
      teach: "",
      grade: 0,
      gpa: 0,
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
    async createRanking() {
      var data = {
        schoolYear: this.$route.query.schoolYear,
        term: this.$route.query.term,
        classRoomLevel: this.info.classRoomLevel,
        classRoomName: this.info.classRoomName,
        grade: this.grade,
        studentId: this.$route.id
      }
      const response = await this.$store.dispatch(`ranking/createRanking`, data);

    },
    async getRanking (data) {
      var condition = {
        schoolYear: this.$route.query.schoolYear,
        term: this.$route.query.term,
        classRoomLevel: this.info.classRoomLevel,
        classRoomName: this.info.classRoomName,
        studentId: this.$route.id
      }
      const response = await this.$store.dispatch(`ranking/getRankingByConditions`, data);
      console.log('grade', response.results)
      return response.results
    },
    async updateGrade(data) {
      const response = await this.$store.dispatch(`grade/updateGrade`, data);
      console.log("update response", response);
    },
    getClass() {
      console.log("xxx", this.info.classRoomLevel);
      if (["ม.1", "ม.2", "ม.3"].includes(this.info.classRoomLevel)) {
        this.classes = "ระดับมัธยมศึกษาตอนต้น";
      } else {
        this.classes = "ระดับมัธยมศึกษาตอนปลาย";
      }
    },
    sumCredit() {
      var sum = 0;
      this.items.forEach(item => {
        sum += parseFloat(item.teachInfo.credit);
        // console.log('summ ',sum)
      });
      // console.log('sum create', sum)
      this.totalCredit = sum;
      return;
    },
    sumCreditStudent() {
      var sum = 0;
      this.items.forEach(item => {
        if (item.grade_option != "ร") {
          sum += parseFloat(item.teachInfo.credit);
        }
      });
      // console.log('sumxx', sum)
      return sum;
    },
    calGPA() {
      var gpa = 0
      var grade = 0
      this.items.forEach(item => {
        grade += parseFloat(item.grade) * parseFloat(item.teachInfo.credit)
        // console.log('grade',grade)
      })
      console.log('grade', grade)
      gpa = parseFloat(grade) / parseFloat(this.totalCreditInStudent)
      console.log('grade / totalCreditInStudent = ', grade, this.totalCreditInStudent, gpa)
      return gpa.toFixed(2)
      // this.items เกรดจริง
      // this.totalCreditInClass หน่วยกิตรวม
    },
    async sumCreateInClasses() {
      console.log("teach", this.teach.length);
      var sumTotalCreate = 0;
      var sumSubject = this.teach.length;
      console.log("total teach", sumSubject);
      this.teach.forEach(item => {
        sumTotalCreate += parseFloat(item.subject_info.credit);
      });
      console.log("sum total create", sumTotalCreate);
      return sumTotalCreate;
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

<style lang="scss" scoped></style>
