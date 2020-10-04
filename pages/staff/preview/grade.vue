<template>
  <v-container>
    <v-btn class="mr-5" color="primary" fab small dark @click="back">
      <v-icon>mdi-arrow-left</v-icon>
    </v-btn>
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
      <v-col cols="4" align="start"> วันที่ {{ gatDate }} </v-col>
      <v-col cols="4" align="center">
        วิชา {{ teach.subject_info.sname }} รหัสวิชา
        {{ teach.subject_info.codet }}
      </v-col>
      <v-col cols="4" align="end">
        อาจารย์ผู้สอน {{ teach.teacher.name }}
      </v-col>
    </v-row>
    <v-row
      v-if="teach.send_score_assessment" 
      class="mb-5 pl-5">
      <div v-if="teach.assessment">
        <h3 v-if="teach.assessment" class="green--text">อนุมัติ</h3>
        <h3 v-else class="red--text">ไม่อนุมัติ</h3>
      </div>
      <div v-else>
        <h3 class="blue--text">รออนุมัติ</h3>
      </div>
    </v-row>
    <v-row justify="center">
      <v-simple-table style="width:100%">
        <thead>
          <tr>
            <th>ที่</th>
            <th>รหัส</th>
            <th>เลขที่</th>
            <th>ชื่อ-สกุล</th>
            <th class="text-left" v-for="item in rating" :key="item.name">
              {{ item.name }} , {{ item.score }} คะแนน
            </th>
            <!-- <th class="text-left" v-for="item in rating" :key="item.id">
              {{ item.name }} , T-score {{ item.rating }} %
            </th> -->
            <th>คุณลักษณะ</th>
            <th>การคิดการอ่าน</th>
            <th @click="sorts('total_score')">Total Score</th>
            <th>Grade</th>
          </tr>
        </thead>
        <tbody align="left">
          <tr
            v-for="(item_score, score_index) in sortedScore"
            :key="item_score.studentObjectId"
          >
            <td>{{ score_index + 1 }}</td>
            <td>{{ item_score.studentId }}</td>
            <td>{{ item_score.studentNumber }}</td>
            <td>{{ item_score.studentName }}</td>
            <!-- <td v-for="item_in in item_score.score" :key="item_in.name">
              {{ item_in }}
            </td> -->
            <td v-for="item in item_score.score" :key="item.key">
              {{ item }}
            </td>
            <td>{{ item_score.aptitude }}</td>
            <td>{{ item_score.analytical_thinking }}</td>
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
      <v-btn class="mt-3 success" @click="preview">ปพ.5</v-btn>
    </v-row>
  </v-container>
</template>

<script>
export default {
  // middleware: 'authentication',
  layout: "staff",
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
    sortedScore() {
      return this.score.sort((a, b) => {
        let modifier = 1;
        if (this.currentSortDir === "desc") modifier = -1;
        if (a[this.currentSort] < b[this.currentSort]) return -1 * modifier;
        if (a[this.currentSort] > b[this.currentSort]) return 1 * modifier;
        return 0;
      });
    }
  },
  data() {
    return {
      teach: {
        teacher: {
          name: ""
        },
        subject_info: {
          sname: "",
          codet: ""
        }
      },
      currentSort: "total_score",
      currentSortDir: "desc",
      layout: "",
      garde: [],
      rating: [],
      score: [],
      processScore: [],
      ratio_array: [],
      score_array: []
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
    calcScore(score_array, index) {
      var calc_score = [];
      // console.log("calcScore index", index);
      score_array.forEach((score, index) => {
        var result =
          (((score / this.score_array[index]) * 100) / 100) *
          this.ratio_array[index];
        // ((( คะแนนที่ได้ / คะแนนเต็ม ) x 100) / 100 ) x ร้อยละ
        calc_score.push(result.toFixed(2));
        // console.log('คะแนนที่ผ่านการคำนวน', calc_score[index])
      });
      return calc_score;
    },
    sorts(s) {
      console.log("test");
      if (s === this.currentSort) {
        this.currentSortDir = this.currentSortDir === "asc" ? "desc" : "asc";
      }
      this.currentSort = s;
    },
    mapRating(rating) {
      rating.forEach(item => {
        this.ratio_array.push(item.rating);
        this.score_array.push(item.score);
      });
      // console.log("this.ratio_array", this.ratio_array);
    },
    preview() {
      this.$router.push({
        name: "staff-preview-grade_summary",
        query: { id: this.$route.query.id }
      });
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
