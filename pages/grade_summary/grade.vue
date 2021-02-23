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
            ปีการศึกษา {{ query.schoolYear }} เทอม {{ query.term }} ชั้น
            {{ query.classRoomLevel }} ห้อง {{ query.classRoomName }}
          </v-card-title>
          <v-data-table :headers="headers" :items="grade">
            <template v-slot:[`item.totalGrade`]="{ item }">
              {{ calTotalGrade(item.term1, item.term2) }}
            </template>
            <template v-slot:[`item.actions`]="{ item }">
              <v-btn color="success" dark class="mr-2" @click="grade(item)">
                ดูคะแนน</v-btn
              >
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </v-layout>
</template>

<script>
export default {
  middleware: "admin",
  async mounted() {
    this.query = await this.$route.query;
    await this.getRanking().then((result) => {
      this.items = result;
    });
    console.log("query", this.query);
    this.grade = await this.calGpa(this.items);
    // this.getDataFromApi().then(result => (this.academicYearItems = result));
  },
  watch: {
    dialog(val) {
      val || this.close();
    },
  },
  data() {
    return {
      headers: [
        { text: "เลขที่", value: "studentNumber", align: "center" },
        { text: "รหัส", value: "studentId", align: "center  " },
        {
          text: "ชื่อ-นามสกุล",
          value: "studentName",
          sortable: false,
          align: "center",
        },
        {
          text: "GPA เทอม 1",
          value: "term1",
          sortable: false,
          align: "center",
        },
        {
          text: "GPA เทอม 2",
          value: "term2",
          sortable: false,
          align: "center",
        },
        {
          text: "GPA รวม",
          value: "totalGrade",
          sortable: false,
          align: "center",
        },
      ],
      dialogCreateYear: false,
      schoolYear: "",
      term: "",
      grade: [],
      items: [],
      title: `เกรดรวม`,
      query: "",
      mockData: [
        {
          classRoomLevel: "ม.1",
          classRoomName: "1",
          createdAt: "2021-02-15T04:11:40.885Z",
          gpa: 1.8484848484848484,
          objectId: "9raAoUoB8o",
          rankingInClasses: 130,
          rankingInRoom: 31,
          schoolYear: "2563",
          studentId: "633014",
          studentName: "เด็กชาย ชยพล ราชภักดี",
          studentObjectId: "1qI9nv1ByY",
          term: "1",
        },
        {
          classRoomLevel: "ม.1",
          classRoomName: "1",
          createdAt: "2021-02-15T04:11:40.885Z",
          gpa: 2.883,
          objectId: "9raAoUoB8o",
          rankingInClasses: 130,
          rankingInRoom: 31,
          schoolYear: "2563",
          studentId: "633014",
          studentName: "เด็กชาย ชยพล ราชภักดี",
          studentObjectId: "1qI9nv1ByY",
          term: "2",
        },
        //  {
        //   classRoomLevel: "ม.1",
        //   classRoomName: "1",
        //   createdAt: "2021-02-15T04:11:40.885Z",
        //   gpa: {
        //     term1: "2.22",
        //     term2: "2.23",
        //     total: "xxxx"
        //   },
        //   objectId: "9raAoUoB8o",
        //   rankingInClasses: 130,
        //   rankingInRoom: 31,
        //   schoolYear: "2563",
        //   studentId: "633014",
        //   studentName: "เด็กชาย ชยพล ราชภักดี",
        //   studentObjectId: "1qI9nv1ByY",

        // },
      ],
    };
  },
  methods: {
    calTotalGrade(grade1, grade2) {
      if (!grade1 || !grade2) {
        return "";
      }
      var resutl = (parseFloat(grade1) + parseFloat(grade2)) / 2;
      return resutl;
    },
    async getClasses() {
      var condition = {
        schoolYear: this.schoolYear,
        term: this.term,
      };
      console.log("data request", condition);
      const response = await this.$store.dispatch(
        `classes/getClassesByConditions`,
        condition
      );
      console.log("response getclasses", response.results);
      if (response.results.length == 0) {
        alert("ไม่พบข้อมูล");
        return;
      }
      return response.results;
    },
    async getRanking() {
      var condition = {
        schoolYear: this.query.schoolYear,
        classRoomLevel: this.query.classRoomLevel,
        classRoomName: this.query.classRoomName,
      };
      const response = await this.$store.dispatch(
        `ranking/getRankingByConditions`,
        condition
      );
      console.log("response result", response.results);
      return response.results;
    },
    calGpa(data) {
      var newObj = [];
      data.forEach((data) => {
        var obj = newObj.find((item) => item.studentId == data.studentId);
        console.log("obj", obj);
        if (!obj) {
          var newData = {
            studentNumber: data.studentNumber,
            studentId: data.studentId,
            studentName: data.studentName,
          };
          console.log("trhis 1");
          newData["term" + data.term] = parseFloat(data.gpa).toFixed(3);
          newObj.push(newData);
        } else {
          console.log("trhis 21");
          obj["term" + data.term] = parseFloat(data.gpa).toFixed(3);
        }
      });
      console.log("new obj", newObj);
      return newObj;
      // to do merge merge json and cal GPA THIS
    },
    back() {
      this.$router.push({ name: "index" });
    },
    resetForm() {
      this.$refs.form.reset();
    },
    close() {
      setTimeout(() => {
        this.dialogCreateYear = false;
      }, 300);
    },
  },
};
</script>
