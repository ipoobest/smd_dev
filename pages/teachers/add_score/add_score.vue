<template>
  <v-container>
    <v-row>
      <v-btn class="mr-5" color="primary" fab small dark @click="back">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <v-col md="2">
        <h3>ลงคะแนนนักเรียน</h3>
      </v-col>
      <v-spacer></v-spacer>
      <v-col md="2">
        <v-text-field
          v-model="score_aptitude"
          :rules="[
            v => v >= 0 || 'กรุณากรอกคะแนนให้มากกว่า 0',
            v => v <= 3 || 'กรุณากรอกคะแนนให้น้อยกว่า 3'
          ]"
          label="คุณลักษณะ"
          outlined
          type="number"
        ></v-text-field>
      </v-col>
      <v-col md="2">
        <v-text-field
          v-model="score_analytical_thinking"
          :rules="[
            v => v >= 0 || 'กรุณากรอกคะแนนให้มากกว่า 0',
            v => v <= 3 || 'กรุณากรอกคะแนนให้น้อยกว่า 3'
          ]"
          label="การคิดการอ่าน"
          outlined
          type="number"
        ></v-text-field>
      </v-col>
      <v-col md="2">
        <v-btn @click="addScoreX">เพิ่ม</v-btn>
      </v-col>
    </v-row>
    <v-simple-table fixed-header v-if="rating">
      <template v-slot:default>
        <thead>
          <tr>
            <th class="text-left">ชื่อ</th>
            <!--- this header -->
            <th class="text-left" v-for="item in rating" :key="item.name">
              {{ item.score }} คะแนน, {{ item.rating }} %
            </th>
            <th class="text-left">คุณลักษณะ</th>
            <th class="text-left">การคิดการอ่าน</th>
            <th class="text-left">คะแนนรวม</th>
            <th class="text-left">เกรด</th>
            <th class="text-left">จัดการ</th>
          </tr>
        </thead>
        <tbody>
          <v-col v-if="rating.length == 0" justify="center">
            <v-row>
              <h2>กรุณาเพิ่มเกณฑ์การให้คะแนน</h2>
            </v-row>
          </v-col>
          <tr
            v-for="(item_score, score_index) in score"
            :key="item_score.studentName"
          >
            <td>{{ item_score.studentName }}</td>
            <td v-for="(item_in, index) in item_score.score" :key="index">
              <v-text-field
                v-model="item_score.score[index]"
                :value="item_in"
                :max="rating[index].score"
                :rules="[
                  v => v >= 0 || 'กรุณากรอกคะแนนให้มากกว่า 0',
                  v => v <= rating[index].score || `กรุณากรอกคะแนนให้น้อยกว่า ${rating[index].score}`]"
                min="0"
                type="number"
                hide-details="auto"
                :disabled="items.send_score"
              />
            </td>
            <td>
              <v-text-field
                v-model="item_score.aptitude"
                type="number"
                :max="3"
                :min="0"
                :rules="[
                  v => v >= 0 || 'กรุณากรอกคะแนนให้มากกว่า 0',
                  v => v <= 3 || 'กรุณากรอกคะแนนให้น้อยกว่า 3'
                ]"
                :disabled="items.send_score"
                hide-details="auto"
              />
            </td>
            <td>
              <v-text-field
                v-model="item_score.analytical_thinking"
                type="number"
                :max="3"
                :min="0"
                :rules="[
                  v => v >= 0 || 'กรุณากรอกคะแนนให้มากกว่า 0',
                  v => v <= 3 || 'กรุณากรอกคะแนนให้น้อยกว่า 3'
                ]"
                :disabled="items.send_score"
                hide-details="auto"
              />
            </td>
            <td>{{ calcScore(item_score.score, score_index) }}</td>

            <td v-if="edit_mode[score_index]">
              <template v-if="item_score.grade_option">{{
                item_score.grade_option
              }}</template>
              <template v-else>{{ item_score.grade }}</template>
            </td>
            <td v-else>
              <v-select
                v-model="item_score.grade_option"
                :items="item_grade_option"
              />
            </td>

            <td>
              <v-btn
                v-if="edit_mode[score_index]"
                class="info mt-5 mr-3"
                @click="editMode(score_index)"
                >แก้ไข</v-btn
              >
              <v-btn
                v-else
                class="success mt-5 mr-3"
                @click="fixedGrade(score_index)"
                >บันทึก</v-btn
              >
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
    <h3 v-else>กรุณาเพิ่มเกณฑ์การให้คะแนน</h3>
    <v-row justify="center">
      <!-- <v-btn color="orange" dark class="mr-2">reset form</v-btn> -->
      <v-btn
        class="info mt-5 mr-5"
        v-if="!items.send_score"
        @click="updateGrade"
        >ส่งคะแนน</v-btn
      >
      <v-btn class="orange mt-5 mr-5" dark v-else>กรุณารอการตรวจสอบ</v-btn>
      <v-btn
        class="orange mt-5 mr-5"
        dark
        >Preview</v-btn
      >
      <v-btn
        class="success mt-5 mr-5"
        >บันทึก</v-btn
      >
    </v-row>
  </v-container>
</template>

<script>
export default {
  layout: "teacher",
  async mounted() {
    await this.getTechById(this.$route.query.id).then(
      result => (this.items = result)
    );
    await this.getGradeByConditions(this.items).then(
      result => (this.grade_list = result)
    );
    await this.getCriteria().then(result => (this.criteria = result))

  },
  data() {
    return {
      title: "เพิ่มคะแนนให้นักเรียน",
      edit_mode: [],
      rating: [],
      form: {
        score_id: []
      },
      data: "",
      items: "",
      score: [],
      studentName: [],
      score_analytical_thinking: "",
      score_aptitude: "",
      grade_list: [],
      grade_array: [],
      criteria: [],
      ratio_array: [],
      score_array: [],
      total_score: "",
      item_grade_option: [
        { text: "0-4", value: null },
        { text: "ร", value: "ร" },
        { text: "มส", value: "มส" }
      ]
    };
  },
  methods: {
    async getGradeByConditions(item) {
      // console.log("teachId xxxx", item.objectId);
      const conditions = {
        teachId: item.objectId
      };
      console.log("condition", conditions);
      const response = await this.$store.dispatch(
        "grade/getGradeByConditions",
        conditions
      );
      console.log("response grade xxx", response);
      if (response.results.length == 0) {
        this.createGrade();
      } else {
        // console.log("this responbse", response.results);
        this.score = response.results.slice();
        this.edit_mode = new Array(this.score.length);
        this.edit_mode.fill(true);
        // console.log("this score grade", this.score);
        return response.results;
      }
    },
    async getStudentByTeach(data) {
      const conditions = {
        schoolYear: this.$route.query.schoolYear,
        term: this.$route.query.term,
        classRoomLevel: this.$route.query.classRoomLevel,
        classRoomName: this.$route.query.classRoomName
      };
      const response = await this.$store.dispatch(
        "teach/getSubjectsByConditions",
        conditions
      );
      console.log("response students", response.results[0].students);
      return response.results[0].students;
    },
    async getStudent(data) {
      console.log("data student", data);
      const query = {
        objectId: {
          $in: data
        }
      };
      const response = await this.$store.dispatch(
        "students/getStudents",
        query
      );
      // console.log("response student test", response.results);
      var name = this.getStudentName(response.results);
      return name;
    },
    async getTechById(id) {
      const response = await this.$store.dispatch("teach/getTeachById", id);
      console.log("this.item", response);
      this.rating = response.rating;
      this.mapRating(this.rating);
      return response;
    },
    async getCriteria() {
      // grade
      const response = await this.$store.dispatch(`criteria/getCriteria`);
      console.log("response", response.results[0]);
      return response.results[0].criteria;
    },
    async createGrade() {
      await this.getStudent(this.items.students).then(
        result => (this.students = result)
      );
      console.log("this.students", this.students);
      var initScore = new Array(this.rating.length);
      initScore.fill(0);
      console.log("init score", initScore);
      if (initScore.length == 0) {
        // console.log('this.intiScore = 0', initScore.length)
        return;
      }
      for (var index = 0; index < this.rating.length; index++) {
        const data = {
          teachId: this.items.objectId,
          subject: this.items.sname,
          schoolYear: this.items.schoolYear,
          term: this.items.term,
          classRoomLevel: this.items.classRoomLevel,
          classRoomName: this.items.classRoomName,
          studentName: this.students[index],
          score: initScore,
          grade: "",
          aptitude: "",
          analytical_thinking: ""
        };
        console.log("date create", data);
        const response = await this.$store.dispatch(`grade/createGrade`, data);
        console.log("response create grade", response);
      }
      this.getGradeByConditions(this.items).then(
        result => (this.grade = result)
      );
    },
    async updateTech(data) {
      const response = this.$store.dispatch(`teach/updateTeach`, data);
      console.log("update Teach", data);
    },
    async updateGrade() {
      if (confirm("ยืนยันการส่งคะแนน")) {
        this.score.forEach(item => {
          var data = {
            objectId: item.objectId,
            score: item.score,
            aptitude: item.aptitude,
            analytical_thinking: item.analytical_thinking,
            grade: item.grade.toString(),
            total_score: item.sum_score
          };
          // console.log("score", data);
          const response = this.$store.dispatch(`grade/updateGrade`, data);
        });
        var sentScore = {
          objectId: this.items.objectId,
          send_score: true
        };
        console.log("sentScoreStaus", sentScore);
        this.items.send_score = true;
        this.updateTech(sentScore);
      }
    },
    getStudentName(item) {
      this.studentName = [];
      for (var index = 0; index < item.length; index++) {
        this.studentName.push(
          item[index].tth + " " + item[index].namet + " " + item[index].snamet
        );
      }
      console.log("student name", this.studentName);
      return this.studentName;
    },
    mapRating(rating) {
      rating.forEach(item => {
        this.ratio_array.push(item.rating);
        this.score_array.push(item.score);
      });
      // console.log("this.ratio_array", this.ratio_array);
    },
    calcScore(score_array, index) {
      var calc_score = [];
      // console.log("calcScore index", index);
      score_array.forEach((score, index) => {
        var result =
          (((score / this.score_array[index]) * 100) / 100) *
          this.ratio_array[index];
        // ((( คะแนนที่ได้ / คะแนนเต็ม ) x 100) / 100 ) x ร้อยละ
        calc_score.push(result);
      });
      var sum_score = calc_score.reduce((a, b) => a + b);
      this.score[index].sum_score = sum_score.toFixed(2);
      this.score[index].grade = this.calcGrade(sum_score.toFixed(2));
      // console.log("this.score xx", this.score);
      return sum_score.toFixed(2);
    },
    calcGrade(score) {
      // console.log('เกณการให้คะแนน', this.items.criteria)
      if (score >= this.criteria.g4) {
        return 4;
      } else if (score >= this.criteria.g3_5) {
        return 3.5;
      } else if (score >= this.criteria.g3) {
        return 3;
      } else if (score >= this.criteria.g2_5) {
        return 2.5;
      } else if (score >= this.criteria.g2) {
        return 2;
      } else if (score >= this.criteria.g1_5) {
        return 1.5;
      } else if (score >= this.criteria.g1) {
        return 1;
      } else {
        return 0;
      }
    },
    fixedGrade(index) {
      var item = this.score[index];
      const data = {
        objectId: item.objectId,
        grade: item.grade.toString(),
        grade_option: item.grade_option,
        score: item.score
      };
      // console.log("update row", data);

      this.$set(this.edit_mode, index, !this.edit_mode[index]);
      const response = this.$store.dispatch(`grade/updateGrade`, data);
    },
    editMode(index) {
      // console.log("index", index);
      this.$set(this.edit_mode, index, !this.edit_mode[index]);
    },
    addScoreX() {
      console.log("xxxx", this.score_aptitude);
      if (
        this.score_aptitude < 0 ||
        this.score_aptitude > 3 ||
        this.score_analytical_thinking < 0 ||
        this.score_analytical_thinking > 3
      ) {
        alert("กรุณากรอกข้อมูลให้ถูกต้อง");
        return;
      }
      this.score.forEach(item => {
        item.aptitude = this.score_aptitude;
        item.analytical_thinking = this.score_analytical_thinking;
      });
    },
    logId(item) {
      console.log(item);
    },
    save() {
      console.log("this.score", this.score);
    },
    close() {},
    reset() {},
    back() {
      this.$router.go(-1);
    }
  }
};
</script>
