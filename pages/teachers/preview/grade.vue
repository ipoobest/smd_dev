<template>
  <v-container>
    <v-btn class="mr-5" color="primary" fab small dark @click="back">
      <v-icon>mdi-arrow-left</v-icon>
    </v-btn>
    <div id="pdfDom"> 
    <v-row justify="center">
      <h3>
        รายชื่อนักเรียนโรงเรียนสาธิตมหาวิทยาลัยขอนแก่น (มอดินแดง) จังหวัดขอนแก่น
      </h3>
    </v-row>
    <v-row justify="center" class="mt-3">
      ชั้นปีที่ {{ teach.classRoomLevel }}/{{ teach.classRoomName }} ภาคเรียนที่
      {{ teach.classRootermmName }} ปีการศึกษา {{ teach.schoolYear }}
    </v-row>
    <v-row justify="center">
      <v-col cols="3" align="start"> วันที่ {{ gatDate }} </v-col>
      <v-col v-if="teach.subject_info" cols="6" align="center"> วิชา {{ teach.subject_info.sname }}, {{ teach.subject_info.codet }} </v-col>
      <v-col v-else cols="6" align="center"> วิชา {{ teach.sname }} </v-col>
      <v-col cols="3" align="end">
        อาจารย์ผู้สอน {{ teach.teacher.name }}
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-simple-table style="width:100%">
        <thead>
          <tr>
            <th>ลำดับ</th>
            <th>รหัส</th>
            <th>ชื่อ-สกุล</th>
            <th class="text-left" v-for="item in rating" :key="item.name">
              {{ item.name }} , {{ item.score }} คะแนน
            </th>
            <th class="text-left">คุณลักษณะ</th>
            <th class="text-left">การคิดการอ่าน</th>
            <th>Total Score</th>
            <th>Grade</th>
          </tr>
        </thead>
        <tbody align="left">
          <tr
            v-for="(item_score, score_index) in sortedData"
            :key="item_score.studentObjectId"
          >
            <td>{{ score_index + 1 }}</td>
            <td>{{ item_score.studentId }}</td>
            <td>{{ item_score.studentName }}</td>
            <td v-for="item_in in item_score.score" :key="item_in.name">
              {{ item_in }}
            </td>
            <td>{{item_score.aptitude}}</td>
            <td>{{item_score.analytical_thinking}}</td>
            <td>{{ item_score.total_score }}</td>
            <td v-if="item_score.grade_option">
              {{ item_score.grade_option }}
            </td>
            <td v-else>{{ item_score.grade }}</td>
          </tr>
        </tbody>
      </v-simple-table>
    </v-row>
    <v-row justify="center">
      <v-btn class="mt-3 success" @click="print()">print</v-btn>
    </v-row>
    </div>
  </v-container>
</template>

<script>
export default {
  // middleware: 'authentication',
  layout: "teacher",
  async mounted() {
    // check user type and user layout
    await this.getTeach(this.$route.query.id).then(
      result => (this.teach = result)
    );
    this.getGrade(this.teach).then(result => (this.score = result));
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
    sortedData() {
      return this.score.sort(function(a, b) {
        return b.total_score - a.total_score;
      });
    }
  },
  data() {
    return {
      htmlTitle: "grade",
      teach: {
        teacher: {
          name: ""
        }
      },
      layout: "",
      garde: [],
      rating: [],
      score: [],
      processScore: [],
      ratio_array: [],
      score_array: [],
      itemSort: []
    };
  },
  methods: {
    async getTeach(id) {
      const response = await this.$store.dispatch("teach/getTeachById", id);
      console.log("this.item", response);
      this.rating = response.rating;
      this.mapRating(this.rating);
      return response;
    },
    async getGrade(item) {
      const conditions = {
        teachId: item.objectId
      };
      // 1 get stu array grade
      const response_grade = await this.$store.dispatch(
        "grade/getGradeByConditions",
        conditions
      );
      console.log("response_grade", response_grade);
      return response_grade.results;
    },

    mapRating(rating) {
      rating.forEach(item => {
        this.ratio_array.push(item.rating);
        this.score_array.push(item.score);
      });
      // console.log("this.ratio_array", this.ratio_array);
    },
    print() {
      window.print();
    },
    back() {
      this.$router.go(-1);
    }
  }
};
</script>

<style lang="scss" scoped>
// v-simple-table, th, td {
// border: 1px solid black;
// border-collapse: collapse;
// }
</style>
