<template>
  <v-container>
    <v-row justify="center">
      <h3>
        รายชื่อนักเรียนโรงเรียนสาธิตมหาวิทยาลัยขอนแก่น (มอดินแดง) จังหวัดขอนแก่น
      </h3>
    </v-row>
    <v-row justify="center" class="mt-3">
      ชั้นปีที่ {{teach.classRoomLevel}}/{{teach.classRoomName}} ภาคเรียนที่ {{teach.classRootermmName}} ปีการศึกษา {{teach.schoolYear}}
    </v-row>
    <v-row justify="center">
      <v-col cols="3" align="start">
        วันที่ 
      </v-col>
      <v-col cols="6" align="center">
        วิชา  {{teach.sname}}
      </v-col>
      <v-col cols="3" align="end">
        อาจารย์ผู้สอน {{teach.teacher.name}}
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-simple-table style="width:100%">
        <thead>
          <tr>
            <th>ที่</th>
            <th>รหัส</th>
            <th>ชื่อ-สกุล</th>
            <th class="text-left" v-for="item in rating" :key="item.name">
              {{ item.name }} , {{ item.score }} คะแนน
            </th>
             <th class="text-left" v-for="item in rating" :key="item.id">
              {{ item.name }} , T-score {{ item.rating }} %
            </th>
            <th>Total Score</th>
            <th>Grade</th>
          </tr>
        </thead>
        <tbody align="center">
          <tr v-for="(item_score, score_index) in score"
            :key="item_score.studentObjectId">
            <td>{{score_index + 1}} </td>
            <td>{{ item_score.studentId}} </td>
            <td>{{ item_score.studentName }}</td>
            <td v-for="item_in in item_score.score" :key="item_in.name">
              {{item_in}}
            </td>
            <td v-for="item in calcScore(item_score.score, score_index)" :key="item.key">
              {{ item }}
            </td>
            <td>{{item_score.total_score}}</td>
            <td>{{item_score.grade}}</td>
          </tr>
        </tbody>
      </v-simple-table>
    </v-row>
    <v-row justify="center">
      <v-btn class="mt-3 success">export pdf</v-btn>
    </v-row>
  </v-container>
</template>

<script>
export default {
  // middleware: 'authentication',
  layout: 'teacher',
  async mounted() {
   await this.getTeach(this.$route.query.id).then(result => (this.teach = result))
   this.getGrade(this.teach).then(result => (this.score = result))
  },
  data() {
    return {
      teach: {
        teacher: {
          name: ''
        }
      },
      garde: [],
      rating: [],
      score: [],
      processScore: [],
      ratio_array: [],
      score_array: []
    }
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
      console.log('response_grade',response_grade)
      return response_grade.results
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
      return calc_score
    },
    mapRating(rating) {
      rating.forEach(item => {
        this.ratio_array.push(item.rating);
        this.score_array.push(item.score);
      });
      // console.log("this.ratio_array", this.ratio_array);
    },
  }
};
</script>

<style lang="scss" scoped>
// v-simple-table, th, td {
  // border: 1px solid black;
  // border-collapse: collapse;
// }
</style>
