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
            :key="item_score.studentObjectId"
          >
            <td>{{ item_score.studentName }}</td>
            <td v-for="(item_in, index) in item_score.score" :key="index">
              <v-text-field
                v-model="item_score.score[index]"
                :value="item_in"
                :max="rating[index].score"
                :min="0"
                :rules="[
                  v => v >= 0 || 'กรุณากรอกคะแนนให้มากกว่า 0',
                  v =>
                    v <= parseInt(rating[index].score) ||
                    `กรุณากรอกคะแนนให้น้อยกว่า ${rating[index].score}`
                ]"
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
      <v-btn class="info mt-5 mr-5" @click="sendGrade">ส่งคะแนน</v-btn>
      <v-btn class="success mt-5 mr-5" @click="previewGrade" dark>Preview</v-btn>
      <v-btn
        class="success mt-5 mr-5"
        v-if="!items.send_score"
        @click="updateGrade"
        >บันทึก</v-btn
      >
      <v-btn class="orange mt-5 mr-5" @click="editAllGrade" dark v-else
        >แก้ไข</v-btn
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
    await this.getCriteria().then(result => (this.criteria = result));
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
      studentId: [],
      score_analytical_thinking: "",
      score_aptitude: "",
      grade: [],
      grade_arr: [],
      grade_list: [],
      grade_array: [],
      criteria: [],
      ratio_array: [],
      score_array: [],
      studentsId: [],
      students: [],
      stu_grade_arr: [],
      stu_classes_arr: [],
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
      const conditions = {
        teachId: item.objectId
      };
      // 1 get stu array grade
      const response_grade = await this.$store.dispatch(
        "grade/getGradeByConditions",
        conditions
      );
      // console.log('response xxzzzx', response_grade.results)
      this.score = response_grade.results;
      this.edit_mode = new Array(this.score.length);
      this.edit_mode.fill(true);
      this.grade_arr = response_grade.results;
      this.stu_grade_arr = await this.grade_arr.map(a => a.studentObjectId);
      // console.log('response this.stu_grade_arr', this.stu_grade_arr)

      // 2 get stu array class
      const response_classes = await this.$store.dispatch(
        `classes/getClass`,
        this.items.classId
      );
      this.stu_classes_arr = response_classes.studentId;
      // console.log('stu_classes_arr', this.stu_classes_arr)

      // 3 check diff
      var difference = this.stu_classes_arr.filter(
        x => !this.stu_grade_arr.includes(x)
      );
      // console.log('diff', difference)

      // 4 createGrade by diff
      if (difference.length != 0) {
        this.createGrade(difference);
      } else {
        // console.log('xxxxxwwww', response_grade.results)
        return response_grade.results;
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
      console.log("response student test", response.results);
      var values = this.getStudentName(response.results);
      var studentName = values[0]
      var studentId = values[1]
      console.log('studentName', studentName)
      console.log('studentId xxx', studentId)
      return [studentName, studentId];
    },
    async getStudentByClassId(classId) {
      const response = await this.$store.dispatch(`classes/getClass`, classId);
      console.log("response xxxx", response.studentId);
      return response.studentId;
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
    async createGrade(students) {
      var values = await this.getStudent(students)
      var studentName = values[0]
      var studentId = values[1]

      // console.log('student id', values)
      
      // console.log("this.students", studentName);
      var initScore = new Array(this.rating.length);
      initScore.fill(0);
      // console.log("init score", initScore);
      if (initScore.length == 0) {
        return;
      }
      // console.log('this. student xxx', studentName.length)
      for (var index = 0; index < studentName.length; index++) {
        const data = {
          teachId: this.items.objectId,
          studentId: studentId[index],
          subject: this.items.sname,
          schoolYear: this.items.schoolYear,
          term: this.items.term,
          classRoomLevel: this.items.classRoomLevel,
          classRoomName: this.items.classRoomName,
          studentName: studentName[index],
          studentObjectId: students[index],
          score: initScore,
          grade_option: null,
          grade: "",
          aptitude: "",
          analytical_thinking: ""
        };
        // console.log("date create", data);
        const response = await this.$store.dispatch(`grade/createGrade`, data);
        // console.log("response create grade", response);
      }
      this.getGradeByConditions(this.items).then(
        result => (this.grade = result)
      );
    },
    async updateTech(data) {
      const response = this.$store.dispatch(`teach/updateTeach`, data);
      console.log("update Teach", data);
    },
    async sendGrade() {
      if (confirm("ยืนยันการส่ง")) {
        this.score.forEach(item => {
          var data = {
            objectId: item.objectId,
            status: "รอการตรวจสอบ"
          };
          const response = this.$store.dispatch(`grade/updateGrade`, data);
        });
      }
    },
    async updateGrade() {
      if (confirm("ยืนยันการบันทึก")) {
        this.score.forEach(item => {
          var data = {
            objectId: item.objectId,
            score: item.score,
            aptitude: item.aptitude,
            analytical_thinking: item.analytical_thinking,
            grade: item.grade.toString(),
            total_score: item.sum_score,
            status: "บันทึก"
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
      this.studentId = []
      for (var index = 0; index < item.length; index++) {
        this.studentName.push(
          item[index].tth + " " + item[index].namet + " " + item[index].snamet
        );
        this.studentId.push(
          item[index].idstd
        )
      }
      // console.log("student name", this.studentId);
      return [this.studentName, this.studentId];
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
        // console.log('คะแนนที่ผ่านการคำนวน', calc_score)
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
    editAllGrade() {
      this.items.send_score = false;
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
    },
    previewGrade() {
      console.log('preview grade')
      this.$router.push({name: 'preview-grade', query: {id: this.$route.query.id}})
      // this.$router.push({name: 'subjects-id', params: { id: `${item.objectId}`}})
    }
  }
};
</script>
