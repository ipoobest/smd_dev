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
          โรงเรียนสาธิตมหาวิทยาลัยขอนแก่น(มอดินแดง) ระดับมัธยมศึกษาตอนต้น
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
        <v-col cols="2"></v-col>
        <v-col cols="2">อยู่ลำดับที่</v-col>
        <v-col cols="1"></v-col>
        <v-col cols="1">จาก</v-col>
        <v-col cols="1"></v-col>
        <v-col cols="2">ของห้อง</v-col>
      </v-row>
      <v-row>
        <v-col cols="3">หน่วยการเรียน</v-col>
        <v-col cols="2"></v-col>
        <v-col cols="2">อยู่ลำดับที่</v-col>
        <v-col cols="1"></v-col>
        <v-col cols="1">จาก</v-col>
        <v-col cols="1"></v-col>
        <v-col cols="2">ระดับชั้น</v-col>
      </v-row>
      <v-row>
        <v-col cols="2">ภาคเรียนนี้</v-col>
        <v-col cols="2">ได้เรียน</v-col>
      </v-row>
      <v-row>
        <v-col cols="2"> {{ gatDate }} </v-col>
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
        <v-btn class="ml-5" color="green" dark @click="arrpove">อนุมัติ</v-btn>
        <!-- <v-btn v-else class="ml-5" color="green" dark @click="unArrpove">online</v-btn> -->
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  layout: "assessment",
  async mounted() {
    this.route = this.$route.query;
    await this.getGradeByConditions().then(result => {
      this.items = result;
    });
    // console.log('this.query', this.$route.query)
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
        term: this.$route.query.term
      };
      const response = await this.$store.dispatch(
        `grade/getGradeByConditions`,
        conditions
      );
      console.log("grade id", response.results[0].approve);
      this.info = response.results[0];
      this.rowSpan = response.results.length;
      return response.results;
    },
    async updateGrade(data) {
      const response = await this.$store.dispatch(`grade/updateGrade`, data);
      console.log("update response", response);
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
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped></style>
